"""
Flask Web Microservice for Python AI Accessibility Verification.
Exposes:
- POST /detect: receives image file/multipart or JSON, runs YOLO, returns detections & score.
- GET /health: healthcheck endpoint.
- GET /status: model loading status (best.pt presence check).
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from detector import AccessibilityDetector

app = Flask(__name__)
CORS(app)

detector = AccessibilityDetector()

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "AI Accessibility Verification Service",
        "modelLoaded": detector.is_model_loaded,
        "isDemoMode": not detector.is_model_loaded
    })

@app.route("/status", methods=["GET"])
def status():
    return jsonify({
        "status": "ready",
        "modelLoaded": detector.is_model_loaded,
        "modelPath": detector.model_path,
        "mode": "REAL AI (YOLOv8)" if detector.is_model_loaded else "DEMO MODE — AI MODEL NOT CONNECTED"
    })

@app.route("/detect", methods=["POST"])
def detect():
    try:
        # Check if file was uploaded via multipart/form-data
        if "image" in request.files:
            file = request.files["image"]
            image_bytes = file.read()
            filename = file.filename or "uploaded.jpg"
        elif request.data:
            image_bytes = request.data
            filename = "uploaded.jpg"
        else:
            return jsonify({"error": "No image data received. Please send 'image' in multipart form data."}), 400

        result = detector.detect(image_bytes, filename=filename)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to analyze image with computer vision.",
            "details": str(e)
        }), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"Starting Accessibility AI Service on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
