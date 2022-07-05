import { useState } from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { Box, Stack } from '../system';
import Text from '../Typography/Text';
import SyntaxHighlighter from './SyntaxHighlighter';

import * as styles from './CompiledCode.css';
import { vars } from '../themes.css';

interface File {
  contents: string;
  fileName?: string;
  language?: string;
  tokenized?: boolean;
}

export interface CompiledCodeProps {
  code: Array<File>;
  css?: Record<string, string>;
  background?: { lightMode?: keyof typeof vars.palette, darkMode?: keyof typeof vars.palette }
}

export const CompiledCode = ({ code, css, background }: CompiledCodeProps) => {
  const [activeFileName, setActiveFileName] = useState(code[0].fileName);
  const [showCss, setShowCss] = useState(false);

  const activeFile = code.filter(({ fileName }) => fileName === activeFileName)[0];

  return (
    <Box
      padding={{
        mobile: 'large',
        tablet: 'xlarge',
      }}
      paddingY="xlarge"
      paddingBottom={css ? "xxlarge" : undefined}
      className={styles.root}
      style={background ? assignInlineVars({
        [styles.darkModeBg]: vars.palette[background.darkMode!],
        [styles.lightModeBg]: vars.palette[background.lightMode!]
      }) : undefined}
    >
      <Stack space={code.length > 1 ? "xlarge" : 'large'}>
        {activeFile.fileName ?
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
                  className={styles.fileNameFocus}
                  borderRadius="small"
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
                          size="small"
                          weight={isActiveFile ? 'strong' : undefined}
                          baseline={false}
                        >
                          <Box component="span" className={[styles.fileName, !isActiveFile ? styles.fileNameInactive : undefined]}>
                            {fileName}
                          </Box>
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box> : null}
        <Box padding="large" margin="-large">
          <Box
            display="flex"
            className={showCss ? styles.showCssOnMobile : undefined}
          >
            <Box
              width="full"
              flexGrow={1}
              flexShrink={0}
              minWidth={0}
              transition="slow"
              className={styles.sourceContainer}
            >
              <SyntaxHighlighter language={activeFile.language || 'tsx'} tokenized={activeFile.tokenized}>
                {
                  activeFile.contents
                }
              </SyntaxHighlighter>
            </Box>
            {css ?
              <Box
                id="outputContainer"
                width="full"
                flexShrink={0}
                minWidth={0}
                padding="large"
                borderRadius="large"
                transition="slow"
                className={styles.outputContainer}
              >
                <Stack space="large">
                  <Text weight="strong" size="small" color="secondary">
                    CSS
                  </Text>

                  {activeFileName && css[activeFileName] ? (
                    <SyntaxHighlighter language="css">
                      {css[activeFileName]}
                    </SyntaxHighlighter>
                  ) : (
                    <Text size="small" type="code">
                      No CSS created
                    </Text>
                  )}
                </Stack>
              </Box> : null}
          </Box>
        </Box>
      </Stack>


      {css ?
        <Box
          display="flex"
          justifyContent="flex-end"
          paddingTop={{ mobile: 'medium' }}
          className={styles.buttonContainer}
        >
          <Box
            component="button"
            background="gray600"
            borderRadius="medium"
            padding="medium"
            cursor="pointer"
            className={styles.button}
            onClick={() => setShowCss(!showCss)}
            position="relative"
            transition="fast"
            aria-expanded={showCss}
            aria-controls="outputContainer"
          >
            <Box
              component="span"
              display="block"
              background="pink600"
              position="absolute"
              inset={0}
              pointerEvents="none"
              borderRadius="medium"
              opacity={showCss ? 0 : undefined}
              transition="slow"
            />
            <Box component="span" position="relative">
              <Text size="small" color="code" weight="strong">
                {showCss ? 'Close' : 'Show Output'}
              </Text>
            </Box>
          </Box>
        </Box> : null}
    </Box>
  );
};
