import { useState, useEffect } from 'react';
import {
  Link as ReactRouterLink,
  Route,
  RouteChildrenProps,
} from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { Title, Meta } from 'react-head';
import classnames from 'classnames';
import { useActiveHash, useHeadingRouteUpdates } from '../useHeadingRoute';
import SiblingDoc from './SiblingDoc/SiblingDoc';
import mdxComponents from '../mdx-components';
import { Fab } from '../Fab/Fab';
import { Box, ContentBlock, Stack } from '../system';
import docs from '../docs-store';
import Logo from '../Logo/Logo';
import { ColorModeToggle } from '../ColorModeToggle/ColorModeToggle';
import * as styles from './DocsPage.css';
import Link from '../Typography/Link';
import Text from '../Typography/Text';
import { mapKeys } from 'lodash';

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

const Header = () => (
  <Box
    component="header"
    display="flex"
    justifyContent="space-between"
    paddingTop="large"
    paddingX="large"
    position={{ mobile: 'relative', desktop: 'fixed' }}
    zIndex={1}
    className={styles.header}
  >
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={-1}
      background={{ lightMode: 'teal100', darkMode: 'gray900' }}
      className={styles.headerBg}
    />
    <ReactRouterLink
      to="/"
      className={styles.homeLink}
      title="Back to home"
      onClick={() => window.scrollTo(0, 0)}
    >
      <Box
        paddingLeft={{ mobile: 'none', tablet: 'xsmall', desktop: 'large' }}
        paddingTop={{ mobile: 'small', desktop: 'medium' }}
      >
        <Box paddingLeft={{ desktop: 'xsmall' }}>
          <Logo size={60} />
        </Box>
      </Box>
    </ReactRouterLink>
  </Box>
);

