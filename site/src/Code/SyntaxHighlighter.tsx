// @ts-ignore
import { PrismLight } from 'react-syntax-highlighter/dist/esm/index';
// @ts-ignore
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
// @ts-ignore
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
PrismLight.registerLanguage('tsx', tsx);
PrismLight.registerLanguage('ts', ts);

import { Box } from '../system';
import { Text } from '../typography';
import * as styles from './SyntaxHighlighter.css';

export interface SyntaxHighlighterProps {
  language: string;
  children: string;
  tokenized?: boolean;
}

export const SyntaxHighlighter = ({
  language,
  children,
  tokenized,
}: SyntaxHighlighterProps) => {
  return (
    <Box className={styles.root}>
      <Text size="code" component="div" baseline={false}>
        {tokenized ? (
          <code
            className={`language-${language}`}
            data-language={language}
            dangerouslySetInnerHTML={{ __html: children }}
          />
        ) : (
          <PrismLight
            language={language}
            style={{ [`pre[class*="language-"]`]: {} }}
          >
            {children}
          </PrismLight>
        )}
      </Text>
    </Box>
  );
};
