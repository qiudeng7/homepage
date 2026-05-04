<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const { links, activeId, parseMarkdownHeadings, observeHeadings, scrollTo } = useToc()

// 从 body 提取 heading（Content v3 的 body 是 AST，需要用 toc 字段或手动解析）
// 这里改用 page.value.body 中的 toc 数据
watchEffect(() => {
  if (page.value?.body?.toc?.links) {
    links.value = page.value.body.toc.links
  }
})

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
    <UPage v-if="page">
      <UPageHeader
        :title="page.title"
        :description="page.description"
      />
      
      <UPageBody>
        <ContentRenderer :value="page" />
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
