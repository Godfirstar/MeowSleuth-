# 素材清单与命名规范

## A. Figma 分层导出（每镜头 4 层）
每个镜头导出以下文件（透明 PNG）：

- `S01_bg.png` / `S01_ui.png` / `S01_hud.png` / `S01_text.png`
- `S02_bg.png` / `S02_ui.png` / `S02_hud.png` / `S02_text.png`
- ...
- `S06_bg.png` / `S06_ui.png` / `S06_hud.png` / `S06_text.png`

> 推荐尺寸：1920x1080

## B. 音效文件（可先占位）
放到 `assets/sfx/`：
- `ui_click_01.wav`
- `ui_click_02.wav`
- `ui_click_03.wav`
- `radar_scan.wav`
- `alert_hit.wav`
- `whoosh_soft.wav`
- `confirm_tone.wav`

## C. 字体建议（科技感 + 可读性）
- 中文：思源黑体 / HarmonyOS Sans / 阿里巴巴普惠体
- 英文数字：Inter / DIN / Orbitron（标题少量）

## D. 免费素材来源（优先可商用）
> 使用前请再次确认单个资源授权条款。

1. 音效（UI/电子音）
- Pixabay SFX: https://pixabay.com/sound-effects/
- Mixkit SFX: https://mixkit.co/free-sound-effects/

2. 图标（文本/截图/语音/通知）
- IconPark: https://iconpark.oceanengine.com/
- Remix Icon: https://remixicon.com/
- Material Symbols: https://fonts.google.com/icons

3. 背景纹理（噪点/网格）
- Hero Patterns: https://heropatterns.com/
- SVG Backgrounds: https://www.svgbackgrounds.com/

## E. 目录结构建议
```
promo-video/
  assets/
    figma_exports/
    sfx/
    fonts/
  ae/
    build_project.jsx
  script/
    shotlist.md
  captions/
    with_subtitles.srt
  output/
```
