import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
  loader: glob({ base: './docs', pattern: '**/*.mdx' }),
  schema: z.object({
    title: z.string(),
    parent: z.string().optional(),
  }),
});

export const collections = { docs };
