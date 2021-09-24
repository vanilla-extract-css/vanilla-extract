---
'@vanilla-extract/recipes': minor
---

Add `RecipeVariants` type to get variants from a recipe.

This type would help consumers easily get the variants type. Useful for typing their components:

```tsx
const textRecipes = recipe({
  variants: {
    size: {
      small: { fontSize: '12px' },
      medium: { fontSize: '16px' },
      large: { fontSize: '24px' },
    },
  },
});

type TextVariants = RecipeVariants<typeof textRecipes>;

type Props = {
  // ... other props
} & TextVariants;

function Text({ size, ...props }: Props) {
  return <div {...props} className={textRecipes({ size })} />;
}

<Text size="small">Awesome text</Text>;
```
