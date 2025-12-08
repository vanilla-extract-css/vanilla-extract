import { useState, useEffect } from 'react';
import {
  Link as ReactRouterLink,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { Title, Meta } from 'react-head';
import clsx from 'clsx';
import { useActiveHash, useHeadingRouteUpdates } from '../useHeadingRoute';
import SiblingDoc from './SiblingDoc/SiblingDoc';
import mdxComponents from '../mdx-components';
import { Fab } from '../Fab/Fab';
import { Box, ContentBlock, Stack } from '../system';
import { groups, pages } from '../docs-store';
import Logo from '../Logo/Logo';
import { ColorModeToggle } from '../ColorModeToggle/ColorModeToggle';
import * as styles from './DocsPage.css';
import Link from '../Typography/Link';
import Text from '../Typography/Text';

import mapKeys from 'lodash/mapKeys';
import { SearchInput } from '../SearchInput/SearchInput';

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
      <ContentBlock size="large">
        {prevDoc && (
          <div style={{ float: 'left' }}>
            <SiblingDoc subtitle="Previous" direction="left" {...prevDoc} />
          </div>
        )}
        {nextDoc && (
          <div style={{ float: 'right' }}>
            <SiblingDoc subtitle="Next" direction="right" {...nextDoc} />
          </div>
        )}
      </ContentBlock>
    </div>
  );
};

const Header = () => (
  <Box
    component="header"
    display="flex"
    justifyContent="space-between"
    paddingTop="large"
    paddingX={{ mobile: 'large', desktop: 'none' }}
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
        paddingTop={{ mobile: 'xsmall', tablet: 'small', desktop: 'medium' }}
      >
        <Box paddingLeft={{ tablet: 'xsmall', desktop: 'medium' }}>
          <Logo height={68} />
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
    className={clsx(
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
      paddingY="xlarge"
      position="fixed"
      background={{
        lightMode: 'white',
        darkMode: 'gray900',
      }}
      zIndex={1}
      pointerEvents={open ? undefined : { mobile: 'none', desktop: 'auto' }}
      opacity={open ? undefined : { mobile: 0, desktop: 1 }}
      className={clsx(
        styles.sidebar,
        styles.primaryNav,
        open ? styles.primaryNavOpen : undefined,
      )}
    >
      <Box display={{ desktop: 'none' }} paddingBottom="xxlarge">
        <ColorModeToggle />
      </Box>
      <Stack space="xlarge">
        {groups.map((label) => {
          const groupPages = pages.filter((page) => label === page.label);

          return (
            <Stack key={label} space="medium">
              <Box paddingLeft="small">
                <Text size="xsmall" weight="strong">
                  <span style={{ textTransform: 'uppercase', opacity: 0.7 }}>
                    {label}
                  </span>
                </Text>
              </Box>

              <>
                {groupPages.map(({ route, title }) => {
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
                      <Box
                        component="span"
                        display="flex"
                        alignItems="center"
                        paddingY="xsmall"
                      >
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
                          className={clsx(
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
              </>
            </Stack>
          );
        })}
        <Stack space="medium">
          <Box paddingLeft="small">
            <Text size="xsmall" weight="strong">
              <span style={{ textTransform: 'uppercase', opacity: 0.7 }}>
                Community
              </span>
            </Text>
          </Box>
          <>
            <Link
              to="https://github.com/vanilla-extract-css/vanilla-extract"
              highlightOnFocus={false}
              underline="never"
              size="small"
            >
              <Box
                component="span"
                display="flex"
                alignItems="center"
                paddingY="xsmall"
                paddingLeft="large"
              >
                <Box
                  component="span"
                  display="block"
                  paddingLeft="xsmall"
                  marginLeft="xsmall"
                >
                  GitHub
                </Box>
              </Box>
            </Link>

            <Link
              to="https://github.com/vanilla-extract-css/vanilla-extract/discussions"
              highlightOnFocus={false}
              underline="never"
              size="small"
            >
              <Box
                component="span"
                display="flex"
                alignItems="center"
                paddingY="xsmall"
                paddingLeft="large"
              >
                <Box
                  component="span"
                  display="block"
                  paddingLeft="xsmall"
                  marginLeft="xsmall"
                >
                  Discussions
                </Box>
              </Box>
            </Link>

            <Link
              to="https://discord.gg/6nCfPwwz6w"
              highlightOnFocus={false}
              underline="never"
              size="small"
            >
              <Box
                component="span"
                display="flex"
                alignItems="center"
                paddingY="xsmall"
                paddingLeft="large"
              >
                <Box
                  component="span"
                  display="block"
                  paddingLeft="xsmall"
                  marginLeft="xsmall"
                >
                  Discord
                </Box>
              </Box>
            </Link>
          </>
        </Stack>
      </Stack>
    </Box>
  );
};

const headingForRoute = mapKeys(pages, (d) => {
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
      className={[styles.sidebar, styles.showOnWideScreens]}
    >
      <Stack space="small">
        {sections
          .filter(({ level }) => level === 2 || level === 3)
          .map(({ hash, name, level }, index) => {
            const active = activeHash ? hash === activeHash : index === 0;
            const l2 = level === 2;

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
                      lightMode: l2 ? 'pink300' : 'blue300',
                      darkMode: l2 ? 'pink400' : 'blue400',
                    }}
                    borderRadius="full"
                    paddingLeft="xsmall"
                    paddingTop={l2 ? 'xlarge' : 'large'}
                    marginLeft={l2 ? 'xsmall' : 'xlarge'}
                    opacity={active ? undefined : 0}
                    className={clsx(
                      styles.activeIndicator,
                      !l2 ? styles.activeIndicatorRight : '',
                      active ? styles.active : '',
                    )}
                  />
                  <Box component="span" paddingLeft={l2 ? 'large' : 'medium'}>
                    {name}
                  </Box>
                </Box>
              </Link>
            );
          })}
      </Stack>
    </Box>
  ) : null;
};

export const DocsPage = () => {
  const location = useLocation();
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
        <Box display={{ mobile: 'none', desktop: 'flex' }} alignItems="center">
          <Box paddingRight="medium">
            <SearchInput />
          </Box>
          <ColorModeToggle />
        </Box>
        <Box
          display={{ mobile: 'flex', desktop: 'none' }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display={menuOpen ? 'none' : undefined} paddingRight="medium">
            <SearchInput />
          </Box>
          <Fab open={menuOpen} onClick={toggleMenu} />
        </Box>
      </Box>

      <Box className={styles.container} zIndex={-1}>
        <Box
          component="main"
          paddingRight="large"
          paddingLeft={{ mobile: 'large', desktop: 'xxlarge' }}
          paddingTop={{ mobile: 'xxlarge', desktop: 'xlarge' }}
          className={styles.main}
        >
          <ContentBlock
            size={{ mobile: 'standard', tablet: 'xlarge', desktop: 'xxlarge' }}
          >
            <Box paddingBottom="xxxlarge">
              <MDXProvider components={mdxComponents}>
                <Routes>
                  {pages.map(({ route, Component, title, sections }, index) => {
                    const prevDoc = pages[index - 1];
                    const nextDoc = pages[index + 1];
                    const pageTitle = `${
                      title ? `${title} — ` : ''
                    }vanilla-extract`.trim();
                    const hashes = sections
                      .filter(({ level }) => level === 2 || level === 3)
                      .map(({ hash }) => hash);

                    return (
                      <Route
                        key={route}
                        path={route}
                        element={
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
                        }
                      />
                    );
                  })}
                </Routes>
              </MDXProvider>
            </Box>
          </ContentBlock>
        </Box>
      </Box>
    </>
  );
};
