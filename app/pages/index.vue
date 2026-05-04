<script setup lang="ts">
const { public: { authorName, githubId, avatarSize, motto } } = useRuntimeConfig()
const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog')
    .order('date', 'DESC')
    .all()
)
</script>

<template>
  <UContainer class="py-12">
    <UPage>
      <template #left>
        <div class="flex flex-col items-center gap-3 sticky top-24 w-48">
          <img
            :src="`/api/avatar?id=${githubId}&size=${avatarSize}`"
            :alt="authorName"
            class="w-28 h-28 rounded-full ring-2 ring-gray-200 object-cover"
          />
          <div class="flex flex-col items-center gap-1">
            <span class="text-lg font-bold text-gray-900">{{ authorName }}</span>
            <span class="text-xs text-gray-500 text-center italic leading-relaxed">{{ motto }}</span>
          </div>
        </div>
      </template>

      <UPageBody>
        <h1 class="text-3xl font-bold mb-8">文章列表</h1>
        <div class="space-y-6">
        <article
          v-for="post in posts"
          :key="post.path"
          class="border rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <NuxtLink :to="post.path" class="block">
            <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
            <p v-if="post.description" class="text-gray-600 mb-3">
              {{ post.description }}
            </p>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <time>{{ new Date(post.date).toLocaleDateString('zh-CN') }}</time>
              <span
                v-if="post.tags?.length"
                class="flex gap-2"
              >
                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="bg-gray-100 px-2 py-0.5 rounded"
                >
                  {{ tag }}
                </span>
              </span>
            </div>
          </NuxtLink>
        </article>
      </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
