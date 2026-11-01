import { useState, useEffect, type ReactNode } from 'react';
import clsx from 'clsx';
import type { MarkdownHeading } from 'astro';
import { useActiveHeading } from '../useActiveHeading';
import SiblingDoc from './SiblingDoc/SiblingDoc';
import { Fab } from '../Fab/Fab';
import { Box, ContentBlock, Stack } from '../system';
import type { DocsPageSummary } from '../docs-store';
import Logo from '../Logo/Logo';
import { ColorModeToggle } from '../ColorModeToggle/ColorModeToggle';
import * as styles from './DocsPage.css';
import { queries } from '../themeUtils';
import Link from '../Typography/Link';
import Text from '../Typography/Text';
import { SearchInput } from '../SearchInput/SearchInput';

interface DocsMainProps {
  prevDoc?: DocsPageSummary;
  nextDoc?: DocsPageSummary;
  children: ReactNode;
}

export const DocsMain = ({ prevDoc, nextDoc, children }: DocsMainProps) => (
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
          <div>
            {children}
            <ContentBlock size="large">
              {prevDoc && (
                <div style={{ float: 'left' }}>
                  <SiblingDoc
                    subtitle="Previous"
                    direction="left"
                    {...prevDoc}
                  />
                </div>
              )}
              {nextDoc && (
                <div style={{ float: 'right' }}>
                  <SiblingDoc subtitle="Next" direction="right" {...nextDoc} />
                </div>
              )}
            </ContentBlock>
          </div>
        </Box>
      </ContentBlock>
    </Box>
  </Box>
);

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
      background={{ lightMode: 'teal100', darkMode: 'zinc900' }}
      className={styles.headerBg}
    />
    <a href="/" className={styles.homeLink} title="Back to home">
      <Box
        paddingLeft={{ mobile: 'none', tablet: 'xsmall', desktop: 'large' }}
        paddingTop={{ mobile: 'xsmall', tablet: 'small', desktop: 'medium' }}
      >
        <Box paddingLeft={{ tablet: 'xsmall', desktop: 'medium' }}>
          <Logo height={68} />
        </Box>
      </Box>
    </a>
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
  route: currentRoute,
  groups,
  pages,
  onClick,
}: {
  open: boolean;
  route: string;
  groups: string[];
  pages: DocsPageSummary[];
  onClick: () => void;
}) => {
  return (
    <Box
      component="aside"
      data-primary-nav
      padding={{ mobile: 'xlarge', desktop: 'large' }}
      paddingY="xlarge"
      position="fixed"
      background={{
        lightMode: 'white',
        darkMode: 'zinc900',
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
                  const active = route === currentRoute;
                  return (
                    <Link
                      key={route}
                      to={route}
                      onClick={onClick}
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

/**
 * Always returns an element: otherwise Astro doesn't recognise it as React, and
 * tries other renderers which call it outside of React, breaking its hooks.
 */
export const SecondaryNav = ({
  route,
  headings,
}: {
  route: string;
  headings: MarkdownHeading[];
}) => {
  const [activeSlug, setActiveSlug] = useActiveHeading(headings);

  return (
    <Box
      component="aside"
      padding="large"
      position="fixed"
      right={0}
      className={[styles.sidebar, styles.showOnWideScreens]}
    >
      <Stack space="small">
        {headings.map(({ slug, text, depth }, index) => {
          const active = activeSlug ? slug === activeSlug : index === 0;
          const l2 = depth === 2;

          return (
            <Link
              key={slug}
              to={`${route}#${slug}`}
              color={!active ? 'secondary' : undefined}
              highlightOnFocus={false}
              underline="never"
              size="small"
              onClick={() => setActiveSlug(slug)}
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
                  {text}
                </Box>
              </Box>
            </Link>
          );
        })}
      </Stack>
    </Box>
  );
};

interface DocsChromeProps {
  route: string;
  groups: string[];
  pages: DocsPageSummary[];
}

export const DocsChrome = ({ route, groups, pages }: DocsChromeProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);

  // Changing the primary nav's layout between mobile and desktop would otherwise
  // trigger the transition used for opening and closing the menu
  useEffect(() => {
    const desktopQuery = window.matchMedia(queries.desktop);
    let frame: number | undefined;

    const onBreakpointChange = () => {
      const primaryNav = document.querySelector('[data-primary-nav]');
      if (!primaryNav) return;

      primaryNav.setAttribute('data-crossing-breakpoint', '');

      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          primaryNav.removeAttribute('data-crossing-breakpoint');
          frame = undefined;
        });
      });
    };

    desktopQuery.addEventListener('change', onBreakpointChange);

    return () => {
      desktopQuery.removeEventListener('change', onBreakpointChange);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, []);

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
        route={route}
        groups={groups}
        pages={pages}
      />

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
    </>
  );
};
