import { ReactNode } from 'react';
import { Box, Stack } from '../system';
import { Link, Text } from '../typography';
import * as styles from './Tweet.css';

interface TweetProps {
  handle: string;
  name: string;
  avatar: string;
  url: string;
  children: ReactNode;
}

export const Tweet = ({ handle, name, avatar, url, children }: TweetProps) => (
  <Link to={url} className={styles.tweetLink}>
    <Box
      padding="xlarge"
      background={{ lightMode: 'white', darkMode: 'black' }}
      className={styles.tweet}
    >
      <Stack space="xlarge">
        <Box display="flex" alignItems="center" style={{ gap: 10 }}>
          <Box
            // borderRadius="full"
            className={styles.avatar}
            background={{ lightMode: 'coolGray100', darkMode: 'black' }}
            style={{
              backgroundImage: `url(${avatar})`,
              backgroundSize: 'cover',
            }}
          />
          <Stack space="medium">
            <Text weight="strong" size="small">
              {name}
            </Text>
            <Text color="secondary" size="small">
              {handle}
            </Text>
          </Stack>
        </Box>
        <Text size="small">{children}</Text>
      </Stack>
    </Box>
  </Link>
);
