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

Cloudflare 构建根目录使用仓库根目录，构建命令 `npm run build`，输出目录 `dist`，Node.js 22.12 或更高版本。

Pages 单文件限制为 25 MiB，因此原始视频独立保存于本仓库的 `portfolio-media-v1` GitHub Release。网页的 `/assets/film-0.mp4` 至 `/assets/film-16.mp4` 由 Pages Worker 以同域流式响应转发对应原始视频，支持浏览器分段读取，避免手机和微信直接访问 GitHub 视频下载地址。图片原样复制，视频未重新编码、缩放或压缩。不需要 R2 或付费存储。

更新视频时，需要同时更新 Release 中同名文件。Git LFS 继续用于保存仓库中的原始视频；Release 是线上播放来源。GitHub 的可访问性会影响视频加载速度。
