<script setup lang="ts">
import type { TocLink } from '~/composables/useToc'

const props = defineProps<{
  links: TocLink[]
  activeId: string
  level?: number
}>()

const emit = defineEmits<{
  navigate: [id: string]
}>()

function onClick(id: string) {
  emit('navigate', id)
}

const isRoot = computed(() => (props.level ?? 0) === 0)
const nonTitleLinks = computed(() => props.links.filter(link => link.depth !== 1))
</script>

<template>
  <nav v-if="isRoot" class="toc">
    <p class="toc-title">OUTLINE</p>
    <ul v-if="nonTitleLinks.length" class="toc-list">
      <li
        v-for="link in nonTitleLinks"
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
        <Toc
          v-if="link.children?.length"
          :links="link.children"
          :active-id="activeId"
          :level="(level ?? 0) + 1"
          @navigate="onClick"
        />
      </li>
    </ul>
  </nav>
  <ul v-else class="toc-list">
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
      <Toc
        v-if="link.children?.length"
        :links="link.children"
        :active-id="activeId"
        :level="(level ?? 0) + 1"
        @navigate="onClick"
      />
    </li>
  </ul>
</template>

<style scoped>
.toc {
  position: sticky;
  top: 6rem;
  max-height: calc(100vh - 8rem);
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
}

.toc-item {
  position: relative;
  margin: 0;
  padding: 0;
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

.toc-item.toc-active > .toc-link {
  color: var(--ui-primary);
  font-weight: 500;
}

.toc-depth-2 > .toc-link {
  color: var(--ui-text);
  opacity: 0.8;
}

.toc-depth-3 {
  padding-left: 0.75rem;
}

.toc-depth-4 {
  padding-left: 1.5rem;
}

.toc-depth-5 {
  padding-left: 2.25rem;
}

.toc-depth-6 {
  padding-left: 3rem;
}

@media (max-width: 1024px) {
  .toc {
    display: none;
  }
}
</style>
