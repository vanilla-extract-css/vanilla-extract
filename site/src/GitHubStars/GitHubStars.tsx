import { useEffect, useState } from 'react';
import { Box } from '../system';
import Text from '../Typography/Text';

const Star = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    focusable="false"
    fill="currentColor"
    width={16}
    height={16}
  >
    <path d="M23 9c-.1-.4-.4-.6-.8-.7l-6.4-.9-2.9-5.8c-.3-.7-1.5-.7-1.8 0L8.2 7.3l-6.3 1c-.4 0-.7.3-.9.7-.1.4 0 .8.3 1l4.6 4.5-1.1 6.4c-.1.4.1.8.4 1 .2 0 .4.1.6.1.2 0 .3 0 .5-.1l5.7-3 5.7 3c.3.2.7.1 1.1-.1.3-.2.5-.6.4-1l-1.1-6.4 4.6-4.5c.3-.2.4-.6.3-.9zm-6.7 4.4c-.2.2-.3.6-.3.9l.8 4.9-4.4-2.3c-.3-.2-.6-.2-.9 0l-4.4 2.3.9-4.9c0-.3-.1-.7-.3-.9L4.1 10 9 9.3c.3 0 .6-.3.8-.5L12 4.3l2.2 4.4c.1.3.4.5.8.5l4.9.7-3.6 3.5z" />
  </svg>
);

export const GitHubStars = () => {
  const [stars, setStars] = useState<string | null>(null);

  useEffect(() => {
    const getCount = async () => {
      const res = await fetch(
        `https://api.github.com/repos/seek-oss/vanilla-extract`,
      );
      const { stargazers_count: count } = await res.json();

      let starCount = null;
      if (typeof count === 'number') {
        starCount =
          Math.abs(count) > 999
            ? `${(Math.sign(count) * (Math.abs(count) / 1000)).toFixed(1)}k`
            : `${Math.sign(count) * Math.abs(count)}`;
      }
      setStars(starCount);
    };
    getCount();
  }, []);

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        focusable="false"
        fill="currentColor"
      >
        <path
          d="M12.006 2a10 10 0 00-3.16 19.489c.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341a2.648 2.648 0 00-1.11-1.463c-.908-.62.068-.608.068-.608a2.1 2.1 0 011.532 1.03 2.13 2.13 0 002.91.831 2.137 2.137 0 01.635-1.336c-2.22-.253-4.555-1.11-4.555-4.943a3.865 3.865 0 011.03-2.683 3.597 3.597 0 01.098-2.647s.84-.269 2.75 1.026a9.478 9.478 0 015.007 0c1.909-1.294 2.747-1.026 2.747-1.026a3.592 3.592 0 01.1 2.647 3.859 3.859 0 011.027 2.683c0 3.842-2.338 4.687-4.566 4.935a2.387 2.387 0 01.68 1.852c0 1.336-.013 2.415-.013 2.743 0 .267.18.578.688.48A10.001 10.001 0 0012.006 2z"
          fillRule="evenodd"
        />
      </svg>
      <Box
        component="span"
        paddingLeft="small"
        style={{ minWidth: 60 }}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
      >
        {stars ? (
          <Box component="span" display="flex" alignItems="center">
            <Star />{' '}
            <Box
              component="span"
              paddingLeft="xsmall"
              style={{ fontSize: '.8em' }}
            >
              {stars}
            </Box>
          </Box>
        ) : (
          <Text size="small" color="strong">
            GitHub
          </Text>
        )}
      </Box>
    </>
  );
};
