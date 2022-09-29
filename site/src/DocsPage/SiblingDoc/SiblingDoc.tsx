import Link from '../../Typography/Link';
import Text from '../../Typography/Text';
import { Chevron } from '../../Chevron/Chevron';
import { Box } from '../../system';

export interface SiblingDocProps {
  title: string;
  route: string;
  direction: 'left' | 'right';
  subtitle?: string;
}
export default ({ title, route, subtitle, direction }: SiblingDocProps) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    paddingTop="xxlarge"
    paddingBottom="xxxlarge"
  >
    <Link to={route}>
      {direction === 'left' ? <Chevron direction="left" /> : null}
      <Box
        component="span"
        display="inline-block"
        marginLeft={direction === 'left' ? 'small' : undefined}
        marginRight={direction === 'right' ? 'small' : undefined}
      >
        <Text component="span" color="secondary" size="small" align={direction}>
          {subtitle}
        </Text>
        {title}
      </Box>
      {direction === 'right' ? <Chevron direction="right" /> : null}
    </Link>
  </Box>
);
