<script setup lang="ts">
const props = defineProps<{
  links: { id: string; text: string; depth: number }[]
  activeId: string
}>()

const emit = defineEmits<{
  navigate: [id: string]
}>()

function onClick(id: string) {
  emit('navigate', id)
}
</script>

<template>
  <nav class="toc">
    <p class="toc-title">Table of Contents</p>
    <ul class="toc-list">
      <li
        v-for="link in links"
        :key="link.id"
        :class="[
          'toc-item',
          `toc-depth-${link.depth}`,
          { 'toc-active': activeId === link.id }
        ]"
      >
        <a
          :href="`#${link.id}`"
          class="toc-link"
          @click.prevent="onClick(link.id)"
        >
          {{ link.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.toc {
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
}

.toc-title {
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ui-text-muted);
  margin: 0 0 0.75rem;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-left: 1px solid var(--ui-border);
}

.toc-item {
  position: relative;
  margin: 0;
  padding: 0;
}

.toc-item::before {
  content: '';
  position: absolute;
  left: -1px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: transparent;
  transition: background 0.2s;
}

.toc-item.toc-active::before {
  background: var(--ui-primary);
}

.toc-link {
  display: block;
  padding: 0.35rem 0.75rem;
  color: var(--ui-text-muted);
  text-decoration: none;
  transition: color 0.2s;
  border-radius: 0 4px 4px 0;
}

.toc-link:hover {
  color: var(--ui-text);
  background: var(--ui-bg-elevated);
}

.toc-active .toc-link {
  color: var(--ui-primary);
  font-weight: 500;
}

.toc-depth-1 {
  font-weight: 500;
}

.toc-depth-2 {
  padding-left: 0.75rem;
}

.toc-depth-3 {
  padding-left: 1.5rem;
}

@media (max-width: 1024px) {
  .toc {
    display: none;
  }
}
</style>
