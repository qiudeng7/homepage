<script setup>
const { data: rawMarkdown } = await useFetch('/api/content/demo')
</script>

<template>
  <div class="comparison-page">
    <header>
      <h1>MDC Prose 组件对比演示</h1>
      <p class="subtitle">
        左侧：启用 Prose 组件（默认）| 右侧：关闭 Prose 组件
      </p>
    </header>

    <div class="comparison-grid">
      <!-- 开启 Prose -->
      <section class="panel">
        <div class="panel-header">
          <span class="badge active">Prose: ON</span>
          <code>&lt;MDC :value="content" /></code>
        </div>
        <div class="panel-content prose-on">
          <MDC :value="rawMarkdown" />
        </div>
      </section>

      <!-- 关闭 Prose -->
      <section class="panel">
        <div class="panel-header">
          <span class="badge inactive">Prose: OFF</span>
          <code>&lt;MDC :value="content" :prose="false" /></code>
        </div>
        <div class="panel-content prose-off">
          <MDC :value="rawMarkdown" :prose="false" />
        </div>
      </section>
    </div>

    <section class="explanation">
      <h2>区别说明</h2>
      <dl>
        <dt>启用 Prose（默认）</dt>
        <dd>
          MDC 使用 Prose* 组件包裹每个 Markdown 元素。
          例如：ProseH1、ProseP、ProseCode。
          你可以全局或局部自定义这些组件的样式和行为。
        </dd>

        <dt>关闭 Prose</dt>
        <dd>
          MDC 直接渲染原始 HTML 标签。
          例如：h1、p、pre+code。
          没有额外的组件包装层，DOM 更干净，但你无法通过覆盖 Prose 组件来定制渲染。
        </dd>
      </dl>
    </section>
  </div>
</template>

<style scoped>
.comparison-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

.subtitle {
  color: #666;
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.panel {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.active {
  background: #dcfce7;
  color: #166534;
}

.badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.panel-content {
  padding: 1.5rem;
}

/* Prose ON: 给 Prose 组件加一些可见样式 */
.prose-on :deep(.prose-h1) {
  color: #1e40af;
  border-bottom: 3px solid #3b82f6;
  padding-bottom: 0.5rem;
}

.prose-on :deep(.prose-h2) {
  color: #1e3a5f;
  margin-top: 1.5rem;
}

.prose-on :deep(.prose-blockquote) {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin-left: 0;
  background: #eff6ff;
  padding: 1rem;
  border-radius: 0 4px 4px 0;
}

.prose-on :deep(.prose-code) {
  background: #1e293b;
  color: #e2e8f0;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.875em;
}

.prose-on :deep(.prose-pre) {
  background: #1e293b;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

.prose-on :deep(.prose-pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.prose-on :deep(.prose-table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.prose-on :deep(.prose-thead) {
  background: #f1f5f9;
}

.prose-on :deep(.prose-th),
.prose-on :deep(.prose-td) {
  border: 1px solid #cbd5e1;
  padding: 0.5rem 0.75rem;
  text-align: left;
}

/* Prose OFF: 原始 HTML 标签样式 */
.prose-off :deep(h1) {
  color: #1e40af;
  border-bottom: 3px solid #3b82f6;
  padding-bottom: 0.5rem;
}

.prose-off :deep(h2) {
  color: #1e3a5f;
  margin-top: 1.5rem;
}

.prose-off :deep(blockquote) {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin-left: 0;
  background: #eff6ff;
  padding: 1rem;
  border-radius: 0 4px 4px 0;
}

.prose-off :deep(code:not(pre code)) {
  background: #1e293b;
  color: #e2e8f0;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.875em;
}

.prose-off :deep(pre) {
  background: #1e293b;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

.prose-off :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.prose-off :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.prose-off :deep(thead) {
  background: #f1f5f9;
}

.prose-off :deep(th),
.prose-off :deep(td) {
  border: 1px solid #cbd5e1;
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.explanation {
  background: #f9fafb;
  padding: 2rem;
  border-radius: 8px;
}

.explanation dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem 2rem;
}

.explanation dt {
  font-weight: 600;
  color: #111827;
}

.explanation dd {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
}

.explanation dd code {
  background: #e5e7eb;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-size: 0.875em;
}

@media (max-width: 900px) {
  .comparison-grid {
    grid-template-columns: 1fr;
  }
  .explanation dl {
    grid-template-columns: 1fr;
  }
}
</style>
