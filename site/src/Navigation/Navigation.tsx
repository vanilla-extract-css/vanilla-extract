import React, { MouseEvent, ReactNode } from 'react';
import classnames from 'classnames';
import { Box, Stack } from '../system';
import docs from '../docs-store';
import Link from '../Typography/Link';
import { useTextStyles } from '../Typography/Text';
import { useActiveHash } from '../useHeadingRoute';
import * as styles from './Navigation.css';

const NavSection = ({
  href,
  title,
  children,
  onClick,
}: {
  href: string;
  title: string;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) => (
  <>
    <Link
      to={href}
      exact
      onClick={onClick}
      highlightOnFocus={false}
      underline="hover"
      className={classnames(
        styles.sectionLinkTitle,
        useTextStyles({ size: 'standard', baseline: false }),
      )}
    >
      <Box component="span" display="block" paddingY="xsmall">
        {title}
      </Box>
    </Link>
    {children}
  </>
);

const SubLink = ({
  children,
  to,
  hash,
  active,
  onClick,
}: {
  children: ReactNode;
  to: string;
  hash?: string;
  active?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) => {
  return (
    <Link
      size="small"
      to={`${to}${hash ? `#${hash}` : ''}`}
      onClick={onClick}
      highlightOnFocus={false}
      style={
        active
          ? {
              fontWeight: 'bold',
            }
          : undefined
      }
    >
      <Box
        position="relative"
        paddingLeft="xlarge"
        paddingY="xsmall"
        key={hash}
      >
        <Box
          position="absolute"
          background={{ lightMode: 'green100', darkMode: 'gray700' }}
          top={0}
          bottom={0}
          left={0}
          right={0}
          zIndex={-1}
          opacity={active ? undefined : 0}
          className={classnames(
            styles.activeIndicator,
            active ? styles.active : '',
          )}
        />
        {children}
      </Box>
    </Link>
  );
};

export default ({ onSelect }: { onSelect: () => void }) => {
  const activeHash = useActiveHash();

  const selectAndScrollToTop = () => {
    window.scrollTo(0, 0);
    onSelect();
  };

  return (
    <Stack space="xlarge">
      {docs.map(({ title, route, sections }) => (
        <NavSection
          key={route}
          title={title}
          href={route}
          onClick={selectAndScrollToTop}
        >
          {sections
            .filter(({ level }) => level === 2)
            .map(({ hash, name }) => (
              <SubLink
                key={name}
                to={route}
                hash={hash}
                active={hash === activeHash}
                onClick={onSelect}
              >
                {name}
              </SubLink>
            ))}
        </NavSection>
      ))}
      <NavSection
        title="Community"
        href="https://github.com/seek-oss/vanilla-extract"
      >
        <SubLink to="https://github.com/seek-oss/vanilla-extract">
          GitHub
        </SubLink>
        <SubLink to="https://github.com/seek-oss/vanilla-extract/discussions">
          Discussions
        </SubLink>
      </NavSection>
    </Stack>
  );
};
