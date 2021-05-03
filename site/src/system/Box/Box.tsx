import { createElement, AllHTMLAttributes, ElementType } from 'react';
import { createAtomsFn } from '@vanilla-extract/sprinkles/createAtomsFn';
import classnames from 'classnames';
import * as resetStyles from '../styles/reset.css';
import {
  responsiveStyles,
  colorStyles,
  unresponsiveStyles,
} from '../styles/atoms.css';

export const atoms = createAtomsFn({
  ...unresponsiveStyles,
  ...colorStyles,
  ...responsiveStyles,
});

type AtomProps = Parameters<typeof atoms>[0];
export interface BoxProps
  extends Omit<
      AllHTMLAttributes<HTMLElement>,
      'content' | 'height' | 'translate' | 'color' | 'width' | 'cursor'
    >,
    AtomProps {
  component?: ElementType;
}

export const Box = ({
  component = 'div',
  className,
  padding,
  paddingX,
  paddingY,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  margin,
  marginX,
  marginY,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  display,
  alignItems,
  justifyContent,
  flexDirection,
  flexWrap,
  flexGrow,
  flexShrink,
  borderRadius,
  position,
  top,
  bottom,
  left,
  right,
  background,
  color,
  width,
  zIndex,
  opacity,
  pointerEvents,
  cursor,
  ...restProps
}: BoxProps) => {
  const atomClasses = classnames(
    resetStyles.base,
    resetStyles.element[component as keyof typeof resetStyles.element],
    atoms({
      padding,
      paddingX,
      paddingY,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      margin,
      marginX,
      marginY,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      display,
      alignItems,
      justifyContent,
      flexDirection,
      flexWrap,
      flexGrow,
      flexShrink,
      borderRadius,
      position,
      top,
      bottom,
      left,
      right,
      background,
      color,
      width,
      zIndex,
      opacity,
      pointerEvents,
      cursor,
    }),
    className,
  );

  return createElement(component, { className: atomClasses, ...restProps });
};
