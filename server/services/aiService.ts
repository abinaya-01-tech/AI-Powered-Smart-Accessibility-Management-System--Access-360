import { DetectionItem } from './firebase.js';

export interface AccessibilityAnalysisResult {
  isDemoMode: boolean;
  modelStatus: string;
  notice?: string;
  detections: DetectionItem[];
  score: number;
  category: 'Highly Accessible' | 'Accessible' | 'Partially Accessible' | 'Poor Accessibility';
  breakdown: { rule: string; points: string }[];
  issues: string[];
  recommendations: string[];
  detectedFeatures: string[];
  annotatedImageUrl?: string;
}

/**
 * Transparent accessibility scoring algorithm
 */
export function calculateAccessibilityScore(detections: DetectionItem[]) {
  const detectedClasses = new Set<string>();
  detections.forEach(d => {
    if (d.class) detectedClasses.add(d.class);
  });

  let score = 0;
  const breakdown: { rule: string; points: string }[] = [];
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (detectedClasses.has('ramp')) {
    score += 30;
    breakdown.push({ rule: 'Ramp detected', points: '+30' });
  } else {
    recommendations.push('Install an ADA-compliant ramp (1:12 slope) for zero-step entrance.');
  }

  if (detectedClasses.has('handrail')) {
    score += 20;
    breakdown.push({ rule: 'Handrail detected', points: '+20' });
  } else {
    recommendations.push('Install continuous safety handrails along corridors and ramps.');
  }

  if (detectedClasses.has('lift')) {
    score += 20;
    breakdown.push({ rule: 'Lift / elevator detected', points: '+20' });
  }

  if (detectedClasses.has('accessible_toilet_sign')) {
    score += 20;
    breakdown.push({ rule: 'Accessible toilet sign detected', points: '+20' });
  } else {
    recommendations.push('Provide clearly designated accessible unisex restrooms with grab bars.');
  }

  if (detectedClasses.has('stairs')) {
    score -= 10;
    breakdown.push({ rule: 'Stairs detected', points: '-10' });
    issues.push('Stairs detected: May present a barrier for wheelchair and mobility-device users.');
    recommendations.push('Provide an accessible alternative route or platform lift adjacent to stairs.');
  }

  // Base infrastructure credit if positive accessibility elements exist
  const positiveClasses = Array.from(detectedClasses).filter(c => c !== 'stairs');
  if (positiveClasses.length > 0) {
    score += 10;
    breakdown.push({ rule: 'Infrastructure baseline credit', points: '+10' });
  }

  const finalScore = Math.max(0, Math.min(100, score));

  let category: 'Highly Accessible' | 'Accessible' | 'Partially Accessible' | 'Poor Accessibility';
  if (finalScore >= 80) category = 'Highly Accessible';
  else if (finalScore >= 60) category = 'Accessible';
  else if (finalScore >= 40) category = 'Partially Accessible';
  else category = 'Poor Accessibility';

  if (recommendations.length === 0) {
    recommendations.push('Maintain existing accessibility infrastructure with regular preventative inspections.');
  }

  return {
    score: finalScore,
    category,
    breakdown,
    issues,
    recommendations,
    detectedFeatures: Array.from(detectedClasses)
  };
}

/**
 * Calls Python AI service if available, else provides clearly labeled DEMO MODE
 */
export async function analyzeAccessibilityImage(
  imageBuffer: Buffer,
  mimeType: string,
  originalName = 'inspection.jpg'
): Promise<AccessibilityAnalysisResult> {
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5001';

  try {
    // Attempt connecting to Python AI Service
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: mimeType });
    formData.append('image', blob, originalName);

    const response = await fetch(`${aiServiceUrl}/detect`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      return {
        isDemoMode: Boolean(data.isDemoMode),
        modelStatus: data.modelStatus || 'REAL AI RESULT (YOLOv8 + OpenCV)',
        notice: data.notice,
        detections: data.detections || [],
        score: data.score,
        category: data.category,
        breakdown: data.breakdown || [],
        issues: data.issues || [],
        recommendations: data.recommendations || [],
        detectedFeatures: data.detectedFeatures || [],
        annotatedImageUrl: data.annotatedImage || `data:${mimeType};base64,${imageBuffer.toString('base64')}`
      };
    }
  } catch {
    // Python service unreachable -> fall back to DEMO MODE
  }

  // Predefined transparent college DEMO MODE
  const lowerName = originalName.toLowerCase();
  let demoDetections: DetectionItem[];

  if (lowerName.includes('stair') || lowerName.includes('step')) {
    demoDetections = [
      { class: 'stairs', confidence: 0.94, box: [0.15, 0.35, 0.85, 0.90] },
      { class: 'handrail', confidence: 0.88, box: [0.08, 0.20, 0.25, 0.85] }
    ];
  } else if (lowerName.includes('lift') || lowerName.includes('elevator')) {
    demoDetections = [
      { class: 'lift', confidence: 0.96, box: [0.25, 0.15, 0.75, 0.88] },
      { class: 'handrail', confidence: 0.85, box: [0.05, 0.50, 0.22, 0.80] }
    ];
  } else if (lowerName.includes('toilet') || lowerName.includes('restroom')) {
    demoDetections = [
      { class: 'accessible_toilet_sign', confidence: 0.95, box: [0.35, 0.12, 0.65, 0.45] },
      { class: 'handrail', confidence: 0.89, box: [0.10, 0.45, 0.30, 0.80] }
    ];
  } else {
    // Default campus ramp + handrail + lift detection
    demoDetections = [
      { class: 'ramp', confidence: 0.93, box: [0.20, 0.40, 0.80, 0.92] },
      { class: 'handrail', confidence: 0.87, box: [0.12, 0.25, 0.30, 0.78] },
      { class: 'lift', confidence: 0.91, box: [0.70, 0.15, 0.95, 0.65] }
    ];
  }

  const scoring = calculateAccessibilityScore(demoDetections);
  const base64Data = imageBuffer.toString('base64');
  const imageUrl = `data:${mimeType};base64,${base64Data}`;

  return {
    isDemoMode: true,
    modelStatus: 'DEMO MODE',
    notice: 'Python AI Service MODE.',
    detections: demoDetections,
    score: scoring.score,
    category: scoring.category,
    breakdown: scoring.breakdown,
    issues: scoring.issues,
    recommendations: scoring.recommendations,
    detectedFeatures: scoring.detectedFeatures,
    annotatedImageUrl: imageUrl
  };
}
