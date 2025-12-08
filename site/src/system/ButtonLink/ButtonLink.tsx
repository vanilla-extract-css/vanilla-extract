import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Link, type NavLinkProps } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Box } from '..';
import * as styles from './ButtonLink.css';
import { sprinkles } from '../styles/sprinkles.css';

interface ButtonLinkProps extends NavLinkProps {
  variant?: 'solid' | 'transparent';
  icon?: ReactNode;
  children: ReactNode;
}
export const ButtonLink = ({
  to,
  variant = 'solid',
  icon,
  children,
}: ButtonLinkProps) => {
  const classNames = clsx(
    sprinkles({
      display: 'flex',
      alignItems: 'center',
      paddingY: {
        mobile: 'medium',
        tablet: 'large',
      },
      paddingX: {
        mobile: 'large',
        tablet: 'xlarge',
      },
      borderRadius: 'large',
      ...(variant === 'solid'
        ? {
            background: { lightMode: 'coolGray900', darkMode: 'gray100' },
            color: { lightMode: 'coolGray50', darkMode: 'gray900' },
          }
        : {}),
      ...(variant === 'transparent'
        ? { color: { lightMode: 'coolGray900', darkMode: 'gray100' } }
        : {}),
    }),
    styles.button,
    variant === 'solid' ? styles.solid : undefined,
    variant === 'transparent' ? styles.transparent : undefined,
  );
  if (typeof to === 'string' && to.startsWith('http')) {
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
