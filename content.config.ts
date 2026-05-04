import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.date(),
        tags: z.array(z.string()).optional(),
        rawbody: z.string(),
      }),
    }),
    apiDocs: defineCollection({
      type: 'page',
      source: 'api-docs/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        method: z.string().optional(),
        path: z.string().optional(),
        rawbody: z.string(),
      }),
    }),
  },
})