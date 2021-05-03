import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { Box } from '../';
import * as styles from './ContentBlock.css';

export const ContentBlock = ({
  children,
  withGutters = false,
  size = 'standard',
}: {
  children: ReactNode;
  withGutters?: boolean;
  size?: keyof typeof styles.width;
}) => {
  return (
    <Box
      className={classnames(styles.root, styles.width[size])}
      paddingX={
        withGutters
          ? { mobile: 'large', tablet: 'large', desktop: 'xlarge' }
          : undefined
      }
    >
      {children}
    </Box>
  );
};
