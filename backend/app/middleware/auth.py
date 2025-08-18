from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import time
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from ..core.config import settings

# Rate limiting
limiter = Limiter(key_func=get_remote_address)

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Add rate limiting logic here if needed beyond slowapi
        response = await call_next(request)
        return response

class CORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Add CORS headers
        origin = request.headers.get("origin")
        if origin in settings.allowed_origins:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        
        return response

 #todo how it works   
from fastapi import FastAPI, Request
import time

app = FastAPI()

@app.middleware("http")
async def custom_middleware(request: Request, call_next):
    # Code before route handler
    start_time = time.time()
    print(f"Request URL: {request.url}")

    # Call the route handler
    response = await call_next(request)

    # Code after route handler
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    print(f"Processed in {process_time} seconds")

    return response

@app.get("/")
async def home():
    return {"message": "Hello World"}
