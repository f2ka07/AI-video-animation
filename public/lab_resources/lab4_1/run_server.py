"""Alternative server startup script for Windows compatibility.

Run from lab_resources directory:
    python lab4_1/run_server.py
"""

import sys
import os
from pathlib import Path

script_path = Path(__file__).resolve()
lab_dir = script_path.parent
lab_resources_root = lab_dir.parent

if str(lab_resources_root) not in sys.path:
    sys.path.insert(0, str(lab_resources_root))

os.chdir(str(lab_dir))

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info",
    )
