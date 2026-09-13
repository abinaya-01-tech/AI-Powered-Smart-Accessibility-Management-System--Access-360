import { Router } from 'express';
import { dbService } from '../services/firebase.js';

export const adminRouter = Router();

// Government / Authority Dashboard Statistics
adminRouter.get('/statistics', (_req, res) => {
  try {
    const locations = dbService.getLocations();
    const reports = dbService.getReports();
    const logs = dbService.getAccessLogs();
    const tokens = dbService.getAllTokens();

    const totalLocations = locations.length;
    const highlyAccessible = locations.filter(l => l.accessibilityCategory === 'Highly Accessible').length;
    const accessible = locations.filter(l => l.accessibilityCategory === 'Accessible').length;
    const partiallyAccessible = locations.filter(l => l.accessibilityCategory === 'Partially Accessible').length;
    const poorAccessibility = locations.filter(l => l.accessibilityCategory === 'Poor Accessibility').length;
    const totalReports = reports.length;
    const verifiedAccessEvents = logs.filter(l => l.status === 'VERIFIED').length;
    const activeTokens = tokens.filter(t => t.status === 'ACTIVE').length;

    // Feature statistics across facilities
    const featureCounts = {
      ramp: locations.filter(l => l.features.ramp).length,
      lift: locations.filter(l => l.features.lift).length,
      handrail: locations.filter(l => l.features.handrail).length,
      accessibleToilet: locations.filter(l => l.features.accessibleToilet).length,
      stairs: locations.filter(l => l.features.stairs).length
    };

    // Score distribution
    const scoreBuckets = [
      { range: '0–39 (Poor)', count: locations.filter(l => l.accessibilityScore < 40).length, fill: '#ef4444' },
      { range: '40–59 (Partial)', count: locations.filter(l => l.accessibilityScore >= 40 && l.accessibilityScore < 60).length, fill: '#f59e0b' },
      { range: '60–79 (Accessible)', count: locations.filter(l => l.accessibilityScore >= 60 && l.accessibilityScore < 80).length, fill: '#3b82f6' },
      { range: '80–100 (High)', count: locations.filter(l => l.accessibilityScore >= 80).length, fill: '#10b981' }
    ];

    // Category distribution for pie chart
    const categoryDistribution = [
      { name: 'Highly Accessible', value: highlyAccessible, color: '#10b981' },
      { name: 'Accessible', value: accessible, color: '#3b82f6' },
      { name: 'Partially Accessible', value: partiallyAccessible, color: '#f59e0b' },
      { name: 'Poor Accessibility', value: poorAccessibility, color: '#ef4444' }
    ];

    // Feature compliance bar data
    const featureCompliance = [
      { feature: 'Ramps', count: featureCounts.ramp, percentage: totalLocations ? Math.round((featureCounts.ramp / totalLocations) * 100) : 0 },
      { feature: 'Lifts / Elevators', count: featureCounts.lift, percentage: totalLocations ? Math.round((featureCounts.lift / totalLocations) * 100) : 0 },
      { feature: 'Handrails', count: featureCounts.handrail, percentage: totalLocations ? Math.round((featureCounts.handrail / totalLocations) * 100) : 0 },
      { feature: 'Accessible Toilets', count: featureCounts.accessibleToilet, percentage: totalLocations ? Math.round((featureCounts.accessibleToilet / totalLocations) * 100) : 0 },
      { feature: 'Stairs (Obstacles)', count: featureCounts.stairs, percentage: totalLocations ? Math.round((featureCounts.stairs / totalLocations) * 100) : 0 }
    ];

    // Access events timeline (mock past 7 days distribution)
    const accessTimeline = [
      { day: 'Mon', events: 14, authorized: 14 },
      { day: 'Tue', events: 19, authorized: 18 },
      { day: 'Wed', events: 25, authorized: 24 },
      { day: 'Thu', events: 22, authorized: 21 },
      { day: 'Fri', events: 31, authorized: 30 },
      { day: 'Sat', events: 16, authorized: 16 },
      { day: 'Sun', events: 12, authorized: 12 }
    ];

    return res.json({
      summary: {
        totalLocations,
        highlyAccessible,
        accessible,
        partiallyAccessible,
        poorAccessibility,
        totalReports,
        verifiedAccessEvents,
        activeTokens
      },
      charts: {
        scoreBuckets,
        categoryDistribution,
        featureCompliance,
        accessTimeline
      },
      problematicLocations: locations.filter(l => l.accessibilityScore < 60)
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to aggregate admin statistics.', details: err.message });
  }
});
