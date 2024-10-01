import { ReactNode } from 'react';
import { Box } from '../system';
import * as styles from './InlineCode.css';

export interface InlineCodeProps {
  children: ReactNode;
  inline?: boolean;
}
export const InlineCode = ({ children }: InlineCodeProps) => {
  return (
    <Box
      component="code"
      color={{ lightMode: 'pink700', darkMode: 'gray200' }}
      display="inline-block"
      position="relative"
      paddingX="small"
      marginX="xsmall"
      marginY="-medium"
      className={styles.code}
    >
      {children}
    </Box>
  );
};
