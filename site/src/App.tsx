import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { Title, Meta } from 'react-head';
import { HomePage } from './HomePage/HomePage';
import { DocsPage } from './DocsPage/DocsPage';
import './App.css';
import { Box } from './system';
import { lightMode, darkMode } from './system/styles/atoms.css';

const pageTitle = 'vanilla-extract — Zero-runtime Stylesheets-in-TypeScript.';
const description = 'Zero-runtime Stylesheets-in-TypeScript.';

export default () => {
  const [theme, setTheme] = useState(darkMode);

  useEffect(() => {
    document.body.classList.add(theme);

    return () => {
      document.body.classList.remove(theme);
    };
  }, [theme]);

  return (
    <>
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
        {theme === lightMode ? `🌙` : `☀️`}
      </Box>
      <Title>{pageTitle}</Title>
      <Meta property="og:title" content={pageTitle} />
      <Meta name="twitter:title" content={pageTitle} />
      <Meta name="description" content={description} />
      <Meta property="og:description" content={description} />
      <Meta name="twitter:description" content={description} />
      <Route path="/" exact component={HomePage} />
      <Route path="/documentation" component={DocsPage} />
    </>
  );
};
