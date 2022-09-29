---
title: parcel
parent: integrations
---

# parcel

A parcel transformer for integrating vanilla-extract with [parcel](https://parceljs.org/).

## Installation

```bash
npm install --save-dev @vanilla-extract/parcel-transformer
```

## Setup

Add the transformer to your parcel configuration.

```json
// .parcelrc
{
  "transformers": {
    "*.css.ts": ["@vanilla-extract/parcel-transformer"]
  }
}
```
