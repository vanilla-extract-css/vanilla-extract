import { ReactNode } from 'react';
import { Box } from '../system';
import * as styles from './Blockquote.css';

export default (props: { children: ReactNode }) => {
  return (
    <Box
      component="blockquote"
      paddingX={{ mobile: 'large', tablet: 'xlarge' }}
      paddingTop="xlarge"
      marginBottom="xlarge"
      borderRadius="small"
      background={{ lightMode: 'blue100', darkMode: 'gray800' }}
      className={styles.root}
    >
      {props.children}
    </Box>
  );
};
