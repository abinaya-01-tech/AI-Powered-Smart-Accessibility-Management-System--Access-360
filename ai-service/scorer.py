"""
Explainable Accessibility Scoring System for AI-Powered Smart Accessibility Management System.
Rules:
- Ramp detected: +30
- Handrail detected: +20
- Lift detected: +20
- Accessible toilet sign detected: +20
- Stairs detected: -10
Normalized to 0–100.

Categories:
80–100: Highly Accessible
60–79: Accessible
40–59: Partially Accessible
0–39: Poor Accessibility
"""

def calculate_accessibility_score(detections):
    # Unique detected valid classes
    detected_classes = set()
    for d in detections:
        c = d.get("class", "").strip().lower()
        if c:
            detected_classes.add(c)

    score = 0
    breakdown = []
    issues = []
    recommendations = []

    if "ramp" in detected_classes:
        score += 30
        breakdown.append({"rule": "Ramp detected", "points": "+30"})
    else:
        recommendations.append("Install an ADA-compliant ramp (1:12 slope) for zero-step step entrance.")

    if "handrail" in detected_classes:
        score += 20
        breakdown.append({"rule": "Handrail detected", "points": "+20"})
    else:
        recommendations.append("Install continuous safety handrails along corridors and ramps.")

    if "lift" in detected_classes:
        score += 20
        breakdown.append({"rule": "Lift / elevator detected", "points": "+20"})

    if "accessible_toilet_sign" in detected_classes:
        score += 20
        breakdown.append({"rule": "Accessible toilet sign detected", "points": "+20"})
    else:
        recommendations.append("Provide clearly designated accessible unisex restrooms with grab bars.")

    if "stairs" in detected_classes:
        score -= 10
        breakdown.append({"rule": "Stairs detected", "points": "-10"})
        issues.append("Stairs detected: May present a barrier for wheelchair and mobility-device users.")
        recommendations.append("Provide an accessible alternative route or platform lift adjacent to stairs.")

    # Base accessibility baseline if features exist
    if len(detected_classes - {"stairs"}) > 0:
        # Base credit for verified public infrastructure
        score += 10
        breakdown.append({"rule": "Infrastructure baseline credit", "points": "+10"})

    # Normalize score strictly between 0 and 100
    final_score = max(0, min(100, score))

    if final_score >= 80:
        category = "Highly Accessible"
    elif final_score >= 60:
        category = "Accessible"
    elif final_score >= 40:
        category = "Partially Accessible"
    else:
        category = "Poor Accessibility"

    if not recommendations:
        recommendations.append("Maintain existing accessibility infrastructure with regular inspections.")

    return {
        "score": final_score,
        "category": category,
        "breakdown": breakdown,
        "issues": issues,
        "recommendations": recommendations,
        "detectedFeatures": list(detected_classes)
    }
