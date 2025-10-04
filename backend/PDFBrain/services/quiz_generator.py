import logging
from typing import List, Dict, Any
from sqlalchemy.orm import Session

from models import Quiz, QuizQuestion, PDFDocument
from schemas import QuizGenerationRequest, QuestionType, QuizSubmissionRequest, QuestionResult
from services.gemini_service import gemini_service

logger = logging.getLogger(__name__)

class QuizGeneratorService:
    def __init__(self):
        pass
    
    async def generate_quiz(self, request: QuizGenerationRequest, db: Session) -> Quiz:
        """Generate a complete quiz from PDF content"""
        
        document = db.query(PDFDocument).filter(PDFDocument.id == request.document_id).first()
        if not document or not document.extracted_text:
            raise ValueError("No text content available for quiz generation")
        
        try:
            question_types_str = [qt.value for qt in request.question_types]
            questions_data = await gemini_service.generate_quiz_questions(
                text=str(document.extracted_text),
                num_questions=request.num_questions,
                question_types=question_types_str,
                difficulty=request.difficulty
            )
            
            if not questions_data:
                raise ValueError("Failed to generate quiz questions")
            
            quiz = Quiz(
                document_id=request.document_id,
                title=f"Quiz: {document.original_filename}",
                description=f"Generated quiz from {document.original_filename}",
                total_questions=len(questions_data)
            )
            
            db.add(quiz)
            db.flush()
            
            for i, q_data in enumerate(questions_data):
                db.add(QuizQuestion(
                    quiz_id=quiz.id,
                    question_type=q_data.get("question_type", "mcq"),
                    question_text=q_data.get("question_text", ""),
                    correct_answer=q_data.get("correct_answer", ""),
                    options=q_data.get("options"),
                    explanation=q_data.get("explanation", ""),
                    order_index=i + 1
                ))
            
            db.commit()
            db.refresh(quiz)
            
            return quiz
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error generating quiz: {str(e)}")
            raise
    
    def get_quiz_by_id(self, quiz_id: int, db: Session) -> Quiz:
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if not quiz:
            raise ValueError("Quiz not found")
        return quiz
    
    def get_quizzes_by_document(self, document_id: int, db: Session) -> List[Quiz]:
        return db.query(Quiz).filter(Quiz.document_id == document_id).all()
    
    def delete_quiz(self, quiz_id: int, db: Session) -> bool:
        quiz = self.get_quiz_by_id(quiz_id, db)
        db.delete(quiz)
        db.commit()
        return True
    
    def check_answers(self, quiz_id: int, submission: QuizSubmissionRequest, db: Session) -> Dict[str, Any]:
        quiz = self.get_quiz_by_id(quiz_id, db)
        
        correct_count = 0
        results: List[QuestionResult] = []
        
        user_answers = {ans.question_id: ans.answer for ans in submission.answers}
        
        for question in quiz.questions:
            user_answer = user_answers.get(question.id, "")
            is_correct = user_answer.lower() == str(question.correct_answer).lower()
            
            if is_correct:
                correct_count += 1
            
            results.append(QuestionResult(
                question_id=question.id,
                question_text=question.question_text,
                user_answer=user_answer,
                correct_answer=question.correct_answer,
                is_correct=is_correct,
                explanation=question.explanation
            ))
        
        return {
            "quiz_id": quiz_id,
            "score": (correct_count / quiz.total_questions) * 100 if quiz.total_questions > 0 else 0,
            "correct_answers": correct_count,
            "total_questions": quiz.total_questions,
            "results": results
        }
    
    def validate_quiz_request(self, request: QuizGenerationRequest) -> List[str]:
        errors = []
        if not (1 <= request.num_questions <= 20):
            errors.append("Number of questions must be between 1 and 20")
        if not request.question_types:
            errors.append("At least one question type must be specified")
        return errors

quiz_generator = QuizGeneratorService()
