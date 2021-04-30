import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { Link, NavLinkProps } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Box } from '..';
import * as styles from './ButtonLink.css';
import { atoms } from '../Box/Box';

interface ButtonLinkProps extends NavLinkProps {
  variant?: 'solid' | 'transparent';
  icon?: ReactNode;
}
export const ButtonLink = ({
  to,
  variant = 'solid',
  icon,
  children,
}: ButtonLinkProps) => {
  const classNames = classnames(
    atoms({
      display: 'flex',
      alignItems: 'center',
      paddingY: 'medium',
      paddingX: 'large',
      borderRadius: 'large',
      ...(variant === 'solid'
        ? {
            background: { lightMode: 'gray900', darkMode: 'gray50' },
            color: { lightMode: 'gray50', darkMode: 'gray900' },
          }
        : {}),
      ...(variant === 'transparent'
        ? { color: { lightMode: 'gray900', darkMode: 'gray50' } }
        : {}),
    }),
    styles.button,
    variant === 'solid' ? styles.solid : undefined,
    variant === 'transparent' ? styles.transparent : undefined,
  );
  if (typeof to === 'string' && /^http/.test(to)) {
    return (
      <a href={to} className={classNames}>
        {children}
        {icon ? (
          <Box display="inline" paddingLeft="small">
            {icon}
          </Box>
        ) : undefined}
      </a>
    );
  }

  if (typeof to === 'string' && to.indexOf('#') > -1) {
    return (
      <HashLink to={to} className={classNames}>
        {children}
        {icon ? (
          <Box display="inline" paddingLeft="small">
            {icon}
          </Box>
        ) : undefined}
      </HashLink>
    );
  }

  return (
    <Link onClick={() => window.scrollTo(0, 0)} to={to} className={classNames}>
      {children}
      {icon ? (
        <Box display="inline" paddingLeft="xsmall">
          {icon}
        </Box>
      ) : undefined}
    </Link>
  );
};
