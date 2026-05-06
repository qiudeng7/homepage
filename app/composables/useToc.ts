/**
 * 从 Markdown 文本中提取 heading，生成 TOC 链接
 */
export interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
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
      const match = line.match(/^(#{1,6})\s+(.+)$/)
      if (match) {
        const depth = match[1].length
        const text = match[2].trim()
        headings.push({ id: slugify(text), text, depth })
      }
    }

    return headings
  }

  /**
   * 给 DOM 中的 heading 注入 id（MDC 默认不带 id）
   */
  function injectHeadingIds() {
    if (typeof document === 'undefined') return

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    headings.forEach(h => {
      if (!h.id) {
        const text = h.textContent?.trim() || ''
        h.id = slugify(text)
      }
    })
  }

  /**
   * 扁平化提取所有 link（包括嵌套 children）
   */
  function flattenLinks(links: TocLink[]): TocLink[] {
    const result: TocLink[] = []
    for (const link of links) {
      result.push(link)
      if (link.children?.length) {
        result.push(...flattenLinks(link.children))
      }
    }
    return result
  }

  /**
   * 通过 scroll 事件跟踪当前阅读位置对应的 heading
   */
  function observeHeadings() {
    if (typeof window === 'undefined') return

    injectHeadingIds()

    const updateActive = () => {
      const allLinks = flattenLinks(links.value)
      const headingEls = allLinks
        .map(link => document.getElementById(link.id))
        .filter(Boolean) as HTMLElement[]

      if (headingEls.length === 0) return

      // 以视口顶部往下 120px 为参考线，找到最后一个越过这条线的 heading
      const referenceY = window.scrollY + 120

      let active = headingEls[0]
      for (const h of headingEls) {
        if (h.offsetTop <= referenceY) {
          active = h
        } else {
          break
        }
      }

      activeId.value = active.id
    }

    // RAF 节流
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActive()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateActive() // 初始定位

    return () => window.removeEventListener('scroll', onScroll)
  }

  /**
   * 滚动到指定 heading
   */
  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      activeId.value = id
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
