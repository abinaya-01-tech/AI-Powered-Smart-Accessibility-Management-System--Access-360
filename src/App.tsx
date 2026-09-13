/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AccessibilitySettingsProvider } from './context/AccessibilitySettingsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { WheelchairTokenPage } from './pages/WheelchairTokenPage';
import { VerifyTokenPage } from './pages/VerifyTokenPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { UserDashboard } from './pages/UserDashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={handleNavigate} />;
      case '/map':
        return <MapPage />;
      case '/wheelchair-token':
        return <WheelchairTokenPage onNavigate={handleNavigate} />;
      case '/verify-token':
        return <VerifyTokenPage />;
      case '/analyze':
        return <AnalyzePage onNavigate={handleNavigate} />;
      case '/admin':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case '/admin/reports':
        return <AdminReportsPage onNavigate={handleNavigate} />;
      case '/admin/users':
        return <AdminUsersPage />;
      case '/dashboard':
        return <UserDashboard onNavigate={handleNavigate} />;
      case '/login':
        return <LoginPage onNavigate={handleNavigate} />;
      case '/register':
        return <RegisterPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AccessibilitySettingsProvider>
        <AppContent />
      </AccessibilitySettingsProvider>
    </AuthProvider>
  );
}

