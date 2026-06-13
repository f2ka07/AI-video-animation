# Lab Resources

This directory contains all lab resources for the Agentic AI course. Download this folder to run the labs.

## Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- Virtual environment (recommended)

## Setup

1. Navigate to the lab_resources directory (where pyproject.toml is located):

   ```bash
   cd lab_resources
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv .venv
   # Linux/Mac:
   source .venv/bin/activate
   # Windows:
   .venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install --upgrade pip
   pip install -e .
   ```

4. Configure environment variables:

   ```bash
   cp .env.example .env
   # Edit .env and add your API keys (GROQ_API_KEY or TOGETHER_API_KEY)
   ```

## Running Labs

Run all commands from the lab_resources directory (where pyproject.toml is located).

### Lab to Directory Mapping

| Course Lab | Directory | Run Command |
|------------|-----------|-------------|
| Lab 1.1 | lab1_1/ | `python -m lab1_1.main` |
| Lab 1.2 | lab1_2/ | `python -m lab1_2.main` |
| Lab 2.1 | lab2_1/ | `python -m lab2_1.main` |
| Lab 3.1 | lab3_1/ | `python -m lab3_1.main` |
| Lab 4.1 | lab4_1/ | `python lab4_1/run_server.py` or `uvicorn lab4_1.app:app --reload` |
| Lab 5.1 | lab5_1/ | `python -m lab5_1.main` |
| Lab 5.2 | lab5_2/ | `python -m lab5_2.main` |
| Lab 6.1 | lab6_1/ | `python -m lab6_1.main` |
| Lab 7.1 | lab7_1/ | `python -m lab7_1.guardrails_demo` or `python -m lab7_1.nim_client_demo` |
| Lab 8.1 | lab8_1/ | `python -m lab8_1.main` |
| Lab 9.1 | lab9_1/ | `python -m lab9_1.main` |
| Lab 10.1 | lab10_1/ | `python -m lab10_1.main` |
| Lab 10.2 | lab10_2/ | `python -m lab10_2.main` |
| Lab 10.3 | lab10_3/ | `python -m lab10_3.main` |
| Capstone | lab_capstone/ | `uvicorn lab_capstone.app.api:app --host 0.0.0.0 --port 8000` |

### Quick Start

Run the environment smoke test (Lab 1.1) first:

```bash
python -m lab1_1.main
```

You should see: LLM: OK, Embeddings: OK, DB: OK

### Optional: Run Lab Helper

Use the run_lab script to run labs by number:

```bash
python run_lab.py 1.1
python run_lab.py 2.1
```

## Docker (Lab 4.1 and Capstone)

**Lab 4.1 (Deployment):**

```bash
docker build -t agentic-ai:latest -f lab4_1/Dockerfile .
docker run -p 8000:8000 --env-file .env agentic-ai:latest
```

**Capstone:**

```bash
docker build -t agentic-ai-capstone:latest -f lab_capstone/Dockerfile .
docker run -p 8000:8000 --env-file .env agentic-ai-capstone:latest
```

## Troubleshooting

- **"No module named 'agentic_core'"**: Ensure you ran `pip install -e .` from the lab_resources directory.
- **"pyproject.toml not found"**: Ensure you are in the lab_resources directory (the folder you downloaded).
- **API key errors**: Check your .env file has valid GROQ_API_KEY or TOGETHER_API_KEY.
