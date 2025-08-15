from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, Literal
from datetime import datetime
import uuid

class AgentRequest(BaseModel):
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    agent_type: Literal["code_analysis", "chat", "explanation"] = "code_analysis"
    input: Dict[str, Any]
    config: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AgentResponse(BaseModel):
    request_id: str
    agent_type: str
    output: Dict[str, Any]
    metadata: Dict[str, Any] = {}
    status: Literal["processing", "completed", "error"] = "processing"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CodeAnalysisRequest(BaseModel):
    code: str
    language: str = "python"
    analysis_types: list[str] = ["syntax", "style", "complexity", "security"]

class CodeAnalysisResponse(BaseModel):
    issues: list[Dict[str, Any]] = []
    suggestions: list[Dict[str, Any]] = []
    metrics: Dict[str, Any] = {}
    score: float = 0.0