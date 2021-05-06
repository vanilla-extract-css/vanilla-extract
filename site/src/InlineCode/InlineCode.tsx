import { ReactNode } from 'react';
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
        inline ? { lightMode: 'pink100', darkMode: 'gray800' } : undefined
      }
      borderRadius="small"
      padding="small"
      marginX="xsmall"
      marginY="-small"
      className={styles.code}
    >
      {children}
    </Box>
  );
};
