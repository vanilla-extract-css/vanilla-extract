// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { Box, Stack } from '../system';
import Text from '../Typography/Text';
import InlineCode from '../InlineCode/InlineCode';
import * as styles from './Code.css';
import { useRef, useEffect } from 'react';
export interface CodeProps {
  language: string;
  errorTokens?: Array<string>;
  title?: string;
  children:
    | string
    | {
        __html: string;
      };
}
export default ({ language, title, errorTokens, children }: CodeProps) => {
  const padding = {
    mobile: 'large',
    tablet: 'large',
    desktop: 'xlarge',
  } as const;

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current === null || !errorTokens || errorTokens.length === 0) {
      return;
    }

    const spans = rootRef.current.querySelectorAll('code span');

    if (!spans) {
      return;
    }

    const errorNodes: Array<Element> = [];
    for (const span of Array.from(spans)) {
      if (span.innerHTML && errorTokens.includes(span.innerHTML)) {
        span.classList.add(styles.errorUnderline);
        errorNodes.push(span);
      }
    }

    return () => {
      errorNodes.forEach((errorNode) => {
        errorNode.classList.remove(styles.errorUnderline);
      });
    };
  }, [rootRef.current, errorTokens]);

  return (
    <div ref={rootRef}>
      <Box
        className={styles.root}
        background={{ lightMode: 'gray900', darkMode: 'gray800' }}
        borderRadius="large"
        padding={padding}
      >
        <Stack space="large">
          {title ? (
            <Box display="flex" alignItems="center">
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
              <Text color="secondary" size="xsmall" type="code">
                {title}
              </Text>
            </Box>
          ) : null}
          <Text size="code" component="div" color="code" baseline={false}>
            {typeof children === 'string' ? (
              <SyntaxHighlighter language={language} style={styles.theme}>
                {children}
              </SyntaxHighlighter>
            ) : (
              <InlineCode inline={false}>
                <span
                  className={`language-${language}`}
                  data-language={language}
                  dangerouslySetInnerHTML={children}
                />
              </InlineCode>
            )}
          </Text>
        </Stack>
      </Box>
    </div>
  );
};
