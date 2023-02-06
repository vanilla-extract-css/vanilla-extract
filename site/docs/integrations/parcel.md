---
title: Parcel
parent: integrations
---

# Parcel

A Parcel transformer for integrating vanilla-extract with [Parcel](https://parceljs.org/).

## Installation

```bash
npm install --save-dev @vanilla-extract/parcel-transformer
```

## Setup

Add the transformer to your Parcel configuration.

```json
// .parcelrc
{
  "transformers": {
    "*.css.ts": ["@vanilla-extract/parcel-transformer"]
  }
}
```
