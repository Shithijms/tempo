from typing import AsyncGenerator, Dict, Any
from langgraph import LangGraph
from langchain.schema import BaseMessage
import httpx
from ..config import settings
from ...schemas.agents import AgentRequest, AgentResponse

class AgentManager:
    def __init__(self):
        self.langgraph_client = httpx.AsyncClient(
            base_url=settings.langgraph_api_url,
            headers={"Authorization": f"Bearer {settings.langgraph_api_key}"}
        )
    
    async def process_request(self, request: AgentRequest) -> AgentResponse:
        """Process agent request using LangGraph API"""
        try:
            # Prepare request for LangGraph API
            payload = {
                "agent_type": request.agent_type,
                "input": request.input,
                "config": request.config or {}
            }
            
            # Call LangGraph API
            response = await self.langgraph_client.post("/invoke", json=payload)
            response.raise_for_status()
            
            result = response.json()
            
            return AgentResponse(
                request_id=request.request_id,
                agent_type=request.agent_type,
                output=result.get("output", {}),
                metadata=result.get("metadata", {}),
                status="completed"
            )
            
        except Exception as e:
            return AgentResponse(
                request_id=request.request_id,
                agent_type=request.agent_type,
                output={},
                metadata={"error": str(e)},
                status="error"
            )
    
    async def analyze_code_stream(self, code_data: Dict[str, Any]) -> AsyncGenerator[Dict[str, Any], None]:
        """Stream code analysis results"""
        try:
            payload = {
                "code": code_data.get("code", ""),
                "language": code_data.get("language", "python"),
                "stream": True
            }
            
            async with self.langgraph_client.stream("POST", "/analyze", json=payload) as response:
                async for chunk in response.aiter_lines():
                    if chunk:
                        yield {"chunk": chunk, "type": "analysis"}
                        
        except Exception as e:
            yield {"error": str(e), "type": "error"}