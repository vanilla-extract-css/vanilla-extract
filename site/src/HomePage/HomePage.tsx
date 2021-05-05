import React, { ReactNode } from 'react';
import dedent from 'dedent';
import { Box, Stack, ContentBlock, Columns, ButtonLink } from '../system';
import { Heading } from '../Typography/Heading';
import { Chevron } from '../Chevron/Chevron';
import Link from '../Typography/Link';
import Text from '../Typography/Text';
import Logo from '../Logo/Logo';
import Code from '../Code/Code';
import InlineCode from '../InlineCode/InlineCode';
import { Tweet } from '../Tweet/Tweet';
import docsStore from '../docs-store';
import { ColorModeToggle } from '../ColorModeToggle/ColorModeToggle';
import { GitHubStars } from '../GitHubStars/GitHubStars';
import * as styles from './HomePage.css';

export const HomePage = () => {
  return (
    <>
      {/* <Box
        margin="large"
        paddingY="xxxlarge"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        style={{ height: 600, width: 1200, gap: 75 }}
        background={{ lightMode: 'green100', darkMode: 'gray700' }}
      >
        <Box style={{ marginTop: '-60px' }}>
          <Logo size={280} />
        </Box>
        <Heading level="1" branded>
          <span style={{ fontSize: '2em' }}>vanilla-extract</span>
        </Heading>
      </Box> */}

      <Box
        paddingTop="xxlarge"
        paddingBottom="xxxlarge"
        background={{ lightMode: 'green100', darkMode: 'gray700' }}
        className={styles.skewedContainer}
      >
        <ContentBlock size="large" withGutters>
          <Box position="relative">
            <Box
              display="flex"
              justifyContent="flex-end"
              paddingBottom={{
                mobile: 'medium',
                tablet: 'xlarge',
                desktop: 'xxlarge',
              }}
            >
              <ColorModeToggle />
            </Box>
            <Box>
              <Columns space="xlarge" collapseOnMobile alignY="center">
                <Stack space="xxlarge">
                  <Logo size={100} />
                  <Heading level="1" branded>
                    Zero-runtime
                    <br />
                    Stylesheets in
                    <br />
                    TypeScript.
                  </Heading>
                  <Text>
                    Write your styles in TypeScript (or JavaScript) with locally
                    scoped class names and CSS Variables, then generate static
                    CSS files at build time.
                  </Text>
                  <Box display="flex" alignItems="center">
                    <Box paddingRight="xlarge">
                      <ButtonLink
                        to="/documentation/"
                        icon={<Chevron direction="right" />}
                      >
                        Get started
                      </ButtonLink>
                    </Box>
                    <ButtonLink
                      to="https://github.com/seek-oss/vanilla-extract"
                      variant="transparent"
                    >
                      <GitHubStars />
                    </ButtonLink>
                  </Box>
                </Stack>
                <Code language="tsx">
                  {dedent`// Set up the theme via CSS Variables
                  export const vars = createGlobalTheme(':root', {
                    color: {
                      brand: 'blue'
                    },
                    font: {
                      body: 'comic sans ms'
                    }
                  });

                  // Consume the theme
                  export const exampleStyle = style({
                    backgroundColor: vars.color.brand,
                    fontFamily: vars.font.body,
                    color: 'white',
                    padding: '10px'
                  });`}
                </Code>
              </Columns>
            </Box>
          </Box>
        </ContentBlock>
      </Box>

      <Stack space="xxxlarge">
        <ContentBlock withGutters>
          <Box
            padding={{ mobile: 'xlarge', tablet: 'xlarge', desktop: 'xxlarge' }}
            borderRadius="large"
            background={{ lightMode: 'white', darkMode: 'gray900' }}
            color={{ lightMode: 'gray900', darkMode: 'gray50' }}
            className={styles.installBlock}
          >
            $ npm install{' '}
            <span style={{ whiteSpace: 'nowrap' }}>--save-dev</span>{' '}
            <span style={{ whiteSpace: 'nowrap' }}>@vanilla-extract/css</span>
          </Box>
        </ContentBlock>

        <ContentBlock withGutters size="large">
          <Box paddingY="xlarge">
            <Columns space="xxlarge" collapseOnMobile>
              <Feature title="Type-safe preprocessor">
                All styles generated at build time — just like{' '}
                <Link
                  to="https://sass-lang.com"
                  size="small"
                  underline="always"
                >
                  Sass
                </Link>
                ,{' '}
                <Link to="https://lesscss.org" size="small" underline="always">
                  LESS
                </Link>
                , etc, but with a type-safe contract.
              </Feature>

              <Feature title="Local scoped CSS">
                The power of deterministic, scoped styles using CSS Modules —
                extended to CSS variables, keyframes and font-faces.
              </Feature>

              <Feature title="High-level theming">
                Supports multiple themes simultaneously via first class scoping
                of CSS variables. No globals!
              </Feature>

              <Feature title="Utilities">
                Provides type-safe utilities for generating variable-based
                &ldquo;calc&rdquo; expressions.
              </Feature>
            </Columns>
          </Box>
        </ContentBlock>

        <ContentBlock withGutters size="large">
          <Columns space="xlarge" collapseOnMobile alignY="center">
            <Stack space="xxlarge">
              <Heading level="3">Scoped Themed Variables</Heading>
              <Text>
                Easily create themed variables, scoped to a class, by providing
                your theme structure to <InlineCode>createTheme</InlineCode>.
              </Text>
              <Text>
                Apply the returned class to an element, then consume the CSS
                variables in your styles, referencing them via the provided
                theme structure.
              </Text>
            </Stack>

            <Code language="tsx">
              {dedent`export const [themeClass, vars] = createTheme({
                  color: {
                    brand: 'aquamarine'
                  },
                });

                export const exampleStyle = style({
                  backgroundColor: vars.color.brand,
                  padding: 10
                });

                // app.ts
                import { themeClass, exampleStyle } from './styles.css.ts';

                document.write(\`
                  <section class="${'${themeClass}'}">
                    <h1 class="${'${exampleStyle}'}">Hello world!</h1>
                  </section>
                \`);`}
            </Code>
          </Columns>
        </ContentBlock>

        <Box paddingY="xxxlarge">
          <Box
            position="relative"
            paddingTop="xlarge"
            paddingBottom="xxlarge"
            background={{ lightMode: 'blue100', darkMode: 'gray800' }}
            className={styles.skewedContainerSecondary}
          >
            <Stack space="xxlarge">
              <ContentBlock size="large" withGutters>
                <Heading level="3">Community vibes</Heading>
              </ContentBlock>
              <ContentBlock size="large" withGutters>
                <Box
                  display="flex"
                  paddingY="large"
                  marginY="-large"
                  paddingX="large"
                  marginLeft="-large"
                  style={{ gap: 60, overflow: 'auto' }}
                >
                  <Tweet
                    handle="@jeresig"
                    name="John Resig"
                    avatar="https://pbs.twimg.com/profile_images/1090714620275245056/HS9xcEDk_200x200.jpg"
                    url="https://twitter.com/jeresig/status/1375609805373575175"
                  >
                    vanilla-extract is super exciting - it’s scratching an itch
                    that we have at @khanacademy, as we look to move off of
                    Aphrodite to something that has better perf characteristics.
                    We were thinking CSS Modules but this is even more ideal!
                  </Tweet>
                  {/* 
                <Tweet
                  handle="@jevakallio"
                  name="Macbook Miller"
                  avatar="https://pbs.twimg.com/profile_images/1260968240504856576/FNIWLC0A_200x200.jpg"
                  url="https://twitter.com/jevakallio/status/1375362320122183684"
                >
                  You had me at vanilla-extract
                </Tweet> */}

                  <Tweet
                    handle="@lorvsso"
                    name="Jack Lo Russo"
                    avatar="https://pbs.twimg.com/profile_images/1365062529622282240/UqZdoTJL_200x200.jpg"
                    url="https://twitter.com/lorvsso/status/1375592486182084613"
                  >
                    I love this ✨ The first time I made a decision at work
                    about CSS architecture, years ago now, CSS Modules was what
                    I ended up recommending and implementing. This is CSS
                    Modules for the new decade ❤️😍
                  </Tweet>

                  {/* <Tweet
                  handle="@markdalgleish"
                  name="Mark Dalgleish"
                  avatar="https://pbs.twimg.com/profile_images/754886061872979968/BzaOWhs1_200x200.jpg"
                  url="https://twitter.com/markdalgleish/status/1375371778306887681"
                >
                  Huge shout out to @peduarte for his amazing work on
                  @stitchesjs, leading the way and showing everyone how
                  first-class CSS Variables can be a core feature of modern
                  CSS-in-JS libraries.
                </Tweet> */}

                  <Tweet
                    handle="@kbrock84"
                    name="Kevin Brock"
                    avatar="https://pbs.twimg.com/profile_images/1127929844241555456/bbEpS1z6_200x200.jpg"
                    url="https://twitter.com/kbrock84/status/1375457568793845764"
                  >
                    Whoever thought of the name vanilla extract for a css in js
                    framework is a fucking genius. Just when you think all the
                    good js lib names have been taken.
                  </Tweet>
                </Box>
              </ContentBlock>
            </Stack>
          </Box>
        </Box>

        <ContentBlock withGutters size="large">
          <Columns space="xlarge" collapseOnMobile alignY="center">
            <Stack space="xxlarge">
              <Heading level="3">Full power of CSS & TypeScript</Heading>
              <Text>
                Define strongly-typed styles with the full power of CSS
                underneath.
              </Text>
              <Text>
                CSS Variables, simple pseudos (hover, focus, etc.), selectors
                and media/feature queries are all supported.
              </Text>
            </Stack>

            <Code language="tsx">
              {dedent`import { vars } from './vars.css.ts';
              
              export const className = style({
                display: 'flex',
                vars: {
                  [vars.color.brand]: 'pink',
                  '--global-variable': 'purple'
                },
                ':hover': {
                  color: 'red'
                },
                selectors: {
                  '&:nth-child(2n)': {
                    background: 'aquamarine'
                  }
                },
                '@media': {
                  'screen and (min-width: 768px)': {
                    padding: 10
                  }
                },
                '@supports': {
                  '(display: grid)': {
                    display: 'grid'
                  }
                }
              });`}
            </Code>
          </Columns>
        </ContentBlock>

        <ContentBlock withGutters size="large">
          <Columns space="xlarge" collapseOnMobile alignY="center">
            <Stack space="xxlarge">
              <Heading level="3">Create variants at build time</Heading>
              <Text>
                Creates a collection of named style variants, useful for mapping
                component props to styles, e.g.
                <InlineCode>{`styles.background[props.variant]`}</InlineCode>
              </Text>
              <Text>
                You can also transform the values by providing a map function as
                the second argument.
              </Text>
            </Stack>

            <Code language="tsx">
              {dedent`import { styleVariants } from '@vanilla-extract/css';

              export const background = styleVariants({
                primary: { background: 'blue' },
                secondary: { background: 'aqua' },
              });
              
              const spaceScale = {
                small: 4,
                medium: 8,
                large: 16
              };
              
              export const padding = styleVariants(
                spaceScale,
                (space) => ({ padding: space })
              );`}
            </Code>
          </Columns>
        </ContentBlock>

        <ContentBlock withGutters>
          <Box component="footer" paddingY="xxxlarge">
            <Stack space="xxlarge" align="center">
              <Logo size={60} />
              <Columns space="xxxlarge" collapseOnMobile>
                <Stack space="xlarge" align="center">
                  <Heading level="4">Documentation</Heading>
                  {docsStore.map(({ title, route }) => (
                    <Link
                      to={route}
                      key={title}
                      size="small"
                      color="secondary"
                      baseline
                    >
                      {title}
                    </Link>
                  ))}
                </Stack>

                <Stack space="xlarge" align="center">
                  <Heading level="4">Community</Heading>
                  <Link
                    to="https://github.com/seek-oss/vanilla-extract"
                    size="small"
                    color="secondary"
                    baseline
                  >
                    GitHub
                  </Link>
                  <Link
                    to="https://github.com/seek-oss/vanilla-extract/discussions"
                    size="small"
                    color="secondary"
                    baseline
                  >
                    Discussions
                  </Link>
                </Stack>

                <Stack space="xlarge" align="center">
                  <Heading level="4">Related work</Heading>
                  <Link
                    to="https://seek-oss.github.io/braid-design-system/"
                    size="small"
                    color="secondary"
                    baseline
                  >
                    <span style={{ whiteSpace: 'nowrap' }}>
                      Braid Design System
                    </span>
                  </Link>
                  <Link
                    to="https://seek-oss.github.io/capsize/"
                    size="small"
                    color="secondary"
                    baseline
                  >
                    Capsize
                  </Link>
                  <Link
                    to="https://github.com/seek-oss/playroom"
                    size="small"
                    color="secondary"
                    baseline
                  >
                    Playroom
                  </Link>
                  <Link
                    to="https://seek-oss.github.io/treat/"
                    size="small"
                    color="secondary"
                    baseline
                  >
                    Treat
                  </Link>
                </Stack>
              </Columns>
            </Stack>
          </Box>
        </ContentBlock>
      </Stack>
    </>
  );
};

const Feature = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <Box position="relative" paddingLeft="xlarge">
    <Box
      position="absolute"
      top={0}
      left={0}
      className={styles.featureKeyLine}
      background={{ lightMode: 'pink300', darkMode: 'pink600' }}
      paddingLeft="xsmall"
      marginTop={{ mobile: '-small', tablet: '-medium', desktop: '-medium' }}
      borderRadius="medium"
    />
    <Stack space="xlarge">
      <Heading level="4">{title}</Heading>
      <Text size="small">{children}</Text>
    </Stack>
  </Box>
);
