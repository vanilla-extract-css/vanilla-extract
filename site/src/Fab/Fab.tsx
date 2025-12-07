import clsx from 'clsx';
import { Box } from '../system';
import * as styles from './Fab.css';

export const Fab = ({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) => {
  return (
    <Box
      component="button"
      position="relative"
      background={{ lightMode: 'white', darkMode: 'gray300' }}
      borderRadius="full"
      zIndex={0}
      cursor="pointer"
      onClick={onClick}
      className={clsx(styles.fab, open ? styles.isOpen : null)}
    >
      <Box
        position="absolute"
        background={{ lightMode: 'coolGray900', darkMode: 'gray800' }}
        className={styles.bar}
      />
      <Box
        position="absolute"
        background={{ lightMode: 'coolGray900', darkMode: 'gray800' }}
        className={styles.bar}
      />
      <Box
        position="absolute"
        background={{ lightMode: 'coolGray900', darkMode: 'gray800' }}
        className={styles.bar}
      />
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
        zIndex={-1}
        borderRadius="full"
        opacity={open ? 0 : undefined}
        className={styles.shadow}
      />
    </Box>
  );
};
