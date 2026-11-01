import {
  type AllHTMLAttributes,
  type ElementType,
  type ReactNode,
  createElement,
} from 'react';
import type { MDXComponents } from 'mdx/types';
import Text, { useTextStyles } from './Typography/Text';
import { Box } from './system';
import InlineCode from './InlineCode/InlineCode';
import Link from './Typography/Link';
import Blockquote from './Blockquote/Blockquote';
import { type HeadingLevel, useHeadingStyles } from './Typography/Heading';
import Divider from './Divider/Divider';
import {
  CompiledCode,
  type CodeFile,
  type CompiledCodeProps,
} from './Code/CompiledCode';
import { type BoxProps } from './system/Box/Box';
import { sprinkles } from './system/styles/sprinkles.css';
import { vars } from './themes.css';
import * as styles from './mdx-components.css';

const Block = ({
  component,
  children,
  maxWidth = 'large',
  style,
  ...restProps
}: Omit<BoxProps, 'paddingBottom'>) => (
  <Box
    component={component}
    paddingBottom="xxlarge"
    {...restProps}
    maxWidth={maxWidth}
    style={{
      margin: '0 auto',
      ...style,
    }}
  >
    {children}
  </Box>
);

// Children arrive as pre-rendered HTML, so structural concerns are handled by `markdown/docsPlugin.ts`

const A = ({
  href,
  color: _color,
  type: _type,
  'data-inline-code': isInlineCodeLink,
  ...restProps
}: JSX.IntrinsicElements['a'] & { 'data-inline-code'?: boolean }) =>
  href ? (
    <Link
      to={href}
      {...restProps}
      inline
      underline="always"
      highlightOnFocus={!isInlineCodeLink}
      className={
        isInlineCodeLink
          ? sprinkles({ color: { lightMode: 'pink700', darkMode: 'zinc200' } })
          : undefined
      }
    />
  ) : (
    <a {...restProps} />
  );

interface HeadingProps extends AllHTMLAttributes<HTMLHeadingElement> {
  component: ElementType;
  level: HeadingLevel;
  href?: string;
}
const Heading = ({ level, component, children, href }: HeadingProps) => {
  const headingElement = createElement(
    Box,
    {
      component: component,
      className: useHeadingStyles(level),
    },
    children,
  );

  return href ? (
    <Box
      component="a"
      href={`#${href}`}
      display="block"
      style={{
        textDecoration: 'none',
      }}
    >
      {headingElement}
    </Box>
  ) : (
    headingElement
  );
};

const CodeBlock = (file: CodeFile) => (
  <Block maxWidth="xlarge">
    <CompiledCode code={[file]} />
  </Block>
);

const CompiledCodeBlock = (props: CompiledCodeProps) => (
  <Block maxWidth="xlarge">
    <Box paddingY="large">
      <CompiledCode {...props} />
    </Box>
  </Block>
);

export const components = {
  hr: () => (
    <Block>
      <Divider />
    </Block>
  ),
  p: ({ children }) => (
    <Block component="p">
      <Text>{children}</Text>
    </Block>
  ),
  h1: ({ id, ...props }) => (
    <Block component="h1" id={id} className={styles.headingScrollTop}>
      <Heading component="span" {...props} href={id} level="1" />
    </Block>
  ),
  h2: ({ id, ...props }) => (
    <Block component="h2" id={id} className={styles.headingScrollTop}>
      <Box
        position="relative"
        component="span"
        display="block"
        marginTop="xxlarge"
        paddingLeft="large"
      >
        <Box
          component="span"
          display="block"
          position="absolute"
          top={0}
          left={0}
          paddingLeft="xsmall"
          marginTop="-small"
          borderRadius="medium"
          background={{ lightMode: 'pink400', darkMode: 'pink500' }}
          style={{
            height: 36,
            transform: 'skew(-15deg)',
          }}
        />
        <Heading component="span" {...props} href={id} level="3" />
      </Box>
    </Block>
  ),
  h3: ({ id, ...props }) => (
    <Block component="h3" id={id} className={styles.headingScrollTop}>
      <Box
        position="relative"
        component="span"
        display="block"
        marginTop="xlarge"
        paddingLeft="large"
      >
        <Box
          component="span"
          display="block"
          position="absolute"
          top={0}
          left={0}
          paddingLeft="xsmall"
          marginTop="-xsmall"
          borderRadius="medium"
          background={{ lightMode: 'blue400', darkMode: 'blue500' }}
          style={{
            height: 28,
            transform: 'skew(15deg)',
          }}
        />
        <Heading component="span" {...props} href={id} level="3" />
      </Box>
    </Block>
  ),
  CodeBlock,
  CompiledCodeBlock,
  code: InlineCode,
  th: (props) => (
    <Text component="th" weight="strong">
      {props.children}
    </Text>
  ),
  td: (props) => <Text component="td">{props.children}</Text>,
  a: A,
  blockquote: ({ children }) => (
    <Block component="blockquote">
      <Blockquote>{children}</Blockquote>
    </Block>
  ),
  'blockquote-p': ({ children }: { children?: ReactNode }) => (
    <Text>{children}</Text>
  ),
  ul: (props) => (
    <Block
      component="ul"
      className={useTextStyles({ baseline: false })}
      style={{
        listStyle: 'disc',
        paddingLeft: '2em',
        paddingRight: '1em',
        margin: `calc(${vars.spacing.xlarge} * -1) auto 0`,
      }}
    >
      {props.children}
    </Block>
  ),
  ol: (props) => (
    <Block
      component="ol"
      className={useTextStyles({ baseline: false })}
      style={{
        listStyle: 'decimal',
        paddingLeft: '2em',
        paddingRight: '1em',
        margin: `calc(${vars.spacing.xlarge} * -1) auto 0`,
      }}
    >
      {props.children}
    </Block>
  ),
} satisfies MDXComponents;
