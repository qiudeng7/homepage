---
title: Hello API
description: 基础问候接口，用于验证 Cloudflare Pages Functions 是否正常工作
method: GET
endpoint: /api/hello
---

# Hello API

基础问候接口，返回一个简单的 JSON 消息。

## 请求

```
GET /api/hello
```

### 请求参数

无。

## 响应

### 成功响应 (200 OK)

```json
{
  "message": "Hello from Cloudflare Pages Functions!"
}
```

### 响应字段

| 字段 | 类型 | 描述 |
|------|------|------|
| message | string | 问候消息 |

## 示例

```bash
curl https://your-domain.com/api/hello
```

## 实现代码

```typescript
export default defineEventHandler(() => {
  return { message: 'Hello from Cloudflare Pages Functions!' }
})
```