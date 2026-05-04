/**
 * 从 Markdown 文本中提取 heading，生成 TOC 链接
 */
export interface TocLink {
  id: string
  text: string
  depth: number
}

export function useToc() {
  const links = ref<TocLink[]>([])
  const activeId = ref('')

  /**
   * 解析 markdown 文本，提取 heading 列表
   */
  function parseMarkdownHeadings(markdown: string): TocLink[] {
    const headings: TocLink[] = []
    const lines = markdown.split('\n')

    for (const line of lines) {
      const match = line.match(/^(#{1,3})\s+(.+)$/)
      if (match) {
        const depth = match[1].length
        const text = match[2].trim()
        // 生成 slug：小写，空格转连字符，去除特殊字符
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
        headings.push({ id, text, depth })
      }
    }

    return headings
  }

  /**
   * 设置 IntersectionObserver 来跟踪当前可见的 heading
   */
  function observeHeadings() {
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        // 找到当前最可见的 heading
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]

        if (visible) {
          activeId.value = visible.target.id
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    )

    // 观察所有 heading
    links.value.forEach(link => {
      const el = document.getElementById(link.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }

  /**
   * 滚动到指定 heading
   */
  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return {
    links,
    activeId,
    parseMarkdownHeadings,
    observeHeadings,
    scrollTo,
  }
}
