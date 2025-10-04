import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import PDFDocument, Quiz
from schemas import (
    QuizGenerationRequest, 
    QuizGenerationResponse, 
    QuizResponse, 
    QuizSubmissionRequest,
    QuizSubmissionResponse
)
from services.quiz_generator import quiz_generator

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/generate", response_model=QuizGenerationResponse)
async def generate_quiz(
    request: QuizGenerationRequest,
    db: Session = Depends(get_db)
):
    """Generate a quiz from PDF content"""
    try:
        errors = quiz_generator.validate_quiz_request(request)
        if errors:
            raise HTTPException(status_code=422, detail=f"Validation errors: {', '.join(errors)}")
        
        document = db.query(PDFDocument).filter(PDFDocument.id == request.document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        quiz = await quiz_generator.generate_quiz(request, db)
        
        return QuizGenerationResponse(
            success=True,
            message=f"Quiz generated successfully with {quiz.total_questions} questions",
            quiz=QuizResponse.from_orm(quiz)
        )
        
    except Exception as e:
        logger.error(f"Error generating quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")

@router.get("/quiz/{quiz_id}", response_model=QuizResponse)
async def get_quiz(
    quiz_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific quiz with all questions and answers"""
    try:
        quiz = quiz_generator.get_quiz_by_id(quiz_id, db)
        return QuizResponse.from_orm(quiz)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/quiz/{quiz_id}/submit", response_model=QuizSubmissionResponse)
async def submit_quiz(
    quiz_id: int,
    submission: QuizSubmissionRequest,
    db: Session = Depends(get_db)
):
    """Submit quiz answers and get results"""
    try:
        results = quiz_generator.check_answers(quiz_id, submission, db)
        return QuizSubmissionResponse(**results)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/document/{document_id}/quizzes", response_model=List[QuizResponse])
async def get_document_quizzes(
    document_id: int,
    db: Session = Depends(get_db)
):
    """Get all quizzes for a specific document"""
    document = db.query(PDFDocument).filter(PDFDocument.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    quizzes = quiz_generator.get_quizzes_by_document(document_id, db)
    return [QuizResponse.from_orm(quiz) for quiz in quizzes]

@router.delete("/quiz/{quiz_id}")
async def delete_quiz(
    quiz_id: int,
    db: Session = Depends(get_db)
):
    """Delete a quiz"""
    try:
        quiz_generator.delete_quiz(quiz_id, db)
        return {"success": True, "message": f"Quiz {quiz_id} deleted"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/")
async def list_all_quizzes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all quizzes"""
    quizzes = db.query(Quiz).offset(skip).limit(limit).all()
    return {
        "quizzes": [
            {
                "id": quiz.id,
                "title": quiz.title,
                "document_id": quiz.document_id,
                "total_questions": quiz.total_questions,
                "created_at": quiz.created_at.isoformat(),
                "document_filename": quiz.document.original_filename if quiz.document else "Unknown"
            }
            for quiz in quizzes
        ],
    }
