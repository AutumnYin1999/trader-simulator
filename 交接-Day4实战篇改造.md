# 交接文档 · Day4 改造：砍掉 CBBC，做成「三客户定价实战」

> 写给下一个接手的 Claude
> 日期：2026-06-01
> 项目：`trader-simulator` — 游戏化期权教学模拟器（React 单页，主文件 `src/Day1TraderSimulator.jsx` 约 7400 行，所有逻辑在这一个文件）
> 用户：HKBU 学生，**中文沟通**，对话感、清晰、别太学术。这天聊到很累，明确说「CBBC 太难、没精力再打磨」。
> 行号会漂移，**一律用 Grep 按函数名/字符串定位，别信旧行号**。

---

## ⭐ 这份文档要做的「一个大任务」

**把 Day4 从「教 CBBC（牛熊证）」改成「三客户定价实战 / 结业篇」。**

用户决定：**放弃 CBBC**（它不是期权、用不了二叉树计算器、要单独建杠杆+MCE 模型，打磨成本高、用户没精力）。改成让玩家用前面学的 **Day2（普通期权定价）+ Day3（障碍期权定价）** 技能，给 3 位需求各异的客户实战报价。

### 为什么这样改（设计依据，别推翻）
- **全盘复用已有引擎**：`BinomialPricingTool`（vanilla + barrier 两模式）、`getQuoteAnalysis`（vanilla 锚 186）、`getDay3QuoteAnalysis`（barrier 锚 934）、`ProductSelectionPanel`、客户到访/客户反馈面板模式——全都现成，工程量远小于继续打磨 CBBC。
- **学习线已完整**：期权基础(Day1) → 定价(Day2) → 障碍+路径(Day3) → **实战应用(Day4)**。不塞 CBBC 完全 OK。
- **补上 Day4 旧版的短板**：旧 Day4 把"定价"技能丢了（CBBC 不报价），新版正好让计算器重新上场。

### 已和用户敲定的设计决策（来自讨论）
1. **客户深度 = 中等**：每个客户 `选品 + 一个关键决策(报价) + 后果`。不做满级（不每人都披露+多步）。
2. **提示强度 = 减少，给结业感**：客户到访页给完整资料，但 Martin 只给**通用原则**（"先读方向、再读风险承受、再想产品"），**不点名**该选哪个、该报多少。选错给反馈，但不预先剧透。
3. **CBBC 是"藏"不是"删"**：保留 `day4Config` 里的 CBBC 数据（改名归档或注释块），方便以后想捡回来。最小损耗。

---

## 三客户阵容（待细化具体数字，方向已定）

> 全部用现有计算器（普通 Call + 障碍 Call 两模式），**不新增 Put 模式**（保持轻量）。三个客户难度递增、提示递减。

| | 客户 | 需求线索 | 正确产品 | 关键决策 | 考的是 | 提示 |
|---|---|---|---|---|---|---|
| ① | 待定（如"张先生"） | 看涨、要简单、亏损有限、不想要任何附加条件 | 普通 Call | **报价**（对标 vanilla 理论价） | Day2 定价 | 半（开场示范） |
| ② | 待定（如"李小姐"） | 看涨**但嫌普通 Call 贵**、明确愿接受"跌破某线失效"换便宜 | 障碍 Call (down-and-out) | **报价**（对标 barrier 理论价） | Day3 障碍+定价 | 减 |
| ③ | 待定（综合判断客户） | 给需求但**不明说要哪种**，玩家要先判断该上普通还是障碍（看预算/风险线索） | 玩家自己判断 | **先选品再报价** | Day2+Day3 判断力 | 最少 |

- **客户③是结业精华**：前两个客户告诉你要什么产品，第三个不告诉——你得自己从"预算紧不紧、能不能接受敲出"嗅出该上 vanilla 还是 barrier，选对了再报价。
- 每个客户给**各自的参数**（S₀/K/σ/T，障碍客户多给 barrier），让玩家真去算、不是背数字。具体数字下一步细化（见下"待办"）。

