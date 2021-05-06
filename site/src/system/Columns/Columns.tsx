import { Children, ReactNode } from 'react';
import { Box, BoxProps } from '../Box/Box';

type AlignY = 'top' | 'center' | 'bottom';

interface Props {
  children: ReactNode;
  space: BoxProps['padding'];
  alignY?: AlignY;
  collapseOnMobile?: boolean;
  collapseOnTablet?: boolean;
}

const resolveAlignY: Record<AlignY, BoxProps['alignItems']> = {
  top: 'flex-start',
  bottom: 'flex-end',
  center: 'center',
};

export const Columns = ({
  children,
  space,
  collapseOnMobile = false,
  collapseOnTablet = false,
  alignY = 'top',
}: Props) => {
  const columns = Children.toArray(children);

  return (
    <Box
      display="flex"
      flexDirection={
        collapseOnMobile || collapseOnTablet
          ? {
              mobile: 'column',
              tablet: collapseOnTablet ? 'column' : 'row',
              desktop: 'row',
            }
          : undefined
      }
      alignItems={resolveAlignY[alignY]}
      marginLeft={
        collapseOnMobile || collapseOnTablet
          ? {
              mobile: 'none',
              tablet: collapseOnTablet ? 'none' : `-${space}`,
              desktop: `-${space}`,
            }
          : `-${space}`
      }
      marginTop={
        collapseOnMobile || collapseOnTablet
          ? {
              mobile: `-${space}`,
              tablet: collapseOnTablet ? `-${space}` : 'none',
              desktop: 'none',
            }
          : undefined
      }
    >
      {columns.map((c, i) => (
        <Box
          paddingLeft={
            collapseOnMobile || collapseOnTablet
              ? {
                  mobile: 'none',
                  tablet: collapseOnTablet ? 'none' : space,
                  desktop: space,
                }
              : space
          }
          paddingTop={
            collapseOnMobile || collapseOnTablet
              ? {
                  mobile: space,
                  tablet: collapseOnTablet ? space : 'none',
                  desktop: 'none',
                }
              : undefined
          }
          style={{ width: '100%', minWidth: 0 }}
          key={i}
        >
          {c}
        </Box>
      ))}
    </Box>
  );
};
