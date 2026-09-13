"""
YOLO + OpenCV Object Detection module for Accessibility Verification.
Supported Classes:
1. ramp
2. stairs
3. handrail
4. accessible_toilet_sign
5. lift
(Mapped: elevator -> lift, restroom_sign -> accessible_toilet_sign)
"""

import os
import io
import base64
import numpy as np
from PIL import Image

try:
    import cv2
except ImportError:
    cv2 = None

try:
    from ultralytics import YOLO
except ImportError:
    YOLO = None

from scorer import calculate_accessibility_score

# Class normalization mapping
CLASS_MAPPINGS = {
    "elevator": "lift",
    "restroom_sign": "accessible_toilet_sign",
    "toilet_sign": "accessible_toilet_sign",
    "restroom": "accessible_toilet_sign",
    "wheelchair_ramp": "ramp",
    "hand_rail": "handrail",
    "steps": "stairs",
    "staircase": "stairs",
}

VALID_CLASSES = {
    "ramp",
    "stairs",
    "handrail",
    "accessible_toilet_sign",
    "lift"
}

# Distinct colors for drawing bounding boxes (BGR)
CLASS_COLORS = {
    "ramp": (34, 197, 94),                   # Green
    "handrail": (59, 130, 246),              # Blue
    "lift": (168, 85, 247),                  # Purple
    "accessible_toilet_sign": (14, 165, 233),# Sky Blue
    "stairs": (239, 68, 68)                  # Red
}

