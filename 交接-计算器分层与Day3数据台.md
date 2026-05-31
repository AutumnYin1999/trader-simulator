# 交接文档 · 计算器分层 + Day3 数据台

> 写给下一个接手的 Claude
> 日期：2026-06-01
> 项目：`trader-simulator-day1` — 游戏化期权教学模拟器（React 单页，主文件 `src/Day1TraderSimulator.jsx` 约 6600 行，所有逻辑在这一个文件）
> 用户：HKBU 学生，**中文沟通**，对话感、清晰、别太学术
> 本文件聚焦「这一个大任务」。项目整体背景见同目录 `交接执行书.md` 与 `项目评审与修改建议.md`，先读那两份。

---

## ⭐ 最新状态（2026-06-01 续会话，必读，写给换电脑后的下一个 Claude）

> 用户已很累，本段是**当前真实进度**。下面「第 1~5 节」是更早的原始计划/历史，做法仍可参考，但**完成情况以本段为准**。

### 这次会话把第一批 + 第二批都做完了，还顺手做了一堆 Day2 体验改造

**全部已通过 `npm run build`。Day2 已由用户在浏览器完整跑通一遍 ✅。Day3 的代码改动已完成，但用户还没在浏览器实测——下一步从 Day3 开始测/调。**

按主题列清单（都在 `src/Day1TraderSimulator.jsx`，**行号已全部漂移，别信旧行号，用 Grep 定位函数名**）：

1. **✅ 第一批·数据台通用化**：`Day2ResearchTerminalPanel` 抽成通用 `ResearchTerminalPanel({ title, accent, taskText, cards, footerHint })`；`Day2ResearchTerminalPanel` / `Day3ResearchTerminalPanel` 是它的薄包装。新增 `day3ResearchCards`（4 张：行情终端 / 🚧障碍合约卡 / 利率公告板 / ⚠️障碍风险卡，后两张带 `isNew` → 渲染「🔓 NEW」徽章）。

2. **✅ 第一批·Day3 数据台 stage**：新增 `day3_research_terminal`（label `09:10 障碍数据台`），插在 `day3_lesson_knock_out` 之后、`day3_lesson_compare_vanilla` 之前。流转：敲出课按钮 → `toDay3ResearchTerminal` → 数据台 → `toDay3CompareVanilla` → 计算器对比。MainPanel `panels` 已注册。

3. **✅ Day2 stage 顺序调整**（用户要求）：改成 **手册更新 → 客户到访 → 产品确认 →【数据台】→ 定价台**（数据台从"见客户前"挪到"产品确认后、定价前"）。涉及：`day2_handbook_updated` 按钮改 `meetDay2Client`、`day2_research_terminal` 按钮改 `toDay2TreeExplainer`（新增 action）、`confirmProduct` 的 day2 分支改成先去 `day2_research_terminal`、时间标签调单调。

4. **✅ Day2 报价台「盲报 + 后果」改造**（用户要求，方案二·市场小涨）：
   - 报价区**删掉所有泄底**：实时评分标签、4 个数值框（教学锚点/模型参考/模拟Payoff/交易台结算）、模拟路径、预估评分。只留报价输入框 + 计算器自己算出的「普通 Call 理论价」。
   - 报价框**默认留空**（`defaultQuote: ""`），没填则底部按钮禁用显示「请先填写报价」（`BottomActionBar` 新增 `selectedQuote` prop + `quoteEntered` 判断）。
   - `getQuoteAnalysis` 五档文案重写成**有真实感的剧情反馈**：过高→客户「我去别家比比」转身离开；偏贵→皱眉勉强成交；合理→爽快成交+Martin 表扬；过低→秒签+Martin 批「你把值 X 点的票贱卖了，白送客户 N 点」（动态插值 theoretical/quote）。
   - 客户反馈页 `Day2ClientResponsePanel` 删掉了「状态条」和「理论价/利润」那行（太剧透），换成中性「报价已发出，等待市场结算」。

