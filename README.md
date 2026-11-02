# 刘旭 — AI 导演作品集

AI 导演 / AI 影视导演 / AI 视觉设计师的个人作品集。包含个人经历、17 个影像视频、22 张作品海报与成果截图，以及联系方式。

## 本地运行

本仓库使用 Git LFS 保存原始视频。克隆时需要安装并启用 Git LFS。

```bash
git clone https://github.com/3224609776liu-dev/codex--.git
cd codex--
git lfs install
git lfs pull
cd liuxu-portfolio
npm ci
npm run dev
```

构建：

```bash
npm run build
```

## 内容与素材

- 网站代码：`liuxu-portfolio/src`
- 媒体文件：`liuxu-portfolio/public/assets`
- 视频为原始文件，保留原始分辨率、码率与音轨，未重新编码。
- 海报、成果截图和个人照片使用原始素材。
- Git LFS 下载的是真实视频文件。若看到只有数行文字的 `.mp4` 文件，请执行 `git lfs pull`。

项目使用 React、Vite、GSAP 和 React Bits 组件。所有作品与素材仅用于作者个人作品集展示，不另行授予转载或商用许可。

## Cloudflare Pages 免费部署

正式分享地址：`https://www.lxzuopinji.pages.dev`。不带 www 的地址：`https://lxzuopinji.pages.dev`。旧项目 `codex-zuopin` 保留，避免历史分享链接失效。

新项目使用直接上传；`www` 是固定的分支别名。每次更新后，先在仓库根目录执行 `npm run build`，再同步两个入口：

```bash
npx wrangler pages deploy dist --project-name lxzuopinji --branch main
npx wrangler pages deploy dist --project-name lxzuopinji --branch www
```

仅向 GitHub 推送代码不会自动更新新项目，必须执行上述部署。旧项目的 GitHub 自动部署仍保留。

Cloudflare 构建根目录使用仓库根目录，构建命令 `npm run build`，输出目录 `dist`，Node.js 22.12 或更高版本。

Pages 单文件限制为 25 MiB，因此原始视频独立保存于本仓库的 `portfolio-media-v1` GitHub Release。网页的 `/assets/film-0.mp4` 至 `/assets/film-16.mp4` 由 Pages Worker 以同域流式响应转发对应原始视频，支持浏览器分段读取，避免手机和微信直接访问 GitHub 视频下载地址。图片原样复制，视频未重新编码、缩放或压缩。不需要 R2 或付费存储。

更新视频时，需要同时更新 Release 中同名文件。Git LFS 继续用于保存仓库中的原始视频；Release 是线上播放来源。GitHub 的可访问性会影响视频加载速度。

## 三档清晰度播放

播放器默认「自动」，根据浏览器提供的网络信息选择 480p、720p 或 1080p；网络持续卡顿时降低清晰度，网络信息更新或稳定缓冲后再调整。手动选择后锁定该档位，切换保留播放进度、暂停状态及声音设置。

三档为独立生成的 H.264 / AAC 播放副本，存放在 `portfolio-playback-v1` GitHub Release，原始视频仍保存在 `portfolio-media-v1` 与 Git LFS，未被替换。竖屏的清晰度按短边计算，保持原有方向和比例。播放索引为 `liuxu-portfolio/src/video-variants.json`。本地 Vite 开发通过代理读取已部署的播放副本。

点击作品即尝试自动播放；浏览器限制有声自动播放时，先静音播放并提供开启声音按钮；仍被限制时显示点击播放。所有版本通过网站同域流式传输，不让手机跳转 GitHub 下载页。
