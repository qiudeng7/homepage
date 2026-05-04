<script setup lang="ts">
const route = useRoute()

// 获取所有 worker-api 文档列表
const { data: apiDocs } = await useAsyncData('worker-api-list', () =>
  queryCollection('workerApi').all()
)

// 获取当前文档内容
const slug = computed(() => {
  const s = route.params.slug
  return Array.isArray(s) ? s[0] : s
})

const currentPath = computed(() => {
  if (!slug.value) {
    // 默认显示第一个文档
    const first = apiDocs.value?.[0]
    return first?.path || ''
  }
  return `/worker-api/${slug.value}`
})

const { data: page } = await useAsyncData(() => currentPath.value, () =>
  queryCollection('workerApi').path(currentPath.value).first()
)

// 如果没有找到页面，404
if (!page.value && currentPath.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const { links, activeId, observeHeadings, scrollTo } = useToc()

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
        <div class="sticky top-24 w-48 space-y-6">
          <AvatarProfile />
          
          <nav class="border-t pt-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">API 文档</p>
            <ul class="space-y-1">
              <li v-for="doc in apiDocs" :key="doc.path">
                <NuxtLink
                  :to="doc.path"
                  class="block px-2 py-1.5 text-sm rounded-md transition-colors"
                  :class="{
                    'bg-gray-100 text-gray-900 font-medium': doc.path === currentPath,
                    'text-gray-600 hover:bg-gray-50 hover:text-gray-900': doc.path !== currentPath
                  }"
                >
                  {{ doc.title }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
      </template>

      <UPageHeader
        :title="page.title"
        :description="page.description"
      />

      <UPageBody>
        <!-- API 元数据标签 -->
        <div v-if="page.method || page.path" class="flex items-center gap-3 mb-6">
          <UBadge
            v-if="page.method"
            :label="page.method"
            color="primary"
            variant="subtle"
          />
          <code
            v-if="page.path"
            class="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700"
          >
            {{ page.path }}
          </code>
        </div>

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