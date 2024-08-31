import { ReactNode } from 'react';
import { Box } from '../system';
import * as styles from './Blockquote.css';

export interface BlockquoteProps {
  children: ReactNode;
}

export const Blockquote = (props: BlockquoteProps) => {
  return (
    <Box
      paddingX={{ mobile: 'large', tablet: 'xlarge' }}
      paddingY="xxlarge"
      position="relative"
      className={styles.root}
    >
      {props.children}
    </Box>
  );
};
