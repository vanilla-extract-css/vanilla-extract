import { Box } from '../system';
import * as styles from './Divider.css';

export default () => {
  return (
    <Box
      component="hr"
      background={{ lightMode: 'pink400', darkMode: 'pink500' }}
      borderRadius="full"
      className={styles.root}
    />
  );
};
