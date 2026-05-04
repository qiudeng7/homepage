import { getContent } from '~/server/utils/content'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') || 'demo'
  const content = getContent(slug)

  if (!content) {
    throw createError({ statusCode: 404, statusMessage: 'Content not found' })
  }

  return content
})
