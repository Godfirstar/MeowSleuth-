# 反诈雷达 2.5D 动效宣传片（30–45s）制作包

本目录包含：

1. `script/shotlist.md`：逐镜头脚本（S01~S06）
2. `ae/build_project.jsx`：After Effects 一键搭建项目结构脚本（自动建 MAIN + S01~S06 子合成、镜头时长、转场占位、风险分数表达式）
3. `assets/manifest.md`：素材清单 + 命名规范 + 免费可商用资源来源
4. `captions/with_subtitles.srt`：字幕版本示例（可选）

---

## 目标规格
- 成片：1920x1080 / 30fps / 30–45s
- 风格：黑底留白、克制发光、丝滑镜头、强节奏 UI 音效
- 工具链：Figma 分层 → After Effects 动效 → Premiere/AE 输出

## 你现在可以直接做的事
1. 在 Figma 按 `assets/manifest.md` 输出命名好的分层 PNG
2. 打开 AE，运行 `ae/build_project.jsx`
3. 按 `script/shotlist.md` 填充每个镜头素材并加关键帧
4. 替换占位音效，导出 MP4（有/无字幕两版）

## 导出建议
- 编码：H.264
- 码率：15–25 Mbps
- 音频：AAC 320kbps
- 输出：
  - `output/反诈雷达_无字幕.mp4`
  - `output/反诈雷达_字幕版.mp4`
