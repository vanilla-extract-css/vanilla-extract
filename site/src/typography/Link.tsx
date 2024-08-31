import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import classnames from 'classnames';
import { TextProps, useTextStyles } from './Text';
import * as styles from './Link.css';
import { sprinkles } from '../system/styles/sprinkles.css';

export interface LinkProps extends ReactRouterLinkProps {
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
export const Link = ({
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
}: LinkProps) => {
  const classNames = classnames(
    inline ? undefined : sprinkles({ display: 'block' }),
    underline === 'hover' ? styles.underlineOnHover : undefined,
    underline === 'never' ? styles.underlineNever : undefined,
    highlightOnFocus ? styles.highlightOnHover : undefined,
    useTextStyles({ size, type, color, weight, baseline }),
    className,
  );

  if (typeof to === 'string' && /^http/.test(to)) {
    return <a href={to} {...restProps} className={classNames} />;
  }

  if (typeof to === 'string' && to.indexOf('#') > -1) {
    return <HashLink to={to} {...restProps} className={classNames} />;
  }

  return (
    <ReactRouterLink
      onClick={() => window.scrollTo(0, 0)}
      to={to}
      {...restProps}
      className={classNames}
    />
  );
};
