import React, { useEffect, useState } from 'react';
import { Box } from '../system';
import { lightMode, darkMode } from '../system/styles/atoms.css';

export default () => {
  const [theme, setTheme] = useState(darkMode);

  useEffect(() => {
    document.body.classList.add(theme);

    return () => {
      document.body.classList.remove(theme);
    };
  }, [theme]);

  return (
    <Box
      component="button"
      position="fixed"
      padding="small"
      style={{
        zIndex: 100,
        top: 100,
        right: 100,
        border: 0,
        background: 'none',
        cursor: 'pointer',
        fontSize: 28,
        filter: `contrast(0) brightness(${theme === lightMode ? '0' : '10'})`,
        outline: 'none',
      }}
      onClick={() => setTheme(theme === lightMode ? darkMode : lightMode)}
    >
      {theme === lightMode ? `☀️` : `🌙`}
    </Box>
  );
};
