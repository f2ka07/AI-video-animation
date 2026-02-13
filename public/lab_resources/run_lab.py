#!/usr/bin/env python3
"""Run labs by lab number (e.g., 1.1, 2.1)."""

import sys
import subprocess
from pathlib import Path

LAB_MAP = {
    "1.1": "lab1_1.main",
    "1.2": "lab1_2.main",
    "2.1": "lab2_1.main",
    "3.1": "lab3_1.main",
    "4.1": "lab4_1.app:app",
    "5.1": "lab5_1.main",
    "5.2": "lab5_2.main",
    "6.1": "lab6_1.main",
    "7.1": "lab7_1.main",
    "8.1": "lab8_1.main",
    "9.1": "lab9_1.main",
    "10.1": "lab10_1.main",
    "10.2": "lab10_2.main",
    "10.3": "lab10_3.main",
    "capstone": "lab_capstone.app.api:app",
}


def run_lab(lab_id: str) -> None:
    """Run a lab by ID."""
    lab_id = lab_id.strip().lower()
    if lab_id not in LAB_MAP:
        print(f"Unknown lab: {lab_id}")
        print(f"Available: {', '.join(LAB_MAP.keys())}")
        sys.exit(1)

    module = LAB_MAP[lab_id]

    if lab_id in ("4.1", "capstone"):
        print(f"Starting {lab_id} (FastAPI server)...")
        subprocess.run(
            [sys.executable, "-m", "uvicorn", module, "--host", "0.0.0.0", "--port", "8000"],
            check=False,
        )
    else:
        print(f"Running lab {lab_id}...")
        subprocess.run([sys.executable, "-m", module], check=False)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run_lab.py <lab_id>")
        print("Example: python run_lab.py 1.1")
        print(f"Available: {', '.join(LAB_MAP.keys())}")
        sys.exit(1)

    try:
        run_lab(sys.argv[1])
    except KeyboardInterrupt:
        print("\nShutting down...")
        sys.exit(0)
