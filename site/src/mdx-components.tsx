import React, {
  ReactNode,
  AllHTMLAttributes,
  ElementType,
  createElement,
} from 'react';
import Text, { useTextStyles } from './Typography/Text';
import { Box } from './system';
import Code from './Code/Code';
import InlineCode from './InlineCode/InlineCode';
import Link from './Typography/Link';
import Blockquote from './Blockquote/Blockquote';
import { HeadingLevel, useHeadingStyles } from './Typography/Heading';
import Divider from './Divider/Divider';

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
  ...restProps
}: AllHTMLAttributes<HTMLAnchorElement>) =>
  href ? (
    <Link to={href} {...restProps} underline="always" />
  ) : (
    <a {...restProps} />
  );

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
    <Box component="h2" marginTop="xxxlarge" marginBottom="xlarge">
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
    <Box component="h3" marginTop="xlarge" marginBottom="xlarge">
      <Heading component="span" {...props} level="3" />
    </Box>
  ),
  pre: Pre,
  code: ({
    'data-language': language,
    dangerouslySetInnerHTML,
  }: {
    'data-language': string;
    dangerouslySetInnerHTML: { __html: string };
  }) => (
    <Box marginBottom={{ mobile: 'small', tablet: 'medium', desktop: 'large' }}>
      <Code language={language}>{dangerouslySetInnerHTML}</Code>
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
      <Text component="span" baseline={false}>
        {props.children}
      </Text>
    </Box>
  ),
};
