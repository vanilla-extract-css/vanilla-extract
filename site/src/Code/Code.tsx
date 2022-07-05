import { useRef, useEffect } from 'react';
import { Box, Stack } from '../system';
import { Sprinkles } from '../system/styles/sprinkles.css';
import Text from '../Typography/Text';
import SyntaxHighlighter from './SyntaxHighlighter';
import * as styles from './ErrorHighlighter.css';

export interface CodeProps {
  language: string;
  errorTokens?: Array<string>;
  title?: string;
  background?: Sprinkles['background'];
  children:
  | string
  | {
    __html: string;
  };
}

const defaultBackground = {
  lightMode: 'coolGray900',
  darkMode: 'black',
} as const;

export default ({
  language,
  title,
  background = defaultBackground,
  errorTokens,
  children,
}: CodeProps) => {
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
      if (span.innerHTML && errorTokens.includes(span.innerHTML.trim())) {
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

  let resolvedTitle;
  let resolvedChildren = '';

  if (children && typeof children !== 'string') {
    const matches = children.__html.match(
      /^(?<node>\<span class=\".*\"\>(?:\/[\/*])(?:\s)?(?<title>[^*\/]*)(?:\*\/)?\<\/span\>)/,
    );

    if (matches && matches.groups) {
      resolvedTitle = matches.groups.title;
      resolvedChildren = children.__html
        .replace(`${matches.groups.node}`, '')
        .trim();
    } else {
      resolvedChildren = children.__html;
    }
  } else {
    resolvedChildren = children;
  }
  return (
    <div ref={rootRef}>
      <Box background={background} borderRadius="large" padding={padding}>
        <Stack space="large">
          {title || resolvedTitle ? (
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
                <Box
                  component="span"
                  color={{ lightMode: 'coolGray400', darkMode: 'gray400' }}
                >
                  {title || resolvedTitle}
                </Box>
              </Text>
            </Box>
          ) : null}
          <SyntaxHighlighter
            language={language}
            tokenized={typeof children !== 'string'}
          >
            {resolvedChildren}
          </SyntaxHighlighter>
        </Stack>
      </Box>
    </div>
  );
};
