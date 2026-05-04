<script setup lang="ts">
defineProps<{
  title: string
  items: { path: string; title: string }[]
  currentPath: string
}>()
</script>

<template>
  <nav class="border-t pt-4">
    <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">{{ title }}</p>
    <ul class="space-y-1">
      <li v-for="doc in items" :key="doc.path">
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
</template>