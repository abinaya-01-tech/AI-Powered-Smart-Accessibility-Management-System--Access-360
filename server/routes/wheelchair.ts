import { Router } from 'express';
import { dbService } from '../services/firebase.js';
import { generateSecureWheelchairToken, verifyWheelchairToken, revokeWheelchairToken } from '../services/tokenService.js';

export const wheelchairRouter = Router();

// Generate a unique cryptographically secure token for wheelchair user
wheelchairRouter.post('/token', (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required to generate a Wheelchair Access Token.' });
    }

    const user = dbService.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found in system.' });
    }

    const tokenRecord = generateSecureWheelchairToken(userId);
    return res.status(201).json({
      message: 'Wheelchair Access Token generated successfully.',
      token: tokenRecord
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Token generation failed.', details: err.message });
  }
});

// Retrieve active token for user
wheelchairRouter.get('/token/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const token = dbService.getTokenByUserId(userId);
    if (!token) {
      return res.status(404).json({ error: 'No active token found for user.' });
    }
    return res.json({ token });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve token.', details: err.message });
  }
});

// Revoke a token
wheelchairRouter.post('/token/revoke', (req, res) => {
  try {
    const { tokenId } = req.body;
    if (!tokenId) {
      return res.status(400).json({ error: 'Token ID is required.' });
    }
    const success = revokeWheelchairToken(tokenId);
    if (!success) {
      return res.status(404).json({ error: 'Token not found.' });
    }
    return res.json({ message: 'Token successfully revoked.', status: 'REVOKED' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Revocation failed.', details: err.message });
  }
});

// Verify token (used by facilities, scanners, or users)
// Anonymous response — no personal info leaked!
wheelchairRouter.post('/verify', (req, res) => {
  try {
    const { token, facilityId, location, accessType } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Accessibility token string is required.' });
    }

    const result = verifyWheelchairToken(
      token,
      facilityId || 'FACILITY-MAIN',
      location || 'Accessible Facility Portal',
      accessType || 'Accessibility Infrastructure Verification',
      true
    );

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: 'Token verification service encountered an issue.', details: err.message });
  }
});

// Manual access request log
wheelchairRouter.post('/access', (req, res) => {
  try {
    const { tokenId, facilityId, location, accessType } = req.body;
    if (!tokenId || !facilityId || !location) {
      return res.status(400).json({ error: 'Missing required parameters for access logging.' });
    }

    const verification = verifyWheelchairToken(tokenId, facilityId, location, accessType || 'Accessible Entryway', true);
    if (!verification.accessAuthorized) {
      return res.status(403).json({
        authorized: false,
        message: verification.message,
        verification
      });
    }

    return res.json({
      authorized: true,
      message: 'Access event logged and authorized.',
      log: verification.accessLog
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to record access event.', details: err.message });
  }
});

// Retrieve access history
wheelchairRouter.get('/history', (req, res) => {
  try {
    const { tokenId } = req.query;
    const logs = dbService.getAccessLogs(typeof tokenId === 'string' ? tokenId : undefined);
    return res.json({ logs });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch access logs.', details: err.message });
  }
});