### 每个客户的迷你流程
```
客户到访(完整资料 + Martin 通用原则，不点答案)
  → [客户③多一步: 选品]
  → 计算器算理论价 + 盲报(用 Day3 已建好的"报价输入框")
  → 客户反馈(接受/拒绝 + 台词，复用 Day3 的 ClientResponse 模式)
```
全部接待完 → **结业成绩单**（新面板）：逐单评分 + 成交几单 + Martin 总评。

---

## 工程落地指引（给动手的 Claude）

### A. 怎么「藏」CBBC（第一步，和建新版一起做，别单独先做否则 Day4 空洞）
- `day4Config`（Grep `const day4Config`）整块是 CBBC 数据：clientProfile=周女士、suitabilityOptions、products(牛证/熊证/Call/Put)、disclosureItems、market(cbbcLeverage/cbbcCallPrice 等)、marketContext、scoringRules。
- **保留但停用**：建议改名 `day4CbbcConfig_ARCHIVED` 或整体注释，并在顶部留一行"// 已归档：CBBC 内容，2026-06 用户决定 Day4 改定价实战，保留备查"。
- 相关 CBBC 专用面板/函数（Grep）：`Day4SuitabilityPanel`、`Day4MarketRunPanel`(CBBC 版)、`Day4ReportPanel`、`evaluateDay4`、`getDay4MarketResult`、actions 里 `selectSuitability/confirmSuitability/meetDay4Client/toDay4Suitability`、BottomActionBar 与 panels 里所有 `day4_*` 分支。新版 Day4 会替换这些 → 旧的同样归档/注释，别裸删（最小损耗）。

### B. 能直接复用的（省事在这）
- **计算器**：`BinomialPricingTool({ mode, selectedQuote, quoteAnalysis, onUpdateQuote, onUpdateTheoretical })`，`mode="vanilla"`/`"barrier"`。报价输入框已内建（Grep `自己填一个报价`）。
- **报价评价**：`getQuoteAnalysis(quote, theoretical, clientName, clientDesc)`（vanilla）、`getDay3QuoteAnalysis(quote, theoretical)`（barrier）。**建议这次顺手把两者合并成一个** `getQuoteAnalysis(quote, theoretical, { clientName, productType, bands })`，按 productType 出 vanilla/barrier 文案——三客户场景会反复用。
- **客户反馈（后果）页**：Day3 刚建好的 `Day3ClientResponsePanel` 模式（Grep `function Day3ClientResponsePanel`）——头像+姓名+接受/拒绝+台词，直接抄成通用 `ClientResponsePanel`。
- **选品页**：`ProductSelectionPanel`（已参数化 products/title/accent/correctProductId）——客户③用。
- **客户资料页**：`Day3ClientArrivalPanel` 模式（profileRows + 对白）抄成通用版，吃客户场景数据。

### C. 需要新建的（这次的主要工作量）
1. **客户场景数组** `day4Clients = [ {id, profile, taskType:"price"|"judge", correctProduct, mode:"vanilla"|"barrier", params:{spot,strike,barrier?,sigma,maturity}, theoretical(算出来的锚), disclosureKey?, feedbackByOutcome, ...} × 3 ]`。
2. **客户队列调度**：新增 state `currentClientIndex`、`clientResults[]`；每个客户走 `arrival → (judge) → price → response`，结束 `index++`，到 3 进结业成绩单。stage 命名建议 `day4_client1_arrival / day4_client1_price / day4_client1_response / day4_client2_... / day4_scorecard`。或更聪明：用**一组通用 stage + index 驱动**避免写 3×N 个 stage（推荐，省代码）。
3. **结业成绩单面板** `Day4ScorecardPanel`：读 `clientResults`，逐单评分 + 总评 + Martin 总结。
4. 每个客户的**参数与理论价锚点**：用项目自己的二叉树公式预算（验证方法见下）。

### D. 算每个客户理论价的方法（务必和计算器一致）
- 项目公式：`u=e^(σ√Δt), d=1/u, p=(e^(rΔt)−d)/(u−d)`，折现 `e^(−rΔt)`；barrier 按**节点敲出**（`price<=barrier` 归零）。
- vanilla 步数 N=3，barrier 步数 N=4（`BinomialPricingTool` 里 `fixedSteps`）。
- **校准过**：σ16%/T0.08/N3 → 185.94≈186（Day2）；σ30%/T0.25/N4/barrier21000 → vanilla 1111.73 / barrier 934.16（Day3）。新客户换参数后照这个方法重算锚点，让"静态示例/客户期望价"和玩家计算器算出来的对上。

