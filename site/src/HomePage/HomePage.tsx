import { ReactNode } from 'react';
import dedent from 'dedent';
import { Box, Stack, ContentBlock, Columns, ButtonLink } from '../system';
import { Heading } from '../Typography/Heading';
import { Chevron } from '../Chevron/Chevron';
import Link from '../Typography/Link';
import Text from '../Typography/Text';
import Logo from '../Logo/Logo';
import Code from '../Code/Code';
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
        background={{ lightMode: 'teal100', darkMode: 'gray700' }}
      >
        <Box style={{ marginTop: '-60px' }}>
          <Logo size={280} />
        </Box>
        <Stack space="large" align="center">
          <Heading level="1" branded>
            <span style={{ fontSize: '2em', opacity: 0.9 }}>
              vanilla-extract
            </span>
          </Heading>
          <Box paddingTop="medium" />
          <Heading level="2">
            <span style={{ fontSize: '1.1em', opacity: 0.6 }}>
              Zero-runtime Stylesheets in TypeScript.
            </span>
          </Heading>
        </Stack>
      </Box> */}

      <Box
        paddingTop="xxlarge"
        paddingBottom="xxxlarge"
        background={{ lightMode: 'teal100', darkMode: 'gray900' }}
        className={styles.skewedContainer}
      >
        <ContentBlock
          size={{ mobile: 'standard', desktop: 'large' }}
          withGutters
        >
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
              <Columns space="none" collapseOnTablet alignY="center">
                <Box
                  marginTop={{ tablet: '-xlarge' }}
                  paddingBottom={{ mobile: 'xlarge', desktop: 'none' }}
                >
                  <Stack
                    space="xxlarge"
                    align={{ mobile: 'center', desktop: 'flex-start' }}
                  >
                    <Box
                      display="flex"
                      justifyContent={{
                        mobile: 'center',
                        desktop: 'flex-start',
                      }}
                    >
                      <Logo size={100} />
                    </Box>
                    <Heading
                      level="1"
                      branded
                      align={{ mobile: 'center', desktop: 'left' }}
                    >
                      Zero-runtime
                      <br />
                      Stylesheets in
                      <br />
                      TypeScript.
                    </Heading>
                    <Box
                      display="flex"
                      justifyContent={{
                        mobile: 'center',
                        desktop: 'flex-start',
                      }}
                    >
                      <Box style={{ maxWidth: 480 }}>
                        <Text align={{ mobile: 'center', desktop: 'left' }}>
                          <Box color={{ darkMode: 'gray300' }}>
                            Use TypeScript as your preprocessor. Write
                            type-safe, locally scoped classes and variables,
                            then generate static CSS files at build time.
                          </Box>
                        </Text>
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={{
                        mobile: 'center',
                        desktop: 'flex-start',
                      }}
                    >
                      <Box paddingRight={{ mobile: 'small', tablet: 'xlarge' }}>
                        <ButtonLink
                          to="/documentation"
                          icon={
                            <Box display={{ mobile: 'none', desktop: 'block' }}>
                              <Chevron direction="right" />
                            </Box>
                          }
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
                </Box>
                <Code
                  language="tsx"
                  errorTokens={['brandd', 'large']}
                  title="styles.css.ts"
                >
                  {dedent`
                  import { createTheme, style } from '@vanilla-extract/css';

                  export const [themeClass, vars] = createTheme({
                    color: {
                      brand: 'blue',
                      white: '#fff'
                    },
                    space: {
                      small: '4px',
                      medium: '8px',
                    }
                  });

                  export const hero = style({
                    backgroundColor: vars.color.brandd,
                    color: vars.color.white,
                    padding: vars.space.large
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
            background={{ lightMode: 'white', darkMode: 'black' }}
            color={{ lightMode: 'coolGray900', darkMode: 'gray50' }}
            className={styles.installBlock}
          >
            $ npm install{' '}
            <span style={{ whiteSpace: 'nowrap' }}>--save-dev</span>{' '}
            <span style={{ whiteSpace: 'nowrap' }}>@vanilla-extract/css</span>
          </Box>
        </ContentBlock>

        <ContentBlock
          withGutters
          size={{ mobile: 'standard', desktop: 'large' }}
        >
          <Box paddingTop="xxlarge" paddingBottom="xxxlarge">
            <Columns space="xxlarge" collapseOnTablet>
              <Feature title="Type-safe static CSS">
                All styles generated at build time — just like{' '}
                <Link
                  to="https://sass-lang.com"
                  size="small"
                  underline="always"
                  inline
                >
                  Sass
                </Link>
                ,{' '}
                <Link
                  to="https://lesscss.org"
                  size="small"
                  underline="always"
                  inline
                >
                  LESS
                </Link>
                , etc, but with the power of TypeScript.
              </Feature>

              <Feature title="First-class theming">
                Create a single global theme or create multiple themes, all with
                type-safe token contracts.
              </Feature>

              <Feature title="Portable styling">
                Works with any front-end framework, with integrations for
                webpack, esbuild and Vite.
              </Feature>

              <Feature title="Build it your way">
                Use high-level abstractions like{' '}
                <Link to="#" size="small" underline="always" inline>
                  Sprinkles
                </Link>{' '}
                and{' '}
                <Link to="#" size="small" underline="always" inline>
                  Dessert Box
                </Link>{' '}
                — or create and publish your own!
              </Feature>
            </Columns>
          </Box>
        </ContentBlock>

        <Box
          position="relative"
          paddingY="xxxlarge"
          background={{ lightMode: 'blue100', darkMode: 'gray900' }}
          className={styles.skewedContainerSecondary}
        >
          <ContentBlock
            withGutters
            size={{ mobile: 'standard', desktop: 'large' }}
          >
            <Stack space="xxlarge">
              <Heading level="3" align="center">
                <Box color={{ lightMode: 'blue900', darkMode: 'gray50' }}>
                  Leverage the full power of CSS &amp; TypeScript
                </Box>
              </Heading>
              <Box paddingX="large">
                <Text align="center" color="neutral">
                  <Box color={{ lightMode: 'blue800', darkMode: 'gray400' }}>
                    Write maintainable CSS at scale without sacrificing platform
                    features. Variables, selectors, pseudo&#8209;classes,
                    media/feature queries, keyframes, font&#8209;face rules and
                    global styles are all supported.
                  </Box>
                </Text>
              </Box>

              <Code
                language="tsx"
                title="styles.css.ts"
                background={{ lightMode: 'coolGray800', darkMode: 'black' }}
              >
                {dedent`
                import { style } from '@vanilla-extract/css';

                export const className = style({
                  display: 'flex',
                  flexDirection: 'column',
                  selectors: {
                    '&:nth-child(2n)': {
                      background: 'aliceblue'
                    }
                  },
                  '@media': {
                    'screen and (min-width: 768px)': {
                      flexDirection: 'row'
                    }
                  }
                });
              `}
              </Code>
            </Stack>
          </ContentBlock>
        </Box>

        <Stack space="xxxlarge">
          <Box paddingTop="xxxlarge">
            <ContentBlock
              withGutters
              size={{ mobile: 'standard', desktop: 'large' }}
            >
              <Columns space="xlarge" collapseOnTablet alignY="center">
                <Stack space="xxlarge">
                  <Heading level="3" align="center">
                    Type-safe theming
                  </Heading>
                  <Text align="center" color="secondary">
                    Define themes with deeply nested token contracts, then let
                    TypeScript do the heavy lifting. Never mess up a variable
                    again.
                  </Text>
                </Stack>

                <Code
                  language="tsx"
                  errorTokens={['brandd']}
                  title="styles.css.ts"
                  background={{ lightMode: 'coolGray900', darkMode: 'gray900' }}
                >
                  {dedent`
                    import { createTheme, style } from '@vanilla-extract/css';
                      
                    export const [themeClass, vars] = createTheme({
                      color: {
                        brand: 'aquamarine',
                        accent: 'honeydew',
                      },
                    });

                    export const brandedSection = style({
                      backgroundColor: vars.color.brandd,
                    });
                  `}
                </Code>
              </Columns>
            </ContentBlock>
          </Box>

          <ContentBlock
            withGutters
            size={{ mobile: 'standard', desktop: 'large' }}
          >
            <Columns space="xxlarge" collapseOnTablet alignY="center" reverseX>
              <Stack space="xxlarge">
                <Heading level="3" align="center">
                  Variables, the way they were intended
                </Heading>
                <Text align="center" color="secondary">
                  Define and consume variables without abstraction. All of your
                  favourite CSS variable patterns can be translated to
                  vanilla-extract.
                </Text>
              </Stack>
              <Code
                language="tsx"
                title="styles.css.ts"
                background={{ lightMode: 'coolGray900', darkMode: 'gray900' }}
              >
                {dedent`import { style, createVar } from '@vanilla-extract/css';

      const shadowColor = createVar();

      export const shadow = style({
        boxShadow: ${'`0 0 10px ${shadowColor}`'},
        selectors: {
          '.light &': {
            vars: { [shadowColor]: 'black' }
          },
          '.dark &': {
            vars: { [shadowColor]: 'white' }
          },
        }
      });`}
              </Code>
            </Columns>
          </ContentBlock>

          <ContentBlock
            withGutters
            size={{ mobile: 'standard', desktop: 'large' }}
          >
            <Columns space="xlarge" collapseOnTablet alignY="center">
              <Stack space="xxlarge">
                <Heading level="3" align="center">
                  Organise your styles with ease
                </Heading>
                <Text align="center" color="secondary">
                  Group style variants into separate collections, then look them
                  up by name. No awkward naming conventions required.
                </Text>
              </Stack>

              <Code
                language="tsx"
                title="styles.css.ts"
                background={{ lightMode: 'coolGray900', darkMode: 'gray900' }}
              >
                {dedent`
                import { styleVariants } from '@vanilla-extract/css';

                export const background = styleVariants({
                  primary: { background: 'navy' },
                  secondary: { background: 'blue' },
                  tertiary: { background: 'aqua' },
                });

                export const color = styleVariants({
                  neutral: { color: 'black' },
                  secondary: { color: 'coolGray' },
                  link: { color: 'blue' },
                });
              `}
              </Code>
            </Columns>
          </ContentBlock>

          <ContentBlock
            withGutters
            size={{ mobile: 'standard', desktop: 'large' }}
          >
            <Columns space="xxlarge" collapseOnTablet alignY="center" reverseX>
              <Stack space="xxlarge">
                <Heading level="3" align="center">
                  Generate real stylesheets
                </Heading>
                <Text align="center" color="secondary">
                  Best-in-class developer experience without the runtime cost.
                  Don’t ship a dynamic CSS engine to your users — ship regular
                  CSS.
                </Text>
              </Stack>
              <Code
                language="css"
                title="output.css"
                background={{ lightMode: 'coolGray900', darkMode: 'gray900' }}
              >
                {dedent`
                  :root {
                    --space-none__ya5b7b0: 0;
                    --space-small__ya5b7b1: 4px;
                    --space-medium__ya5b7b2: 8px;
                    --space-large__ya5b7b3: 12px;
                  }

                  .Hero_container__1ldw6lo0 {
                    padding: var(--space-medium__ya5b7b2);
                  }
                `}
              </Code>
            </Columns>
          </ContentBlock>
        </Stack>

        <Box paddingY="xxxlarge">
          <Box
            position="relative"
            paddingY="xxxlarge"
            background={{ lightMode: 'blue100', darkMode: 'gray900' }}
            className={styles.skewedContainerSecondary}
          >
            <ContentBlock size="large" withGutters>
              <Stack space="xxlarge" align="center">
                <Columns space="xxlarge" collapseOnTablet alignY="center">
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
                  <Tweet
                    handle="@okonetchnikov"
                    name="Andrey Okonetchnikov"
                    avatar="https://pbs.twimg.com/profile_images/1327698924698804226/io9KdHy__400x400.jpg"
                    url="https://twitter.com/okonetchnikov/status/1389450586257514505"
                  >
                    I really don’t want to rework my whole workshop but this is
                    looking so good I almost have to 😅🤔
                  </Tweet>
                </Columns>
                <Columns space="xxlarge" collapseOnTablet alignY="center">
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
                  <Tweet
                    handle="@kossnocorp"
                    name="Sasha Koss"
                    avatar="https://pbs.twimg.com/profile_images/979030533719064576/rD33B86M_400x400.jpg"
                    url="https://twitter.com/kossnocorp/status/1390214753352658946"
                  >
                    vanilla-extract is the first CSS-in-JS library that excites
                    me and convinces me to ditch CSS modules in favor of it.
                    TypeScript support is superb 👌
                    <br />
                    <br />
                    Looking forward to rewriting my design system using it!
                  </Tweet>
                </Columns>
              </Stack>
            </ContentBlock>
          </Box>
        </Box>

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
      <Text size="small" color="secondary">
        {children}
      </Text>
    </Stack>
  </Box>
);
