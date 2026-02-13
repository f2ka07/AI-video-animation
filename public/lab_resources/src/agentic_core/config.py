"""Configuration management for agentic AI system."""

from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # LLM provider and models
    llm_provider: str = "groq"  # groq | together | nim | local
    llm_model_planner: str = "llama-3.3-70b-versatile"  # Groq model name
    llm_model_tool: str = "llama-3.3-70b-versatile"  # Use versatile model for tool calling (supports function calling)
    llm_model_critic: str = "llama-3.1-8b-instant"  # Groq model name

    groq_api_key: str | None = None
    together_api_key: str | None = None

    # NVIDIA NIM
    nvidia_nim_base_url: str | None = None
    nvidia_nim_api_key: str | None = None

    # Embeddings / vector store
    embeddings_model: str = "BAAI/bge-small-en-v1.5"  # HuggingFace model identifier
    vectorstore_backend: str = "chromadb"

    # DB
    db_url: str = "sqlite:///./agent_state.db"

    # NeMo Guardrails (optional)
    use_nemo_guardrails: bool = False

    # Monitoring
    log_level: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",  # Ignore extra fields from .env
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
