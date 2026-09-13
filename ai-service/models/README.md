# YOLO Model Weights Directory

Place your custom trained YOLO weights file named `best.pt` in this directory:
`ai-service/models/best.pt`

### Supported Accessibility Classes:
1. `ramp`
2. `stairs`
3. `handrail`
4. `accessible_toilet_sign` (or `restroom_sign`, automatically mapped)
5. `lift` (or `elevator`, automatically mapped)

### Training Tips:
- Train YOLOv8 / YOLOv11 on Roboflow or custom labeled accessibility datasets with these 5 classes.
- Export trained model weights: `yolo detect train model=yolov8n.pt data=accessibility.yaml epochs=50 imgsz=640`
- Copy `runs/detect/train/weights/best.pt` into this `models/` directory.

### Demo Mode:
If `best.pt` is not present, the AI service will automatically operate in **DEMO MODE — AI MODEL NOT CONNECTED**, providing clear notices and transparent simulated detections for academic presentations.