5. **✅ Day2 新增市场播放页**（用户要求，仿 Day1）：新组件 `Day2MarketRunPanel` + 新 stage `day2_market_run`（label `09:46 市场结算`）。流程：客户反馈 →「查看市场结算」(`toDay2MarketRun`) →【价格沿 path 自动逐格播放的曲线动画】→「查看报告」(`viewReport`→`evaluateDay2`→report)。接线点：`BottomActionBar` 加 `day2_market_run` 按钮、自动播放 `useEffect` 的 stage 数组加 `day2_market_run`、`marketPathLength` 加 `isDay2Stage` 分支、`viewReport` 的 day2 分支改 `day2_market_run`、mentorText 加 day2_market_run、MainPanel panels 加。未成交（报太高）时结算显示「未成交·0」。

6. **✅ 第二批·合并计算器**：新建 `BinomialPricingTool({ mode, selectedQuote, quoteAnalysis, onUpdateQuote, onUpdateTheoretical })`，`mode="vanilla"`(Day2)/`"barrier"`(Day3)。**删掉了旧的 `VanillaBinomialPricingTool` 和 `BarrierBinomialPricingTool`**。两个 builder（vanilla/barrier）保留、按 mode 选。barrier 模式：参数列多金色「障碍价格」行 + 🔓NEW 徽章、敲出红/绿染色、底部 vanilla vs barrier 对比卡、标题 BARRIER MODE。`Day2TreeExplainerPanel` 用 `mode="vanilla"`、`Day3CompareVanillaPanel` 用 `mode="barrier"`。

7. **✅ 波动率修正（重要金融正确性）**：原 Day2/Day3 数据台 VHSI 写的是 **24%**，但玩家照填算出 ~401，对不上剧情锚点 186。查明 186 对应 σ≈**16%**。已把两天数据台「行情终端」卡 VHSI **24%→16%**（也更符合"平静市场"），并把标签加上 σ 符号（`VHSI 波动率指数 σ`）。验算：σ=16%、T=0.08、N=3 → 理论价 185.94 ≈ 186，终端 payoff 0/0/69/1253 ✓。

8. **✅ 步数 N 锁死**（用户要求）：N 不再是可编辑输入，改成只读展示（「🔒 固定」徽章）。`fixedSteps = isBarrier ? 6 : 3`，默认值即固定值，从 inputMeta 移除了 steps 行。Day2=3 步（还原 186）、Day3=6 步（障碍看清敲出路径）。

### 下一步（明天换电脑后从这里继续）

1. **先在浏览器把 Day3 完整走一遍**（`npm run dev` → http://127.0.0.1:5173/）。重点看合并后的 barrier 计算器：金色障碍行 + 🔓NEW、敲出红节点/红绿连线、vanilla vs barrier 对比卡、N 只读 6 步、**不白屏**（build 过 ≠ 运行安全，见第 1 节白屏教训）。
2. Day3 之后的内容（客户、产品选择、风险披露、市场路径、报告）按需调整——**用户说"之后都从 Day3 开始调整"**。
3. **Day2 别动**（已实测通过）。
4. 可考虑给 Day3 也加一个像 Day2 那样的"盲报/后果"或体验打磨（如果用户提）。
5. 改完照例 `npm run build` + 让用户浏览器实测。

### 工程注意
- 行号全乱了，**一律用 Grep 按函数名/字符串定位**。
- 改 JSX 里 `panels` / `actionSets` 引用的变量时，记得「调用处传入」+「函数签名解构」两处一起改，否则运行时白屏而 build 抓不到。
- `npm run build` 在 `trader-simulator-day1/` 下跑。

---

## 0. 为什么新开会话

上个会话上下文变得很大（反复读 6600 行大文件），导致频繁出现 "tool call could not be parsed"（我生成工具指令时的格式偶发错误，非网络问题）。用户选择「写好交接，新会话干净上下文接手」。所以你现在上下文是干净的，请高效动手。

---

## 1. 本会话已经做完的事（不要重复）

全部已通过 `npm run build`：

