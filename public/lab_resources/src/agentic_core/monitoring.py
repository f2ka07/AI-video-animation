"""Monitoring, logging, and metrics helpers."""

import time
from contextlib import contextmanager
from typing import Any

from loguru import logger
from prometheus_client import Counter, Histogram, Gauge

logger.remove()
logger.add(
    lambda msg: print(msg, end=""),
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>",
    level="INFO",
)

request_counter = Counter("agent_requests_total", "Total agent requests", ["role", "status"])
request_duration = Histogram("agent_request_duration_seconds", "Agent request duration", ["role"])
active_requests = Gauge("agent_active_requests", "Active agent requests", ["role"])


class MetricsCollector:
    """Collects and reports metrics."""

    def __init__(self):
        """Initialize metrics collector."""
        self.metrics = {
            "requests": 0,
            "errors": 0,
            "latencies": [],
        }

    def record_request(self, role: str, duration: float, success: bool = True):
        """Record a request metric."""
        self.metrics["requests"] += 1
        self.metrics["latencies"].append(duration)
        request_counter.labels(role=role, status="success" if success else "error").inc()
        request_duration.labels(role=role).observe(duration)

        if not success:
            self.metrics["errors"] += 1

    def get_stats(self) -> dict[str, Any]:
        """Get current statistics."""
        latencies = self.metrics["latencies"]
        if latencies:
            avg_latency = sum(latencies) / len(latencies)
            max_latency = max(latencies)
            min_latency = min(latencies)
        else:
            avg_latency = max_latency = min_latency = 0.0

        return {
            "total_requests": self.metrics["requests"],
            "total_errors": self.metrics["errors"],
            "avg_latency_seconds": avg_latency,
            "max_latency_seconds": max_latency,
            "min_latency_seconds": min_latency,
        }

    def reset(self):
        """Reset metrics."""
        self.metrics = {
            "requests": 0,
            "errors": 0,
            "latencies": [],
        }


_metrics_collector = MetricsCollector()


def get_metrics_collector() -> MetricsCollector:
    """Get global metrics collector."""
    return _metrics_collector


@contextmanager
def track_request(role: str = "unknown"):
    """Context manager to track request duration."""
    active_requests.labels(role=role).inc()
    start_time = time.time()
    success = True
    try:
        yield
    except Exception:
        success = False
        raise
    finally:
        duration = time.time() - start_time
        active_requests.labels(role=role).dec()
        _metrics_collector.record_request(role, duration, success)


def log_agent_action(agent_name: str, action: str, details: dict[str, Any] | None = None):
    """Log an agent action."""
    logger.info(f"Agent {agent_name} - {action}", **details or {})


def log_error(error: Exception, context: dict[str, Any] | None = None):
    """Log an error with context."""
    logger.error(f"Error: {str(error)}", **context or {})
