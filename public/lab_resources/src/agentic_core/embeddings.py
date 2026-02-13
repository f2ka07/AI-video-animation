"""Embedding generation helpers for RAG."""

from sentence_transformers import SentenceTransformer

from .config import get_settings

settings = get_settings()

# Global model instance (lazy loaded)
_embedding_model: SentenceTransformer | None = None


def get_embedding_model() -> SentenceTransformer:
    """Get or create the embedding model instance."""
    global _embedding_model
    if _embedding_model is None:
        model_name = settings.embeddings_model
        _embedding_model = SentenceTransformer(model_name)
    return _embedding_model


def embed_text(text: str) -> list[float]:
    """Generate embedding for a single text."""
    model = get_embedding_model()
    embedding = model.encode(text, convert_to_numpy=True)
    return embedding.tolist()


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Generate embeddings for multiple texts."""
    model = get_embedding_model()
    embeddings = model.encode(texts, convert_to_numpy=True)
    return embeddings.tolist()
