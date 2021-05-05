import { Children, ReactNode } from 'react';
import { Box } from '../';
import { BoxProps } from '../Box/Box';

type Align = 'left' | 'center' | 'right';

const resolveAlign: Record<Align, BoxProps['alignItems']> = {
  left: 'flex-start',
  right: 'flex-end',
  center: 'center',
};

export const Stack = ({
  children,
  space,
  align = 'left',
}: {
  children: ReactNode;
  space: BoxProps['paddingBottom'];
  align?: Align;
}) => {
  const stackItems = Children.toArray(children);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={align !== 'left' ? resolveAlign[align] : undefined}
    >
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
