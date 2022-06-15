import Text from '../Typography/Text';

// @ts-ignore
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter/dist/esm/index';

import * as styles from './Code.css';
import { Box, Stack } from '../system';

interface File {
  fileName: string;
  contents: string;
}

interface CompiledCodeProps {
  code: Array<File>;
  css: Array<File>;
}
export const CompiledCode = ({ code, css }: CompiledCodeProps) => {
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
          {code.map(({ fileName, contents }) => (
            <SyntaxHighlighter
              key={fileName}
              language="tsx"
              style={styles.theme}
            >
              {`// ${fileName}\n${contents}`}
            </SyntaxHighlighter>
          ))}

          {css.map(({ fileName, contents }) => (
            <SyntaxHighlighter
              key={fileName}
              language="css"
              style={styles.theme}
            >
              {`/* ${fileName} */\n${contents}`}
            </SyntaxHighlighter>
          ))}
        </Stack>
      </Text>
    </Box>
  );
};