### E. 铁律（历次交接反复强调，别犯）
1. **build 过 ≠ 运行不崩**。`MainPanel` 里 `panels` 对象每次渲染**全量构造所有 stage 的 JSX**，任何 stage 引用未定义变量 → 整个游戏白屏，而 `npm run build` 抓不到。
2. 新增/传 prop **两处一起改**：① 调用处 `xxx={xxx}` ② 函数签名解构 `{ ..., xxx }`。少一处运行时崩。
3. 改完 `npm run build`（在 `trader-simulator/` 下）**且让用户在浏览器实测**，或用 Playwright 实测（见下"验证手段"）。
4. **别裸删**用户的东西，CBBC 归档保留。

---

## 本次会话已经做完的事（Day3，别重复/别破坏）

1. **Day3 数据改成"covid 高波动"情景**：σ 16%→**30%**、期限 1月→**3个月(T0.25)**、`vanillaPremium` 186→**1112**、`premium` 115→**934**。原因：旧 σ16%/1月 在 N=4 下障碍敲出无效（barrier=vanilla），课会废；30%/3月 才让"障碍更便宜"显现（便宜~178）。数据台行情卡 σ 注明真实锚点（2020-02-28 VHSI 32.7）。**Day2 保持 σ16% 平静基线不动**。
2. **Day3 加了「盲报+后果」**：新 `getDay3QuoteAnalysis`（锚 934、障碍味文案）、新 stage `day3_client_response`、新 `Day3ClientResponsePanel`、新 action `toDay3MarketRun`；`confirmDisclosure` Day3 分支改道到客户反馈页；报告加「你的报价/客户状态」，拒绝时显示「未成交·0」。
3. **修了潜伏 bug**：`confirmQuote` 原写死跳 `day2_risk_disclosure`，导致 Day3 报价后错进 Day2。已改成按 stage 区分（Day3 → `day3_risk_disclosure`）。
4. **文案**：删掉全部「贱卖」（Day2+Day3 都改成"交易台损失了利润"），保留「白送」（用户说还行）。
5. **已用 Playwright(Edge headless) 实测 Day3 全流程两遍（报价 1000 成交 / 2000 拒绝），零报错、不白屏、台词随报价变、未成交逻辑正确。**

> ⚠️ `actions.startGame` 当前 = `startDay3`（测试用，直接进 Day3）。**正式发布前要改回 `startDay1`**（Grep `startGame:`）。

---

## 下一步待办（按顺序）

1. **和用户确认三客户的具体设定**：每个客户的姓名、方向、预算/风险线索、正确产品、参数(S₀/K/σ/T/barrier)、理论价锚点。客户③的"判断"线索怎么埋。
2. 决定 stage 用「3×N 写死」还是「通用 stage + index 驱动」（推荐后者，省代码、易扩展到 N 个客户）。
3. 合并/参数化报价评价函数（vanilla+barrier 统一），抽通用 `ClientArrivalPanel` / `ClientResponsePanel`。
4. 归档 CBBC（day4Config + Day4 专用面板/函数/分支），搭新 Day4 队列 + 结业成绩单。
5. `npm run build` + Playwright/浏览器实测整条 Day4。
6. 把本文件状态更新；正式发布前 `startGame` 改回 `startDay1`。

---

## 验证手段（这次摸索出来的，好用）
项目没装浏览器工具。临时 `npm i playwright-core --no-save`，用系统 Edge（`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`）headless 驱动：`chromium.launch({ executablePath: EDGE, headless: true })` → goto `http://127.0.0.1:5174/`（dev server 端口，5173 被占会自动 +1）→ 按钮用 `page.locator('button:has-text("文案")')` 点 → 截图取证。用完卸载、删临时脚本。能端到端点完一整天、抓白屏和文案，比"build 过就算"靠谱得多。

祝顺利。先读 `交接执行书.md`、`项目评审与修改建议.md`、`交接-计算器分层与Day3数据台.md` 补全背景，再动手。
