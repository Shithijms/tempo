# from fastapi import FastAPI,HTTPException
# import bcrypt
# from app.database.db import supabase

# app=FastAPI()

# @app.post("/signup")
# def signup(name:str,email:str,password:str):
#     #hash password
#     hashed_pw=bcrypt.hashpw(password.encode("utf-8"),bcrypt.gensalt()).decode()

#     # Insert into Supabase
#     response = supabase.table("users").insert({
#         "name": name,
#         "email": email,
#         "password_hash": hashed_pw,
#         "profile_pic": ""
#     }).execute()

#     if response.data:
#         return {"message": "User created", "user": response.data}
    

# @app.post("/login")
# def login(email:str,password:str):
#     #fetch user details
#     response=supabase.table("users").select("*").eq("email",email).execute()

#     if not response.data:
#         raise HTTPException(status_code=404, detail="User not found")
   
#     user=response.data[0]

#     #verify password
#     if bcrypt.checkpw(password.encode("utf-8"), user["password_hash"].encode("utf-8")):
#         return {"message": "Login successful", "user": user}
#     else:
#         raise HTTPException(status_code=401, detail="Invalid password")


from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from starlette.requests import Request
from starlette.responses import RedirectResponse
from app.utils.auth import create_access_token
from starlette.middleware.sessions import SessionMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key="supersecret_session_key")
# OAuth config
oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"}
)

# JWT-based auth
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Example in-memory user DB
fake_users_db = {}

@app.get("/login/google")
async def login_google(request: Request):
    redirect_uri = request.url_for("auth_google")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/google")
async def auth_google(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = token["userinfo"]

    # Check if user exists, else create
    email = user_info["email"]
    if email not in fake_users_db:
        fake_users_db[email] = {"email": email, "role": "student"}  # default role

    # Issue JWT
    jwt_token = create_access_token({"sub": email, "role": fake_users_db[email]["role"]})
    response = RedirectResponse(url="/dashboard")
    response.set_cookie(key="access_token", value=f"Bearer {jwt_token}", httponly=True)
    return response
