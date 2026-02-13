"""Example test functions for Lab 3.1."""


def test_add_function(code: str) -> bool:
    """Test if add function works correctly."""
    try:
        code_clean = code.strip()
        if code_clean.startswith("```python"):
            code_clean = code_clean[9:]
        elif code_clean.startswith("```"):
            code_clean = code_clean[3:]
        if code_clean.endswith("```"):
            code_clean = code_clean[:-3]
        code_clean = code_clean.strip()

        namespace = {}
        exec(code_clean, namespace)

        if "add" not in namespace:
            return False

        add_func = namespace["add"]
        result = add_func(2, 3)
        return result == 5
    except Exception:
        return False


def test_multiply_function(code: str) -> bool:
    """Test if multiply function works correctly."""
    try:
        exec(code, globals())
        result = multiply(4, 5)
        return result == 20
    except Exception:
        return False
