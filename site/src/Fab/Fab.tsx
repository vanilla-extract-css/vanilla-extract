import React from 'react';
import classnames from 'classnames';
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
      background={{ lightMode: 'white', darkMode: 'gray400' }}
      display={{ desktop: 'none' }}
      borderRadius="full"
      onClick={onClick}
      className={classnames(styles.fab, open ? styles.fab_isOpen : null)}
    >
      <Box
        position="absolute"
        background={{ lightMode: 'gray900', darkMode: 'gray800' }}
        className={styles.fab__bar}
      />
      <Box
        position="absolute"
        background={{ lightMode: 'gray900', darkMode: 'gray800' }}
        className={styles.fab__bar}
      />
      <Box
        position="absolute"
        background={{ lightMode: 'gray900', darkMode: 'gray800' }}
        className={styles.fab__bar}
      />
    </Box>
  );
};
