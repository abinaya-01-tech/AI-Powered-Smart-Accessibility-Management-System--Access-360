import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  register: (data: { email: string; name: string; role: UserRole; accessibilityNeeds?: string[] }) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'accessibility_system_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } else {
      // Default initial wheelchair user for smooth first-time testing
      const defaultUser: User = {
        userId: 'USER-WHEELCHAIR-01',
        email: 'wheelchair.user@college.edu',
        name: 'Alex Rivera',
        role: 'wheelchair_user',
        createdAt: '2026-08-15T08:00:00Z',
        tokenId: 'WAT-7X92-KL8P-QM41',
        accessibilityNeeds: ['Manual/Power Wheelchair Access', 'Zero-Step Entrance', 'Accessible Restroom']
      };
      setUser(defaultUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    try {
      const res = await api.login(email);
      setUser(res.user);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.user));
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { email: string; name: string; role: UserRole; accessibilityNeeds?: string[] }) => {
    setLoading(true);
    try {
      const res = await api.register(data);
      setUser(res.user);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.user));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const switchDemoRole = async (role: UserRole) => {
    setLoading(true);
    try {
      const { users } = await api.getDemoUsers();
      const match = users.find(u => u.role === role);
      if (match) {
        setUser(match);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(match));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
