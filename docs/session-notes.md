# Session Notes

## 当前状态（2026-06-02）

**全游戏逻辑审计完成，所有已知 bug 已修复并提交。**

---

## 审计结论（完整）

### 已验证正确

| 模块 | 结论 |
|------|------|
| Day1–Day3 二叉树公式 | CRR 实现正确，所有锚点实算匹配 |
| Day1–Day3 风险披露多选题 | 各天正确项 + 1 误导项，答案合理 |
| Day1–Day3 产品选择逻辑 | 合理 |
| Day2–Day3 报价评分区间 | 与 pnl 逻辑自洽 |
| Day3 市场路径敲出判断 | path[3]=20950≤21000 → knockedOut=true ✅ |
| Day1–Day2 市场结算 | payoff/deskPnl 逻辑正确 ✅ |
| Day4 三客户产品判断 + 评分 | 合理 ✅ |

### 已修复 Bug（本次会话全部）

1. **Day3 clientPnl 固定值** → 改用 `selectedQuote` 实算
2. **Day2 数据台文案** → Merton 改为「含股息定价时需扣除」
3. **Day3 市场面板 label** → 「期权费」改为「参考理论价」
4. **Day3 too_low status** → 去掉「交易台损失了利润」（敲出时 desk 盈利）
5. **披露按钮无门槛** → 加 `disclosureReady`（须勾全正确项 + 未勾误导项）
6. **理论价格全部改为引擎实算** → Day2/Day3/Day4 的 theoretical/premium/vanillaPremium 全改为 `buildVanillaBinomialToolTree` / `buildBarrierBinomialToolTree` 在 config 覆盖块里实算，放在 line ~4665
7. **Day2 理论价 0 守卫** → `Math.round(vanillaPrice) >= 1` 防极端参数覆盖

---

## 架构笔记

- config 覆盖块（line ~4665）：在两个定价引擎函数定义之后、`checkDay2Params` 之前，模块级直接赋值覆盖 config 里的 hardcoded 占位值。
- `liveTheoretical` 初始值从 `day2Config.quoteRules.theoreticalPrice` 读取，该值在模块加载时已被实算覆盖。

---

## 开放问题

- 待推送：本地 main 已有 3 个新提交，用 `git push origin main:feature/game-logic-fixes` 推到独立分支再开 PR