1. ✅ **修了入口 bug**：`actions.startGame` 从 `startDay2` 改回 `startDay1`（约 6877 行）。之前为测试临时接到 Day2。
2. ✅ **修了空白屏严重 bug**：`MainPanel`（约 5938 行起的函数签名）和它的调用处（约 6990 行）都漏了 `liveTheoretical` 这个 prop，导致**任何进入游戏的操作都白屏**（`ReferenceError: liveTheoretical is not defined`）。已在两处补上。
   - ⚠️**教训（重要）**：`MainPanel` 内部有个 `panels` 对象，每次渲染会**全量构造所有 stage 的 JSX**。任何一个 stage 引用了未定义变量，整个游戏直接白屏。新增 prop 必须**同时改两处**：① 调用组件时传入 `xxx={xxx}`、② 函数签名解构 `{ ..., xxx }`。少一处就运行时崩，而 **`npm run build` 抓不到这种错**（打包不检查变量是否定义）。所以改完务必让用户在浏览器实测。
3. ✅ **任务 3 披露文案**（Day3 障碍手册、Day4 牛熊证手册、Day2 日终报告各加一句风险披露）。
4. ✅ **Day2 数据台「考验化」改造**（`Day2ResearchTerminalPanel`，约 3634 行）：
   - 删掉了每张卡的「填表提示」(card.hint 渲染块) 和底部「参数速查表」（直接给答案的黄色块）
   - 任务说明改成「S₀（标的现价）、K（行权价）、T（年化期限）、r（无风险利率）、σ（年化波动率）」，并强调「资料卡只给原始行情，不给现成答案」
   - 保留每张卡的**数据行**（玩家要自己从数据里对应、手填）
5. ✅ **Day2 计算器 `VanillaBinomialPricingTool` 默认值改成最小值**（约 4069 行）：spot 1000 / strike 1000 / rate -5 / sigma 1 / maturity 0.02 / steps 1。玩家必须自己从数据台抄真实参数填进来。

---

## 2. 本次大任务：目标与已确认的设计决策

用户的产品直觉：**Day3 = Day2 + barrier 那一层**。希望「同一个熟悉的计算器，到 Day3 长出障碍价参数」，并且 **Day3 数据台也比 Day2 多一层障碍维度**，让 Day3 内容明显比 Day2 多、有「解锁/进阶」感。同时顺便去掉两个组件的代码重复。

### 现状（两个高度重复的组件）

| | Day2 `VanillaBinomialPricingTool` (4067-4315) | Day3 `BarrierBinomialPricingTool` (4317-4483) |
|---|---|---|
| 所在 stage | `day2_tree_explainer`（`Day2TreeExplainerPanel` 4560 行）| `day3_lesson_compare_vanilla`（`Day3CompareVanillaPanel` 5052 行）|
| 参数 | spot,strike,rate,sigma,maturity,steps（6）| 同样 6 个 **+ barrier**（7）|
| steps 上限 | 3 | 6 |
| builder | `buildVanillaBinomialToolTree` (~3890) | `buildBarrierBinomialToolTree` (3969)，是 vanilla 的**超集**（多算 barrierValue、knocked、links.alive）|
| 树渲染 | 节点显示 payoff/optionValue，无染色 | 节点显示 KO YES/NO + 红/绿染色，links 按 alive 染色 |
| 底部 | **报价输入区**（selectedQuote 联动评分，Day2 专有）| **vanilla vs barrier 对比卡**（两个理论价并排）|
| 默认值 | 已改最小值 | 仍是真实值（21500 等）— 待改最小值 |
| 联动 | 有 `onUpdateTheoretical` 把理论价回传父组件 | 无 |

### 已和用户确认的设计决策

1. **计算器合并成一个组件**，建议签名 `BinomialPricingTool({ mode, selectedQuote, quoteAnalysis, onUpdateQuote, onUpdateTheoretical })`，`mode` = `"vanilla"`(Day2) / `"barrier"`(Day3)。
   - **上部共享**：参数输入列 + u/d/p 信息 + 树 SVG 骨架。
   - **barrier 行的「解锁感」**：mode=barrier 时参数列多一行「障碍价格」，这一行用**金色高亮** + 一个 **「🔓 今日新增 / NEW」徽章**（用户选定的方案：高亮行+NEW徽章，不要动画）。
   - **树渲染按 mode 分支**：barrier 模式显示敲出红染色（沿用现有 4426-4452 的节点渲染 + 4412-4423 的 links 染色）；vanilla 模式沿用现有简单节点。
   - **底部按 mode 分支**：vanilla 模式渲染 Day2 报价输入区（现 4255-4312，依赖 selectedQuote/quoteAnalysis/onUpdateQuote/marketPreview/pricingPreview，并保留 `教学锚点/模型参考` 等）；barrier 模式渲染对比卡（现 4455-4478）。
   - **builder 选择**：mode=barrier 用 barrier builder，vanilla 用 vanilla builder（或统一用 barrier builder——它是超集——但 vanilla 模式别显示 barrier 相关字段，且注意 vanilla 没有 barrier 参数时不要让节点误判 knocked；最稳妥是保留两个 builder 按 mode 选）。
   - **steps 上限**：vanilla 3 / barrier 6（保留差异，放进 mode 判断）。
   - **`onUpdateTheoretical` 联动**：只在 vanilla 模式需要（Day2 报价评分联动）。barrier 模式不传即可（effect 里已判空）。
