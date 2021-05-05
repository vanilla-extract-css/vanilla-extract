// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { Box } from '../system';
import Text from '../Typography/Text';
import InlineCode from '../InlineCode/InlineCode';
import * as styles from './Code.css';
export interface CodeProps {
  language: string;
  children:
    | string
    | {
        __html: string;
      };
}
export default ({ language, children }: CodeProps) => {
  const padding = {
    mobile: 'large',
    tablet: 'large',
    desktop: 'xlarge',
  } as const;

  return (
    <Box
      className={styles.root}
      background={{ lightMode: 'gray900', darkMode: 'gray800' }}
      borderRadius="large"
      padding={padding}
    >
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
    </Box>
  );
};
