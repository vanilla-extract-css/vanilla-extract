import { Link, type LinkProps } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import clsx from 'clsx';
import { type TextProps, useTextStyles } from './Text';
import * as styles from './Link.css';
import { sprinkles } from '../system/styles/sprinkles.css';

interface Props extends LinkProps {
  baseline?: boolean;
  size?: 'standard' | 'small' | 'xsmall';
  underline?: 'always' | 'hover' | 'never';
  variant?: 'link' | 'button';
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
}: Props) => {
  const classNames = clsx(
    inline ? undefined : sprinkles({ display: 'block' }),
    underline === 'hover' ? styles.underlineOnHover : undefined,
    underline === 'never' ? styles.underlineNever : undefined,
    highlightOnFocus ? styles.highlightOnHover : undefined,
    useTextStyles({ size, type, color, weight, baseline }),
    className,
  );

  if (typeof to === 'string' && to.startsWith('http')) {
    return <a href={to} {...restProps} className={classNames} />;
  }

  if (typeof to === 'string' && to.indexOf('#') > -1) {
    return <HashLink to={to} {...restProps} className={classNames} />;
  }

  return (
    <Link
      onClick={() => window.scrollTo(0, 0)}
      to={to}
      {...restProps}
      className={classNames}
    />
  );
};
