import { Children, type ReactNode } from 'react';
import { Box } from '../';
import type { BoxProps } from '../Box/Box';
import {
  mapResponsiveValue,
  type ResponsiveValue,
} from '../styles/sprinkles.css';

const alignToFlexAlign = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
} as const;

export const Stack = ({
  children,
  space,
  align,
}: {
  children: ReactNode;
  space: BoxProps['paddingBottom'];
  align?: ResponsiveValue<'left' | 'center' | 'right'>;
}) => {
  const stackItems = Children.toArray(children);
  const alignItems = align
    ? mapResponsiveValue(align, (value) => alignToFlexAlign[value])
    : undefined;

  return (
    <Box display="flex" flexDirection="column" alignItems={alignItems}>
      {stackItems.map((item, index) => (
        <Box
          key={index}
          paddingBottom={index !== stackItems.length - 1 ? space : undefined}
        >
          {item}
        </Box>
      ))}
    </Box>
  );
};