2. **默认值都设最小值**（玩家自己填）。barrier 模式的 barrier 默认值也用其最小值（inputMeta 里 barrier 的 min，现为 1000）。
3. **数据台合并成通用组件**：把 `Day2ResearchTerminalPanel`(3634) 改成 `ResearchTerminalPanel({ title, accent, taskText, cards })`，Day2 与 Day3 传不同数据。`researchCards`(3574) 留给 Day2，新增 `day3ResearchCards`。
4. **Day3 新增数据台 stage** `day3_research_terminal`，插在 **`day3_lesson_knock_out` 之后、`day3_lesson_compare_vanilla`（计算器）之前**——让「查 barrier 参数 → 紧接着填计算器」连贯（这正是 Day2 没做好、被用户吐槽的断裂点，Day3 一步到位）。
5. **期限**：Day2 = 1 个月（T≈0.08）、Day3 = 3 个月（T=0.25）。资料卡里写这些**真实值**让玩家查；计算器默认仍是最小值占位。
6. **Day3 数据台也是最小值进计算器**，玩家从 Day3 数据台查参数（含 barrier）自己填。

### Day3 数据台的 4 张资料卡（已和用户敲定方向）

| 卡 | 图标 | 内容要点 | 真实数据来源 |
|---|---|---|---|
| 行情终端 | 📈 | 现价 S₀ 21,500；VHSI σ（可调高到 ~24%+，铺垫「高波动→更易敲出」）| `vhsi_history.csv` |
| **障碍合约卡（新·核心）** | 🚧 | 产品 Down-and-Out Call；行权价 K 22,000；**障碍价 Barrier 21,000 ←玩家要查的新参数**；敲出类型「向下触障即失效」；**期限 T≈0.25（3 个月）**；可放真实期权链片段 | `option_chain_current.csv` |
| 利率公告板 | 🏦 | r = 2%（HIBOR 参考）| 教学值 |
| **障碍风险卡（新）** | ⚠️ | 障碍 21,000 距现价 21,500 仅约 2.3%，很近 → 容易敲出；真实参照：2020-03 恒指崩到约 21,700，这种障碍会被打穿；要点「障碍设得离现价越近，越便宜但越容易敲出」| `hsi_2020_covid.csv` |

→ 4 张里「障碍合约卡」「障碍风险卡」是 Day3 全新内容，其余两张复用 Day2 风格。延续 Day2「不给现成答案、不写填表提示、不放速查表」的考验风格。

---

## 3. 建议的执行顺序（分两批，各自 build + 让用户浏览器实测）

> ✅✅ 注：下面第一批、第二批**都已在 2026-06-01 续会话完成**（详见顶部「⭐ 最新状态」）。以下保留作做法参考。

