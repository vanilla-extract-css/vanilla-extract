import {
  ReactNode,
  AllHTMLAttributes,
  ElementType,
  createElement,
  Children,
} from 'react';
import Text, { useTextStyles } from './Typography/Text';
import { Box } from './system';
import Code from './Code/Code';
import InlineCode from './InlineCode/InlineCode';
import Link from './Typography/Link';
import Blockquote from './Blockquote/Blockquote';
import { HeadingLevel, useHeadingStyles } from './Typography/Heading';
import Divider from './Divider/Divider';
import { sprinkles } from './system/styles/sprinkles.css';
import { CompiledCode } from './Code/CompiledCode';

interface Children {
  children: ReactNode;
}
interface HeadingProps {
  children: ReactNode;
  component: ElementType;
  level: HeadingLevel;
  id: string;
}

const P = (props: Children) => (
  <Box component="p" paddingBottom="xlarge">
    <Text>{props.children}</Text>
  </Box>
);

const Pre = ({ color, width, ...props }: AllHTMLAttributes<HTMLPreElement>) => (
  <Box component="pre" paddingBottom="large" {...props} />
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
    <Box paddingTop="small" paddingBottom="xxlarge">
      <Divider />
    </Box>
  ),
  p: P,
  h1: ({ component, ...props }: HeadingProps) => (
    <Box component="h1" marginBottom="xxlarge">
      <Heading component="span" {...props} level="1" />
    </Box>
  ),
  h2: ({ component, ...props }: HeadingProps) => (
    <Box
      component="h2"
      paddingTop={{ mobile: 'xxlarge', desktop: 'xxlarge' }}
      paddingBottom="xxlarge"
    >
      <Box position="relative" paddingLeft="large">
        <Box
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
    </Box>
  ),
  h3: ({ component, ...props }: HeadingProps) => (
    <Box component="h3" paddingTop="xlarge" paddingBottom="xxlarge">
      <Box position="relative" paddingLeft="large">
        <Box
          position="absolute"
          top={0}
          left={0}
          paddingLeft="xsmall"
          marginTop="-xsmall"
          borderRadius="medium"
          background={{ lightMode: 'green400', darkMode: 'green500' }}
          style={{
            height: 28,
            transform: 'skew(15deg)',
          }}
        />
        <Heading component="span" {...props} level="3" />
      </Box>
    </Box>
  ),
  pre: Pre,
  compiledcode: CompiledCode,
  code: ({
    'data-language': language,
    dangerouslySetInnerHTML,
  }: {
    'data-language': string;
    dangerouslySetInnerHTML: { __html: string };
  }) => (
    <Box marginBottom={{ mobile: 'small', tablet: 'medium', desktop: 'large' }}>
      <Code
        language={language}
        background={{ lightMode: 'coolGray800', darkMode: 'gray900' }}
      >
        {dangerouslySetInnerHTML}
      </Code>
    </Box>
  ),
  inlineCode: InlineCode,
  th: Th,
  td: Td,
  a: A,
  blockquote: Blockquote,
  ul: (props: Children) => (
    <Box
      component="ul"
      paddingBottom="xlarge"
      className={useTextStyles({ baseline: false })}
      style={{
        listStyle: 'disc',
        paddingLeft: '1em',
        paddingRight: '1em',
      }}
    >
      {props.children}
    </Box>
  ),
  ol: (props: Children) => (
    <Box
      component="ol"
      paddingBottom="xlarge"
      className={useTextStyles({ baseline: false })}
      style={{
        listStyle: 'decimal',
        paddingLeft: '1em',
        paddingRight: '1em',
      }}
    >
      {props.children}
    </Box>
  ),
  li: (props: Children) => (
    <Box component="li" paddingBottom="large">
      {props.children}
    </Box>
  ),
};
