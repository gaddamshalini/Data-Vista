from flask import Blueprint, request, jsonify
from database import SessionLocal
from models import Student
from ml.predictor import predictor

ml_bp = Blueprint("ml_readiness", __name__, url_prefix="/api/ml")

@ml_bp.route("/predict", methods=["GET", "POST"])
def predict_readiness():
    """
    Predict placement readiness using the trained machine learning model.
    Accepts student_id via query param or full feature payload in POST body.
    """
    student_id = request.args.get("student_id")
    body = request.get_json(silent=True) or {}

    features = {}

    if student_id:
        db = SessionLocal()
        try:
            student = db.query(Student).filter(Student.student_id == student_id).first()
            if not student:
                return jsonify({"success": False, "error": f"Student '{student_id}' not found"}), 404

            features = {
                "cgpa": student.cgpa,
                "num_skills": len(student.skills),
                "num_projects": len(student.projects),
                "num_certifications": len(student.certifications),
                "internship_months": (getattr(student, "num_internships", 0) or 0) * 3,
                "aptitude_score": float(getattr(student, "aptitude_score", 75.0) or 75.0),
                "communication_score": float(getattr(student, "communication_score", 75.0) or 75.0)
            }
        finally:
            db.close()
    else:
        # Custom manual or simulated features
        features = {
            "cgpa": float(body.get("cgpa", 7.5)),
            "num_skills": int(body.get("num_skills", 4)),
            "num_projects": int(body.get("num_projects", 2)),
            "num_certifications": int(body.get("num_certifications", 1)),
            "internship_months": int(body.get("internship_months", 0)),
            "aptitude_score": float(body.get("aptitude_score", 70.0)),
            "communication_score": float(body.get("communication_score", 70.0))
        }

    try:
        prediction_result = predictor.predict_readiness(features)
        return jsonify({
            "success": True,
            "data": prediction_result
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@ml_bp.route("/evaluation-metrics", methods=["GET"])
def get_model_evaluation():
    """
    Returns full test-set evaluation leaderboard for all trained models:
    - Logistic Regression, Decision Tree, Random Forest
    - Accuracy, Precision, Recall, F1 Score
    - Confusion Matrix (TN, FP, FN, TP)
    - Feature Importance breakdown
    """
    metrics = predictor.get_evaluation_metrics()
    return jsonify({
        "success": True,
        "data": metrics
    })
