import type { ReactNode } from 'react';
import clsx from 'clsx';
import * as styles from './ButtonLink.css';
import { sprinkles } from '../styles/sprinkles.css';

interface ButtonLinkProps {
  to: string;
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
            background: { lightMode: 'gray900', darkMode: 'zinc100' },
            color: { lightMode: 'gray50', darkMode: 'zinc900' },
          }
        : {}),
      ...(variant === 'transparent'
        ? { color: { lightMode: 'gray900', darkMode: 'zinc100' } }
        : {}),
    }),
    styles.button,
    variant === 'solid' ? styles.solid : undefined,
    variant === 'transparent' ? styles.transparent : undefined,
  );
  return (
    <a href={to} className={classNames}>
      {children}
      {icon}
    </a>
  );
};