const MenuBackdrop = ({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) => (
  <Box
    position="fixed"
    top={0}
    bottom={0}
    left={0}
    right={0}
    zIndex={1}
    display={{ desktop: 'none' }}
    background={{ lightMode: 'teal100', darkMode: 'black' }}
    opacity={open ? undefined : 0}
    pointerEvents={open ? { desktop: 'none' } : 'none'}
    className={classnames(
      styles.backdrop,
      open ? styles.backdrop_isVisible : undefined,
    )}
    onClick={onClick}
  />
);

const PrimaryNav = ({
  open,
  pathname,
  onClick,
}: {
  open: boolean;
  pathname: string;
  onClick: () => void;
}) => {
  const selectAndScrollToTop = () => {
    window.scrollTo(0, 0);
    onClick();
  };

  return (
    <Box
      component="aside"
      padding={{ mobile: 'xlarge', desktop: 'large' }}
      position="fixed"
      background={{
        lightMode: 'white',
        darkMode: 'gray900',
      }}
      zIndex={1}
      pointerEvents={open ? undefined : { mobile: 'none', desktop: 'auto' }}
      opacity={open ? undefined : { mobile: 0, desktop: 1 }}
      className={classnames(
        styles.sidebar,
        styles.primaryNav,
        open ? styles.primaryNavOpen : undefined,
      )}
    >
      <Box display={{ desktop: 'none' }} paddingBottom="xxlarge">
        <ColorModeToggle />
      </Box>
      <Stack space="medium">
        {docs.map(({ title, route }) => {
          const active = route === `${pathname}/`;
          return (
            <Link
              key={route}
              to={route}
              onClick={selectAndScrollToTop}
              weight={active ? 'strong' : undefined}
              highlightOnFocus={false}
              underline="never"
              size="small"
            >
              <Box component="span" display="flex" alignItems="center">
                <Box
                  component="span"
                  background={{
                    lightMode: 'blue300',
                    darkMode: 'blue400',
                  }}
                  borderRadius="full"
                  paddingLeft="xsmall"
                  paddingTop="xlarge"
                  marginLeft="xsmall"
                  opacity={active ? undefined : 0}
                  className={classnames(
                    styles.activeIndicator,
                    active ? styles.active : '',
                  )}
                />
                <Box component="span" paddingLeft="large">
                  {title}
                </Box>
              </Box>
            </Link>
          );
        })}
        <Link
          to="https://github.com/seek-oss/vanilla-extract"
          onClick={selectAndScrollToTop}
          highlightOnFocus={false}
          underline="never"
          size="small"
        >
          <Box component="span" paddingLeft="large">
            <Box component="span" paddingLeft="xsmall" marginLeft="xsmall">
              Github
            </Box>
          </Box>
        </Link>
      </Stack>
    </Box>
  );
};

const headingForRoute = mapKeys(docs, (d) => {
  return d.route.endsWith('/')
    ? d.route.slice(0, d.route.lastIndexOf('/'))
    : d.route;
});

const SecondaryNav = ({
  pathname,
  onClick,
}: {
  pathname: string;
  onClick: () => void;
}) => {
  const activeHash = useActiveHash();
  const { sections, route } = headingForRoute[pathname];

  return sections.length > 2 ? (
    <Box
      component="aside"
      padding="large"
      position="fixed"
      right={0}
      display={{ mobile: 'none', desktop: 'block' }}
      className={styles.sidebar}
    >
      <Stack space="large">
        <Text size="small" weight="strong">
          Contents
        </Text>
        <Stack space="small" key="route">
          {sections
            .filter(({ level }) => level === 2)
            .map(({ hash, name }, index) => {
              const active = activeHash ? hash === activeHash : index === 0;

              return (
                <Link
                  key={name}
                  to={`${route}${hash ? `#${hash}` : ''}`}
                  color={!active ? 'secondary' : undefined}
                  highlightOnFocus={false}
                  underline="never"
                  size="small"
                  onClick={onClick}
                >
                  <Box component="span" display="flex" alignItems="center">
                    <Box
                      component="span"
                      background={{
                        lightMode: 'green300',
                        darkMode: 'green400',
                      }}
                      borderRadius="full"
                      paddingLeft="xsmall"
                      paddingTop="xlarge"
                      marginLeft="xsmall"
                      opacity={active ? undefined : 0}
                      className={classnames(
                        styles.activeIndicator,
                        active ? styles.active : '',
                      )}
                    />
                    <Box component="span" paddingLeft="large">
                      {name}
                    </Box>
                  </Box>
                </Link>
              );
            })}
        </Stack>
      </Stack>
    </Box>
  ) : null;
};

export const DocsPage = ({ location }: RouteChildrenProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);
  const normalisedPath = location.pathname.endsWith('/')
    ? location.pathname.slice(0, location.pathname.lastIndexOf('/'))
    : location.pathname;

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add(styles.bodyLock);

      return () => {
        document.body.classList.remove(styles.bodyLock);
      };
    }
  }, [menuOpen]);

  return (
    <>
      <Header />

      <MenuBackdrop open={menuOpen} onClick={closeMenu} />

      <PrimaryNav
        open={menuOpen}
        onClick={closeMenu}
        pathname={normalisedPath}
      />

      <SecondaryNav onClick={closeMenu} pathname={normalisedPath} />

      <Box zIndex={1} position="fixed" top={0} right={0} padding="large">
        <Box display={{ mobile: 'none', desktop: 'block' }}>
          <ColorModeToggle />
        </Box>
        <Box display={{ desktop: 'none' }}>
          <Fab open={menuOpen} onClick={toggleMenu} />
        </Box>
      </Box>

      <Box className={styles.container} zIndex={-1}>
        <Box
          component="main"
          paddingRight="large"
          paddingLeft={{ mobile: 'large', desktop: 'xlarge' }}
          paddingTop={{ mobile: 'xxlarge', desktop: 'xlarge' }}
          className={styles.main}
        >
          <ContentBlock>
            <Box paddingBottom="xxxlarge">
              <MDXProvider components={mdxComponents}>
                {docs.map(({ route, Component, title, sections }, index) => {
                  const prevDoc = docs[index - 1];
                  const nextDoc = docs[index + 1];
                  const pageTitle = `vanilla-extract${
                    index ? ` – ${title} ` : ''
                  }`.trim();
                  const hashes = sections
                    .filter(({ level }) => level === 2)
                    .map(({ hash }) => hash);

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
              </MDXProvider>
            </Box>
          </ContentBlock>
        </Box>
      </Box>
    </>
  );
};