class AccessibilityDetector:
    def __init__(self, model_path=None):
        if model_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            model_path = os.path.join(base_dir, "models", "best.pt")
        
        self.model_path = model_path
        self.model = None
        self.is_model_loaded = False
        self._load_model()

    def _load_model(self):
        if os.path.exists(self.model_path) and YOLO is not None:
            try:
                self.model = YOLO(self.model_path)
                self.is_model_loaded = True
                print(f"[AI Service] Successfully loaded YOLO model from {self.model_path}")
            except Exception as e:
                print(f"[AI Service] Error loading YOLO model: {e}")
                self.model = None
                self.is_model_loaded = False
        else:
            print(f"[AI Service] YOLO weights not found at {self.model_path}. Operating in DEMO MODE.")
            self.model = None
            self.is_model_loaded = False

    def normalize_class_name(self, raw_class):
        clean = raw_class.strip().lower().replace(" ", "_").replace("-", "_")
        if clean in CLASS_MAPPINGS:
            clean = CLASS_MAPPINGS[clean]
        if clean in VALID_CLASSES:
            return clean
        return None

    def annotate_image(self, img_np, detections):
        """Draw bounding boxes and class labels with OpenCV."""
        if cv2 is None:
            return None

        annotated = img_np.copy()
        height, width = annotated.shape[:2]

        for det in detections:
            cls_name = det["class"]
            conf = det.get("confidence", 0.90)
            box = det.get("box", [0.1, 0.1, 0.9, 0.9])
            
            # Normalize box coordinates to pixel coordinates
            if all(isinstance(c, float) and c <= 1.0 for c in box):
                x1 = int(box[0] * width)
                y1 = int(box[1] * height)
                x2 = int(box[2] * width)
                y2 = int(box[3] * height)
            else:
                x1, y1, x2, y2 = [int(v) for v in box]

            color = CLASS_COLORS.get(cls_name, (0, 255, 0))
            cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 3)

            label = f"{cls_name.replace('_', ' ').title()}: {int(conf * 100)}%"
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.6
            thickness = 2
            (text_w, text_h), baseline = cv2.getTextSize(label, font, font_scale, thickness)
            
            # Draw label background badge
            cv2.rectangle(
                annotated,
                (x1, max(0, y1 - text_h - 10)),
                (x1 + text_w + 10, y1),
                color,
                -1
            )
            # Text on badge (white or dark)
            cv2.putText(
                annotated,
                label,
                (x1 + 5, y1 - 5),
                font,
                font_scale,
                (255, 255, 255),
                thickness,
                cv2.LINE_AA
            )

        # Encode annotated image to base64 data URI
        _, buffer = cv2.imencode('.jpg', annotated, [cv2.IMWRITE_JPEG_QUALITY, 85])
        base64_str = base64.b64encode(buffer).decode('utf-8')
        return f"data:image/jpeg;base64,{base64_str}"

    def detect(self, image_bytes, filename="uploaded.jpg"):
        """Perform object detection using real YOLO or explainable demo mode."""
        # Convert bytes to PIL & OpenCV
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_np = np.array(pil_image)
        if cv2 is not None:
            img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
        else:
            img_bgr = img_np

        if self.is_model_loaded and self.model is not None:
            # REAL AI INFERENCE
            results = self.model(pil_image)
            raw_detections = []
            for r in results:
                for box in r.boxes:
                    cls_id = int(box.cls[0].item())
                    cls_name = r.names.get(cls_id, "unknown")
                    norm_class = self.normalize_class_name(cls_name)
                    if norm_class:
                        conf = float(box.conf[0].item())
                        xyxy = box.xyxy[0].tolist()
                        raw_detections.append({
                            "class": norm_class,
                            "confidence": round(conf, 2),
                            "box": xyxy
                        })

            scoring = calculate_accessibility_score(raw_detections)
            annotated_url = self.annotate_image(img_bgr, raw_detections)

            return {
                "isDemoMode": False,
                "modelStatus": "REAL AI RESULT (YOLOv8 + OpenCV)",
                "detections": raw_detections,
                "score": scoring["score"],
                "category": scoring["category"],
                "breakdown": scoring["breakdown"],
                "issues": scoring["issues"],
                "recommendations": scoring["recommendations"],
                "detectedFeatures": scoring["detectedFeatures"],
                "annotatedImage": annotated_url
            }
        else:
            # CLEARLY LABELED DEMO MODE
            # Use deterministic inspection simulation based on image attributes/filename
            fname = filename.lower()
            if "stair" in fname or "step" in fname:
                demo_detections = [
                    {"class": "stairs", "confidence": 0.94, "box": [0.15, 0.35, 0.85, 0.90]},
                    {"class": "handrail", "confidence": 0.88, "box": [0.08, 0.20, 0.25, 0.85]}
                ]
            elif "lift" in fname or "elevator" in fname:
                demo_detections = [
                    {"class": "lift", "confidence": 0.96, "box": [0.25, 0.15, 0.75, 0.88]},
                    {"class": "handrail", "confidence": 0.85, "box": [0.05, 0.50, 0.22, 0.80]}
                ]
            elif "toilet" in fname or "restroom" in fname:
                demo_detections = [
                    {"class": "accessible_toilet_sign", "confidence": 0.95, "box": [0.35, 0.12, 0.65, 0.45]},
                    {"class": "handrail", "confidence": 0.89, "box": [0.10, 0.45, 0.30, 0.80]}
                ]
            else:
                # Standard entrance ramp scenario
                demo_detections = [
                    {"class": "ramp", "confidence": 0.93, "box": [0.20, 0.40, 0.80, 0.92]},
                    {"class": "handrail", "confidence": 0.87, "box": [0.12, 0.25, 0.30, 0.78]},
                    {"class": "lift", "confidence": 0.91, "box": [0.70, 0.15, 0.95, 0.65]}
                ]

            scoring = calculate_accessibility_score(demo_detections)
            annotated_url = self.annotate_image(img_bgr, demo_detections)

            return {
                "isDemoMode": True,
                "modelStatus": "DEMO MODE — AI MODEL NOT CONNECTED",
                "notice": "models/best.pt is not loaded. Predefined college demo dataset active.",
                "detections": demo_detections,
                "score": scoring["score"],
                "category": scoring["category"],
                "breakdown": scoring["breakdown"],
                "issues": scoring["issues"],
                "recommendations": scoring["recommendations"],
                "detectedFeatures": scoring["detectedFeatures"],
                "annotatedImage": annotated_url
            }
