export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()

  const githubId = (query.id as string) || config.public.githubId
  const size = (query.size as string) || config.public.avatarSize

  const response = await fetch(`https://avatars.githubusercontent.com/u/${githubId}?v=4&size=${size}`)
  const buffer = await response.arrayBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type': response.headers.get('content-type') || 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  })
})
