import { ReactNode, ElementType } from 'react';
import classnames from 'classnames';
import { Box } from '../system';
import * as styles from './typography.css';
import { atoms, AtomProps } from '../system/Box/Box';

const colorMap = {
  neutral: { lightMode: 'gray700', darkMode: 'white' },
  strong: { lightMode: 'gray900', darkMode: 'white' },
  code: { lightMode: 'white' },
  link: { lightMode: 'gray700', darkMode: 'white' },
  secondary: { lightMode: 'gray500', darkMode: 'gray400' },
  highlight: { lightMode: 'pink500' },
} as const;

interface TextStyleProps {
  size?: keyof typeof styles.text;
  color?: keyof typeof colorMap;
  weight?: keyof typeof styles.weight;
  align?: AtomProps['textAlign'];
  baseline?: boolean;
  type?: Exclude<keyof typeof styles.font, 'brand' | 'heading'>;
}

export interface TextProps extends TextStyleProps {
  component?: ElementType;
  children: ReactNode;
}

export const useTextStyles = ({
  size = 'standard',
  color = 'neutral',
  weight = 'regular',
  type = 'body',
  align,
  baseline = true,
}: TextStyleProps) =>
  classnames(
    styles.font[type],
    styles.text[size].base,
    atoms({ color: colorMap[color], textAlign: align }),
    styles.weight[weight],
    {
      [styles.text.standard.trims]: baseline,
    },
  );

export default ({
  component = 'span',
  size,
  color,
  weight,
  align,
  baseline = true,
  type,
  children,
}: TextProps) => {
  return (
    <Box
      component={component}
      display="block"
      className={useTextStyles({ size, color, weight, type, align, baseline })}
    >
      {children}
    </Box>
  );
};
