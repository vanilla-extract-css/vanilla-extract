import React, { useState } from 'react';
import { Link as ReactRouterLink, Route } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { Title, Meta } from 'react-head';
import classnames from 'classnames';
import { useHeadingRouteUpdates } from '../useHeadingRoute';
import Navigation from '../Navigation/Navigation';
import SiblingDoc from './SiblingDoc/SiblingDoc';
import mdxComponents from '../mdx-components';
import { Fab } from '../Fab/Fab';
import { Box, ContentBlock } from '../system';
import docs from '../docs-store';
import Logo from '../Logo/Logo';
import { ColorModeToggle } from '../ColorModeToggle/ColorModeToggle';
import * as styles from './DocsPage.css';

interface DocsRouteProps {
  component: (props: any) => JSX.Element;
  prevDoc?: {
    title: string;
    route: string;
  };
  nextDoc?: {
    title: string;
    route: string;
  };
  hashes: Array<string>;
}

const DocsRoute = ({
  component: Component,
  prevDoc,
  nextDoc,
  hashes,
}: DocsRouteProps) => {
  useHeadingRouteUpdates(hashes);

  return (
    <div>
      <Component />
      {prevDoc && (
        <div style={{ float: 'left' }}>
          <SiblingDoc direction="left" {...prevDoc} />
        </div>
      )}
      {nextDoc && (
        <div style={{ float: 'right' }}>
          <SiblingDoc direction="right" {...nextDoc} />
        </div>
      )}
    </div>
  );
};

export const DocsPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);

  return (
    <MDXProvider components={mdxComponents}>
      <Box
        component="header"
        display="flex"
        justifyContent="space-between"
        paddingY="medium"
        paddingX="large"
        width="full"
        position={{ desktop: 'fixed' }}
        background={{ lightMode: 'green100', darkMode: 'gray700' }}
        zIndex={1}
        className={styles.header}
      >
        <ReactRouterLink
          to="/"
          className={styles.homeLink}
          title="Back to home"
        >
          <Logo size={70} />
        </ReactRouterLink>
      </Box>

      <Box position="absolute" top={0} right={0} padding="large">
        <Box display={{ mobile: 'none', desktop: 'block' }}>
          <ColorModeToggle />
        </Box>
        <Box display={{ desktop: 'none' }}>
          <Fab open={menuOpen} onClick={toggleMenu} />
        </Box>
      </Box>

      <Box
        position="fixed"
        top={0}
        bottom={0}
        left={0}
        right={0}
        zIndex={1}
        display={{ desktop: 'none' }}
        background={{ lightMode: 'green100', darkMode: 'gray700' }}
        opacity={menuOpen ? undefined : 0}
        pointerEvents={menuOpen ? { desktop: 'none' } : 'none'}
        className={classnames(
          styles.backdrop,
          menuOpen ? styles.backdrop_isVisible : undefined,
        )}
        onClick={toggleMenu}
      />

      <Box
        component="aside"
        paddingTop={{ mobile: 'xlarge', tablet: 'xlarge' }}
        paddingX={{ mobile: 'xlarge', tablet: 'xlarge', desktop: 'large' }}
        background={{ lightMode: 'white', darkMode: 'gray900' }}
        position="fixed"
        top={0}
        bottom={0}
        zIndex={menuOpen ? 1 : undefined}
        pointerEvents={
          menuOpen ? undefined : { mobile: 'none', desktop: 'auto' }
        }
        opacity={menuOpen ? undefined : { mobile: 0, desktop: 1 }}
        className={classnames(
          styles.sidebar,
          menuOpen ? styles.sidebarOpen : undefined,
        )}
      >
        <Box
          style={{ overflow: 'auto', height: '100%' }}
          paddingBottom="xxxlarge"
        >
          <Navigation onSelect={closeMenu} />
        </Box>
      </Box>
      <Box
        paddingTop={{ mobile: 'medium', tablet: 'medium' }}
        className={styles.container}
      >
        <Box
          component="main"
          paddingRight="large"
          paddingLeft={{ mobile: 'large', desktop: 'xlarge' }}
          paddingTop={{ mobile: 'xlarge', tablet: 'xlarge' }}
          className={styles.main}
        >
          <ContentBlock>
            <Box paddingBottom="xxxlarge">
              {docs.map(({ route, Component, title, sections }, index) => {
                const prevDoc = docs[index - 1];
                const nextDoc = docs[index + 1];
                const pageTitle = `vanilla-extract${
                  index ? ` – ${title} ` : ''
                }`.trim();
                const hashes = sections.map(({ hash }) => hash);

                return (
                  <Route
                    key={route}
                    path={route}
                    exact
                    render={() => (
                      <>
                        <Title>{pageTitle}</Title>
                        <Meta property="og:title" content={pageTitle} />
                        <Meta name="twitter:title" content={pageTitle} />
                        <DocsRoute
                          nextDoc={nextDoc}
                          prevDoc={prevDoc}
                          hashes={hashes}
                          component={Component}
                        />
                      </>
                    )}
                  />
                );
              })}
            </Box>
          </ContentBlock>
        </Box>
      </Box>
    </MDXProvider>
  );
};
