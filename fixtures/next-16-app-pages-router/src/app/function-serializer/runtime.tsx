export function runtimeStyled<Tag extends keyof JSX.IntrinsicElements>(
  tag: Tag,
  className: string,
) {
  return function Component(props: React.ComponentProps<Tag>) {
    const Element = tag as any;
    return (
      <Element
        {...props}
        className={[props.className, className].filter(Boolean).join(' ')}
      />
    );
  };
}
