import React, { createContext, useContext, useState, useEffect } from 'react';

type TextSize = 'normal' | 'large' | 'larger';

interface AccessibilitySettingsContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  cycleTextSize: () => void;
}

const AccessibilitySettingsContext = createContext<AccessibilitySettingsContextType | undefined>(undefined);

export const AccessibilitySettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<TextSize>('normal');

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('contrast-more');
    } else {
      root.classList.remove('contrast-more');
    }
  }, [highContrast]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);

  const cycleTextSize = () => {
    setTextSize(curr => {
      if (curr === 'normal') return 'large';
      if (curr === 'large') return 'larger';
      return 'normal';
    });
  };

  return (
    <AccessibilitySettingsContext.Provider
      value={{ highContrast, toggleHighContrast, textSize, setTextSize, cycleTextSize }}
    >
      <div
        className={`${highContrast ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} ${
          textSize === 'large' ? 'text-[17px]' : textSize === 'larger' ? 'text-[19px]' : 'text-[16px]'
        } min-h-screen transition-colors duration-150`}
      >
        {children}
      </div>
    </AccessibilitySettingsContext.Provider>
  );
};

export function useAccessibilitySettings() {
  const context = useContext(AccessibilitySettingsContext);
  if (!context) {
    throw new Error('useAccessibilitySettings must be used within AccessibilitySettingsProvider');
  }
  return context;
}
