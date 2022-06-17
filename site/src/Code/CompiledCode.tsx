import { useState } from 'react';
import { Chevron } from '../Chevron/Chevron';
import { Box, Stack } from '../system';
import Text from '../Typography/Text';
import SyntaxHighlighter from './SyntaxHighlighter';

import * as styles from './CompiledCode.css';

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
      padding={{
        mobile: 'large',
        tablet: 'xlarge',
      }}
      paddingTop="xlarge"
    >
      <Stack space="xlarge">
        <Box display="flex" alignItems="center">
          {code.map(({ fileName }) => {
            const isActiveFile = fileName === activeFileName;

            return (
              <Box
                key={fileName}
                component={code.length > 1 ? 'button' : 'span'}
                cursor={code.length > 1 ? 'pointer' : undefined}
                marginRight="large"
                marginTop="-medium"
                onClick={
                  code.length > 1
                    ? () => {
                        setActiveFileName(fileName);
                        setShowCss(false);
                      }
                    : undefined
                }
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
                    transition="slow"
                    className={
                      isActiveFile
                        ? styles.fileIndicatorActive
                        : styles.fileIndicatorInactive
                    }
                  />
                  <Box
                    component="span"
                    paddingLeft="large"
                    position="relative"
                    className={styles.boldLayoutShiftFix}
                    data-text={fileName}
                  >
                    <Box position="absolute" left={0} paddingLeft="large">
                      <Text
                        key={fileName}
                        color={isActiveFile ? 'code' : 'secondary'}
                        size="small"
                        weight={isActiveFile ? 'strong' : undefined}
                        baseline={false}
                      >
                        {fileName}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
        <Box padding="large" margin="-large" overflow="hidden">
          <Box
            display="flex"
            className={showCss ? styles.showCssOnMobile : undefined}
          >
            <Box
              width="full"
              flexGrow={1}
              flexShrink={0}
              minWidth={0}
              opacity={showCss ? 0 : undefined}
              transition="slow"
              className={styles.sourceContainer}
            >
              <SyntaxHighlighter language="tsx">
                {
                  code.filter(({ fileName }) => fileName === activeFileName)[0]
                    .contents
                }
              </SyntaxHighlighter>
            </Box>
            <Box
              width="full"
              flexShrink={0}
              minWidth={0}
              padding="large"
              background={{ lightMode: 'coolGray900', darkMode: 'black' }}
              borderRadius="large"
              transition="slow"
              className={styles.outputContainer}
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
        </Box>
      </Stack>

      <Box
        display="flex"
        justifyContent="flex-end"
        paddingTop={{ mobile: 'medium' }}
        className={styles.buttonContainer}
      >
        <Box
          opacity={!showCss ? 0 : undefined}
          pointerEvents={!showCss ? 'none' : undefined}
          transition="fast"
        >
          <Box
            component="button"
            background="gray600"
            borderRadius="medium"
            padding="medium"
            cursor="pointer"
            onClick={() => setShowCss(false)}
          >
            <Text size="small" color="code">
              Close x
            </Text>
          </Box>
        </Box>
        <Box
          position="absolute"
          opacity={showCss ? 0 : undefined}
          pointerEvents={showCss ? 'none' : undefined}
          transition="fast"
        >
          <Box
            component="button"
            background="pink600"
            borderRadius="medium"
            padding="medium"
            cursor="pointer"
            onClick={() => setShowCss(true)}
          >
            <Text size="small" color="code">
              Output <Chevron direction="right" />
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
