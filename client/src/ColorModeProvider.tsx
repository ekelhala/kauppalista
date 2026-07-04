import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Theme } from './types/Theme';

interface ColorModeContextValue {
  mode: Theme;
  toggle: () => void;
  setMode: (mode: Theme) => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'light',
  toggle: () => {},
  setMode: () => {},
});

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    return saved === 'light' || saved === 'dark' ? saved : 'light';
  });

  const setMode = (newMode: Theme) => {
    setModeState(newMode);
    localStorage.setItem('theme', newMode);
  };

  const toggle = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <ColorModeContext.Provider value={{ mode, toggle, setMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  return useContext(ColorModeContext);
}
