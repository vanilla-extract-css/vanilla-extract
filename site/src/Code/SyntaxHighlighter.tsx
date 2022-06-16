// @ts-ignore
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter/dist/esm/index';
// @ts-ignore
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
// @ts-ignore
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('ts', ts);

import { Box } from '../system';
import Text from '../Typography/Text';
import * as styles from './SyntaxHighlighter.css';

export interface CodeProps {
  language: string;
  children: string;
  tokenized?: boolean;
}

export default ({ language, children, tokenized }: CodeProps) => {
  return (
    <Box className={styles.root}>
      <Text size="code" component="div" color="code" baseline={false}>
        {tokenized ? (
          <code
            className={`language-${language}`}
            data-language={language}
            dangerouslySetInnerHTML={{ __html: children }}
          />
        ) : (
          <SyntaxHighlighter language={language} style={styles.theme}>
            {children}
          </SyntaxHighlighter>
        )}
      </Text>
    </Box>
  );
};
