# 轩辕剑叁外传：天之痕（2000 大宇 DOMO 经典版）— Web 在线网页版 & 完整硬盘整理版

大宇资讯 DOMO 小组 2000 年经典单机武侠角色扮演游戏巅峰巨作《轩辕剑叁外传：天之痕》（The Legend and Hero of Xuan-Yuan: The Scar of the Sky）官方 v2.03 完整硬盘整理版与 Web 在线网页版。无需实体光盘，浏览器即点即玩，附官方最终补丁（v2.01/2.02/2.03）、全部 108 首原版 MP3 背景音乐、31 个过场动画文件（`video/*.bik` / `*.Ani`）、符鬼小窝程序以及完整 1.39 GiB 整合包 Releases 下载。

🎮 **在线试玩与下载：**
- **浏览器即点即玩 (GitHub Pages)**：[https://kunruiw1991.github.io/tianzhihen-online/](https://kunruiw1991.github.io/tianzhihen-online/)
- **本地程序与元数据归档目录**：[`archive/`](./archive)
- **完整官方 v2.03 硬盘整合包下载 (含 108 首 MP3 音乐与全动画)**：[Releases `tianzhihen-203`](https://github.com/kunruiw1991/tianzhihen-online/releases/tag/tianzhihen-203)

---

## 🌟 核心特性

1. **纯前端免安装在线体验 (100% Client-Side)**
   - 包含经典序章剧场（伏魔山陈辅师徒深入石洞寻昆仑镜、舍身冰封凶兽饕餮）、战斗法术特效模拟与动态剧情推进。
   - 所有静态地图与交互逻辑完全运行于现代浏览器沙盒中，零服务器后端开销。

2. **108 首原版高保真 MP3 背景音乐点播大碟**
   - 完整收录原版游戏内置全部 108 首 MP3 格式音乐（《三个人的时光》、《如忆玉儿曲》、《小雪主题曲》、《女娲石》、《云和山的彼端·隋郡》、《经典战斗曲》等）。
   - 内置 WebAudio 音频旋转黑胶唱片与实时声谱波形显示，支持单曲循环、列表轮播与背景静音播放。

3. **经典「符鬼小窝」五行灵宠养成系统**
   - 完美重现天之痕标志性的符鬼养成：支持 **金、木、水、火、土** 五行灵根自由切换。
   - 110 幅原版符鬼表情贴图（开心、愤怒、哭泣、贪睡、施法），支持投喂鼠儿果、金创药、雪莲与炼妖精怪，实时更新饱食度、心情与四维属性，领悟强力五行奇术。

4. **经典 `.cm` 存档实时解析器与浏览器 IndexedDB 自动云端持久化**
   - 深度解析游戏二进制存档格式（`swd3e/Data/0.cm` ~ `7.cm`），实时查看队伍主角姓名、等级、气血/灵力、四维属性、装备法宝与银两。
   - 每 5 分钟定时自动持久化至浏览器本地 `IndexedDB`，支持一键导出/导入本地 `.cm` 存档文件，告别丢档困扰。

5. **专为 iPad 妙控键盘深度优化**
   - 针对 iPad Magic Keyboard 等无独立 `Esc` 键的外接键盘，**深度映射 `` ~ / ` `` (Backquote) 键与 `Esc` 完全等效**（兼容中英文输入法状态下的 `~`、`` ` ``、`·`、`～`）。

---

## 📁 目录结构

| 路径 | 说明 |
| :--- | :--- |
| `index.html` / `app.js` / `style.css` | Web 网页版入口、UI 视觉、序章战斗逻辑、符鬼养成与音频播放器 |
| `audio/` | 精选 7 首最核心原版 MP3 背景音乐（含《三个人的时光》、《如忆玉儿曲》等） |
| `img/ghosts/` | 110 幅原版五行符鬼表情与行走动作帧图 |
| `archive/` | 原始游戏主程序与元数据（含 `swd3e.exe`、`Ghost.exe`、`battle.ffd`、`*.act` 色表、`talk*.dat` 剧本、`MAPS.dat` 地图表等） |
| `archive/Data/` | 原版 `.cm` 存档与系统环境缓存 |
| `archive/GhostPic/` | 原始符鬼小窝 BMP 动画资源与提示音效 |

---

## 📦 本地电脑独立运行指南 (Windows / macOS / Linux)

除了在线体验外，你也可以下载完整整合包在本地高清运行：

### 1. 下载完整游戏包
从 [GitHub Releases (`tianzhihen-203`)](https://github.com/kunruiw1991/tianzhihen-online/releases/tag/tianzhihen-203) 下载 `TianZhiHen-2.03-HDD.zip`（`1.39 GiB`，解压后 `1.70 GB`，SHA-256 校验码：`d555c15514cd21a60755debbbe408090479a45e8a3e6137251b143d495c54b18`）。

### 2. 本地系统运行方式

- **Windows 10 / 11**：
  1. 解压后进入 `MAINDIR/swd3e/` 目录。
  2. 右键 `swd3e.exe` ->「属性」->「兼容性」：勾选「以兼容模式运行这个程序（Windows 98 / Windows Me）」以及「以管理员身份运行」。
  3. 双击 `swd3e.exe` 即可启动游戏；若需符鬼小窝，可单独运行同目录下的 `Ghost.exe`。

- **macOS (Apple Silicon M1/M2/M3/M4)**：
  1. 推荐使用 **CrossOver 24+** 或免费的 **Whisky** (基于 Wine 与 Apple D3DMetal/DXMT)。
  2. 新建 Windows 7 32-bit 容器，将 `MAINDIR/swd3e/` 目录拖入，直接启动 `swd3e.exe` 即可完美原生 60 帧运行。

- **Linux (Steam Deck / Ubuntu / Arch)**：
  1. 安装 Wine：`sudo apt install wine` 或 `sudo pacman -S wine`。
  2. 在解压目录下运行：`WINEPREFIX=~/.wine-swd3e wine swd3e.exe`。

---

## ⌨️ 操作指南

| 键盘按键 / 鼠标 | 功能说明 |
| :--- | :--- |
| `鼠标左键` | 角色行走移动 / 菜单光标选择 / 与场景人物对话 |
| `Space` / `Enter` | 调查场景物品 / 对话推进 / 菜单确认 |
| `ESC` / `~` (`` ` ``) | 呼出系统状态栏 / 退出菜单 / 返回上一级（iPad 键盘优化） |
| `Tab` | 快速切换战斗目标 / 隐藏对话框 |
| `Ctrl` / `Alt` | 战斗加速 / 对话快进 |
