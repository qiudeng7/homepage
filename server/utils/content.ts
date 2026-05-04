import contentMap from 'virtual:content-map'

export function getContent(slug: string): string | undefined {
  return contentMap[slug]
}

export function getAllContent(): Record<string, string> {
  return contentMap
}
