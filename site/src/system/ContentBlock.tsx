import { ReactNode } from 'react';
import { Box, type BoxProps } from './Box';
import * as styles from './ContentBlock.css';

export interface ContentBlockProps {
  children: ReactNode;
  withGutters?: boolean;
  size?: BoxProps['maxWidth'];
}

export const ContentBlock = ({
  children,
  withGutters = false,
  size = 'standard',
}: ContentBlockProps) => {
  return (
    <Box
      maxWidth={size}
      className={styles.root}
      paddingX={
        withGutters
          ? { mobile: 'large', tablet: 'xlarge', desktop: 'xxlarge' }
          : undefined
      }
    >
      {children}
    </Box>
  );
};
