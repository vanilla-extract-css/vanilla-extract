import React from 'react';
import Text from '../Typography/Text';

// @ts-ignore
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';

import * as styles from './Code.css';
import { Box, Stack } from '../system';

interface CompiledCodeProps {
  code: string;
  css: string;
}
export const CompiledCode = ({ code, css }: CompiledCodeProps) => {
  console.log(css.length, code.length);
  return (
    <Box
      className={styles.root}
      background={{ lightMode: 'coolGray800', darkMode: 'gray900' }}
      borderRadius="large"
      padding={{
        mobile: 'large',
        tablet: 'large',
        desktop: 'xlarge',
      }}
    >
      <Text size="code" component="div" color="code" baseline={false}>
        <Stack space="xlarge">
          <SyntaxHighlighter language="tsx" style={styles.theme}>
            {code}
          </SyntaxHighlighter>
          <SyntaxHighlighter language="css" style={styles.theme}>
            {css}
          </SyntaxHighlighter>
        </Stack>
      </Text>
    </Box>
  );
};
