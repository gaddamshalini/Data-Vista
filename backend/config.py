import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# Database configuration: defaults to SQLite for zero-config, supports MySQL via environment variable
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{BASE_DIR / 'careercompass.db'}"
)

# Upload directory for resumes
UPLOAD_FOLDER = BASE_DIR / "uploads"
UPLOAD_FOLDER.mkdir(exist_ok=True)

# ML model directory
ML_DIR = BASE_DIR / "ml"
ML_DIR.mkdir(exist_ok=True)
MODEL_PATH = ML_DIR / "best_placement_model.joblib"
METRICS_PATH = ML_DIR / "model_evaluation_metrics.json"

SECRET_KEY = os.getenv("SECRET_KEY", "careercompass-secure-secret-key-2026")
DEBUG = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1")
