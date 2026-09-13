import { Router } from 'express';
import { dbService, LocationRecord } from '../services/firebase.js';

export const locationsRouter = Router();

// List locations with filters
locationsRouter.get('/', (req, res) => {
  try {
    const { search, category, minScore, ramp, lift, handrail, accessibleToilet } = req.query;
    let locations = dbService.getLocations();

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      locations = locations.filter(l => l.name.toLowerCase().includes(q) || l.address.toLowerCase().includes(q));
    }

    if (category && typeof category === 'string' && category !== 'ALL') {
      locations = locations.filter(l => l.accessibilityCategory === category);
    }

    if (minScore) {
      const min = Number(minScore);
      locations = locations.filter(l => l.accessibilityScore >= min);
    }

    if (ramp === 'true') {
      locations = locations.filter(l => l.features.ramp);
    }
    if (lift === 'true') {
      locations = locations.filter(l => l.features.lift);
    }
    if (handrail === 'true') {
      locations = locations.filter(l => l.features.handrail);
    }
    if (accessibleToilet === 'true') {
      locations = locations.filter(l => l.features.accessibleToilet);
    }

    return res.json({ locations });
  } catch (err: any) {
    return res.status(500).json({ error: 'Unable to load accessibility locations.', details: err.message });
  }
});

// Get single location
locationsRouter.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const location = dbService.getLocation(id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found.' });
    }
    const reports = dbService.getReports().filter(r => r.locationId === id);
    return res.json({ location, reports });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve location details.', details: err.message });
  }
});

// Create new location
locationsRouter.post('/', (req, res) => {
  try {
    const { name, address, latitude, longitude, accessibilityScore, features } = req.body;
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Name, address, latitude, and longitude are required.' });
    }

    const score = Number(accessibilityScore || 70);
    let category: 'Highly Accessible' | 'Accessible' | 'Partially Accessible' | 'Poor Accessibility';
    if (score >= 80) category = 'Highly Accessible';
    else if (score >= 60) category = 'Accessible';
    else if (score >= 40) category = 'Partially Accessible';
    else category = 'Poor Accessibility';

    const newLoc: LocationRecord = {
      id: `LOC-${Date.now().toString(36).toUpperCase()}`,
      name: name.trim(),
      address: address.trim(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      accessibilityScore: score,
      accessibilityCategory: category,
      features: {
        ramp: Boolean(features?.ramp),
        lift: Boolean(features?.lift),
        handrail: Boolean(features?.handrail),
        accessibleToilet: Boolean(features?.accessibleToilet),
        stairs: Boolean(features?.stairs)
      },
      wheelchairAccessStatus: score >= 60 ? 'FULLY_ACCESSIBLE' : score >= 40 ? 'ASSISTED_ACCESS_ONLY' : 'INACCESSIBLE',
      lastVerificationDate: new Date().toISOString(),
      reportsCount: 1
    };

    dbService.createOrUpdateLocation(newLoc);
    return res.status(201).json({ message: 'Location added successfully.', location: newLoc });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create location.', details: err.message });
  }
});
