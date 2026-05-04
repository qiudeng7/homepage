---
title: 安装 K3s
description: 一键安装轻量级 Kubernetes 发行版 K3s，包含国内镜像加速和常用配置
---

# 安装 K3s

K3s 是 Rancher 开发的轻量级 Kubernetes 发行版，适合边缘计算、CI/CD 和小型生产环境。

## 快速安装

```bash
# 使用国内镜像加速
curl -sfL https://rancher-mirror.oss-cn-beijing.aliyuncs.com/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -

# 验证安装
sudo kubectl get nodes
```

## 常用配置

### 使用 containerd 作为容器运行时（默认）

```bash
curl -sfL https://get.k3s.io | sh -s - server \
  --docker \
  --write-kubeconfig-mode 644
```

### 禁用默认组件

```bash
curl -sfL https://get.k3s.io | sh -s - server \
  --disable traefik \
  --disable servicelb \
  --disable metrics-server
```

### 使用外部数据库（高可用）

```bash
curl -sfL https://get.k3s.io | sh -s - server \
  --datastore-endpoint "mysql://user:pass@tcp(192.168.1.1:3306)/k3s"
```

## 添加节点

```bash
# 在 master 节点获取 token
sudo cat /var/lib/rancher/k3s/server/node-token

# 在 worker 节点执行
curl -sfL https://get.k3s.io | K3S_URL=https://<master-ip>:6443 K3S_TOKEN=<token> sh -
```

## 卸载

```bash
/usr/local/bin/k3s-uninstall.sh
```