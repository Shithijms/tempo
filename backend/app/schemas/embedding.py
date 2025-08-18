from pydantic import BaseModel

class PostCreate(BaseModel):
     title:str
     body:str

class SearchQuery(BaseModel):
     query:str
     result:int