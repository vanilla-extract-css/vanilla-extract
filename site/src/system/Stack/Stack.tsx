import { Children, ReactNode } from 'react';
import { Box } from '../';
import { BoxProps } from '../Box/Box';

export const Stack = ({
  children,
  space,
  align,
}: {
  children: ReactNode;
  space: BoxProps['paddingBottom'];
  align?: BoxProps['alignItems'];
}) => {
  const stackItems = Children.toArray(children);

  return (
    <Box display="flex" flexDirection="column" alignItems={align}>
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
