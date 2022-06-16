import { Box, Stack } from '../system';
import SyntaxHighlighter from './SyntaxHighlighter';

interface File {
  fileName: string;
  contents: string;
}

export interface CompiledCodeProps {
  code: Array<File>;
  css: Array<File>;
}

export const CompiledCode = ({ code, css }: CompiledCodeProps) => {
  return (
    <Box
      background={{ lightMode: 'coolGray800', darkMode: 'gray900' }}
      borderRadius="large"
      padding={{
        mobile: 'large',
        tablet: 'large',
        desktop: 'xlarge',
      }}
    >
      <Stack space="xlarge">
        COMPILED
        {code.map(({ fileName, contents }) => (
          <SyntaxHighlighter key={fileName} language="tsx">
            {`// ${fileName}\n${contents}`}
          </SyntaxHighlighter>
        ))}
        {css.map(({ fileName, contents }) => (
          <SyntaxHighlighter key={fileName} language="css">
            {`/* ${fileName} */\n${contents}`}
          </SyntaxHighlighter>
        ))}
      </Stack>
    </Box>
  );
};
