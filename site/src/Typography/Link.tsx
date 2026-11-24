import type { AnchorHTMLAttributes } from 'react';
import clsx from 'clsx';
import { type TextProps, useTextStyles } from './Text';
import * as styles from './Link.css';
import { sprinkles } from '../system/styles/sprinkles.css';

interface Props extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'color' | 'type'
> {
  to: string;
  baseline?: boolean;
  size?: 'standard' | 'small' | 'xsmall';
  underline?: 'always' | 'hover' | 'never';
  weight?: TextProps['weight'];
  color?: TextProps['color'];
  type?: TextProps['type'];
  inline?: boolean;
  highlightOnFocus?: boolean;
}
export default ({
  to,
  baseline = false,
  size = 'standard',
  color = 'link',
  weight = 'regular',
  underline = 'hover',
  type = 'body',
  highlightOnFocus = true,
  inline = false,
  className,
  ...restProps
}: Props) => (
  <a
    href={to}
    {...restProps}
    className={clsx(
      inline ? undefined : sprinkles({ display: 'block' }),
      underline === 'hover' ? styles.underlineOnHover : undefined,
      underline === 'never' ? styles.underlineNever : undefined,
      highlightOnFocus ? styles.highlightOnHover : undefined,
      useTextStyles({ size, type, color, weight, baseline }),
      className,
    )}
  />
);
