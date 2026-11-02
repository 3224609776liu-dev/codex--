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
