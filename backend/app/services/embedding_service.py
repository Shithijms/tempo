from app.core.embeddings import embedding_service
from app.utils.database import supabase
from typing import List, Dict

class EmbeddingManager:
    def create_post_with_embedding(self, title: str, body: str):
        embedding = embedding_service.generate_embedding(body)
        
        result = supabase.table('posts').insert({
            'title': title,
            'body': body,
            'embedding': embedding
        }).execute()
        
        return result.data
    
    def search_similar_posts(self, query: str, limit: int = 5):
        query_embedding = embedding_service.generate_embedding(query)
        
        result = supabase.rpc('search_similar_posts', {
            'query_embedding': query_embedding,
            'match_count': limit
        }).execute()
        
        return result.data

embedding_manager = EmbeddingManager()