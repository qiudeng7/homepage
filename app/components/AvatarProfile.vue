<script setup lang="ts">
const { public: { authorName, githubId, githubUsername, avatarSize, motto } } = useRuntimeConfig()
</script>

<template>
  <div class="flex flex-col items-center gap-3 w-48">
    <a
      :href="`https://github.com/${githubUsername}`"
      target="_blank"
      rel="noopener noreferrer"
      class="relative group"
    >
      <img
        :src="`https://v6.gh-proxy.org/https://avatars.githubusercontent.com/u/${githubId}?v=4&size=${avatarSize}`"
        :alt="authorName"
        class="w-40 h-40 rounded-full ring-2 ring-gray-200 object-cover transition-all group-hover:brightness-50"
      />
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <UIcon name="i-lucide-github" class="w-8 h-8 text-white drop-shadow-lg" />
      </div>
    </a>
    
    <div class="flex flex-col items-center gap-1">
      <span class="text-xl font-bold text-gray-900">{{ authorName }}</span>
      <span class="text-l text-gray-500 text-center italic leading-relaxed">{{ motto }}</span>
    </div>
  </div>
</template>
