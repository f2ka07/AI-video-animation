"""Vector store wrapper for ChromaDB."""

from typing import Any

import chromadb

from .config import get_settings
from .embeddings import embed_texts

settings = get_settings()


class VectorStore:
    """ChromaDB wrapper for vector storage and retrieval."""

    def __init__(self, collection_name: str = "default", persist_directory: str = "./chroma_db"):
        """Initialize vector store with ChromaDB backend."""
        self.collection_name = collection_name
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.collection = self.client.get_or_create_collection(name=collection_name)

    def add_texts(
        self,
        texts: list[str],
        metadatas: list[dict[str, Any]] | None = None,
        ids: list[str] | None = None,
    ) -> None:
        """Add texts to the vector store."""
        if metadatas is None:
            metadatas = [{}] * len(texts)
        if ids is None:
            ids = [f"doc_{i}" for i in range(len(texts))]

        embeddings = embed_texts(texts)

        self.collection.add(
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas,
            ids=ids,
        )

    def search(
        self,
        query: str,
        n_results: int = 5,
        filter: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        """Search for similar texts."""
        from .embeddings import embed_text

        query_embedding = embed_text(query)

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where=filter,
        )

        formatted_results = []
        if results["documents"] and len(results["documents"][0]) > 0:
            for i in range(len(results["documents"][0])):
                formatted_results.append(
                    {
                        "text": results["documents"][0][i],
                        "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                        "id": results["ids"][0][i],
                        "distance": results["distances"][0][i] if results["distances"] else None,
                    }
                )

        return formatted_results

    def delete(self, ids: list[str]) -> None:
        """Delete documents by IDs."""
        self.collection.delete(ids=ids)

    def get_collection_stats(self) -> dict[str, Any]:
        """Get statistics about the collection."""
        count = self.collection.count()
        return {"count": count, "collection_name": self.collection_name}
