import {
  ReactNode,
  AllHTMLAttributes,
  ElementType,
  createElement,
  Children,
} from 'react';
import { MDXProvider } from '@mdx-js/react';
import Text, { useTextStyles } from './Typography/Text';
import { Box } from './system';
import InlineCode from './InlineCode/InlineCode';
import Link from './Typography/Link';
import Blockquote from './Blockquote/Blockquote';
import { HeadingLevel, useHeadingStyles } from './Typography/Heading';
import Divider from './Divider/Divider';
import { CompiledCode, CompiledCodeProps } from './Code/CompiledCode';
import { BoxProps } from './system/Box/Box';
import { sprinkles } from './system/styles/sprinkles.css';

interface Children {
  children: ReactNode;
}
interface HeadingProps {
  children: ReactNode;
  component: ElementType;
  level: HeadingLevel;
  id: string;
}

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

const RemoveNestedParagraphs = (p: Children) => (
  <MDXProvider
    {...p}
    components={{
      p: ({ children }) => <Text>{children}</Text>,
    }}
  />
);

const Th = (props: Children) => (
  <Text component="th" weight="strong">
    {props.children}
  </Text>
);

const Td = (props: Children) => <Text component="td">{props.children}</Text>;

const A = ({
  href,
  size, // Omit
  color, // Omit
  type, // Omit
  ...restProps
}: AllHTMLAttributes<HTMLAnchorElement>) => {
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

const Heading = ({ level, component, children, id }: HeadingProps) => {
  const headingElement = createElement(
    Box,
    {
      component: component,
      className: useHeadingStyles(level),
    },
    children,
  );

  return id ? (
    <>
      <Box
        component="a"
        display="block"
        id={id}
        style={{
          visibility: 'hidden',
          scrollMarginTop: 120,
        }}
      />
      <a style={{ textDecoration: 'none' }} href={`#${id}`}>
        {headingElement}
      </a>
    </>
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
  p: ({ children }: Children) => (
    <Block component="p">
      <Text>{children}</Text>
    </Block>
  ),
  h1: ({ component, ...props }: HeadingProps) => (
    <Block component="h1">
      <Heading component="span" {...props} level="1" />
    </Block>
  ),
  h2: ({ component, ...props }: HeadingProps) => (
    <Block component="h2" paddingTop="xxlarge">
      <Box
        position="relative"
        component="span"
        display="block"
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
        <Heading component="span" {...props} level="3" />
      </Box>
    </Block>
  ),
  h3: ({ component, ...props }: HeadingProps) => (
    <Block component="h3" paddingTop="xlarge">
      <Box
        position="relative"
        component="span"
        display="block"
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
        <Heading component="span" {...props} level="3" />
      </Box>
    </Block>
  ),
  pre: ({ children }: Children) => (
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
  code: ({
    'data-language': language,
    dangerouslySetInnerHTML,
  }: {
    'data-language': string;
    dangerouslySetInnerHTML: { __html: string };
  }) => {
    let resolvedTitle = '';
    let resolvedChildren = dangerouslySetInnerHTML.__html;
    const matches = resolvedChildren.match(
      /^(?<node>\<span class=\".*\"\>(?:\/[\/*])(?:\s)?(?<title>[^*\/]*)(?:\*\/)?\<\/span\>)/,
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
  th: Th,
  td: Td,
  a: A,
  blockquote: ({ children }: Children) => (
    <Block component="blockquote">
      <RemoveNestedParagraphs>
        <Blockquote>{children}</Blockquote>
      </RemoveNestedParagraphs>
    </Block>
  ),
  ul: (props: Children) => (
    <Block
      component="ul"
      className={useTextStyles({ baseline: false })}
      style={{
        listStyle: 'disc',
        paddingLeft: '1em',
        paddingRight: '1em',
      }}
    >
      {props.children}
    </Block>
  ),
  ol: (props: Children) => (
    <Block
      component="ol"
      className={useTextStyles({ baseline: false })}
      style={{
        listStyle: 'decimal',
        paddingLeft: '1em',
        paddingRight: '1em',
      }}
    >
      {props.children}
    </Block>
  ),
};
