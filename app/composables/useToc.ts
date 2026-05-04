/**
 * 从 Markdown 文本中提取 heading，生成 TOC 链接
 */
export interface TocLink {
  id: string
  text: string
  depth: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

export function useToc() {
  const links = ref<TocLink[]>([])
  const activeId = ref('')
  let observer: IntersectionObserver | null = null

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
   * 设置 IntersectionObserver 来跟踪当前可见的 heading
   */
  function observeHeadings() {
    if (typeof window === 'undefined') return

    // 先注入 id，确保 observer 能找到元素
    injectHeadingIds()

    // 清理旧的 observer
    if (observer) {
      observer.disconnect()
      observer = null
    }

    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]

        if (visible) {
          activeId.value = visible.target.id
        }
      },
      {
        rootMargin: '-100px 0px -70% 0px',
        threshold: 0,
      }
    )

    // 观察所有 heading（使用 links 中的 id）
    links.value.forEach(link => {
      const el = document.getElementById(link.id)
      if (el) observer!.observe(el)
    })

    // 如果当前没有任何 active，默认高亮第一个
    if (!activeId.value && links.value.length > 0) {
      activeId.value = links.value[0].id
    }
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

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    links,
    activeId,
    parseMarkdownHeadings,
    observeHeadings,
    scrollTo,
  }
}
