# Auto-FMS-Analyzer

基于无标记视觉技术的 FMS 自动化测评与纠正性训练处方系统

![alt text](https://img.shields.io/badge/license-MIT-blue.svg)
![alt text](https://img.shields.io/badge/frontend-React%2019-61dafb.svg)
![alt text](https://img.shields.io/badge/backend-Python%203.9+-3776ab.svg)
![alt text](https://img.shields.io/badge/AI-Pose%20Estimation-ff69b4.svg)
**Auto FMS Analyzer** 是一款开源、智能、高精度的功能性动作筛查（FMS）自动化系统。通过先进的计算机视觉技术实时捕捉人体姿态，自动完成 **7 项标准 FMS 测试** 的动作识别、关节角度动态计算与专业评分（0-3 分），并提供针对性的改进建议。

系统采用**前后端分离架构**，前端使用 React + TypeScript + Tailwind CSS 提供现代流畅的用户界面，后端基于 MediaPipe Pose 实现高精度姿态检测与角度计算，适合康复医师、运动教练、运动科学研究员以及健身爱好者使用。

## ✨ 核心特性

- **7 项 FMS 完整测试支持**  
  Deep Squat、Hurdle Step、In-line Lunge、Shoulder Mobility、Active Straight Leg Raise、Trunk Stability Push-up、Rotary Stability
- **实时视觉反馈**  
  摄像头实时骨骼追踪 + 侧边栏动态显示各关节角度变化曲线
- **智能评分引擎**  
  基于官方 FMS 标准（Gray Cook 体系）的多维度分析（角度阈值、对称性、深度、稳定性）
- **专业报告生成**  
  测试结束后自动输出得分、问题诊断与个性化改进建议
- **现代 Web 界面**  
  支持桌面与平板，响应式设计，一键开始/结束测试
- **高扩展性**  
  模块化设计，易于接入 Kalman Filter 平滑、Transformer 时序模型、视频录制与云端报告导出

## 🛠 技术架构

### 前端（frontend）
- React 19 + TypeScript
- Vite 构建工具
- Tailwind CSS + shadcn/ui 组件库
- 实时状态管理（Zustand / TanStack Query）

### 后端（backend）
- Python 3.11+
- MediaPipe Pose（高精度人体关键点检测）
- OpenCV（图像处理与摄像头流）
- 模块化评分引擎（每个 FMS 测试独立 Analyzer 类）

### 未来规划（Roadmap）
- Kalman Filter 姿态平滑与遮挡预测
- Transformer 时序动作理解模型
- 视频录制与离线分析
- 报告 PDF/Excel 导出
- 云端模型微调接口

## 🚀 快速开始

### 克隆仓库
```bash
git clone https://github.com/pengjk0-dotcom/Auto-FMS-Analyzer.git
cd Auto-FMS-Analyzer

### 后端启动（Python）
Bashcd backend
pip install -r requirements.txt
python main.py

### 前端启动（React）
cd frontend
npm install
npm run dev

访问 http://localhost:5173 即可使用
