---
title: Raw Content API
description: 获取博客文章的原始 Markdown 内容和元数据
method: GET
path: /api/raw/{slug}
---

# Raw Content API

获取博客文章的原始 Markdown 内容和元数据，用于外部系统集成或数据导出。

## 请求

```
GET /api/raw/{slug}
```

### 路径参数

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| slug | string | 是 | 文章 slug，对应 `content/blog/{slug}.md` |

## 响应

### 成功响应 (200 OK)

```json
{
  "title": "示例文章",
  "date": "2026-05-04T00:00:00.000Z",
  "description": "Common Markdown 的所有基本语法演示",
  "tags": ["markdown", "demo"],
  "content": "# 示例文章\n\n这是一段普通的段落文字..."
}
```

### 响应字段

| 字段 | 类型 | 描述 |
|------|------|------|
| title | string | 文章标题 |
| date | string (ISO 8601) | 发布日期 |
| description | string \| null | 文章描述 |
| tags | string[] \| null | 标签列表 |
| content | string | 原始 Markdown 内容 |

### 错误响应

#### 404 Not Found

```json
{
  "statusCode": 404,
  "statusMessage": "Not found"
}
```

## 示例

```bash
# 获取 demo 文章的原始内容
curl https://your-domain.com/api/raw/demo
```

## 实现代码

```typescript
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') || ''
  const path = `/blog/${slug}`

  const page = await queryCollection(event, 'blog')
    .path(path)
    .select('title', 'rawbody', 'date', 'description', 'tags')
    .first()

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  return {
    title: page.title,
    date: page.date,
    description: page.description,
    tags: page.tags,
    content: page.rawbody,
  }
})
```