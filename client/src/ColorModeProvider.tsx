import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Theme } from './types/Theme';
import { useMantineColorScheme } from '@mantine/core';

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

  const { setColorScheme } = useMantineColorScheme();

  const setMode = (newMode: Theme) => {
    setModeState(newMode);
    localStorage.setItem('theme', newMode);
  };

  const toggle = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    setColorScheme(mode === 'dark' ? 'dark' : 'light');
  }, [mode, setColorScheme]);

  return (
    <ColorModeContext.Provider value={{ mode, toggle, setMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  return useContext(ColorModeContext);
}
