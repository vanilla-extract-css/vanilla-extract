import React from 'react';
import Link from '../../Typography/Link';
import { Chevron } from '../../Chevron/Chevron';
import { Box } from '../../system';

export interface SiblingDocProps {
  title: string;
  route: string;
  direction: 'left' | 'right';
}
export default ({ title, route, direction }: SiblingDocProps) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    paddingTop="xxlarge"
    paddingBottom="xxxlarge"
  >
    <Link to={route}>
      {direction === 'left' ? <Chevron direction="left" /> : null}
      <Box display="inline-block" marginX="small">
        {title}
      </Box>
      {direction === 'right' ? <Chevron direction="right" /> : null}
    </Link>
  </Box>
);
