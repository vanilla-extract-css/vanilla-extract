# Nuxt 3 Vanilla Extract Example

## Setup

First at the top of the vanilla-extract repo.  
Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

Next at the top directory of the vanilla-extract repo we then need to build the bundles.
```bash
pnpm build
```

Next move to the nuxt example directory
```bash
cd examples/nuxt
```

## Development Server

Start the development server on http://localhost:3000

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
# builds the site
pnpm build
# or pre-renders the site for static hosting
pnpm generate
```

Locally preview production build:

```bash
pnpm preview
```
