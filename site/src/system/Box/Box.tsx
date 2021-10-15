import { createElement, AllHTMLAttributes, ElementType } from 'react';
import classnames from 'classnames';
import * as resetStyles from '../styles/reset.css';
import { sprinkles, Sprinkles } from '../styles/sprinkles.css';

export interface BoxProps
  extends Omit<
      AllHTMLAttributes<HTMLElement>,
      'content' | 'height' | 'translate' | 'color' | 'width' | 'cursor'
    >,
    Sprinkles {
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
  textAlign,
  maxWidth,
  ...restProps
}: BoxProps) => {
  const atomClasses = classnames(
    resetStyles.base,
    resetStyles.element[component as keyof typeof resetStyles.element],
    sprinkles({
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
      textAlign,
      maxWidth,
    }),
    className,
  );

  return createElement(component, { className: atomClasses, ...restProps });
};
