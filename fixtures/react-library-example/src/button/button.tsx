import clsx from 'clsx';
import * as styles from './button.css.js';

export default function Button({
  className,
  children,
  type = 'button',
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button {...props} type={type} className={clsx(styles.btn, className)}>
      {children}
    </button>
  );
}
