<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const { links, activeId, parseMarkdownHeadings, observeHeadings, scrollTo } = useToc()

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
  <UContainer class="py-12 max-w-[1400px]">
    <UPage v-if="page">
      <template #left>
        <div class="sticky top-24">
          <AvatarProfile />
        </div>
      </template>

      <div class="mb-4">
        <UButton
          to="/"
          variant="ghost"
          color="neutral"
          icon="i-lucide-arrow-left"
          label="返回"
        />
      </div>

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
