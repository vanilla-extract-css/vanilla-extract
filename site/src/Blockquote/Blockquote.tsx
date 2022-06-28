import { ReactNode } from 'react';
import { Box } from '../system';
import * as styles from './Blockquote.css';

export default (props: { children: ReactNode }) => {
  return (
    <Box
      paddingX={{ mobile: 'large', tablet: 'xlarge' }}
      paddingY="xlarge"
      borderRadius="medium"
      background={{ lightMode: 'blue100', darkMode: 'blueGray900' }}
      className={styles.root}
    >
      {props.children}
    </Box>
  );
};
