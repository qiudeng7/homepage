---
title: Ubuntu 换源
description: Ubuntu APT 源更换为国内镜像，支持 20.04/22.04/24.04
---

# Ubuntu 换源

将 Ubuntu APT 源更换为国内镜像源，大幅提升软件包下载速度。

## 自动换源脚本

```bash
#!/bin/bash

# 备份原配置
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak.$(date +%Y%m%d%H%M%S)

# 检测 Ubuntu 版本
VERSION=$(lsb_release -cs)

# 选择镜像源（默认清华大学）
MIRROR="mirrors.tuna.tsinghua.edu.cn"

case $VERSION in
  focal|jammy|noble)
    sudo tee /etc/apt/sources.list <<EOF
deb https://${MIRROR}/ubuntu/ ${VERSION} main restricted universe multiverse
deb https://${MIRROR}/ubuntu/ ${VERSION}-updates main restricted universe multiverse
deb https://${MIRROR}/ubuntu/ ${VERSION}-backports main restricted universe multiverse
deb https://${MIRROR}/ubuntu/ ${VERSION}-security main restricted universe multiverse
EOF
    ;;
  *)
    echo "不支持的 Ubuntu 版本: ${VERSION}"
    exit 1
    ;;
esac

# 更新索引
sudo apt-get update

echo "换源完成！"
```

## 手动换源（清华镜像）

### Ubuntu 24.04 (noble)

```bash
sudo sed -i 's/archive.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list
sudo sed -i 's/security.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list
sudo apt update
```

### Ubuntu 22.04 (jammy)

```bash
sudo sed -i 's/archive.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list
sudo sed -i 's/security.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list
sudo apt update
```

## 其他镜像源

| 镜像源 | 地址 |
|--------|------|
| 清华大学 | `mirrors.tuna.tsinghua.edu.cn` |
| 阿里云 | `mirrors.aliyun.com` |
| 中科大 | `mirrors.ustc.edu.cn` |
| 华为云 | `repo.huaweicloud.com` |

### 阿里云镜像

```bash
sudo sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list
sudo sed -i 's/security.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list
sudo apt update
```

## 恢复官方源

```bash
sudo cp /etc/apt/sources.list.bak.* /etc/apt/sources.list
sudo apt update
```