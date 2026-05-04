<script setup>
const { data: rawMarkdown } = await useFetch('/api/content/demo')
</script>

<template>
  <UContainer class="py-12">
    <UPage>
      <UPageBody>
        <MDC :value="rawMarkdown" />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
