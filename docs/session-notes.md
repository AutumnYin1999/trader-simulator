# Session Notes

## 当前状态（2026-06-02）

**全游戏逻辑审计完成，所有已知 bug 已修复并提交。**

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
| Day4 三客户产品判断 | 张=vanilla✅ 李=down_out✅ 何=down_out✅ |
| Day4 评分区间 | vanilla +4/+34/+74；barrier ×1.183/×1.398 ✅ |
| Day4 总评分公式 | avg>=3.5→A, >=2.5→B, >=1.6→C, else D ✅ |

### 已修复 Bug（本次会话）

1. **Day3 clientPnl 固定值**：`getDay3MarketResult()` 移除 `pnl`；`evaluateDay3()` 改用 `clientPnl/deskPnl`；`Day3MarketRunPanel` 和 `Day3ReportPanel` 同步
2. **Day2 数据台文案**：Merton 模型 → 含股息定价时需扣除
3. **Day3 市场面板 label**：「期权费」→「参考理论价」（明确是锚点，不是实际收费）
4. **Day3 too_low status 文案**：「交易台损失了利润」→「交易台利润被压缩」（敲出后 desk 永远盈利，原文不实）
5. **Day2 理论价格 0 bug**：`BinomialPricingTool` 里 `onUpdateTheoretical` 加 `> 0` 守卫，防止极端参数输入覆盖理论价
6. **披露按钮无门槛**：`BottomActionBar` 加 `disclosureReady` prop，要求勾全所有正确选项才解锁按钮（Day1/2/3；Day4 `correctDisclosureIds=[]` 自动通过）

---

## 开放问题

- 待推送：本地 main 已有 2 个新提交，可用 `git push origin main:feature/game-logic-fixes` 推到独立分支再开 PR
