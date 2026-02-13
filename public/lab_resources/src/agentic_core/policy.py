"""Policy enforcement and safety checks."""

import re
from typing import Any

from .schemas import Message, ToolCall


class PolicyViolation(Exception):
    """Raised when a policy violation is detected."""

    def __init__(self, message: str, violation_type: str):
        super().__init__(message)
        self.violation_type = violation_type


class PolicyChecker:
    """Base policy checker."""

    def check(self, content: str | dict[str, Any]) -> tuple[bool, str | None]:
        """Check content against policy. Returns (allowed, reason)."""
        return True, None


class PIIPolicyChecker(PolicyChecker):
    """Checks for PII (Personally Identifiable Information)."""

    EMAIL_PATTERN = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
    PHONE_PATTERN = r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b"
    SSN_PATTERN = r"\b\d{3}-\d{2}-\d{4}\b"

    def check(self, content: str | dict[str, Any]) -> tuple[bool, str | None]:
        """Check for PII in content."""
        if isinstance(content, dict):
            content = str(content)

        violations = []

        if re.search(self.EMAIL_PATTERN, content):
            violations.append("email")
        if re.search(self.PHONE_PATTERN, content):
            violations.append("phone")
        if re.search(self.SSN_PATTERN, content):
            violations.append("ssn")

        if violations:
            return False, f"PII detected: {', '.join(violations)}"

        return True, None


class ActionPolicyChecker(PolicyChecker):
    """Checks if actions are allowed."""

    def __init__(self, allowed_actions: list[str] | None = None, blocked_actions: list[str] | None = None):
        """Initialize with allowed/blocked action lists."""
        self.allowed_actions = allowed_actions or []
        self.blocked_actions = blocked_actions or []

    def check_tool_call(self, tool_call: ToolCall) -> tuple[bool, str | None]:
        """Check if a tool call is allowed."""
        tool_name = tool_call.tool_name

        if self.blocked_actions and tool_name in self.blocked_actions:
            return False, f"Tool {tool_name} is blocked by policy"

        if self.allowed_actions and tool_name not in self.allowed_actions:
            return False, f"Tool {tool_name} is not in allowed list"

        return True, None


class PolicyEnforcer:
    """Enforces multiple policy checkers."""

    def __init__(self, checkers: list[PolicyChecker] | None = None):
        """Initialize with policy checkers."""
        self.checkers = checkers or []

    def add_checker(self, checker: PolicyChecker) -> None:
        """Add a policy checker."""
        self.checkers.append(checker)

    def check_message(self, message: Message) -> tuple[bool, str | None]:
        """Check a message against all policies."""
        for checker in self.checkers:
            allowed, reason = checker.check(message.content)
            if not allowed:
                return False, reason
        return True, None

    def check_tool_call(self, tool_call: ToolCall) -> tuple[bool, str | None]:
        """Check a tool call against all policies."""
        for checker in self.checkers:
            if isinstance(checker, ActionPolicyChecker):
                allowed, reason = checker.check_tool_call(tool_call)
                if not allowed:
                    return False, reason
        return True, None

    def enforce_message(self, message: Message) -> None:
        """Enforce policies on a message, raising exception if violated."""
        allowed, reason = self.check_message(message)
        if not allowed:
            raise PolicyViolation(reason or "Policy violation", "message")

    def enforce_tool_call(self, tool_call: ToolCall) -> None:
        """Enforce policies on a tool call, raising exception if violated."""
        allowed, reason = self.check_tool_call(tool_call)
        if not allowed:
            raise PolicyViolation(reason or "Policy violation", "tool_call")
