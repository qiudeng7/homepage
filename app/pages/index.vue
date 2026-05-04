<script setup lang="ts">
const { origin } = useRequestURL()
const { data: rawMarkdown } = await useFetch(`${origin}/content/demo.md`, {
  responseType: 'text',
  default: () => ''
})
const { links, activeId, parseMarkdownHeadings, observeHeadings, scrollTo } = useToc()

// Markdown 解析后提取 heading
watchEffect(() => {
  if (rawMarkdown.value) {
    links.value = parseMarkdownHeadings(rawMarkdown.value)
  }
})

// 当 links 变化且 DOM 更新后，重新设置 scroll 监听
let cleanupScroll: (() => void) | undefined

watch(links, async () => {
  await nextTick()
  cleanupScroll?.()
  cleanupScroll = observeHeadings()
}, { immediate: true })

onUnmounted(() => {
  cleanupScroll?.()
})
</script>

<template>
  <UContainer class="py-12">
    <UPage>
      <UPageBody>
        <MDC :value="rawMarkdown" />
      </UPageBody>

      <template #right>
        <Toc
          :links="links"
          :active-id="activeId"
          @navigate="scrollTo"
        />
      </template>
    </UPage>
  </UContainer>
</template>
