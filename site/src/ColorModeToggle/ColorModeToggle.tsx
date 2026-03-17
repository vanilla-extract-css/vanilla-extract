import {
  useEffect,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import { Box } from '../system';
import * as styles from './ColorModeToggle.css';

type ColorMode = 'dark' | 'light';
export const themeKey = 'vanilla-theme-pref';

interface ColorModeContextValues {
  colorMode: ColorMode | null;
  setColorMode: (colorMode: ColorMode) => void;
}

export const ColorModeContext = createContext<ColorModeContextValues>({
  colorMode: null,
  setColorMode: () => {},
});

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode | null>(null);

  useEffect(() => {
    setColorMode(
      document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    );
  }, []);

  const setter = (c: ColorMode) => {
    setColorMode(c);

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(c);

    try {
      localStorage.setItem(themeKey, c);
    } catch {}
  };

  return (
    <ColorModeContext.Provider
      value={{
        colorMode,
        setColorMode: setter,
      }}
    >
      {children}
    </ColorModeContext.Provider>
  );
}

export const ColorModeToggle = () => {
  const { colorMode, setColorMode } = useContext(ColorModeContext);

  return (
    <Box
      component="button"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      cursor="pointer"
      className={styles.root}
      title="Toggle color mode"
      onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
    />
  );
};
