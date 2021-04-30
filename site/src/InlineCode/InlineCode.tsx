import React, { ReactNode } from 'react';
import { Box } from '../system';
import * as styles from './InlineCode.css';

export interface InlineCodeProps {
  children: ReactNode;
  inline?: boolean;
}
export default ({ children, inline = true }: InlineCodeProps) => {
  return (
    <Box
      component="code"
      color={inline ? { lightMode: 'pink700', darkMode: 'gray200' } : undefined}
      background={
        inline ? { lightMode: 'pink100', darkMode: 'gray700' } : undefined
      }
      className={styles.code}
    >
      {children}
    </Box>
  );
};
