from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, HTTPException
from typing import Dict, List
import json
import asyncio
from ..core.security import authenticate_websocket
from ..core.agents import AgentManager
from ..schemas.agents import AgentRequest, AgentResponse

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_sessions: Dict[str, Dict] = {}

    async def connect(self, websocket: WebSocket, user_id: str, session_data: Dict):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        self.user_sessions[user_id] = session_data

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if user_id in self.user_sessions:
            del self.user_sessions[user_id]

    async def send_personal_message(self, message: Dict, user_id: str):
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            await websocket.send_text(json.dumps(message))

    async def send_agent_response(self, response: AgentResponse, user_id: str):
        message = {
            "type": "agent_response",
            "data": response.dict()
        }
        await self.send_personal_message(message, user_id)

manager = ConnectionManager()
agent_manager = AgentManager()

@router.websocket("/ws/agents")
async def websocket_agent_endpoint(
    websocket: WebSocket,
    token: str = Query(...),
):
    # Authenticate WebSocket connection
    user_data = await authenticate_websocket(token)
    if not user_data:
        await websocket.close(code=1008, reason="Invalid token")
        return
    
    user_id = user_data.get("sub")
    await manager.connect(websocket, user_id, user_data)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            message_type = message.get("type")
            
            if message_type == "agent_request":
                # Handle agent request
                agent_request = AgentRequest(**message.get("data", {}))
                
                # Send acknowledgment
                await manager.send_personal_message({
                    "type": "request_received",
                    "request_id": agent_request.request_id
                }, user_id)
                
                # Process with LangGraph agent (async)
                asyncio.create_task(
                    process_agent_request(agent_request, user_id)
                )
            
            elif message_type == "ping":
                await manager.send_personal_message({
                    "type": "pong",
                    "timestamp": message.get("timestamp")
                }, user_id)
                
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        print(f"User {user_id} disconnected")
    except Exception as e:
        print(f"WebSocket error for user {user_id}: {str(e)}")
        await websocket.close(code=1011, reason="Internal server error")
        manager.disconnect(user_id)

async def process_agent_request(request: AgentRequest, user_id: str):
    try:
        # Send processing status
        await manager.send_personal_message({
            "type": "status_update",
            "request_id": request.request_id,
            "status": "processing",
            "message": "Agent is analyzing your request..."
        }, user_id)
        
        # Process with LangGraph agent
        response = await agent_manager.process_request(request)
        
        # Send final response
        await manager.send_agent_response(response, user_id)
        
    except Exception as e:
        # Send error response
        await manager.send_personal_message({
            "type": "error",
            "request_id": request.request_id,
            "error": str(e)
        }, user_id)

@router.websocket("/ws/code-analysis")
async def websocket_code_analysis(
    websocket: WebSocket,
    token: str = Query(...),
):
    user_data = await authenticate_websocket(token)
    if not user_data:
        await websocket.close(code=1008, reason="Invalid token")
        return
    
    user_id = user_data.get("sub")
    await manager.connect(websocket, user_id, user_data)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "analyze_code":
                code_data = message.get("data", {})
                
                # Stream analysis results
                async for analysis_chunk in agent_manager.analyze_code_stream(code_data):
                    await manager.send_personal_message({
                        "type": "analysis_chunk",
                        "data": analysis_chunk
                    }, user_id)
                
                # Send completion
                await manager.send_personal_message({
                    "type": "analysis_complete"
                }, user_id)
                    
    except WebSocketDisconnect:
        manager.disconnect(user_id)
