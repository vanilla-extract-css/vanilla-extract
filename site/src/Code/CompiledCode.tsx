import { useState } from 'react';
import { Box, Stack } from '../system';
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
        <Box display="flex" alignItems="center">
          {code.map(({ fileName }) => (
            <Box
              key={fileName}
              component="button"
              cursor="pointer"
              marginRight="xlarge"
              onClick={() => setActiveFileName(fileName)}
            >
              <Box position="relative" display="flex" alignItems="center">
                <Box
                  component="span"
                  position="absolute"
                  background={{
                    lightMode: 'green300',
                    darkMode: 'green400',
                  }}
                  borderRadius="full"
                  paddingLeft="xsmall"
                  paddingTop="large"
                  marginLeft="xsmall"
                  style={{
                    transition: 'transform .3s ease, opacity .3s ease',
                    transform:
                      fileName === activeFileName
                        ? `skew(15deg)`
                        : `skew(-15deg)`,
                    opacity: fileName === activeFileName ? 1 : 0,
                    filter:
                      fileName === activeFileName ? undefined : 'saturate(0)',
                  }}
                />
                <Box
                  component="span"
                  paddingLeft="large"
                  paddingY="large"
                  marginY="-large"
                  paddingRight="large"
                  marginRight="-large"
                >
                  <Text
                    key={fileName}
                    color={fileName === activeFileName ? 'code' : 'secondary'}
                    size="small"
                    weight={fileName === activeFileName ? 'strong' : undefined}
                  >
                    {fileName}
                  </Text>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Box display={{ mobile: 'block', desktop: 'flex' }}>
          <Box style={{ minWidth: 0 }} width="full" flexGrow={1}>
            <SyntaxHighlighter language="tsx">
              {
                code.filter(({ fileName }) => fileName === activeFileName)[0]
                  .contents
              }
            </SyntaxHighlighter>
          </Box>
          <Box
            style={{ width: '45%' }}
            width="full"
            flexGrow={0}
            flexShrink={0}
            padding={{ desktop: 'large' }}
            marginTop={{ desktop: '-medium' }}
            marginY={{ desktop: '-large' }}
            marginRight={{ desktop: '-large' }}
            marginLeft={{ desktop: 'xlarge' }}
            background={{ darkMode: 'black' }}
            borderRadius="large"
          >
            <Stack space="large">
              <Text weight="strong" size="small" color="secondary">
                CSS
              </Text>
              <SyntaxHighlighter language="css">
                {css[activeFileName]}
              </SyntaxHighlighter>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
