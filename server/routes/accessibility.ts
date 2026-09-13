import { Router } from 'express';
import multer from 'multer';
import { dbService, AccessibilityReportRecord } from '../services/firebase.js';
import { analyzeAccessibilityImage } from '../services/aiService.js';

export const accessibilityRouter = Router();

// File upload security: memory storage, size limit 10MB, strict mime-types
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedExtensions = /\.(jpg|jpeg|png|webp)$/i;

    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only JPG, JPEG, PNG, and WEBP image files are allowed.'));
    }
  }
});

// Analyze image with YOLO / Python AI service
accessibilityRouter.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image file for accessibility verification.' });
    }

    const analysis = await analyzeAccessibilityImage(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    return res.json(analysis);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Unable to analyze the image. Please try again.',
      details: err.message
    });
  }
});

// Save an accessibility report
accessibilityRouter.post('/reports', (req, res) => {
  try {
    const {
      locationId,
      locationName,
      score,
      category,
      detections,
      recommendations,
      issues,
      imageUrl,
      annotatedImageUrl,
      inspectorId,
      inspectorName,
      isDemoMode,
      modelStatus
    } = req.body;

    if (!locationName || score === undefined || !category) {
      return res.status(400).json({ error: 'Missing required report fields (locationName, score, category).' });
    }

    const reportId = `REP-${Date.now().toString(36).toUpperCase()}`;
    const newReport: AccessibilityReportRecord = {
      id: reportId,
      locationId: locationId || `LOC-${Date.now().toString(36).toUpperCase()}`,
      locationName,
      score: Number(score),
      category,
      detections: Array.isArray(detections) ? detections : [],
      recommendations: Array.isArray(recommendations) ? recommendations : [],
      issues: Array.isArray(issues) ? issues : [],
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
      annotatedImageUrl: annotatedImageUrl || imageUrl || '',
      inspectorId: inspectorId || 'USER-INSPECTOR-01',
      inspectorName: inspectorName || 'Certified Accessibility Inspector',
      isDemoMode: Boolean(isDemoMode),
      modelStatus: modelStatus || 'AI Verification Report',
      createdAt: new Date().toISOString(),
      status: score >= 60 ? 'VERIFIED' : 'FLAGGED'
    };

    const saved = dbService.createReport(newReport);
    return res.status(201).json({
      message: 'Accessibility verification report successfully recorded in Firestore.',
      report: saved
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to record report.', details: err.message });
  }
});

// List all reports
accessibilityRouter.get('/reports', (req, res) => {
  try {
    const reports = dbService.getReports();
    return res.json({ reports });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch reports.', details: err.message });
  }
});

// Get report by ID
accessibilityRouter.get('/reports/:id', (req, res) => {
  try {
    const { id } = req.params;
    const report = dbService.getReport(id);
    if (!report) {
      return res.status(404).json({ error: 'Accessibility report not found.' });
    }
    return res.json({ report });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve report.', details: err.message });
  }
});
