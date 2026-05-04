<script setup lang="ts">
const route = useRoute()

const { data: scripts } = await useAsyncData('scripts-list', () =>
  queryCollection('scripts').all()
)

const slug = computed(() => {
  const s = route.params.slug
  return Array.isArray(s) ? s[0] : s
})

const currentPath = computed(() => {
  if (!slug.value) {
    const first = scripts.value?.[0]
    return first?.path || ''
  }
  return `/scripts/${slug.value}`
})

// 无 slug 时自动跳转到第一个脚本
if (!slug.value && scripts.value?.[0]) {
  await navigateTo(scripts.value[0].path, { replace: true })
}

const { data: page } = await useAsyncData(() =>
  queryCollection('scripts').path(currentPath.value).first()
)

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
            <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">运维脚本</p>
            <ul class="space-y-1">
              <li v-for="doc in scripts" :key="doc.path">
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