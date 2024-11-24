import { Box } from '../system';
import * as styles from './Divider.css';

export const Divider = () => {
  return (
    <Box
      component="hr"
      background={{ lightMode: 'pink400', darkMode: 'pink500' }}
      borderRadius="full"
      className={styles.root}
    />
  );
};
