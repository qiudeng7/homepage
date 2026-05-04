---
title: 安装 Docker
description: 一键安装 Docker CE，包含国内镜像加速和 Docker Compose
---

# 安装 Docker

Docker 是最流行的容器化平台，以下脚本支持 Ubuntu/Debian 和 CentOS/RHEL。

## Ubuntu / Debian

```bash
# 更新包索引
sudo apt-get update

# 安装依赖
sudo apt-get install -y ca-certificates curl gnupg

# 添加 Docker GPG 密钥
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 添加 Docker 仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 将当前用户加入 docker 组
sudo usermod -aG docker $USER
newgrp docker
```

## CentOS / RHEL

```bash
# 安装依赖
sudo yum install -y yum-utils

# 添加 Docker 仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装 Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 启动并设置开机自启
sudo systemctl start docker
sudo systemctl enable docker
```

## 配置国内镜像加速

```bash
sudo mkdir -p /etc/docker

sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.ccs.tencentyun.com"
  ]
}
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 验证安装

```bash
docker --version
docker compose version
docker run hello-world
```