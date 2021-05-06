import { ReactNode } from 'react';
import { Box, Stack } from '../system';
import Link from '../Typography/Link';
import Text from '../Typography/Text';
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
      borderRadius="large"
      background={{ lightMode: 'white', darkMode: 'gray900' }}
      className={styles.tweet}
    >
      <Stack space="xlarge">
        <Box display="flex" alignItems="center" style={{ gap: 10 }}>
          <Box
            borderRadius="full"
            className={styles.avatar}
            background={{ lightMode: 'gray100', darkMode: 'gray800' }}
            style={{
              backgroundImage: `url(${avatar})`,
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
