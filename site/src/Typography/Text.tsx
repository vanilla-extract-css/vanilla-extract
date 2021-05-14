import { ReactNode, ElementType } from 'react';
import classnames from 'classnames';
import { Box } from '../system';
import * as styles from './typography.css';
import { atoms, Atoms } from '../system/styles/atoms.css';

const colorMap = {
  neutral: { lightMode: 'coolGray700', darkMode: 'gray100' },
  strong: { lightMode: 'coolGray900', darkMode: 'gray100' },
  code: { lightMode: 'white' },
  link: { lightMode: 'coolGray700', darkMode: 'gray100' },
  secondary: { lightMode: 'coolGray500', darkMode: 'gray400' },
  highlight: { lightMode: 'pink500' },
} as const;

interface TextStyleProps {
  size?: keyof typeof styles.text;
  color?: keyof typeof colorMap;
  weight?: keyof typeof styles.weight;
  align?: Atoms['textAlign'];
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