**第一批（低风险，先做）✅ 已完成：数据台通用化 + Day3 数据台 stage**
1. 把 `Day2ResearchTerminalPanel` 重构为通用 `ResearchTerminalPanel({ title, accent, taskText, cards })`；让 Day2 的渲染处（MainPanel 里 `day2_research_terminal:` 那行，约 5992）传入 Day2 的 `researchCards` 和原任务文案。
2. 新增 `day3ResearchCards` 数据（见上表 4 张卡）。
3. `day3Config.stages` 新增 `day3_research_terminal`（label 用 09:10 一类、保证时间顺序不倒退；mentor 写一句「障碍产品定价前先查障碍价等参数」）。
4. 在 Day3 stage 流转里插入：`day3_lesson_knock_out → day3_research_terminal → day3_lesson_compare_vanilla`。需要改：① stage 顺序数组（如果有的话，搜 `day3_market_run` 出现的 `1164` 行附近可能有 fullWidth/顺序数组，确认）；② 对应的「下一步」action（搜 `setCurrentStage("day3_lesson_compare_vanilla")` 的上一步跳转，改成先去 research_terminal）；③ MainPanel 的 `panels` 里新增 `day3_research_terminal: <ResearchTerminalPanel .../>`；④ BottomActionBar / 推进按钮链路。
5. `npm run build` + 让用户在浏览器从 Day3 走一遍。

**第二批（高风险，后做）✅ 已完成：合并计算器**
6. 新建 `BinomialPricingTool({ mode, ... })`，把 Vanilla 和 Barrier 两个组件的共享骨架抽出来，差异用 `mode` 分支（参数行、barrier 高亮+NEW、树染色、底部、steps 上限、builder、默认最小值）。
7. 把 `Day2TreeExplainerPanel`(4560) 里的 `<VanillaBinomialPricingTool .../>`(4603) 换成 `<BinomialPricingTool mode="vanilla" .../>`（保留它的 selectedQuote/quoteAnalysis/onUpdateQuote/onUpdateTheoretical 四个 prop）。
8. 把 `Day3CompareVanillaPanel`(5052) 里的 `<BarrierBinomialPricingTool />`(5092) 换成 `<BinomialPricingTool mode="barrier" />`。
9. 删掉旧的两个组件函数（确认无其他引用后）。
10. Barrier 默认值改最小值；Day3 期限资料卡 3 个月。
11. `npm run build` + 让用户浏览器实测 Day2 计算器（报价联动还在不在）和 Day3 计算器（barrier 高亮行、NEW 徽章、敲出红节点、对比卡都正常）。

> 如果第二批合并风险评估下来太高/收益不值，可与用户商量退一步：**不物理合并组件**，只给 `BarrierBinomialPricingTool` 加 barrier 高亮行+NEW 徽章、改默认最小值、改期限。可见效果一样，代码去重放弃。先问用户。

---

## 4. 工作规范（必须遵守）

1. 每改完一批跑 `npm run build`，**且让用户在浏览器实测**（build 过 ≠ 运行时不崩，见上面 liveTheoretical 教训）。
2. 新增/传递 prop 时，**调用处传入** 和 **函数签名解构** 两处一起改。
3. 完成后在 `交接执行书.md` 和 `项目评审与修改建议.md` 标记，并更新本文件状态。
4. **不要改** 教学剧情路径 `dayNConfig.market.path`、**不要改** `scoringRules` 结构。
5. 视觉统一：复用 `TerminalCard`/`TerminalHeader`/`cn()`，不引新 UI 库。
6. **降低 parse 报错**：把「大段中文讲解」和「工具调用」尽量分开发；工具调用参数写简洁；不要无谓重复读大文件。

---

## 5. 关键代码位置速查（本任务相关）

- builder：`buildVanillaBinomialToolTree` ~3890；`buildBarrierBinomialToolTree` 3969
- 计算器：`VanillaBinomialPricingTool` 4067；`BarrierBinomialPricingTool` 4317
- 公式讲解：`BinomialFormulaPanel` 4485（Day2 用）
- Day2 计算器宿主：`Day2TreeExplainerPanel` 4560（含公式panel + 计算器，stage `day2_tree_explainer`）
- Day3 计算器宿主：`Day3CompareVanillaPanel` 5052（stage `day3_lesson_compare_vanilla`）
- Day2 数据台：`Day2ResearchTerminalPanel` 3634；其数据 `researchCards` 3574
- Day2 数据台 stage 配置：`day2_research_terminal` 约 333；MainPanel 渲染约 5992
- Day3 stages：608-677
- MainPanel 函数：约 5938（签名解构）；调用处约 6990
- actions/stage 跳转：6840-6940 一带；`startGame` 约 6877

祝顺利。先读 `交接执行书.md` 和 `项目评审与修改建议.md`，再动手；不确定先读代码，不要猜。
