import { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  fontSize: number;
  toggleHighContrast: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    // Carregar preferências do localStorage
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('fontSize') || '100');
    
    setHighContrast(savedHighContrast);
    setFontSize(savedFontSize);
  }, []);

  useEffect(() => {
    // Aplicar alto contraste
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    // Aplicar tamanho da fonte
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('fontSize', String(fontSize));
  }, [fontSize]);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 10, 150));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 10, 80));
  };

  const resetFontSize = () => {
    setFontSize(100);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        fontSize,
        toggleHighContrast,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
