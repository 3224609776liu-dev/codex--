# 风衣人物透明素材

文件：public/assets/walking-cutout-left.png
工具：内置 image_gen（imagegen 技能），未使用 CLI。
原图：用户提供的《黑色风衣男士侧身行走_智能超清+4k.png》。
成品：保留黑风衣、帽子和步行姿态，人物朝画面左侧，透明背景。网页以约 76–90px 高呈现，点击轻跳，减少动态效果模式不播放弹跳。

最终使用的提示词：

Use case: background-extraction. Edit target: supplied photograph of a man in a black long trench coat and baseball cap walking to screen right. Produce a clean full-body cutout of EXACTLY this man, retaining the same clothing, cap, anatomy, walking pose and shoes, but horizontally mirror him so his face, cap brim and walking direction point to screen LEFT. Remove ALL background, floor, cast shadow, text and other elements. Real transparent alpha background, no checkerboard painted into pixels. Render the man as a very dark monochrome photographic silhouette with subtle garment edges; preserve the coat outline and leg separation so he reads clearly when used at only 80 pixels tall on a dark website. One person only, full body and shoes uncut, tightly framed with a small clear margin. This output is the isolated asset only, no layout or website mockup.

## 原地行走序列（2026-11-02）

素材：public/assets/walking-left-cycle.png，3 列 × 2 行透明行走序列。使用内置 image_gen 处理；网页用 CSS 离散帧循环播放，离开视口或页面隐藏时暂停，减少动态效果模式禁用。点击弹性动画保留在父元素。

最终提示词：
Edit target: supplied transparent cutout of left-facing man wearing black baseball cap, long black trench coat, black trousers and black shoes, hands in pockets. Create a production 6-frame walk-cycle sprite sheet of THIS exact man walking in place toward SCREEN LEFT. Layout MUST be 3 equal columns and 2 equal rows (6 cells), all cells exactly same size, no gutters or borders. Frames read left to right then top to bottom, one smooth complete walking cycle with alternating leg contacts and passing poses; modest believable coat sway. Each cell contains one complete figure only, identical character appearance, same head facing left, same scale, SAME anchored hip position and same ground baseline within every cell. Keep ALL shoes and cap fully in every cell, ample margin, no cell overlap. Photographic very dark monochrome silhouette consistent with reference. True transparent alpha background across ALL 6 cells, no floor, no cast shadows, no labels, no text, no extra props. Each cell is a portrait approximately 2:3 rectangle; total sheet aspect ratio 1:1. This is a sprite sheet for tiny 80px tall UI animation, so prioritize identical proportions and clear natural leg alternation, not any website layout.
