<script setup>
const { data: rawMarkdown } = await useFetch('/api/content/demo')
const { links, activeId, parseMarkdownHeadings, observeHeadings, scrollTo } = useToc()

// Markdown 解析后提取 heading
watchEffect(() => {
  if (rawMarkdown.value) {
    links.value = parseMarkdownHeadings(rawMarkdown.value)
  }
})

// 内容渲染完成后启动观察
onMounted(() => {
  const cleanup = observeHeadings()
  onUnmounted(() => cleanup?.())
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
