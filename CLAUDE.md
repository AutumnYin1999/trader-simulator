# trader-simulator · CLAUDE.md

## 项目概览

React + Vite 单文件游戏（`src/Day1TraderSimulator.jsx`，~8500 行）。
四天期权教学模拟器：Day1 基础 → Day2 二叉树定价 → Day3 障碍期权 → Day4 三客户实战。

启动：`npm install && npm run dev` → http://127.0.0.1:5173/

## 架构约束（不可随意改动）

- **全部逻辑在单文件**：`src/Day1TraderSimulator.jsx`。不拆文件。
- **定价引擎**：`buildVanillaBinomialToolTree` (line ~4489) / `buildBarrierBinomialToolTree` (line ~4570)。CRR 公式：`u=e^(σ√Δt), d=1/u, p=(e^(rΔt)-d)/(u-d)`，折现 `e^(-rΔt)`。
- **二叉树步数固定**：vanilla N=3（Day2），barrier N=4（Day3/Day4）。`steps` 字段在计算器 UI 里锁定只读。
- **不含股息率 q**：计算器暂用 `growth=exp(r·dt)`（不含 q=3.5%）作为教学简化，故意为之。数据台已注明「今天先不计 q」。若要加 q，改为 `exp((r-q)·dt)`。

## 理论价锚点（已实算验证，r=2%）

| 客户 | 产品 | 参数 | 理论价 |
|------|------|------|--------|
| Day2 王先生 | vanilla | S0=21500/K=22000/σ=16%/T=0.08/N=3 | 185.94 ≈ 186 |
| Day3 陈女士 | vanilla ref | S0=21500/K=22000/σ=30%/T=0.25/N=4 | 1111.73 ≈ 1112 |
| Day3 陈女士 | barrier | 同上 + barrier=21000 | 934.16 ≈ 934 |
| Day4 张先生 | vanilla | S0=24000/K=24500/σ=18%/T=0.08/N=3 | 297.06 ≈ 297 |
| Day4 李小姐 | barrier | S0=24000/K=24500/barrier=23000/σ=28%/T=0.25/N=4 | 980.77 ≈ 981 |
| Day4 何先生 | barrier | S0=25000/K=25500/barrier=23500/σ=32%/T=0.25/N=4 | 1184.20 ≈ 1184 |

## 已知 Bug

_无未修复 bug。_

## 报价评分区间（不要随意改数字）

**Day2 vanilla（theoretical=186）**：`fairLow=+4, fairHigh=+34, rejectAbove=+74`（绝对值）  
**Day3 barrier（theoretical=934）**：`fairHigh=×1.183, rejectAbove=×1.398`（相对倍数）  
**Day4 vanilla**：同 Day2 区间（+4/+34/+74）  
**Day4 barrier**：同 Day3 区间（×1.183/×1.398）

## 市场路径（教学固定路径，不是随机的）

| Day | Path | 敲出？ | 最终价 |
|-----|------|--------|--------|
| Day1 | [21500,21800,22100,22400] | N/A | 22400（涨，Call ITM） |
| Day2 | [21500,21680,21940,22140] | N/A | 22140（涨，Call OTM→微 ITM） |
| Day3 | [21500,21820,21460,20950,21680,22400] | ✅ 第4点20950≤21000 | 22400（但已敲出） |
