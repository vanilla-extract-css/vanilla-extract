import type { ReactNode } from 'react';
import { Box } from '../system';
import * as styles from './Blockquote.css';

export default (props: { children: ReactNode }) => {
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
