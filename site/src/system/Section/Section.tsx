import React, { ReactNode } from 'react';
import { Box } from '../';
import * as styles from './Section.css';

export const Section = ({ children }: { children: ReactNode }) => {
  const gutter = {
    mobile: 'large',
    tablet: 'large',
    desktop: 'xlarge',
  } as const;

  return (
    <Box className={styles.root} paddingLeft={gutter} paddingRight={gutter}>
      {children}
    </Box>
  );
};
