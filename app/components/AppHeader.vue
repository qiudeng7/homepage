<script setup lang="ts">
const route = useRoute()
const isBlog = computed(() => route.path === '/' || route.path.startsWith('/blog'))
const isSubscription = computed(() => route.path.startsWith('/subscription'))
const isScripts = computed(() => route.path.startsWith('/scripts'))
const isApi = computed(() => route.path.startsWith('/api-docs'))
</script>

<template>
  <header class="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
    <UContainer class="max-w-[1400px]">
      <nav class="flex items-center justify-between h-14">
        <NuxtLink to="/" class="text-lg font-bold text-gray-900 hover:text-gray-700 transition-colors">
          秋灯的博客
        </NuxtLink>

        <div class="flex items-center gap-1">
          <UButton
            to="/"
            variant="ghost"
            color="neutral"
            :class="{ 'bg-gray-100': isBlog }"
          >
            博客
          </UButton>
          <UButton
            to="/subscription"
            variant="ghost"
            color="neutral"
            :class="{ 'bg-gray-100': isSubscription }"
          >
            订阅
          </UButton>
          <UButton
            to="/scripts"
            variant="ghost"
            color="neutral"
            :class="{ 'bg-gray-100': isScripts }"
          >
            脚本
          </UButton>
          <UButton
            to="/api-docs"
            variant="ghost"
            color="neutral"
            :class="{ 'bg-gray-100': isApi }"
          >
            API 接口
          </UButton>
        </div>
      </nav>
    </UContainer>
  </header>
</template>