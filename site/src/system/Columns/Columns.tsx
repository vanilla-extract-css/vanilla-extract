import { Children, ReactNode } from 'react';
import { Box } from '../Box/Box';
import {
  mapResponsiveValue,
  ResponsiveValue,
  Space,
} from '../styles/atoms.css';

type AlignY = 'top' | 'center' | 'bottom';

interface Props {
  children: ReactNode;
  space: Space;
  alignY?: ResponsiveValue<AlignY>;
  reverseX?: boolean;
  collapseOnMobile?: boolean;
  collapseOnTablet?: boolean;
}

const alignYToFlexAlign = {
  top: 'flex-start',
  bottom: 'flex-end',
  center: 'center',
} as const;

const negate = (space: Space) =>
  space === 'none' ? ('none' as const) : (`-${space}` as const);

export const Columns = ({
  children,
  space,
  collapseOnMobile = false,
  collapseOnTablet = false,
  reverseX = false,
  alignY = 'top',
}: Props) => {
  const columns = Children.toArray(children);
  const row = reverseX ? 'row-reverse' : 'row';

  return (
    <Box
      display="flex"
      flexDirection={
        collapseOnMobile || collapseOnTablet
          ? {
              mobile: 'column',
              tablet: collapseOnTablet ? 'column' : row,
              desktop: row,
            }
          : undefined
      }
      alignItems={
        alignY
          ? mapResponsiveValue(alignY, (value) => alignYToFlexAlign[value])
          : undefined
      }
      marginLeft={
        collapseOnMobile || collapseOnTablet
          ? ({
              mobile: 'none',
              tablet: collapseOnTablet ? 'none' : negate(space),
              desktop: negate(space),
            } as const)
          : negate(space)
      }
      marginTop={
        collapseOnMobile || collapseOnTablet
          ? {
              mobile: negate(space),
              tablet: collapseOnTablet ? negate(space) : 'none',
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
