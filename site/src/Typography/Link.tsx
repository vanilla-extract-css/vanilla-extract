import { Link, LinkProps } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import classnames from 'classnames';
import { TextProps, useTextStyles } from './Text';
import * as styles from './Link.css';

interface Props extends LinkProps {
  baseline?: boolean;
  size?: 'standard' | 'small';
  underline?: 'always' | 'hover';
  variant?: 'link' | 'button';
  color?: TextProps['color'];
  highlightOnFocus?: boolean;
}
export default ({
  to,
  baseline = false,
  size = 'standard',
  color = 'link',
  underline = 'hover',
  highlightOnFocus = true,
  className,
  ...restProps
}: Props) => {
  const classNames = classnames(
    underline === 'hover' ? styles.underlineOnHover : undefined,
    highlightOnFocus ? styles.highlightOnHover : undefined,
    useTextStyles({ size, color, baseline }),
    className,
  );

  if (typeof to === 'string' && /^http/.test(to)) {
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
