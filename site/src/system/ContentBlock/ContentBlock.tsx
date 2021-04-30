import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { Box } from '../';
import * as styles from './ContentBlock.css';

export const ContentBlock = ({
  children,
  guttersOnMobile = false,
  size = 'standard',
}: {
  children: ReactNode;
  guttersOnMobile?: boolean;
  size?: keyof typeof styles.width;
}) => {
  return (
    <Box
      className={classnames(styles.root, styles.width[size])}
      paddingX={
        guttersOnMobile
          ? { mobile: 'large', tablet: 'large', desktop: 'medium' }
          : undefined
      }
    >
      {children}
    </Box>
  );
};
