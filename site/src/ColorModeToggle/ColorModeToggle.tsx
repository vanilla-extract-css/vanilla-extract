import { Box } from '../system';
import { darkMode, lightMode, themeKey } from '../system/styles/colorModes';
import * as styles from './ColorModeToggle.css';

type ColorMode = typeof darkMode | typeof lightMode;

const setColorMode = (colorMode: ColorMode) => {
  document.documentElement.classList.remove(lightMode, darkMode);
  document.documentElement.classList.add(colorMode);

  try {
    localStorage.setItem(themeKey, colorMode);
  } catch {}
};

export const ColorModeToggle = () => (
  <Box
    component="button"
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="full"
    cursor="pointer"
    className={styles.root}
    title="Toggle color mode"
    onClick={() =>
      setColorMode(
        document.documentElement.classList.contains(darkMode)
          ? lightMode
          : darkMode,
      )
    }
  />
);
