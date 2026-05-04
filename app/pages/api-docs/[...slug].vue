<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

// 获取所有 API 文档列表
const { data: apiDocs } = await useAsyncData('api-docs-list', () =>
  queryCollection('apiDocs').all()
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
  return `/api-docs/${slug.value}`
})

// 无 slug 时自动跳转到第一个文档
if (!slug.value && apiDocs.value?.[0]) {
  await navigateTo(apiDocs.value[0].path, { replace: true })
}

const { data: page } = await useAsyncData(() =>
  queryCollection('apiDocs').path(currentPath.value).first()
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
          <!-- 头像区域（内联 AvatarProfile 内容，避免嵌套 sticky 冲突） -->
          <div class="flex flex-col items-center gap-3 w-48">
            <a
              :href="`https://github.com/${config.public.githubUsername}`"
              target="_blank"
              rel="noopener noreferrer"
              class="relative group"
            >
              <img
                :src="`/api/avatar?id=${config.public.githubId}&size=${config.public.avatarSize}`"
                :alt="config.public.authorName"
                class="w-28 h-28 rounded-full ring-2 ring-gray-200 object-cover transition-all group-hover:brightness-50"
              />
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <UIcon name="i-lucide-github" class="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </a>
            
            <div class="flex flex-col items-center gap-1">
              <span class="text-lg font-bold text-gray-900">{{ config.public.authorName }}</span>
              <span class="text-xs text-gray-500 text-center italic leading-relaxed">{{ config.public.motto }}</span>
            </div>
          </div>
          
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
        <div v-if="page.method || page.endpoint" class="flex items-center gap-3 mb-6">
          <UBadge
            v-if="page.method"
            :label="page.method"
            color="primary"
            variant="subtle"
          />
          <code
            v-if="page.endpoint"
            class="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700"
          >
            {{ page.endpoint }}
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