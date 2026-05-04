<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog')
    .order('date', 'DESC')
    .all()
)
</script>

<template>
  <UContainer class="py-12 max-w-[1400px]">
    <UPage>
      <template #left>
        <AvatarProfile />
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

      <template #right>
        <div class="w-48" />
      </template>
    </UPage>
  </UContainer>
</template>
