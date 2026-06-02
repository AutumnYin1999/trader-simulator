# Session Notes

## 当前状态（2026-06-02）

**全游戏逻辑审计已完成。所有已知 bug 已修复并提交。**

---

## 审计结论（完整）

### 已验证正确

| 模块 | 结论 |
|------|------|
| Day1–Day3 二叉树公式 | CRR 实现正确，所有锚点实算匹配 |
| Day1 风险披露多选题 | 3 正确 + 1 误导项，答案全部合理 |
| Day2 风险披露多选题 | 4 正确 + 1 误导项，答案全部合理 |
| Day3 风险披露多选题 | 4 正确 + 1 误导项，答案全部合理 |
| Day1 产品选择逻辑 | vanilla_call 正确；put/direct/barrier 拒绝理由合理 |
| Day3 产品选择逻辑 | down_out_call=A / vanilla_call=B / up_out_call=C / else=D，合理 |
| Day2 报价评分区间 | +4/+34/+74 区间与 deskPnl 逻辑自洽 |
| Day3 市场路径敲出判断 | path[3]=20950≤21000 → knockedOut=true ✅ |
| Day1 市场结算 | payoff=400, netPnl=+214 ✅ |
| Day2 市场结算 | deskPnl=quote-140（用 selectedQuote）✅ |
| Day4 三客户产品判断 | 张=vanilla✅ 李=down_out✅ 何=down_out✅（预算卡进 1184 ≈「一千出头」）|
| Day4 评分区间 | vanilla 同 Day2（+4/+34/+74）；barrier 同 Day3（×1.183/×1.398）✅ |
| Day4 总评分公式 | avg>=3.5→A, >=2.5→B, >=1.6→C, else D，3客户样本验算合理 ✅ |

### 已修复 Bug

**Bug 1（已修复）：Day3 客户净盈亏用固定理论价 934 而非玩家报价**
- `getDay3MarketResult()` 移除 `pnl` 字段（该函数不接收 selectedQuote）
- `evaluateDay3()` 新增 `clientPnl = barrierPayoff - Number(selectedQuote)`、`deskPnl` 字段
- `Day3MarketRunPanel` 加 `selectedQuote` prop，用 `clientPnl` 替换 `result.pnl`
- `Day3ReportPanel` 改用 `score.clientPnl`

**Bug 2（已修复）：Day2 数据台文案「Merton 模型需要」→「含股息定价时需扣除」**

---

## 开放问题

无。审计全部完成，所有 bug 已修复并提交。
