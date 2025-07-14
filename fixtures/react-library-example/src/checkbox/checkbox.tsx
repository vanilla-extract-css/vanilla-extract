import { useId } from 'react';
import clsx from 'clsx';
import * as styles from './checkbox.css.js';

export default function Radio({
  children,
  className,
  id,
  ...props
}: React.ComponentProps<'input'> & { children: React.ReactNode }) {
  const randomID = useId();
  return (
    <>
      <input
        {...props}
        className={styles.input}
        id={id ?? randomID}
        type="checkbox"
      />
      <label className={clsx(styles.label, className)} htmlFor={id ?? randomID}>
        {children}
      </label>
    </>
  );
}
