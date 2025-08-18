from fastapi import FastAPI,HTTPException,APIRouter
import bcrypt
from app.database.db import supabase
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
from app.routers import chatbot

#router handel
chatbot_router=APIRouter(prefix="/chatbot")

load_dotenv()

app = FastAPI()

#middleware
app.add_middleware(SessionMiddleware, secret_key="supersecret_session_key")

#routers
#app.include_router(chatbot.chatbot_router,prefix="/chatbot")

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

@app.post("/signup")
def signup(name:str,email:str,password:str):
    #hash password
    hashed_pw=bcrypt.hashpw(password.encode("utf-8"),bcrypt.gensalt()).decode()

    # Insert into Supabase
    response = supabase.table("users").insert({
        "name": name,
        "email": email,
        "password_hash": hashed_pw,
        "profile_pic": ""
    }).execute()

    if response.data:
        return {"message": "User created", "user": response.data}
    
from pydantic import BaseModel
class User(BaseModel):
    email:str
    password:str

@app.post("/login")
def login(user:User):
    email=user.email
    password=user.password
   
    #fetch user details
    response=supabase.table("users").select("*").eq("email",email).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")
   
    user=response.data[0]

    #verify password
    if bcrypt.checkpw(password.encode("utf-8"), user["password_hash"].encode("utf-8")):
        return {"message": "Login successful", "user": user}
    else:
        raise HTTPException(status_code=401, detail="Invalid password")

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



from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

SECRET_KEY = "your-secret"
ALGORITHM = "HS256"

def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = token.replace("Bearer ", "")  # remove prefix
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/dashboard")
def dash(user: dict = Depends(get_current_user)):
    return {"message": f"Welcome to dashboard, {user['sub']}!", "role": user["role"]}


@chatbot_router.get("/")
def chat():
    return {"Hello":"world"}


#embedings
# Python script to generate embeddings and store in Supabase
from sentence_transformers import SentenceTransformer
from supabase import create_client

model = SentenceTransformer('all-MiniLM-L6-v2')



import os
from dotenv import load_dotenv
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

title='First Post'
body='Hello world!'

# output=model.encode(body).tolist()
# result=supabase.table('posts').insert({
#     'title':title,
#     'body':body,
#     'embedding':output
# }).execute()
# print(result)

# query=model.encode("hello world").tolist()
# search_res=supabase.rpc('search_similar_posts',{
#     'query_embedding':query,
#     'match_count':1
# }).execute()
# print("Res:",search_res.data)


def search_similar_posts(query_text, limit=5):
    # Generate query embedding
    query_embedding = model.encode(query_text).tolist()
    
    # Search using Supabase RPC function
    # Make sure you have the search function created in your database
    try:
        search_result = supabase.rpc('search_similar_posts', {
            'query_embedding': query_embedding,
            'match_count': limit
        }).execute()
        
        return search_result.data
    except Exception as e:
        print(f"Search error: {e}")
        return None

sample_posts = [
    ("Python Tutorial", "Learn Python programming with examples and exercises"),
    ("React Guide", "Building modern web applications with React and JavaScript"),
    ("AI Introduction", "Understanding artificial intelligence and machine learning basics"),
    ("Database Design", "Best practices for designing relational databases")
]

print("\n--- Adding More Sample Data ---")
for title, body in sample_posts:
    embedding = model.encode(body).tolist()
    result = supabase.table('posts').insert({
        'title': title,
        'body': body,
        'embedding': embedding
    }).execute()
    print(f"Added: {title}")

# Test search with more data
print("\n--- Testing Search with More Data ---")
test_queries = [
    "programming tutorial",
    "web development",
    "machine learning",
    "database management"
]

for query in test_queries:
    print(f"\n🔍 Searching for: '{query}'")
    results = search_similar_posts(query, 3)
    if results:
        for i, post in enumerate(results, 1):
            similarity = post.get('similarity', 0)
            print(f"{i}. {post['title']} (similarity: {similarity:.3f})")
    else:
        print("No results found")