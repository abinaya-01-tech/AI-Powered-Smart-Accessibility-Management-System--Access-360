import { Router } from 'express';
import { dbService, UserRecord } from '../services/firebase.js';

export const authRouter = Router();

// Registration
authRouter.post('/register', (req, res) => {
  try {
    const { email, name, role = 'wheelchair_user', accessibilityNeeds } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and full name are required.' });
    }

    const existing = dbService.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const userId = `USER-${Date.now().toString(36).toUpperCase()}`;
    const newUser: UserRecord = {
      userId,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role: ['wheelchair_user', 'inspector', 'admin'].includes(role) ? role : 'wheelchair_user',
      createdAt: new Date().toISOString(),
      accessibilityNeeds: Array.isArray(accessibilityNeeds) ? accessibilityNeeds : []
    };

    dbService.createUser(newUser);
    return res.status(201).json({
      message: 'Account registered successfully.',
      user: newUser
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Registration failed.', details: err.message });
  }
});

// Login
authRouter.post('/login', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = dbService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email. Please register.' });
    }

    return res.json({
      message: 'Authentication successful.',
      user
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Login failed.', details: err.message });
  }
});

// Quick demo login switch helper
authRouter.get('/demo-users', (_req, res) => {
  const users = dbService.getAllUsers();
  return res.json({ users });
});
