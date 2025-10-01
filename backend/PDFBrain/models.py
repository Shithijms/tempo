from sqlalchemy import Column, Integer, BigInteger, String, Text, DateTime, Boolean, ForeignKey, JSON, SmallInteger, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class PDFDocument(Base):
    __tablename__ = "pdf_documents"
    
    id = Column(Integer, primary_key=True, index=True)  # Supabase uses integer
    filename = Column(String, nullable=False)           # character varying (no limit)
    original_filename = Column(String, nullable=False)  # character varying
    file_path = Column(String, nullable=False)          # character varying
    extracted_text = Column(Text, nullable=True)        # text
    summary = Column(Text, nullable=True)               # text
    upload_time = Column(DateTime, default=datetime.utcnow)  # timestamp w/o tz
    file_size = Column(Integer, nullable=False)         # integer
    page_count = Column(Integer, nullable=True)         # integer
    
    # Relationships
    chat_messages = relationship("ChatMessage", back_populates="document")
    quizzes = relationship("Quiz", back_populates="document")


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)   # integer
    document_id = Column(Integer, ForeignKey("pdf_documents.id"), nullable=False)
    session_id = Column(String, nullable=False, index=True)  # character varying (no limit)
    user_message = Column(Text, nullable=False)          # text
    ai_response = Column(Text, nullable=False)           # text
    timestamp = Column(DateTime, default=datetime.utcnow)  # timestamp w/o tz
    
    # Relationships
    document = relationship("PDFDocument", back_populates="chat_messages")


class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(BigInteger, primary_key=True, index=True)    # Supabase: bigint
    created_at = Column(DateTime, default=datetime.utcnow)   # timestamp with tz default now()
    category_id = Column(BigInteger, nullable=True)          # bigint, FK to categories
    title = Column(String, nullable=True)                    # character varying
    total_questions = Column(SmallInteger, nullable=True)    # smallint
    document_id = Column(Integer, ForeignKey("pdf_documents.id"), nullable=True)
    description = Column(Text, nullable=True)                # text
    
    # Relationships
    document = relationship("PDFDocument", back_populates="quizzes")
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    
    id = Column(BigInteger, primary_key=True, index=True)    # Supabase: bigint
    quiz_id = Column(BigInteger, ForeignKey("quizzes.id"), nullable=False)
    question_text = Column(Text, nullable=False)             # text
    options = Column(JSON, nullable=True)                    # jsonb
    correct_answer = Column(Text, nullable=False)            # text
    created_at = Column(DateTime, default=datetime.utcnow)   # timestamp with tz default now()
    question_type = Column(String, nullable=True)            # character varying
    explanation = Column(Text, nullable=True)                # text
    order_index = Column(Integer, nullable=True)             # integer
    
    # Relationships
    quiz = relationship("Quiz", back_populates="questions")
