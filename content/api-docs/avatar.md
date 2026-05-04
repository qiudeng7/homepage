---
title: Avatar API
description: 获取 GitHub 用户头像，支持自定义尺寸和缓存
method: GET
endpoint: /api/avatar
---

# Avatar API

获取 GitHub 用户头像，支持自定义尺寸和缓存控制。

## 请求

```
GET /api/avatar?id={githubId}&size={size}
```

### 请求参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| id | string | 否 | `85886906` | GitHub 用户 ID |
| size | string | 否 | `256` | 头像尺寸（像素） |

## 响应

### 成功响应 (200 OK)

返回 PNG/JPEG 图片二进制数据。

### 响应头

| 头字段 | 值 |
|--------|-----|
| Content-Type | `image/png` 或 `image/jpeg` |
| Cache-Control | `public, max-age=86400` |

## 示例

```bash
# 获取默认头像
curl https://your-domain.com/api/avatar

# 获取指定用户的大尺寸头像
curl https://your-domain.com/api/avatar?id=85886906&size=512
```

## 实现代码

```typescript
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()

  const githubId = (query.id as string) || config.public.githubId
  const size = (query.size as string) || config.public.avatarSize

  const response = await fetch(`https://avatars.githubusercontent.com/u/${githubId}?v=4&size=${size}`)
  const buffer = await response.arrayBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type': response.headers.get('content-type') || 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  })
})
```