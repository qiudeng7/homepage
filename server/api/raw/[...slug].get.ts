export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') || ''
  const path = `/blog/${slug}`

  const page = await queryCollection(event, 'blog')
    .path(path)
    .select('title', 'rawbody', 'date', 'description', 'tags')
    .first()

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  return {
    title: page.title,
    date: page.date,
    description: page.description,
    tags: page.tags,
    content: page.rawbody,
  }
})
