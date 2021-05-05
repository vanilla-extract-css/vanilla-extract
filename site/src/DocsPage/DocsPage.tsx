import React, { useState, useEffect } from 'react';
import { Link as ReactRouterLink, Route } from 'react-router-dom';
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
import useReactRouter from 'use-react-router';
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
    paddingY="medium"
    paddingX="large"
    width="full"
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
      background={{ lightMode: 'green100', darkMode: 'gray700' }}
      className={styles.headerBg}
    />
    <ReactRouterLink to="/" className={styles.homeLink} title="Back to home">
      <Logo size={66} />
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
    background={{ lightMode: 'green100', darkMode: 'gray700' }}
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
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) => {
  const { location } = useReactRouter();
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
        darkMode: 'gray800',
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
        {docs.map(({ title, route }) => (
          <Link
            key={route}
            to={route}
            onClick={selectAndScrollToTop}
            highlightOnFocus={false}
            underline="hover"
            size="small"
            className={styles.sectionLinkTitle}
          >
            <Box component="span" display="flex" alignItems="center">
              <Box
                component="span"
                background="blue300"
                borderRadius="full"
                paddingLeft="xsmall"
                paddingTop="xlarge"
                marginLeft="xsmall"
                opacity={route === location.pathname ? undefined : 0}
                className={classnames(
                  styles.activeIndicator,
                  route === location.pathname ? styles.active : '',
                )}
              />
              <Box component="span" paddingLeft="large">
                {title}
              </Box>
            </Box>
          </Link>
        ))}
        <Link
          to="https://github.com/seek-oss/vanilla-extract"
          onClick={selectAndScrollToTop}
          highlightOnFocus={false}
          underline="hover"
          size="small"
          className={styles.sectionLinkTitle}
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

const headingForRoute = mapKeys(docs, (d) => d.route);

const SecondaryNav = ({ onClick }: { onClick: () => void }) => {
  const { location } = useReactRouter();
  const activeHash = useActiveHash();
  const { sections, route } = headingForRoute[location.pathname];

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
            .map(({ hash, name }) => (
              <Link
                key={name}
                to={`${route}${hash ? `#${hash}` : ''}`}
                color={hash !== activeHash ? 'secondary' : undefined}
                highlightOnFocus={false}
                size="small"
                onClick={onClick}
              >
                <Box component="span" display="flex" alignItems="center">
                  <Box
                    component="span"
                    background={{
                      lightMode: 'green200',
                      darkMode: 'green400',
                    }}
                    borderRadius="full"
                    paddingLeft="xsmall"
                    paddingTop="xlarge"
                    marginLeft="xsmall"
                    opacity={hash === activeHash ? undefined : 0}
                    className={classnames(
                      styles.activeIndicator,
                      hash === activeHash ? styles.active : '',
                    )}
                  />
                  <Box component="span" paddingLeft="large">
                    {name}
                  </Box>
                </Box>
              </Link>
            ))}
        </Stack>
      </Stack>
    </Box>
  ) : null;
};

export const DocsPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);

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

      <PrimaryNav open={menuOpen} onClick={closeMenu} />

      <SecondaryNav onClick={closeMenu} />

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
          paddingTop={{ mobile: 'xlarge', tablet: 'xlarge' }}
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
              </MDXProvider>
            </Box>
          </ContentBlock>
        </Box>
      </Box>
    </>
  );
};
