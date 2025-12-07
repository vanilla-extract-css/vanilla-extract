import {
  type ReactNode,
  type ComponentProps,
  type AllHTMLAttributes,
  type ElementType,
  createElement,
  Children,
} from 'react';
import { MDXProvider } from '@mdx-js/react';
import Text, { useTextStyles } from './Typography/Text';
import { Box } from './system';
import InlineCode from './InlineCode/InlineCode';
import Link from './Typography/Link';
import Blockquote from './Blockquote/Blockquote';
import { type HeadingLevel, useHeadingStyles } from './Typography/Heading';
import Divider from './Divider/Divider';
import { CompiledCode, type CompiledCodeProps } from './Code/CompiledCode';
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

const RemoveNestedParagraphs = (props: { children: ReactNode }) => (
  <MDXProvider
    {...props}
    components={{
      p: ({ children }) => <Text>{children}</Text>,
    }}
  />
);

const A = ({
  href,
  color: _color,
  type: _type,
  ...restProps
}: JSX.IntrinsicElements['a']) => {
  let isInlineCodeLink = false;

  if (
    restProps.children &&
    Children.count(restProps.children) === 1 &&
    typeof restProps.children === 'object'
  ) {
    const child = Children.only(restProps.children);
    if (child && typeof child === 'object' && 'props' in child) {
      isInlineCodeLink =
        child.props.parentName === 'a' &&
        child.props.originalType === 'inlineCode';
    }
  }

  return href ? (
    <Link
      to={href}
      {...restProps}
      inline
      underline="always"
      highlightOnFocus={!isInlineCodeLink}
      className={
        isInlineCodeLink
          ? sprinkles({ color: { lightMode: 'pink700', darkMode: 'gray200' } })
          : undefined
      }
    />
  ) : (
    <a {...restProps} />
  );
};

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

export default {
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
  pre: ({ children }) => (
    <Block maxWidth="xlarge" component="pre">
      {children}
    </Block>
  ),
  compiledcode: (props: CompiledCodeProps) => (
    <Block maxWidth="xlarge">
      <Box paddingY="large">
        <CompiledCode {...props} />
      </Box>
    </Block>
  ),
  code: (props) => {
    // These props are added by SyntaxHighlighter
    const { dangerouslySetInnerHTML, ['data-language']: language } =
      props as typeof props & {
        'data-language'?: string;
        dangerouslySetInnerHTML: { __html: string };
      };
    let resolvedTitle = '';
    let resolvedChildren = dangerouslySetInnerHTML.__html;
    const matches = resolvedChildren.match(
      /^(?<node><span class=".*">(?:\/[/*])(?:\s)?(?<title>[^*/]*)(?:\*\/)?<\/span>)/,
    );

    if (matches && matches.groups) {
      resolvedTitle = matches.groups.title;
      resolvedChildren = resolvedChildren
        .replace(`${matches.groups.node}`, '')
        .trim();
    }

    return (
      <CompiledCode
        code={[
          {
            fileName: resolvedTitle,
            contents: resolvedChildren,
            language,
            tokenized: true,
          },
        ]}
      />
    );
  },
  inlineCode: InlineCode,
  th: (props) => (
    <Text component="th" weight="strong">
      {props.children}
    </Text>
  ),
  td: (props) => <Text component="td">{props.children}</Text>,
  a: A,
  blockquote: ({ children }) => (
    <Block component="blockquote">
      <RemoveNestedParagraphs>
        <Blockquote>{children}</Blockquote>
      </RemoveNestedParagraphs>
    </Block>
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
} satisfies ComponentProps<typeof MDXProvider>['components'];
