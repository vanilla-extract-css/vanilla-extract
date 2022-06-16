import { useState } from 'react';
import { Chevron } from '../Chevron/Chevron';
import { Box, Stack } from '../system';
import { vars } from '../themes.css';
import Text from '../Typography/Text';
import SyntaxHighlighter from './SyntaxHighlighter';

interface File {
  fileName: string;
  contents: string;
}

export interface CompiledCodeProps {
  code: Array<File>;
  css: Record<string, string>;
}

export const CompiledCode = ({ code, css }: CompiledCodeProps) => {
  const [activeFileName, setActiveFileName] = useState(code[0].fileName);
  const [showCss, setShowCss] = useState(false);

  return (
    <Box
      background={{ lightMode: 'coolGray800', darkMode: 'gray900' }}
      borderRadius="large"
      paddingTop={{
        mobile: 'small',
        tablet: 'small',
        desktop: 'medium',
      }}
      paddingBottom={{
        mobile: 'large',
        tablet: 'large',
        desktop: 'xlarge',
      }}
      paddingX={{
        mobile: 'large',
        tablet: 'large',
        desktop: 'xlarge',
      }}
    >
      <Stack space="xlarge">
        <Box
          display="flex"
          alignItems="center"
          paddingY="medium"
          style={{ borderBottom: `1px solid ${vars.palette.gray700}` }}
        >
          <Box display="flex" paddingRight="medium">
            <Box
              borderRadius="full"
              background="red"
              paddingTop="medium"
              paddingLeft="medium"
              marginRight="small"
            />
            <Box
              borderRadius="full"
              background="yellow"
              paddingTop="medium"
              paddingLeft="medium"
              marginRight="small"
            />
            <Box
              borderRadius="full"
              background="green500"
              paddingTop="medium"
              paddingLeft="medium"
              marginRight="small"
            />
          </Box>
          {code.map(({ fileName }) => (
            <Box
              key={fileName}
              component="button"
              padding="small"
              cursor="pointer"
              marginRight="medium"
              onClick={() => {
                setActiveFileName(fileName);
                setShowCss(false);
              }}
            >
              <Text
                key={fileName}
                color={fileName === activeFileName ? 'highlight' : 'secondary'}
                size="xsmall"
                type="code"
              >
                {fileName}
              </Text>
            </Box>
          ))}
        </Box>
        <SyntaxHighlighter language="tsx">
          {
            code.filter(({ fileName }) => fileName === activeFileName)[0]
              .contents
          }
        </SyntaxHighlighter>
        <Box
          paddingTop="medium"
          style={{ borderTop: `1px solid ${vars.palette.gray700}` }}
        >
          <Stack space="medium">
            <Box
              component="button"
              cursor="pointer"
              padding="small"
              onClick={() => setShowCss(!showCss)}
            >
              <Text color="highlight" size="small">
                Show compiled CSS{' '}
                <Chevron direction={showCss ? 'up' : 'down'} />
              </Text>
            </Box>
            {showCss ? (
              <SyntaxHighlighter language="css">
                {css[activeFileName]}
              </SyntaxHighlighter>
            ) : null}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
