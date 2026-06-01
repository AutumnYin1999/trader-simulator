import React, { useEffect, useMemo, useRef, useState } from "react";

const day1Config = {
  day: 1,
  title: "普通期权基础",
  stages: {
    title_screen: {
      label: "开始界面",
      system: "标题画面",
      mentor: "",
    },
    day1_welcome: {
      label: "08:55 第一天上班",
      system: "新人报到",
      mentor:
        "早上好，欢迎来到中环期权交易台。今天是你第一天上班，别紧张，我会一步一步带你读懂客户需求。",
    },
    day1_lesson_basics: {
      label: "09:00 第一课：选择权",
      system: "期权直觉",
      mentor:
        "先别想公式。期权的第一层意思就是“选择权”：买方先付一笔钱，换来未来可以选择要不要交易的权利。",
    },
    day1_intro: {
      label: "09:05 Call 与 Put",
      system: "方向教学",
      mentor:
        "现在记两个方向词就够了：Call 是看涨，Put 是看跌。客户说“我觉得会涨”，你脑子里先亮起 Call。",
    },
    day1_lesson_premium: {
      label: "09:08 期权费",
      system: "成本与最大亏损",
      mentor:
        "买期权不是免费许愿。客户要先支付期权费。好处是，如果判断错了，普通期权买方通常最多亏掉这笔期权费。",
    },
    day1_lesson_vanilla_rule: {
      label: "09:10 普通期权规则",
      system: "到期价格",
      mentor:
        "普通期权像一张到期结算的票。中途价格怎么晃都不会敲出，关键看最后到期那一刻，价格在行权价的哪一边。",
    },
    day1_handbook_updated: {
      label: "09:12 手册更新",
      system: "工作手册同步",
      mentor:
        "见客户之前先打开工作手册看一眼。它不是答案全书，而是你当前阶段可用的规则本。",
    },
    day1_client_arrival: {
      label: "09:15 第一位客户",
      system: "客户需求读取",
      mentor:
        "先看客户方向：她看涨。再看风险需求：她希望下行亏损有限。需要的话打开手册，普通 Call 可能符合这个需求。",
    },
    day1_product_selection: {
      label: "09:20 产品选择",
      system: "产品适当性",
      mentor:
        "产品要同时匹配方向和风险需求。看涨且希望最大亏损有限，通常先考虑普通看涨期权。",
    },
    day1_risk_disclosure: {
      label: "09:25 风险披露",
      system: "风险披露",
      mentor:
        "客户必须理解：期权费可能全部损失，而且看对方向也不代表一定赚钱。不要把产品说成稳赚。",
    },
    day1_market_run: {
      label: "09:30 市场运行",
      system: "市场路径模拟",
      mentor:
        "运行固定市场路径。第一天只看普通期权到期结果，不接真实行情，也不做复杂定价。",
    },
    day1_report: {
      label: "09:45 日终报告",
      system: "交易复盘",
      mentor:
        "好交易员不只看客户有没有赚钱，还要说明产品是否适合客户。结果只是评分的一半。",
    },
    day1_complete: {
      label: "10:00 完成第一天",
      system: "关卡完成",
      mentor:
        "做得不错。第一天的重点是方向匹配、期权费风险和适当性纪律。",
    },
  },
  introCards: [
    {
      id: "call_intro",
      code: "CALL / 看涨",
      title: "普通看涨期权",
      tone: "gold",
      bullets: [
        "适合客户认为标的价格会上涨的情景",
        "买方支付期权费，获得未来按行权价买入的权利",
        "到期价格高于行权价时，Call 才会产生内在价值",
        "买方最大损失通常限于已支付的期权费",
      ],
    },
    {
      id: "put_intro",
      code: "PUT / 看跌",
      title: "普通看跌期权",
      tone: "cyan",
      bullets: [
        "适合客户认为标的价格会下跌的情景",
        "买方支付期权费，获得未来按行权价卖出的权利",
        "到期价格低于行权价时，Put 才会产生内在价值",
        "普通 Put 更像下跌保护，不是保本收益承诺",
      ],
    },
  ],
  handbookEntries: [
    {
      id: "vanilla_core",
      title: "普通期权基础",
      sections: [
        {
          title: "普通 Call",
          bullets: [
            "适合看涨观点",
            "买方支付期权费 premium",
            "到期时，如果最终价格高于行权价，Call 有价值",
            "买方最大损失通常是期权费",
          ],
        },
        {
          title: "普通 Put",
          bullets: [
            "适合看跌观点",
            "买方支付期权费 premium",
            "到期时，如果最终价格低于行权价，Put 有价值",
            "买方最大损失通常是期权费",
          ],
        },
        {
          title: "期权费 Premium",
          bullets: [
            "买方为了获得权利支付的成本",
            "即使判断错误，买方最大损失通常也是这笔期权费",
          ],
        },
        {
          title: "普通期权规则",
          bullets: [
            "普通期权主要看最终到期价格",
            "普通期权不会因为中途价格波动而敲出",
            "今天先不讨论定价模型，只判断方向和风险是否匹配",
          ],
        },
      ],
    },
    {
      id: "suitability_rule",
      title: "适当性规则",
      sections: [
        {
          title: "方向匹配",
          bullets: [
            "客户看涨，通常考虑 Call",
            "客户看跌，通常考虑 Put",
            "产品方向必须先匹配客户观点",
          ],
        },
        {
          title: "风险需求",
          bullets: [
            "客户想控制最大亏损，普通期权比直接买入资产更合适",
            "不要只因为客户想赚钱就推荐高风险产品",
            "好结果不一定代表推荐适合",
          ],
        },
      ],
    },
    {
      id: "risk_disclosure",
      title: "风险披露",
      sections: [
        {
          title: "必须讲清楚",
          bullets: [
            "期权不是保本收益产品",
            "如果市场方向判断错误，期权费可能全部损失",
            "即使方向判断正确，也可能因为涨幅不够而无法覆盖期权费",
            "不要告诉客户“只要市场上涨就一定赚钱”",
          ],
        },
      ],
    },
  ],
  clientProfile: {
    name: "李女士",
    type: "散户投资者",
    marketView: "看涨恒生指数",
    riskTolerance: "中等",
    goal: "想获得上涨收益，但不想承担大额下跌风险",
    budget: "可以支付有限期权费",
    experience: "新手",
    dialogue: [
      "我觉得恒生指数下个月可能会上涨。",
      "但我不想直接买指数，因为我担心万一跌了亏很多。",
      "有没有一种产品，可以让我参与上涨，同时把最大亏损限制住？",
    ],
  },
  products: [
    {
      id: "vanilla_call",
      name: "普通看涨期权",
      term: "Vanilla Call",
      status: "可用",
      description: [
        "适合看涨观点",
        "买方先支付期权费",
        "买方最大损失通常限于期权费",
        "没有敲出风险",
      ],
      feedback:
        "很好。客户看涨，同时希望下行亏损有限，普通看涨期权符合这个需求。",
    },
    {
      id: "vanilla_put",
      name: "普通看跌期权",
      term: "Vanilla Put",
      status: "可用",
      description: [
        "适合看跌观点",
        "买方先支付期权费",
        "买方最大损失通常限于期权费",
        "没有敲出风险",
      ],
      feedback: "这个产品适合看跌观点，但客户现在是看涨恒生指数。",
    },
    {
      id: "direct_index",
      name: "直接买入指数",
      term: "Direct Index Purchase",
      status: "可用",
      description: [
        "完整参与上涨",
        "也完整承担下跌",
        "亏损不限制在期权费内",
      ],
      feedback:
        "直接买入指数确实有上涨敞口，但下行亏损并不限制在期权费内。",
    },
    {
      id: "barrier_option",
      name: "障碍期权",
      term: "Barrier Option",
      status: "未解锁",
      locked: true,
      description: [
        "可能更便宜，但有敲出风险",
        "今天的训练尚未覆盖",
      ],
      feedback: "第一天暂未解锁。Martin 还没有教这个产品。",
    },
  ],
  disclosureItems: [
    {
      id: "premium_fully_lost",
      text: "如果期权到期时没有价值，客户支付的期权费可能全部损失。",
      correct: true,
    },
    {
      id: "max_loss_premium",
      text: "普通期权买方的最大损失通常限于已支付的期权费。",
      correct: true,
    },
    {
      id: "profit_not_guaranteed",
      text: "看涨期权提供上涨敞口，但并不保证一定盈利。",
      correct: true,
    },
    {
      id: "guaranteed_profit",
      text: "只要市场稍微上涨，客户就一定赚钱。",
      correct: false,
    },
  ],
  market: {
    underlying: "恒生指数",
    spot: 21500,
    strike: 22000,
    premium: 186,
    maturity: "1个月",
    path: [21500, 21800, 22100, 22400],
    chartPath: [21500, 21380, 21720, 21640, 21800, 22030, 21920, 22100, 22310, 22220, 22400],
  },
  scoringRules: {
    correctProduct: "vanilla_call",
    correctDisclosureIds: [
      "premium_fully_lost",
      "max_loss_premium",
      "profit_not_guaranteed",
    ],
    misleadingDisclosureId: "guaranteed_profit",
  },
};

const day2Config = {
  day: 2,
  title: "定价柜台",
  stages: {
    day2_intro: {
      label: "09:00 晨会",
      system: "定价晨会",
      mentor:
        "昨天你学会了普通期权是什么。今天换一个更像真实交易台的问题：这个期权到底该报多少钱？",
    },
    day2_lesson_pricing_anchor: {
      label: "09:03 第一课：报价锚点",
      system: "为什么要定价",
      mentor:
        "先记住一句话：报价不能凭感觉。理论价格像交易台的锚，先告诉你这个产品大概值多少钱。",
    },
    day2_lesson_tree_paths: {
      label: "09:06 第二课：二叉树路径",
      system: "上涨与下跌分叉",
      mentor:
        "二叉树不是在预言市场，而是在把未来拆成几种可能。每一步只问两个问题：如果上涨会怎样？如果下跌会怎样？",
    },
    day2_lesson_backward_price: {
      label: "09:09 第三课：从未来倒推",
      system: "收益与理论价格",
      mentor:
        "到期收益先在最后一层算出来，再从未来倒推回今天。今天我们用简化版，只理解直觉，不考复杂公式。",
    },
    day2_handbook_updated: {
      label: "09:12 手册更新",
      system: "二叉树规则同步",
      mentor:
        "见客户之前，先打开工作手册看一下。今天的关键规则很简单：报价要接近理论价格，不能太低，也不能太高。",
    },
    day2_research_terminal: {
      label: "09:18 中环数据台",
      system: "定价参数查询",
      mentor:
        "产品结构确认好了。报价之前，先去数据台把今天的关键参数查齐。现价、波动率、利率、期限——这些数字不是凭空来的，每一个都有出处。把它们记下来，等会儿填进计算器。",
    },
    day2_client_arrival: {
      label: "09:14 客户到访",
      system: "机构客户需求",
      mentor:
        "他已经明确说了自己要普通看涨期权。今天的重点不是选产品，而是报出合理的期权费。",
    },
    day2_product_review: {
      label: "09:16 产品确认",
      system: "确认交易结构",
      mentor:
        "先确认结构：看涨恒生指数、1 个月、普通 Call。结构对了，接下来才轮到定价。",
    },
    day2_tree_explainer: {
      label: "09:22 定价树",
      system: "二叉树定价入门",
      mentor:
        "注意，不是所有上涨路径都会让客户赚钱。看涨期权只有在最终价格高于行权价时才有到期价值。",
    },
    day2_quote_slider: {
      label: "09:32 客户报价",
      system: "报价滑块",
      mentor:
        "不要为了成交把价格报得太低，也不要报得太贵。好的交易员要在公允价值、客户接受度和交易台利润之间找平衡。",
    },
    day2_risk_disclosure: {
      label: "09:38 风险披露",
      system: "模型与期权风险",
      mentor:
        "定价模型不是盈利保证。客户必须同时理解期权费风险、到期收益规则，以及模型只是在估算今天的价值。",
    },
    day2_client_response: {
      label: "09:43 客户反馈",
      system: "报价结果",
      mentor:
        "专业客户会盯着报价。价格离理论价值太远，不管太低还是太高，都会留下问题。",
    },
    day2_market_run: {
      label: "09:46 市场结算",
      system: "到期路径模拟",
      mentor:
        "现在看市场怎么走。价格会一步步跳动，注意盯住到期价格——普通 Call 的结算只看最后那一格落在行权价的哪一边。",
    },
    day2_report: {
      label: "09:50 日终报告",
      system: "定价复盘",
      mentor:
        "定价不是背答案，而是先用理论价格做锚点，再判断交易台利润和客户接受度。",
    },
    day2_complete: {
      label: "10:00 完成第二天",
      system: "关卡完成",
      mentor:
        "今天你完成了第一笔带模型锚点的报价。记住：理论价格是纪律，不是承诺。",
    },
  },
  handbookEntries: [
    {
      id: "binomial_pricing",
      title: "二叉树定价 / Binomial Tree Pricing",
      sections: [
        {
          title: "核心想法",
          bullets: [
            "二叉树用来模拟标的价格未来可能上涨或下跌",
            "每一步，价格可能向上走，也可能向下走",
            "到期时，根据最终价格计算期权到期收益（Payoff）",
            "然后从最后一层往前倒推，得到今天的理论价格（Theoretical Price）",
          ],
        },
        {
          title: "普通看涨期权",
          bullets: [
            "到期收益（Payoff）= max(最终价格 - 行权价（Strike）, 0)",
            "如果最终价格高于行权价，看涨期权有价值",
            "如果最终价格低于行权价，看涨期权到期价值为 0",
          ],
        },
        {
          title: "报价规则",
          bullets: [
            "理论价格是模型计算出来的参考价值",
            "交易员给客户的报价通常应该接近理论价格",
            "报价太低：交易台利润太薄，甚至可能承担不划算的风险",
            "报价太高：客户可能拒绝交易",
            "合理报价 = 理论价格 + 适当利润空间",
          ],
        },
        {
          title: "重要提醒",
          bullets: [
            "定价模型不是在保证市场一定会怎么走",
            "它只是用不同可能路径来估算产品今天的价值",
            "第二天只学习普通期权定价",
            "新的产品规则会在后续关卡学习",
          ],
        },
      ],
    },
  ],
  clientProfile: {
    name: "王先生",
    type: "机构客户",
    marketView: "看涨恒生指数",
    riskTolerance: "中等",
    goal: "获得未来 1 个月的上涨收益",
    productNeed: "普通看涨期权",
    budget: "可以接受合理报价，但不想被报太贵",
    experience: "专业客户",
    dialogue: [
      "我想买一份 1 个月到期的恒生指数看涨期权。",
      "我看涨市场，但我很在意报价。",
      "请给我一个你认为公允的报价，我会和其他交易台比较一下。",
    ],
  },
  productSummary: {
    product: "普通看涨期权 Vanilla Call",
    underlying: "恒生指数 HSI",
    spot: 21500,
    strike: 22000,
    maturity: "1 个月",
    clientView: "看涨",
    matchReason: "看涨期权适合表达看涨观点。",
  },
  tree: {
    underlying: "恒生指数 HSI",
    spot: 21500,
    strike: 22000,
    upMove: "+2.65%",
    downMove: "-2.58%",
    steps: 3,
    riskFreeRate: "2%（教学默认）",
    theoreticalPrice: 186,
    nodes: [
      { id: "s0", step: "第 0 步", label: "今天", price: 21500, x: 8, y: 50 },
      { id: "u", step: "第 1 步", label: "上涨", price: 22069, x: 29, y: 35 },
      { id: "d", step: "第 1 步", label: "下跌", price: 20946, x: 29, y: 65 },
      {
        id: "uu",
        step: "第 2 步",
        label: "上涨-上涨",
        price: 22653,
        x: 51,
        y: 22,
      },
      {
        id: "mid",
        step: "第 2 步",
        label: "一涨一跌",
        price: 21500,
        x: 51,
        y: 50,
      },
      {
        id: "dd",
        step: "第 2 步",
        label: "下跌-下跌",
        price: 20405,
        x: 51,
        y: 78,
      },
      {
        id: "uuu",
        step: "第 3 步",
        label: "三次上涨",
        price: 23253,
        payoff: 1253,
        formula: "max(23,253 - 22,000, 0) = 1,253",
        hot: true,
        terminal: true,
        x: 84,
        y: 10,
      },
      {
        id: "uum",
        step: "第 3 步",
        label: "两涨一跌",
        price: 22069,
        payoff: 69,
        formula: "max(22,069 - 22,000, 0) = 69",
        hot: true,
        terminal: true,
        x: 84,
        y: 37,
      },
      {
        id: "udd",
        step: "第 3 步",
        label: "一涨两跌",
        price: 20946,
        payoff: 0,
        formula: "max(20,946 - 22,000, 0) = 0",
        terminal: true,
        x: 84,
        y: 64,
      },
      {
        id: "ddd",
        step: "第 3 步",
        label: "三次下跌",
        price: 19879,
        payoff: 0,
        formula: "max(19,879 - 22,000, 0) = 0",
        terminal: true,
        x: 84,
        y: 91,
      },
    ],
    links: [
      ["s0", "u"],
      ["s0", "d"],
      ["u", "uu"],
      ["u", "mid"],
      ["d", "mid"],
      ["d", "dd"],
      ["uu", "uuu"],
      ["uu", "uum"],
      ["mid", "uum"],
      ["mid", "udd"],
      ["dd", "udd"],
      ["dd", "ddd"],
    ],
  },
  quoteRules: {
    theoreticalPrice: 186,
    fairRange: [190, 220],
    deskMinimum: 186,
    rejectAbove: 260,
    sliderMin: 100,
    sliderMax: 300,
    defaultQuote: "",
  },
  market: {
    underlying: "恒生指数 HSI",
    path: [21500, 21680, 21940, 22140],
    strike: 22000,
  },
  disclosureItems: [
    {
      id: "day2_premium_loss",
      text: "如果期权到期时没有价值，客户支付的期权费可能全部损失。",
      correct: true,
    },
    {
      id: "day2_not_guaranteed",
      text: "看涨期权可以提供上涨收益，但不保证一定赚钱。",
      correct: true,
    },
    {
      id: "day2_model_paths",
      text: "报价基于定价模型和未来可能路径，不代表市场一定会按这个方向走。",
      correct: true,
    },
    {
      id: "day2_below_strike_zero",
      text: "如果最终价格低于行权价，看涨期权到期收益为 0。",
      correct: true,
    },
    {
      id: "day2_model_guarantee",
      text: "只要模型给出了理论价格，客户就一定能赚钱。",
      correct: false,
    },
  ],
  scoringRules: {
    correctDisclosureIds: [
      "day2_premium_loss",
      "day2_not_guaranteed",
      "day2_model_paths",
      "day2_below_strike_zero",
    ],
    misleadingDisclosureId: "day2_model_guarantee",
  },
};

const day3Config = {
  day: 3,
  title: "障碍期权",
  stages: {
    day3_intro: {
      label: "09:00 晨会",
      system: "路径风险晨会",
      mentor:
        "前两天你已经学会了普通期权和模型报价。今天加一个真正会改变结局的规则：障碍。价格不是只看最后一刻，中途碰到某条线，产品可能直接结束。",
    },
    day3_lesson_barrier_concept: {
      label: "09:04 第一课：障碍线",
      system: "Barrier 直觉",
      mentor:
        "把障碍想成交易合约里的红线。普通期权只看到期价格；障碍期权还会看路径，中途有没有碰到这条红线。",
    },
    day3_lesson_knock_out: {
      label: "09:08 第二课：敲出",
      system: "Knock-Out 规则",
      mentor:
        "敲出（Knock-Out）的意思是：只要标的价格碰到障碍线，期权就提前失效。哪怕最后市场又涨回来，已经敲出的产品也不能复活。",
    },
    day3_handbook_updated: {
      label: "09:12 手册更新",
      system: "障碍规则同步",
      mentor:
        "工作手册已经新增障碍期权页面。今天见客户前一定要看：障碍产品最容易出错的地方，就是把它当成普通期权来讲。",
    },
    day3_client_arrival: {
      label: "09:14 客户到访",
      system: "预算敏感客户",
      mentor:
        "她看涨，但又嫌普通 Call 太贵。现在先问清楚：她是否能接受”中途跌破某条线就提前失效”的规则。",
    },
    day3_product_selection: {
      label: "09:18 产品选择",
      system: "障碍结构匹配",
      mentor:
        "客户看涨、预算有限、愿意接受下方障碍风险。今天的目标产品是下跌敲出看涨期权，也就是 Down-and-Out Call。",
    },
    day3_research_terminal: {
      label: "09:22 障碍数据台",
      system: "障碍参数查询",
      mentor:
        "障碍产品定价前，先去数据台把参数查齐。今天比昨天多一个关键数字——障碍价。现价、波动率、利率、期限你已经熟了，重点看那张障碍合约卡，把障碍价记下来。",
    },
    day3_lesson_compare_vanilla: {
      label: "09:26 定价树",
      system: "Barrier 定价",
      mentor:
        "现在用计算器对比 Vanilla 和 Barrier 的理论价。障碍期权通常更便宜，因为买方接受了额外风险。便宜不是优惠券，而是用敲出风险换来的低期权费。",
    },
    day3_risk_disclosure: {
      label: "09:38 风险披露",
      system: "路径风险披露",
      mentor:
        "障碍产品必须把路径风险讲清楚：不是只看最终价格。碰到障碍线后，就算最后价格很漂亮，客户也可能拿不到收益。",
    },
    day3_client_response: {
      label: "09:42 客户反馈",
      system: "障碍报价结果",
      mentor:
        "障碍产品的卖点就是比普通 Call 便宜。报太低交易台少赚，报太高客户宁愿直接买普通 Call。看陈女士怎么回应。",
    },
    day3_market_run: {
      label: "09:46 市场路径",
      system: "敲出路径模拟",
      mentor:
        "现在看一条固定市场路径。注意盯住障碍线，不要只盯最终价格。下面这条是教学演示路径，旁边我放了一段真实参照——2020 年新冠股灾时，恒指真的跌到过 21,000 一带，障碍随时会被击穿。",
    },
    day3_report: {
      label: "09:52 日终报告",
      system: "障碍期权复盘",
      mentor:
        "障碍产品的评分重点是：产品是否适合、敲出风险是否充分披露、客户是否真的理解路径依赖。",
    },
    day3_complete: {
      label: "10:00 完成第三天",
      system: "关卡完成",
      mentor:
        "今天你见过了路径依赖的第一课。普通期权看终点，障碍期权还看旅途。",
    },
  },
  handbookEntries: [
    {
      id: "barrier_options",
      title: "障碍期权 / Barrier Options",
      sections: [
        {
          title: "核心想法",
          bullets: [
            "障碍期权会额外设置一条障碍价格（Barrier）",
            "产品结果不仅看最终到期价格，也看中途是否触碰障碍",
            "触碰障碍可能让期权提前生效或提前失效",
          ],
        },
        {
          title: "敲出 Knock-Out",
          bullets: [
            "Knock-Out 表示触碰障碍后，期权提前失效",
            "失效后即使最终价格重新回到有利位置，产品也不会自动复活",
            "下跌敲出看涨期权（Down-and-Out Call）适合看涨但愿意承担下方障碍风险的客户",
          ],
        },
        {
          title: "为什么更便宜",
          bullets: [
            "障碍期权通常比同类普通期权便宜",
            "便宜来自额外敲出风险，不是无条件折扣",
            "客户必须理解：更低期权费换来的是更复杂的路径风险",
          ],
        },
        {
          title: "风险披露",
          bullets: [
            "必须说明障碍价格和观察方式",
            "必须说明触碰障碍后产品可能提前失效",
            "必须说明最终价格有利，也可能因为曾经敲出而没有收益",
            "不要把障碍期权说成普通期权的便宜版本",
            "本模拟用离散观察点演示路径，真实障碍产品多为连续监控，敲出更容易发生",
          ],
        },
      ],
    },
  ],
  clientProfile: {
    name: "陈女士",
    type: "预算敏感散户",
    marketView: "看涨恒生指数",
    riskTolerance: "中高",
    goal: "想用较低期权费参与未来上涨",
    productNeed: "愿意接受额外条件，但不想让亏损失控",
    budget: "普通 Call 觉得太贵，希望期权费更低",
    experience: "买过普通期权，但第一次接触障碍结构",
    dialogue: [
      "我还是看涨恒生指数，但昨天那种普通 Call 对我来说有点贵。",
      "如果能便宜一些，我可以接受一些额外条件。",
      "你帮我看看，有没有比普通 Call 更适合我预算的方案？",
    ],
  },
  products: [
    {
      id: "down_out_call",
      name: "下跌敲出看涨期权",
      term: "Down-and-Out Call",
      status: "可用",
      description: [
        "适合看涨观点",
        "期权费低于同类普通 Call",
        "如果中途触碰下方障碍线，产品提前失效",
        "买方最大损失通常限于期权费",
      ],
      feedback:
        "方向和预算都匹配。关键是你必须把下方障碍和敲出后不可复活讲清楚。",
    },
    {
      id: "vanilla_call",
      name: "普通看涨期权",
      term: "Vanilla Call",
      status: "可用",
      description: [
        "适合看涨观点",
        "没有敲出风险",
        "期权费更高",
        "主要看最终到期价格",
      ],
      feedback:
        "普通 Call 方向正确、风险更简单，但没有回应客户“希望更便宜并接受额外条件”的需求。",
    },
    {
      id: "up_out_call",
      name: "上涨敲出看涨期权",
      term: "Up-and-Out Call",
      status: "可用",
      description: [
        "价格上涨太多时可能敲出",
        "和客户想参与上涨的目标有冲突",
        "需要非常明确的收益上限和敲出解释",
      ],
      feedback:
        "客户想参与上涨。上涨敲出 Call 会在市场上涨过强时失效，和这位客户的直觉不太匹配。",
    },
    {
      id: "direct_index",
      name: "直接买入指数",
      term: "Direct Index Purchase",
      status: "可用",
      description: [
        "完整参与上涨",
        "没有期权费",
        "下跌风险不限制在期权费内",
      ],
      feedback:
        "这不是期权结构，也没有满足客户想用有限期权费表达观点的需求。",
    },
  ],
  disclosureItems: [
    {
      id: "day3_path_dependent",
      text: "障碍期权不只看最终价格，也看中途价格路径是否触碰障碍线。",
      correct: true,
    },
    {
      id: "day3_knock_out_loss",
      text: "如果触碰敲出障碍，产品可能提前失效，客户支付的期权费可能全部损失。",
      correct: true,
    },
    {
      id: "day3_final_price_not_enough",
      text: "即使最终价格高于行权价，如果之前已经敲出，客户也可能没有收益。",
      correct: true,
    },
    {
      id: "day3_cheaper_reason",
      text: "障碍期权更便宜，是因为客户承担了额外的敲出风险。",
      correct: true,
    },
    {
      id: "day3_same_as_vanilla",
      text: "障碍期权和普通期权一样，只需要看最终到期价格。",
      correct: false,
    },
  ],
  market: {
    underlying: "恒生指数",
    spot: 21500,
    strike: 22000,
    barrier: 21000,
    premium: 934,
    vanillaPremium: 1112,
    maturity: "3个月",
    path: [21500, 21820, 21460, 20950, 21680, 22400],
  },
  // 真实市场背景：教学路径是简化演示，这里引用真实历史数据作为「现实参照」。
  // 数据来源：同组数学引擎队抓取的真实行情（central-trader/data）。
  marketContext: {
    title: "现实参照 · 2020 新冠股灾",
    source: "数据来源：恒指日线 hsi_2020_covid.csv ＋ VHSI vhsi_history.csv（同组数学引擎队抓取）",
    bullets: [
      "2020-03-19 恒指盘中跌至 21,139 点，正好贴近本关现价 21,500 与障碍 21,000 的量级",
      "2020-03-23 恒指收报 21,696 点，触及本轮新冠最低区域后才反弹",
      "同期 VHSI（恒指波动率指数）冲到 60.19（2020-03-19），市场恐慌使下方障碍极易被击穿",
      "真实教训：高波动期，下跌敲出障碍比平静期更容易触发——便宜的代价是路径风险",
    ],
  },
  scoringRules: {
    correctProduct: "down_out_call",
    correctDisclosureIds: [
      "day3_path_dependent",
      "day3_knock_out_loss",
      "day3_final_price_not_enough",
      "day3_cheaper_reason",
    ],
    misleadingDisclosureId: "day3_same_as_vanilla",
  },
};

// 已归档：CBBC（牛熊证）内容。2026-06 用户决定 Day4 改成「三客户定价实战 / 结业篇」，
// 这份数据保留备查（牛证/熊证/MCE/收回价/适当性），不再驱动 Day4 流程。
// 若以后想捡回 CBBC，把它接回 dayConfigs/stageConfig 即可。配套的旧面板见 Day4Cbbc*_ARCHIVED。
const day4CbbcConfig_ARCHIVED = {
  day: 4,
  title: "牛熊证与收回价",
  stages: {
    day4_intro: {
      label: "09:00 晨会",
      system: "CBBC 产品晨会",
      mentor:
        "今天把牛熊证讲完整一点。牛证看涨，熊证看跌。它们都带杠杆，也都带收回价。今天我们用熊证的上方收回价做案例。",
    },
    day4_handbook_updated: {
      label: "09:05 手册更新",
      system: "牛熊证规则同步",
      mentor:
        "工作手册新增了牛熊证页面。注意对称关系：牛证怕标的跌到收回价，熊证怕标的涨到收回价。",
    },
    day4_client_arrival: {
      label: "09:10 客户到访",
      system: "适当性读取",
      mentor:
        "先听客户方向。她看跌，想要杠杆，也知道强制收回风险。今天重点是判断熊证是否匹配，以及上方收回价如何触发 MCE。",
    },
    day4_suitability_check: {
      label: "09:16 适当性判断",
      system: "是否适合 CBBC",
      mentor:
        "这一步像合规闸门。客户方向、风险承受能力、产品经验和是否理解 MCE，都要一起看。",
    },
    day4_product_selection: {
      label: "09:24 产品推荐",
      system: "推荐最终产品",
      mentor:
        "客户看跌、想要杠杆、能接受强制收回。熊证方向匹配，但你必须把上方收回价讲清楚。",
    },
    day4_risk_disclosure: {
      label: "09:32 风险披露",
      system: "CBBC 风险说明",
      mentor:
        "熊证不是普通 Put 的便宜版本。必须讲清楚：标的上涨触及收回价会触发 MCE，之后即使市场再跌，也不会恢复。",
    },
    day4_market_run: {
      label: "09:42 市场路径",
      system: "CBBC 对比路径",
      mentor:
        "这条路径会让你看到上方 barrier：恒指先冲上去触发熊证 MCE，后来才跌下来。最终方向对，也救不回已收回的产品。旁边那段真实参照就是活教材——2020 年 2 月恒指先冲到 28,000，3 月才崩到 21,700，先冲高后大跌正是熊证最怕的剧本。",
    },
    day4_report: {
      label: "09:52 日终报告",
      system: "CBBC 适当性复盘",
      mentor:
        "第四天的重点是对称理解。牛证看涨但怕下跌触发收回；熊证看跌但怕上涨触发收回。",
    },
    day4_complete: {
      label: "10:00 完成第四天",
      system: "关卡完成",
      mentor:
        "你已经见过下方障碍，也见过上方收回价。路径依赖产品最重要的不是终点，而是中途有没有碰线。",
    },
  },
  handbookEntries: [
    {
      id: "cbbc_basics",
      title: "牛熊证 / CBBC",
      sections: [
        {
          title: "核心想法",
          bullets: [
            "CBBC 是 Callable Bull/Bear Contract，中文常叫牛熊证",
            "牛证（Bull CBBC）适合看涨观点：标的上涨通常对牛证有利",
            "熊证（Bear CBBC）适合看跌观点：标的下跌通常对熊证有利",
            "CBBC 通常带有杠杆，标的轻微波动也可能造成产品价格明显变化",
            "牛熊证不是普通期权，它们有强制收回机制",
          ],
        },
        {
          title: "牛证 vs 熊证",
          bullets: [
            "牛证像带杠杆的看涨工具，但下跌触及收回价会触发 MCE",
            "熊证像带杠杆的看跌工具，但上涨触及收回价会触发 MCE",
            "牛证的危险线通常在现价下方",
            "熊证的危险线通常在现价上方",
          ],
        },
        {
          title: "强制收回事件 MCE",
          bullets: [
            "CBBC 有收回价（Call Price）",
            "牛证：标的价格触及或低于收回价，会触发强制收回事件",
            "熊证：标的价格触及或高于收回价，会触发强制收回事件",
            "触发 MCE 后，产品提前终止，交易停止",
            "本模拟为离散观察点，真实牛熊证连续监控，收回更容易发生",
          ],
        },
        {
          title: "残值与损失",
          bullets: [
            "MCE 后不保证有残值",
            "有些 CBBC 可能有残值，有些可能没有残值",
            "教学简化：今天把残值视为 0，用来强调强制收回风险",
            "客户最大损失通常限于投入金额和交易成本，但亏损发生得很快",
          ],
        },
        {
          title: "价格与杠杆（教学简化）",
          bullets: [
            "真实牛熊证价格 ≈ |现价 − 行权价| × 换股比率 + 财务费用，不是用期权费定价",
            "本模拟把熊证当成带杠杆的线性看跌工具：投入资金固定，盈亏 = 投入 × 杠杆 × 标的下跌比例",
            "因此模拟里的「熊证成本/盈亏」是示意性杠杆数值，不代表真实换股比率定价",
            "杠杆放大收益，也放大亏损；未敲出时最大亏损仍以投入资金为限",
          ],
        },
        {
          title: "适当性规则",
          bullets: [
            "方向正确不等于产品适合",
            "客户不能接受强制收回，就不适合 CBBC",
            "客户风险承受能力低，不应为了便宜或杠杆推荐 CBBC",
            "客户必须理解：最后方向判断正确，也可能因为中途 MCE 而损失",
            "不要把牛熊证说成普通期权的便宜替代品",
          ],
        },
      ],
    },
  ],
  clientProfile: {
    name: "周女士",
    type: "活跃零售客户",
    marketView: "看跌恒生指数",
    riskTolerance: "高",
    goal: "想用较低资金参与短期下跌",
    productNeed: "想了解熊证，接受杠杆和强制收回风险",
    budget: "愿意投入有限资金，但希望下跌时反应更快",
    experience: "交易过普通 Put，第一次正式交易牛熊证",
    dialogue: [
      "我觉得恒生指数短期可能会回落。普通 Put 风险更简单，但期权费和杠杆效果都不是我最想要的。",
      "朋友提到熊证，说下跌时反应更快，但我知道它可能会被强制收回。",
      "你帮我判断一下，如果我要做看跌交易，熊证是不是合适？",
    ],
  },
  suitabilityOptions: [
    {
      id: "not_suitable",
      title: "不适合推荐 CBBC",
      tag: "过度保守",
      description:
        "客户虽然看跌，但只要有强制收回风险，就一律不推荐 CBBC。",
      feedback:
        "这次有点过度保守。周女士风险承受能力高，也明确知道 MCE 风险，可以继续评估熊证。",
    },
    {
      id: "suitable",
      title: "可以评估 Bear CBBC",
      tag: "正确",
      description:
        "客户看跌、风险承受能力高、了解强制收回风险。可以评估熊证，但必须充分披露上方收回价。",
      feedback:
        "判断正确。她不是低风险客户，也没有回避 MCE；下一步要选择方向匹配的熊证，并讲清楚上方收回价。",
    },
  ],
  products: [
    {
      id: "bull_cbbc",
      name: "恒指牛证",
      term: "Bull CBBC",
      status: "可用",
      description: [
        "适合看涨观点",
        "带杠杆，价格波动更敏感",
        "触及或低于收回价会触发 MCE",
        "方向与本客户看跌观点相反",
      ],
      feedback:
        "客户是看跌观点，牛证方向相反。牛证是看涨工具，不适合这个订单。",
    },
    {
      id: "bear_cbbc",
      name: "恒指熊证",
      term: "Bear CBBC",
      status: "可用",
      description: [
        "适合看跌观点",
        "带杠杆，价格波动更敏感",
        "标的上涨触及或高于收回价会触发 MCE",
        "使用上方收回价作为风险边界",
      ],
      feedback:
        "方向匹配。客户看跌、能承受高风险，可以考虑熊证，但必须说明上方收回价和 MCE。",
    },
    {
      id: "vanilla_call",
      name: "普通看涨期权",
      term: "Vanilla Call",
      status: "可用",
      description: [
        "适合看涨观点",
        "没有强制收回事件",
        "买方最大损失通常限于期权费",
        "方向与客户观点不匹配",
      ],
      feedback:
        "普通 Call 没有 MCE 风险，但方向是看涨，和客户看跌观点不匹配。",
    },
    {
      id: "vanilla_put",
      name: "普通看跌期权",
      term: "Vanilla Put",
      status: "可用",
      description: [
        "适合看跌观点",
        "没有强制收回事件",
        "买方最大损失通常限于期权费",
        "风险更简单，但没有 CBBC 杠杆特征",
      ],
      feedback: "普通 Put 方向正确、风险更简单，但客户明确想评估杠杆型熊证。它可以作为更保守备选。",
    },
  ],
  disclosureItems: [
    {
      id: "day4_mce",
      text: "CBBC 有收回价（Call Price），触及收回价会触发强制收回事件（MCE）。",
      correct: true,
    },
    {
      id: "day4_bear_trigger",
      text: "熊证中，标的价格触及或高于收回价，产品可能提前终止。",
      correct: true,
    },
    {
      id: "day4_residual_not_guaranteed",
      text: "MCE 后残值不保证，教学简化下可视为可能损失全部投入金额。",
      correct: true,
    },
    {
      id: "day4_leverage",
      text: "CBBC 带杠杆，价格波动和亏损速度都可能被放大。",
      correct: true,
    },
    {
      id: "day4_recover_after_mce",
      text: "如果 MCE 后市场又跌回来，熊证会自动恢复交易并继续赚钱。",
      correct: false,
    },
  ],
  market: {
    underlying: "恒生指数",
    spot: 21500,
    // 普通 Put 比较产品的行权价（价外 Put，现价 21500 之下）
    strike: 21200,
    // 熊证结构：现价 ≤ 收回价 ≤ 行权价。N 类熊证 行权价 = 收回价 = 22000，无残值。
    cbbcStrike: 22000,
    cbbcCallPrice: 22000,
    cbbcEntryCost: 80,
    // 熊证是带杠杆的线性跟踪工具，不是用期权费定价。这里用示意性杠杆倍数表达「下跌反应更快」。
    cbbcLeverage: 7,
    vanillaPremium: 150,
    maturity: "1个月",
    path: [21500, 21780, 22050, 21600, 21100, 20750],
  },
  // 真实市场背景：教学路径是简化演示，这里引用真实历史数据作为「现实参照」。
  // 数据来源：同组数学引擎队抓取的真实行情（central-trader/data）。
  marketContext: {
    title: "现实参照 · 2020 新冠：先冲高、再崩盘",
    source: "数据来源：恒指日线 hsi_2020_covid.csv（同组数学引擎队抓取）",
    bullets: [
      "2020-02-17 恒指曾上探 28,055 点——先冲高的走势，正是熊证最怕的「上方收回」剧本",
      "若当时持有上方收回价偏低的熊证，这波上冲就可能触发强制收回（MCE）",
      "随后疫情扩散，恒指在 2020-03-23 一路跌到 21,696 点——方向其实对了",
      "但已被收回的熊证无法复活：本关「先冲高触发 MCE、后大跌」的剧情，正是真实市场的缩影",
    ],
  },
  scoringRules: {
    correctSuitability: "suitable",
    correctProduct: "bear_cbbc",
    correctDisclosureIds: [
      "day4_mce",
      "day4_bear_trigger",
      "day4_residual_not_guaranteed",
      "day4_leverage",
    ],
    misleadingDisclosureId: "day4_recover_after_mce",
  },
};

// ===================================================================
// Day4 实战篇 · 三客户定价实战（结业）
// 叙事：Day3（2020 covid 股灾）数月后，恒指从 21,000 低位回升到 24,000–25,000。
// 玩家用 Day2(普通期权定价) + Day3(障碍期权定价) 学到的技能，给 3 位需求各异的客户实战报价。
// 三客户难度递增、提示递减；客户③不点产品，要玩家自己判断该上普通还是障碍。
// 理论价锚点均由项目二叉树「实算」（r=2%，vanilla N=3 / barrier N=4），与计算器一字不差。
//   ① 张先生 vanilla：S0 24000/K 24500/σ18%/T0.08 → 297.06 ≈ 297
//   ② 李小姐 barrier：S0 24000/K 24500/障碍23000/σ28%/T0.25 → 980.77 ≈ 981（普通 Call 1167）
//   ③ 何先生 barrier：S0 25000/K 25500/障碍23500/σ32%/T0.25 → 1184.20 ≈ 1184（普通 Call 1411）
// ===================================================================
const day4Clients = [
  {
    id: "zhang",
    avatar: "张",
    typeLabel: "机构客户",
    taskType: "price", // 已点名产品，直接报价
    mode: "vanilla",
    correctProduct: "vanilla_call",
    productLabel: "普通 Call",
    hintLevel: "示范",
    params: { spot: 24000, strike: 24500, barrier: null, rate: 2, sigma: 18, maturity: 0.08, steps: 3 },
    theoretical: 297, // 实算 297.06，vanilla N=3
    vanillaRef: 297,
    profile: {
      name: "张先生",
      type: "机构客户（偏保守）",
      marketView: "看涨恒生指数",
      riskTolerance: "中等",
      goal: "用 1 个月期权抓一波上涨",
      productNeed: "最简单的看涨工具，亏损只限于权利金",
      budget: "可以接受合理报价，但不想被宰",
      experience: "常年交易普通期权",
    },
    dialogue: [
      "我看涨恒指，想买一个月的看涨期权。",
      "我要最干净的那种——亏损就限于我付的权利金，别给我加什么附加条件。",
      "你算个公允价给我，我会拿去和别家比。",
    ],
  },
  {
    id: "li",
    avatar: "李",
    typeLabel: "预算敏感客户",
    taskType: "price", // 需求里点了「换便宜/接受敲出」，等于半点名
    mode: "barrier",
    correctProduct: "down_out_call",
    productLabel: "障碍 Call",
    hintLevel: "减少",
    params: { spot: 24000, strike: 24500, barrier: 23000, rate: 2, sigma: 28, maturity: 0.25, steps: 4 },
    theoretical: 981, // 实算 980.77，barrier N=4
    vanillaRef: 1167, // 实算 1167.35
    profile: {
      name: "李小姐",
      type: "预算敏感客户",
      marketView: "看涨恒生指数",
      riskTolerance: "中高",
      goal: "看涨，但想压低权利金",
      productNeed: "愿意接受「中途跌破某条线就提前作废」换更便宜",
      budget: "普通 Call 太贵，希望便宜一些",
      experience: "买过普通期权，也碰过障碍结构",
    },
    dialogue: [
      "我也看涨恒指，但上次那种普通 Call 对我来说太贵了。",
      "如果能便宜些，我可以接受「中途跌破某条线就提前作废」。",
      "帮我配个比普通 Call 便宜的看涨方案，算个公允价给我。",
    ],
  },
  {
    id: "he",
    avatar: "何",
    typeLabel: "结业判断客户",
    taskType: "judge", // 不点产品，玩家先选品再报价
    mode: "barrier",
    correctProduct: "down_out_call",
    productLabel: "障碍 Call",
    hintLevel: "最少",
    params: { spot: 25000, strike: 25500, barrier: 23500, rate: 2, sigma: 32, maturity: 0.25, steps: 4 },
    theoretical: 1184, // 实算 1184.20，barrier N=4
    vanillaRef: 1411, // 实算 1411.24
    profile: {
      name: "何先生",
      type: "小企业主",
      marketView: "看涨恒生指数",
      riskTolerance: "中高",
      goal: "看涨，想做这一波，但预算很紧",
      productNeed: "没明说要哪种——你得自己判断",
      budget: "预算只有一千出头，再贵就买不起",
      experience: "买过普通期权，也买过障碍期权",
    },
    dialogue: [
      "我看涨恒指，想做这一波。",
      "但我预算很紧，手里也就一千点出头，普通 Call 那种价我下不了手。",
      "我不怕它中途跌——真跌破某个位置当它作废、我也认。你看着给我配个合适的。",
    ],
    judgeProducts: [
      {
        id: "vanilla_call",
        name: "普通看涨期权",
        term: "Vanilla Call",
        status: "可用",
        description: ["适合看涨观点", "没有敲出风险，结构最简单", "权利金最高", "只看最终到期价格"],
        feedback:
          "方向对，但普通 Call 是这里最贵的，正撞上何先生「预算只有一千出头」的红线。他买不起。",
      },
      {
        id: "down_out_call",
        name: "下跌敲出看涨期权",
        term: "Down-and-Out Call",
        status: "可用",
        description: ["适合看涨观点", "权利金低于普通 Call", "中途跌破下方障碍线则提前失效", "买方最大损失通常限于权利金"],
        feedback:
          "判断正确。预算紧 + 能接受下方敲出——障碍 Call 用更低权利金换路径风险，正好卡进他的预算。算它的理论价再报。",
      },
      {
        id: "up_out_call",
        name: "上涨敲出看涨期权",
        term: "Up-and-Out Call",
        status: "可用",
        description: ["看涨，但涨太多会敲出", "和「参与上涨」的目标冲突", "需要明确的收益上限解释"],
        feedback:
          "他想参与上涨，上涨敲出会在市场涨太强时失效，跟他的目标冲突。不匹配。",
      },
    ],
  },
];

const day4Config = {
  day: 4,
  title: "结业实战 · 三客户定价",
  clients: day4Clients,
  handbookEntries: [],
  martinPrinciple: "先读方向，再读风险承受度和预算，最后才想产品；报价永远以模型理论价为锚，再加合理利润。",
  // 安全占位：让既有 isDay4Stage 派生逻辑（披露评分 / 市场结算路径）读不到 undefined。
  // 新 Day4 流程没有风险披露步骤，也没有自动市场结算，这些字段仅为防御。
  disclosureItems: [],
  market: { path: [] },
  scoringRules: { correctDisclosureIds: [], misleadingDisclosureId: "__day4_none__" },
  stages: {
    day4_intro: {
      label: "09:00 结业晨会",
      system: "三客户定价实战",
      mentor:
        "今天没有新产品要学。前三天你学了普通期权、定价、障碍——今天是结业实战：三位客户排队等你报价。原则我只说一次：先读方向，再读风险承受度和预算，最后才想产品；报价永远以模型理论价为锚，再加合理利润。我不会告诉你该选什么、报多少。",
    },
    day4_client_arrival: {
      label: "09:10 客户到访",
      system: "读懂客户需求",
      mentor:
        "先把客户资料和对白读透。方向、预算、能不能接受附加条件——线索都在里面。读完再决定怎么做。",
    },
    day4_judge: {
      label: "09:16 判断产品",
      system: "自己选结构",
      mentor:
        "这位客户没说要哪种产品。从他的预算和风险话术里判断：该上普通 Call，还是用更便宜的障碍 Call？选错了客户会走。",
    },
    day4_pricing: {
      label: "09:22 计算器报价",
      system: "算理论价并报价",
      mentor:
        "把客户卡上的参数填进计算器，算出理论价，再加合理利润报出去。系统不会提前告诉你对不对，提交后才见分晓。",
    },
    day4_client_response: {
      label: "09:30 客户反馈",
      system: "报价回执",
      mentor:
        "看客户怎么回应。报太低交易台白送利润，报太高客户掉头就走，公允加利润才是定价纪律。",
    },
    day4_scorecard: {
      label: "09:45 结业成绩单",
      system: "三单复盘",
      mentor:
        "三位客户都接待完了。逐单看：产品选对没、报价偏差多少、成交了几单。这就是你这四天学到的全部。",
    },
    day4_complete: {
      label: "10:00 结业",
      system: "训练完成",
      mentor:
        "从期权基础到定价、障碍，再到今天的实战报价——你已经把一个新人交易员该有的定价纪律走了一遍。",
    },
  },
};

// Day4 报价评价：合并 vanilla(Day2 带) 与 barrier(Day3 带) 两套区间，按 client.mode 出文案。
// vanilla 带：理论价 +4 / +34 / +74；barrier 带：理论价 ×1.183(合理上限) / ×1.398(拒绝上限)。
function getDay4QuoteAnalysis(quote, client) {
  const theoretical = client.theoretical;
  const name = client.profile.name;
  const productLabel = client.productLabel;
  const q = Number(quote);
  const margin = Math.round(q - theoretical);
  const anchor = Math.round(theoretical);

  if (!Number.isFinite(q) || q <= 0) {
    return {
      id: "empty",
      label: "未报价",
      status: "尚未报价",
      accepted: false,
      score: "D",
      customerLine: "你还没给我报价呢。",
      martinComment: `还没报价。先在计算器里算出${productLabel}的理论价，再加点利润报给${name}。`,
      margin: 0,
      theoretical,
    };
  }

  if (q < theoretical) {
    const bargain = Math.round(theoretical - q);
    return {
      id: "too_low",
      label: "报价过低",
      status: "成交了，但报价偏低，交易台损失了利润",
      accepted: true,
      score: "C",
      customerLine: "这个价很划算，成交！",
      martinComment: `${name}几乎没还价就签了——他清楚自己占了便宜。${productLabel}模型公允价约 ${anchor} 点，你只报了 ${Math.round(q)} 点，等于白送客户 ${bargain} 点。先看模型理论价，再加利润。`,
      margin,
      theoretical,
    };
  }

  if (client.mode === "barrier") {
    const fairHigh = theoretical * 1.183;
    const rejectAbove = theoretical * 1.398;
    if (q <= fairHigh) {
      return {
        id: "fair",
        label: "合理报价",
        status: "成交，定价漂亮",
        accepted: true,
        score: "A",
        customerLine: "比普通 Call 便宜，又没便宜得离谱，可以，成交。",
        martinComment: `漂亮。你拿障碍模型价 ${anchor} 点当锚，又加了 ${margin} 点利润——客户觉得比普通 Call 划算，交易台也拿到补偿。这就是障碍定价的纪律。`,
        margin,
        theoretical,
      };
    }
    if (q <= rejectAbove) {
      return {
        id: "expensive",
        label: "偏贵",
        status: "勉强成交，客户不满意",
        accepted: true,
        score: "C",
        customerLine: "障碍产品不就图个便宜吗？这价有点贵……行吧，先这样。",
        martinComment: `${name}皱着眉签了。障碍产品的卖点就是便宜，你报这么贵，等于把它最大的优势抹掉了。这种体验留不住回头客。`,
        margin,
        theoretical,
      };
    }
    return {
      id: "too_high",
      label: "报价过高",
      status: "客户拒绝，转身离开",
      accepted: false,
      score: "D",
      customerLine: "这么贵我还买障碍干嘛？我不如直接买普通 Call。",
      martinComment: `${name}起身就走了。障碍报到这个价，客户宁愿去买普通 Call。报价离公允价值太远，再好的客户也会走。`,
      margin,
      theoretical,
    };
  }

  // vanilla 带
  const fairLow = theoretical + 4;
  const fairHigh = theoretical + 34;
  const rejectAbove = theoretical + 74;
  if (q < fairLow) {
    return {
      id: "thin_margin",
      label: "利润很薄",
      status: "成交，但利润薄如纸",
      accepted: true,
      score: "B",
      customerLine: "可以，我接受这个报价。",
      martinComment: `${name}爽快接受。你守住了理论价 ${anchor} 点，但利润薄得几乎看不见。成交是成交了，交易台这单基本白忙。`,
      margin,
      theoretical,
    };
  }
  if (q <= fairHigh) {
    return {
      id: "fair",
      label: "合理报价",
      status: "成交，定价漂亮",
      accepted: true,
      score: "A",
      customerLine: "价格公道，成交。",
      martinComment: `漂亮。你拿模型理论价 ${anchor} 点当锚，又留了 ${margin} 点利润——客户爽快接受，交易台也有钱赚。这就是定价纪律。`,
      margin,
      theoretical,
    };
  }
  if (q <= rejectAbove) {
    return {
      id: "expensive",
      label: "偏贵",
      status: "勉强成交，客户不满意",
      accepted: true,
      score: "C",
      customerLine: "有点贵……行吧，这次先这样。",
      martinComment: `${name}皱着眉签了字。报得偏高，客户明显不爽。这种客户体验留不住回头客。`,
      margin,
      theoretical,
    };
  }
  return {
    id: "too_high",
    label: "报价过高",
    status: "客户拒绝，转身离开",
    accepted: false,
    score: "D",
    customerLine: "这个价太离谱了，我去别家比比。",
    martinComment: `${name}合上笔记本起身就走了。报这么高把客户吓跑，这单黄了。模型是用来守纪律的，不是用来宰客的。`,
    margin,
    theoretical,
  };
}

const dayConfigs = {
  1: day1Config,
  2: day2Config,
  3: day3Config,
  4: day4Config,
};

const stageConfig = {
  ...day1Config.stages,
  ...day2Config.stages,
  ...day3Config.stages,
  ...day4Config.stages,
};

const allHandbookEntries = [
  ...day1Config.handbookEntries,
  ...day2Config.handbookEntries,
  ...day3Config.handbookEntries,
  ...day4Config.handbookEntries,
];

const day1HandbookEntryIds = day1Config.handbookEntries.map((entry) => entry.id);
const day2HandbookEntryIds = day2Config.handbookEntries.map((entry) => entry.id);
const day3HandbookEntryIds = day3Config.handbookEntries.map((entry) => entry.id);

const fullWidthStages = new Set([
  "day2_lesson_backward_price",
  "day2_tree_explainer",
  "day3_lesson_compare_vanilla",
  "day3_market_run",
  "day4_pricing",
]);

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatPoints(value) {
  return value.toLocaleString("en-US");
}

function getQuoteAnalysis(
  quote,
  theoretical = day2Config.quoteRules.theoreticalPrice,
  clientName = "王先生",
  clientDesc = "专业客户",
) {
  const margin = quote - theoretical;
  // 合理区间：理论价 + 4 到 理论价 + 34（相对偏移，不再写死绝对值）
  const fairLow = theoretical + 4;
  const fairHigh = theoretical + 34;
  const rejectAbove = theoretical + 74;

  if (quote < theoretical) {
    const bargain = theoretical - quote;
    return {
      id: "too_low",
      label: "报价过低",
      score: "D",
      tone: "danger",
      status: "成交了，但报价偏低，交易台损失了利润",
      accepted: true,
      customerPreview: "客户会立刻抓住这个便宜价。",
      customerLine: "这个价格很划算，成交。",
      reportText:
        "你的报价低于这张期权的合理价值，客户几乎是立刻就接受了——心里清楚自己占了便宜。",
      martinComment:
        `${clientName}眼睛一亮，几乎没还价就签了字。你把一张大约值 ${theoretical} 点的期权报了 ${quote} 点，等于白送客户 ${bargain} 点。${clientDesc}最会捡这种便宜。下次先看模型算出的理论价，再加利润，别让交易台吃哑巴亏。`,
      margin,
      theoretical,
    };
  }

  if (quote < fairLow) {
    return {
      id: "thin_margin",
      label: "利润很薄",
      score: "B-",
      tone: "warn",
      status: "成交，但利润薄如纸",
      accepted: true,
      customerPreview: "客户会爽快接受，但交易台几乎没赚头。",
      customerLine: "可以，我接受这个报价。",
      reportText: "报价对客户很友好，但交易台利润薄得几乎看不见。",
      martinComment:
        "你守住了理论价，但利润薄得几乎看不见。成交是成交了，交易台这单基本白忙。真实交易台会再问一句：这点利润，值得承担这笔风险吗？",
      margin,
      theoretical,
    };
  }

  if (quote <= fairHigh) {
    return {
      id: "fair",
      label: "合理报价",
      score: "A",
      tone: "good",
      status: "成交，定价漂亮",
      accepted: true,
      customerPreview: "报价公平，也有合理利润空间。",
      customerLine: "价格公道，成交。",
      reportText: "你参考了理论价格，并加入了合理利润空间，客户和交易台都满意。",
      martinComment:
        `漂亮。你拿模型理论价 ${theoretical} 点当锚，又留了 ${margin} 点利润——客户爽快接受，交易台也有钱赚。这就是定价纪律。`,
      margin,
      theoretical,
    };
  }

  if (quote <= rejectAbove) {
    return {
      id: "expensive",
      label: "偏贵",
      score: "C",
      tone: "warn",
      status: "勉强成交，客户不满意",
      accepted: true,
      customerPreview: "客户会皱眉，勉强成交。",
      customerLine: "有点贵……行吧，这次先这样。",
      reportText: "报价高于合理区间，客户勉强接受，但明显不满意。",
      martinComment:
        `${clientName}皱着眉签了字。成交是成交了，但你报得偏高，客户明显不爽。这种客户体验留不住回头客——${clientDesc}会记得谁宰过自己。`,
      margin,
      theoretical,
    };
  }

  return {
    id: "too_high",
    label: "报价过高",
    score: "D",
    tone: "danger",
    status: "客户拒绝，转身离开",
    accepted: false,
    customerPreview: "客户很可能掉头就走。",
    customerLine: "这个价太离谱了，我去别家比比。",
    reportText: "报价过高，客户当场拒绝，转身离开，这单没成。",
    martinComment:
      `${clientName}合上笔记本起身就走了。报这么高把客户吓跑，这单黄了，交易台一分钱没赚到。模型是用来守纪律的，不是用来宰客的——报价离公允价值太远，再好的客户也会走。`,
    margin,
    theoretical,
  };
}

function getDay2MarketResult(quote, theoretical = day2Config.quoteRules.theoreticalPrice) {
  const market = day2Config.market;
  const finalPrice = market.path[market.path.length - 1];
  const payoff = Math.max(finalPrice - market.strike, 0);
  const analysis = getQuoteAnalysis(quote, theoretical);
  const tradeAccepted = analysis.accepted;

  return {
    path: market.path,
    finalPrice,
    payoff,
    tradeAccepted,
    deskPnl: tradeAccepted ? quote - payoff : 0,
    clientPnl: tradeAccepted ? payoff - quote : 0,
  };
}

function getDay2PricingScore(quote, theoretical = day2Config.quoteRules.theoreticalPrice) {
  const analysis = getQuoteAnalysis(quote, theoretical);
  const marketResult = getDay2MarketResult(quote, theoretical);
  const fairLow = theoretical + 4;
  const fairHigh = theoretical + 34;

  if (!analysis.accepted) {
    return {
      score: "D",
      comment: "报价过高，客户拒绝交易。市场后来上涨，但交易台没有成交，也没有收入。",
    };
  }

  if (quote < theoretical) {
    return {
      score: marketResult.deskPnl < 0 ? "D" : "C",
      comment:
        marketResult.deskPnl < 0
          ? "报价低于理论价格，市场上涨后交易台实际亏损。低价成交不等于好报价。"
          : "报价低于理论价格，这次市场结果还能覆盖收益，但定价纪律不够。",
    };
  }

  if (quote >= fairLow && quote <= fairHigh) {
    return {
      score: marketResult.deskPnl >= 0 ? "A" : "B",
      comment:
        marketResult.deskPnl >= 0
          ? "报价接近模型价格，并留下合理利润空间；模拟市场结算后交易台仍有正收益。"
          : "报价纪律不错，但这条市场路径让交易台承受了亏损。模型是报价锚点，不是收益保证。",
    };
  }

  if (quote < fairLow) {
    return {
      score: "B-",
      comment: "报价守住理论价格，但利润空间偏薄；市场结算后需要检查这笔风险是否值得。",
    };
  }

  if (quote <= theoretical + 74) {
    return {
      score: "C",
      comment: "报价高于合理区间，虽然客户勉强接受，但客户满意度下降。",
    };
  }

  return {
    score: "D",
    comment: "报价远离模型价格，客户拒绝交易。",
  };
}

function getDay3MarketResult() {
  const market = day3Config.market;
  const finalPrice = market.path[market.path.length - 1];
  const knockedOutIndex = market.path.findIndex((price) => price <= market.barrier);
  const knockedOut = knockedOutIndex >= 0;
  const vanillaPayoff = Math.max(finalPrice - market.strike, 0);
  const barrierPayoff = knockedOut ? 0 : vanillaPayoff;
  const pnl = barrierPayoff - market.premium;

  return {
    finalPrice,
    knockedOut,
    knockedOutIndex,
    vanillaPayoff,
    barrierPayoff,
    pnl,
  };
}

// Day3 障碍报价评价：以障碍产品的模型公允价（day3Config.market.premium ≈ 934）为锚，
// 区间按 Day2 的相对比例缩放（合理加价 ~+2%..+18%，超过 ~+40% 客户宁愿买普通 Call 而拒绝）。
function getDay3QuoteAnalysis(quote, theoretical = day3Config.market.premium) {
  const q = Number(quote);
  const margin = Math.round(q - theoretical);
  const anchor = Math.round(theoretical);
  const fairHigh = theoretical * 1.183;
  const rejectAbove = theoretical * 1.398;

  if (!Number.isFinite(q) || q <= 0) {
    return {
      id: "empty",
      label: "未报价",
      status: "尚未报价",
      accepted: false,
      customerLine: "你还没给我报价呢。",
      martinComment: "还没报价。先在计算器里算出障碍理论价，再加一点利润报给陈女士。",
      margin: 0,
      theoretical,
    };
  }

  if (q < theoretical) {
    const bargain = Math.round(theoretical - q);
    return {
      id: "too_low",
      label: "报价过低",
      status: "成交了，但报价偏低，交易台损失了利润",
      accepted: true,
      customerLine: "这价比普通 Call 便宜太多了，成交！",
      martinComment: `陈女士爽快签了——她占了便宜。障碍模型公允价 ${anchor} 点，你只报了 ${Math.round(q)} 点，交易台等于少收了 ${bargain} 点。给客户优惠可以，但别让到这个地步。`,
      margin,
      theoretical,
    };
  }

  if (q <= fairHigh) {
    return {
      id: "fair",
      label: "合理报价",
      status: "成交，定价漂亮",
      accepted: true,
      customerLine: "比普通 Call 便宜，又没便宜得离谱，可以，成交。",
      martinComment: `漂亮。你拿障碍模型价 ${anchor} 点当锚，又加了 ${margin} 点利润——客户觉得比普通 Call 划算，交易台也拿到补偿。这就是障碍定价的纪律。`,
      margin,
      theoretical,
    };
  }

  if (q <= rejectAbove) {
    return {
      id: "expensive",
      label: "偏贵",
      status: "勉强成交，客户不满意",
      accepted: true,
      customerLine: "障碍产品不就图个便宜吗？这价有点贵……行吧，先这样。",
      martinComment: "陈女士皱着眉签了。障碍产品的卖点就是便宜，你报这么贵，等于把它最大的优势抹掉了。这种体验留不住回头客。",
      margin,
      theoretical,
    };
  }

  return {
    id: "too_high",
    label: "报价过高",
    status: "客户拒绝，转身离开",
    accepted: false,
    customerLine: "这么贵我还买障碍干嘛？我不如直接买普通 Call。",
    martinComment: `陈女士掉头就走了。障碍比普通 Call 还贵，等于自己否定自己——客户当然不签。报价离障碍公允价 ${anchor} 点太远，这单黄了。`,
    margin,
    theoretical,
  };
}

// 已归档（CBBC）：原 Day4 熊证市场结算，新流程不再使用。
function getDay4CbbcMarketResult_ARCHIVED() {
  const market = day4CbbcConfig_ARCHIVED.market;
  const finalPrice = market.path[market.path.length - 1];
  const mceIndex = market.path.findIndex((price) => price >= market.cbbcCallPrice);
  const mceTriggered = mceIndex >= 0;
  // 普通 Put 比较产品：使用 Put 自己的行权价 strike(21200)
  const vanillaPayoff = Math.max(market.strike - finalPrice, 0);
  const vanillaPnl = vanillaPayoff - market.vanillaPremium;
  // 熊证按「带杠杆的线性看跌敞口」建模（而非期权 payoff），避免出现「小成本博大内在价值」的伪套利。
  // 未触发 MCE：盈亏 = 投入资金 × 杠杆 × 标的相对入场的下跌比例（下跌为正，上涨为负）。
  // 触发 MCE：损失全部投入（教学简化：残值 = 0）。亏损下限为投入资金。
  const bearMovePct = (market.spot - finalPrice) / market.spot;
  const bearCbbcPnl = mceTriggered
    ? -market.cbbcEntryCost
    : Math.max(
        -market.cbbcEntryCost,
        Math.round(market.cbbcEntryCost * market.cbbcLeverage * bearMovePct),
      );

  return {
    finalPrice,
    mceIndex,
    mceTriggered,
    vanillaPayoff,
    vanillaPnl,
    bearCbbcPnl,
  };
}

function TypewriterText({
  text = "",
  className = "",
  speed = 26,
  startDelay = 0,
  skipSignal = 0,
  onDone,
}) {
  const [displayed, setDisplayed] = useState("");
  const timerRef = useRef(null);
  const indexRef = useRef(0);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  const lastSkipSignalRef = useRef(skipSignal);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    window.clearTimeout(timerRef.current);
    setDisplayed("");
    indexRef.current = 0;
    doneRef.current = false;

    const complete = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDoneRef.current?.();
    };

    const tick = () => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        complete();
        return;
      }

      timerRef.current = window.setTimeout(tick, speed + Math.random() * 22);
    };

    if (!text) {
      complete();
      return undefined;
    }

    timerRef.current = window.setTimeout(tick, startDelay);
    return () => window.clearTimeout(timerRef.current);
  }, [text, speed, startDelay]);

  useEffect(() => {
    if (skipSignal === lastSkipSignalRef.current) return;
    lastSkipSignalRef.current = skipSignal;
    if (doneRef.current) return;

    window.clearTimeout(timerRef.current);
    indexRef.current = text.length;
    doneRef.current = true;
    setDisplayed(text);
    onDoneRef.current?.();
  }, [skipSignal, text]);

  return (
    <span className={cn("whitespace-pre-line", className)}>
      {displayed}
      <span className="cursor" />
    </span>
  );
}

function MatrixCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const fontSize = 14;
    const glyphs = "HK$CALLPUT1997HSIVHSIPREMIUMVANILLA";
    let columns = 0;
    let drops = [];
    let frameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * canvas.height);
    };

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 26, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;
      ctx.fillStyle = "rgba(0, 240, 255, 0.55)";

      drops.forEach((drop, index) => {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillText(char, index * fontSize, drop * fontSize);
        drops[index] = drop * fontSize > canvas.height && Math.random() > 0.975 ? 0 : drop + 1;
      });

      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 h-full w-full opacity-[0.14]" />;
}

function GlobalAtmosphere() {
  return (
    <>
      <MatrixCanvas />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,240,255,0.018)_2px,rgba(0,240,255,0.018)_4px)]" />
      <div className="top-glow-line pointer-events-none fixed left-0 top-0 z-20 h-[2px] w-full bg-[linear-gradient(90deg,transparent,#00f0ff,transparent)]" />
      <div className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(circle_at_50%_35%,rgba(0,240,255,0.08),transparent_34%),linear-gradient(to_bottom,rgba(10,10,26,0.1),rgba(10,10,26,0.92))]" />
      <div className="pulse-dot fixed left-8 top-8 z-10 h-2 w-2 rounded-full bg-[#00f0ff]" />
    </>
  );
}

function StyleBlock() {
  return (
    <style>{`
      .font-terminal { font-family: 'JetBrains Mono', monospace; }
      .font-cn { font-family: 'Noto Sans SC', sans-serif; }
      .top-glow-line { animation: glow-line 3s ease-in-out infinite; }
      .pulse-dot { animation: pulse 2s ease-in-out infinite; }
      .scene-enter { animation: fade-in-up 0.45s ease both; }
      .market-node { animation: node-pop 0.35s ease both; }
      .market-chart-panel {
        position: relative;
        overflow: hidden;
      }
      .market-chart-panel::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(90deg, transparent, rgba(0,240,255,0.1), transparent);
        transform: translateX(-100%);
        animation: market-scan 1.25s linear infinite;
        opacity: 0.65;
      }
      .live-price-pulse {
        animation: live-price-pulse 0.7s ease-in-out infinite;
      }
      .chart-tension {
        animation: chart-tension 0.42s ease-in-out infinite alternate;
      }
      .opening-curtain {
        position: fixed;
        inset: 0;
        z-index: 8;
        pointer-events: none;
        background:
          linear-gradient(180deg, rgba(0,240,255,0.18), transparent 18%, transparent 82%, rgba(255,215,0,0.12)),
          repeating-linear-gradient(90deg, rgba(0,240,255,0.08) 0 1px, transparent 1px 18px),
          #050816;
        transform: translateY(-105%);
        animation: curtain-drop 1.05s cubic-bezier(.18,.82,.22,1) forwards,
          curtain-exit 0.9s cubic-bezier(.75,0,.35,1) 1.25s forwards;
        box-shadow: 0 24px 70px rgba(0,240,255,0.2);
      }
      .opening-curtain::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        height: 2px;
        width: 100%;
        background: linear-gradient(90deg, transparent, #00f0ff, #ffd700, transparent);
        box-shadow: 0 0 24px rgba(0,240,255,0.55);
      }
      .title-stage {
        position: relative;
        opacity: 0;
        animation: title-reveal 0.8s ease 1.45s forwards;
      }
      .title-stage .title-char {
        display: inline-block;
        opacity: 0;
        transform: translateY(40px);
        animation: char-rise 0.6s ease forwards;
      }
      .title-stage .title-shadow {
        position: absolute;
        inset: 0;
        color: #00f0ff;
        filter: blur(20px);
        opacity: 0.3;
        z-index: -1;
      }
      .title-stage .title-glow {
        background: linear-gradient(90deg, #00f0ff, #ffd700);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .title-stage .title-glow .title-char {
        background: linear-gradient(90deg, #00f0ff, #ffd700);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        -webkit-text-fill-color: transparent;
      }
      .title-stage .title-shadow .title-char {
        color: #00f0ff;
        -webkit-text-fill-color: #00f0ff;
      }
      .title-stage.title-ready {
        opacity: 1;
      }
      .title-stage.title-ready .title-char {
        opacity: 1;
        transform: translateY(0);
      }
      .title-location {
        opacity: 0;
        animation: fade-in-down 0.8s ease 1.05s forwards;
      }
      .title-subtitle {
        opacity: 0;
        animation: fade-in 0.8s ease 2.35s forwards;
      }
      .title-footer {
        opacity: 0;
        animation: fade-in 0.8s ease 4s forwards;
      }
      .cursor {
        display: inline-block;
        width: 2px;
        height: 1.1em;
        margin-left: 2px;
        background: #00f0ff;
        vertical-align: text-bottom;
        animation: blink 0.8s step-end infinite;
      }
      .shine-button { position: relative; overflow: hidden; }
      .shine-button::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.34), transparent);
        transition: left 0.55s ease;
      }
      .shine-button:hover::before { left: 100%; }
      .handbook-new { animation: handbook-pulse 1.2s ease-in-out infinite; }
      @keyframes glow-line {
        0%, 100% { opacity: 0.45; }
        50% { opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.35; box-shadow: 0 0 4px #00f0ff; }
        50% { opacity: 1; box-shadow: 0 0 12px #00f0ff, 0 0 24px rgba(0,240,255,0.35); }
      }
      @keyframes curtain-drop {
        from { transform: translateY(-105%); }
        to { transform: translateY(0); }
      }
      @keyframes curtain-exit {
        from { transform: translateY(0); }
        to { transform: translateY(105%); }
      }
      @keyframes title-reveal {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes char-rise {
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fade-in-down {
        from { opacity: 0; transform: translateY(-18px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes node-pop {
        from { opacity: 0; transform: translateY(8px) scale(0.92); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes market-scan {
        from { transform: translateX(-100%); }
        to { transform: translateX(100%); }
      }
      @keyframes live-price-pulse {
        0%, 100% { text-shadow: 0 0 8px rgba(0,240,255,0.35); }
        50% { text-shadow: 0 0 18px rgba(0,240,255,0.9), 0 0 32px rgba(0,240,255,0.35); }
      }
      @keyframes chart-tension {
        from { filter: drop-shadow(0 0 5px rgba(0,240,255,0.35)); }
        to { filter: drop-shadow(0 0 13px rgba(255,215,0,0.35)); }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes handbook-pulse {
        0%, 100% { box-shadow: 0 0 12px rgba(255,215,0,0.18); }
        50% { box-shadow: 0 0 26px rgba(255,215,0,0.45); }
      }
    `}</style>
  );
}

function PrimaryButton({ children, className = "", tone = "cyan", ...props }) {
  const tones = {
    cyan: "bg-[linear-gradient(135deg,#00f0ff,#00c8ff)] text-[#0a0a1a] hover:shadow-[0_0_28px_rgba(0,240,255,0.4)]",
    gold: "bg-[linear-gradient(135deg,#ffd700,#ff9f1a)] text-[#0a0a1a] hover:shadow-[0_0_28px_rgba(255,215,0,0.35)]",
    red: "border border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/16 hover:shadow-[0_0_24px_rgba(239,68,68,0.3)]",
    ghost: "border border-cyan-400/30 bg-cyan-400/[0.04] text-[#00f0ff] hover:bg-cyan-400/[0.09] hover:shadow-[0_0_22px_rgba(0,240,255,0.18)]",
  };

  return (
    <button
      type="button"
      className={cn(
        "shine-button rounded-md px-6 py-3 text-sm font-bold tracking-[0.14em] transition duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40",
        tones[tone],
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function TerminalCard({ children, className = "" }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] shadow-[0_8px_25px_rgba(0,240,255,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function TerminalHeader({ label, accent }) {
  return (
    <div className="font-terminal flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#1a1c24] px-4 py-3 text-sm text-slate-400">
      <span>{label}</span>
      {accent && <span className="text-[#00f0ff]">{accent}</span>}
    </div>
  );
}

function SideData({ currentDay }) {
  const side =
    currentDay === 4
      ? {
          leftStatus: "理论价",
          dayLabel: "结业实战",
          mode: "实战报价",
          topic: "三客户定价",
        }
      : currentDay === 3
      ? {
          leftStatus: "障碍线",
          dayLabel: "第三天",
          mode: "路径",
          topic: "KNOCK-OUT",
        }
      : currentDay === 2
        ? {
            leftStatus: "理论价",
            dayLabel: "第二天",
            mode: "报价",
            topic: "二叉树",
          }
        : {
            leftStatus: "固定路径",
            dayLabel: "第一天",
            mode: "教学",
            topic: "CALL / PUT",
          };

  return (
    <>
      <div className="font-terminal fixed left-8 top-1/2 z-10 hidden -translate-y-1/2 text-sm leading-8 text-slate-700 lg:block">
        <div className="text-slate-600">恒指</div>
        <div className="text-[#00f0ff]">21,500.00</div>
        <div className="text-green-500">{side.leftStatus}</div>
        <div className="text-[#ffd700]">{side.dayLabel}</div>
        <br />
        <div className="text-slate-600">模式</div>
        <div className="text-[#00f0ff]">{side.mode}</div>
      </div>

      <div className="font-terminal fixed right-8 top-1/2 z-10 hidden -translate-y-1/2 text-right text-sm leading-8 text-slate-700 lg:block">
        <div className="text-slate-600">产品</div>
        <div className="text-[#00f0ff]">
          {currentDay === 4
            ? "普通 / 障碍"
            : currentDay === 3
              ? "障碍期权"
              : "普通期权"}
        </div>
        <br />
        <div className="text-slate-600">主题</div>
        <div className="text-[#00f0ff]">{side.topic}</div>
        <br />
        <div className="text-slate-600">柜台</div>
        <div className="text-[#00f0ff]">中环</div>
      </div>
    </>
  );
}

function TopBar({
  currentDay,
  stage,
  handbookHasNew,
  canGoBack,
  onGoBack,
  onOpenHandbook,
}) {
  const dayConfig = dayConfigs[currentDay] ?? day1Config;
  const stageMeta = stageConfig[stage] ?? { label: "待命" };

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-3 border-b border-cyan-400/15 py-4 text-sm md:mt-5">
      <div className="font-terminal tracking-[0.16em] text-[#00f0ff]">
        第 {currentDay} 天：{dayConfig.title}
      </div>
      <div className="font-terminal text-slate-500">
        时间：<span className="text-slate-300">{stageMeta.label}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onGoBack}
          disabled={!canGoBack}
          className="font-terminal rounded-md border border-cyan-400/25 bg-cyan-400/[0.04] px-4 py-2 text-xs font-bold tracking-[0.16em] text-[#00f0ff] transition duration-300 hover:bg-cyan-400/[0.09] disabled:pointer-events-none disabled:opacity-35"
        >
          上一页
        </button>
        <button
          type="button"
          onClick={onOpenHandbook}
          className={cn(
            "font-terminal rounded-md border px-4 py-2 text-xs font-bold tracking-[0.16em] transition duration-300",
            handbookHasNew
              ? "handbook-new border-[#ffd700]/70 bg-[#ffd700]/15 text-[#ffd700]"
              : "border-cyan-400/25 bg-cyan-400/[0.04] text-[#00f0ff] hover:bg-cyan-400/[0.09]",
          )}
        >
          打开手册 {handbookHasNew ? "/ 新内容" : ""}
        </button>
      </div>
    </div>
  );
}

function MentorPanel({ text, skipSignal }) {
  return (
    <TerminalCard className="h-full overflow-hidden">
      <TerminalHeader label="导师面板 / MARTIN" accent="在线" />
      <div className="p-5">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#00f0ff,#0088aa)] font-terminal text-2xl font-black text-[#0a0a1a] shadow-[0_0_28px_rgba(0,240,255,0.25)]">
            M
          </div>
          <div>
            <div className="font-terminal text-sm tracking-[0.18em] text-[#00f0ff]">
              导师 MARTIN
            </div>
            <div className="mt-1 text-xs text-slate-500">新人交易员引导</div>
          </div>
        </div>

        <div className="min-h-36 rounded-md border-l-4 border-[#00f0ff] bg-cyan-400/[0.04] p-4 text-base leading-8 text-slate-300">
          <TypewriterText text={text} skipSignal={skipSignal} />
        </div>
      </div>
    </TerminalCard>
  );
}

function BottomActionBar({
  stage,
  selectedProduct,
  selectedSuitability,
  marketComplete,
  selectedQuote,
  day4ClientIndex = 0,
  actions,
}) {
  const quoteEntered =
    selectedQuote !== "" && selectedQuote !== null && Number.isFinite(Number(selectedQuote));
  const day4IsJudge = day4Clients[day4ClientIndex]?.taskType === "judge";
  const day4IsLastClient = day4ClientIndex >= day4Clients.length - 1;
  const actionSets = {
    day1_welcome: (
      <PrimaryButton onClick={actions.startBriefing} className="px-10">
        开始晨会
      </PrimaryButton>
    ),
    day1_lesson_basics: (
      <PrimaryButton onClick={actions.toCallPutLesson} className="px-10">
        继续：Call 与 Put
      </PrimaryButton>
    ),
    day1_intro: (
      <PrimaryButton onClick={actions.toPremiumLesson} className="px-10">
        继续：期权费
      </PrimaryButton>
    ),
    day1_lesson_premium: (
      <PrimaryButton onClick={actions.toVanillaRuleLesson} className="px-10">
        继续：普通期权规则
      </PrimaryButton>
    ),
    day1_lesson_vanilla_rule: (
      <PrimaryButton onClick={actions.finishLesson} className="px-10">
        更新工作手册
      </PrimaryButton>
    ),
    day1_handbook_updated: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.meetClient}>接待第一位客户</PrimaryButton>
      </>
    ),
    day1_client_arrival: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.toProductSelection}>
          进入产品选择
        </PrimaryButton>
      </>
    ),
    day1_product_selection: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmProduct} disabled={!selectedProduct}>
          确认产品
        </PrimaryButton>
      </>
    ),
    day1_risk_disclosure: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmDisclosure}>确认披露</PrimaryButton>
      </>
    ),
    day1_market_run: (
      marketComplete ? (
        <PrimaryButton onClick={actions.viewReport} tone="gold">
          查看报告
        </PrimaryButton>
      ) : null
    ),
    day1_report: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.finishDay}>完成第一天</PrimaryButton>
      </>
    ),
    day1_complete: (
      <>
        <PrimaryButton tone="gold" onClick={actions.startDay2}>
          进入第二天：定价柜台
        </PrimaryButton>
        <PrimaryButton tone="ghost" onClick={actions.restartDay1}>
          重新开始第一天
        </PrimaryButton>
      </>
    ),
    day2_intro: (
      <PrimaryButton onClick={actions.toDay2PricingAnchor} className="px-10">
        开始定价课
      </PrimaryButton>
    ),
    day2_lesson_pricing_anchor: (
      <PrimaryButton onClick={actions.toDay2TreePaths} className="px-10">
        继续：二叉树路径
      </PrimaryButton>
    ),
    day2_lesson_tree_paths: (
      <PrimaryButton onClick={actions.toDay2BackwardPrice} className="px-10">
        继续：到期收益与倒推
      </PrimaryButton>
    ),
    day2_lesson_backward_price: (
      <PrimaryButton onClick={actions.finishDay2Intro} className="px-10">
        更新工作手册
      </PrimaryButton>
    ),
    day2_handbook_updated: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.meetDay2Client}>接待客户</PrimaryButton>
      </>
    ),
    day2_research_terminal: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.toDay2TreeExplainer}>参数已记录，进入定价台</PrimaryButton>
      </>
    ),
    day2_client_arrival: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.toDay2ProductReview}>
          进入产品确认
        </PrimaryButton>
      </>
    ),
    day2_product_review: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmProduct}>确认产品</PrimaryButton>
      </>
    ),
    day2_tree_explainer: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmQuote} disabled={!quoteEntered}>
          {quoteEntered ? "继续风险披露" : "请先填写报价"}
        </PrimaryButton>
      </>
    ),
    day2_quote_slider: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmQuote}>确认报价</PrimaryButton>
      </>
    ),
    day2_risk_disclosure: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmDisclosure}>
          确认风险披露
        </PrimaryButton>
      </>
    ),
    day2_client_response: (
      <PrimaryButton onClick={actions.toDay2MarketRun}>查看市场结算</PrimaryButton>
    ),
    day2_market_run: (
      marketComplete ? (
        <PrimaryButton onClick={actions.viewReport} tone="gold">
          查看报告
        </PrimaryButton>
      ) : (
        <PrimaryButton disabled>行情运行中…</PrimaryButton>
      )
    ),
    day2_report: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.finishDay2}>完成第二天</PrimaryButton>
      </>
    ),
    day2_complete: (
      <>
        <PrimaryButton tone="gold" onClick={actions.startDay3}>
          进入第三天：障碍期权
        </PrimaryButton>
        <PrimaryButton tone="ghost" onClick={actions.restartDay2}>
          重新开始第二天
        </PrimaryButton>
      </>
    ),
    day3_intro: (
      <PrimaryButton onClick={actions.toDay3BarrierConcept} className="px-10">
        开始障碍课
      </PrimaryButton>
    ),
    day3_lesson_barrier_concept: (
      <PrimaryButton onClick={actions.toDay3KnockOut} className="px-10">
        继续：什么是敲出
      </PrimaryButton>
    ),
    day3_lesson_knock_out: (
      <PrimaryButton onClick={actions.finishDay3Intro} className="px-10">
        更新工作手册
      </PrimaryButton>
    ),
    day3_research_terminal: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.toDay3CompareVanilla}>
          参数已记录，继续定价
        </PrimaryButton>
      </>
    ),
    day3_lesson_compare_vanilla: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmQuote} disabled={!quoteEntered}>
          {quoteEntered ? "继续风险披露" : "请先填写报价"}
        </PrimaryButton>
      </>
    ),
    day3_handbook_updated: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.meetDay3Client}>接待客户</PrimaryButton>
      </>
    ),
    day3_client_arrival: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.toDay3ProductSelection}>
          进入产品选择
        </PrimaryButton>
      </>
    ),
    day3_product_selection: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.toDay3ResearchTerminal}>
          前往数据台查参数
        </PrimaryButton>
      </>
    ),
    day3_risk_disclosure: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmDisclosure}>
          确认风险披露
        </PrimaryButton>
      </>
    ),
    day3_client_response: (
      <PrimaryButton onClick={actions.toDay3MarketRun}>查看市场结算</PrimaryButton>
    ),
    day3_market_run: (
      marketComplete ? (
        <PrimaryButton onClick={actions.viewReport} tone="gold">
          查看报告
        </PrimaryButton>
      ) : null
    ),
    day3_report: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.finishDay3}>完成第三天</PrimaryButton>
      </>
    ),
    day3_complete: (
      <>
        <PrimaryButton tone="gold" onClick={actions.startDay4}>
          进入结业实战：三客户定价
        </PrimaryButton>
        <PrimaryButton tone="ghost" onClick={actions.restartDay3}>
          重新开始第三天
        </PrimaryButton>
      </>
    ),
    day4_intro: (
      <PrimaryButton onClick={actions.beginDay4Clients} className="px-10">
        开始接待客户
      </PrimaryButton>
    ),
    day4_client_arrival: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.toDay4Task}>
          {day4IsJudge ? "我已读懂需求，去判断产品" : "我已读懂需求，去报价"}
        </PrimaryButton>
      </>
    ),
    day4_judge: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmProduct} disabled={!selectedProduct}>
          确认产品，进入报价
        </PrimaryButton>
      </>
    ),
    day4_pricing: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          打开手册
        </PrimaryButton>
        <PrimaryButton onClick={actions.submitDay4Quote} disabled={!quoteEntered}>
          {quoteEntered ? "提交报价" : "请先填写报价"}
        </PrimaryButton>
      </>
    ),
    day4_client_response: (
      <PrimaryButton onClick={actions.nextDay4Client} tone="gold">
        {day4IsLastClient ? "查看结业成绩单" : "下一位客户"}
      </PrimaryButton>
    ),
    day4_scorecard: (
      <PrimaryButton onClick={actions.finishDay4} tone="gold" className="px-10">
        完成结业
      </PrimaryButton>
    ),
    day4_complete: (
      <>
        <PrimaryButton tone="ghost" disabled>
          全部课程已完成
        </PrimaryButton>
        <PrimaryButton tone="gold" onClick={actions.restartDay4}>
          重新开始结业实战
        </PrimaryButton>
      </>
    ),
  };

  return (
    <div className="mx-auto mb-5 flex w-full max-w-[1180px] flex-wrap items-center justify-end gap-3 border-t border-cyan-400/15 pt-4">
      {actionSets[stage]}
    </div>
  );
}

function HandbookOverlay({ open, unlockedEntries, onClose }) {
  const entries = allHandbookEntries.filter((entry) =>
    unlockedEntries.includes(entry.id),
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col border-l border-cyan-400/20 bg-[#0a0a1a]/95 shadow-[0_0_45px_rgba(0,240,255,0.18)]">
        <div className="flex items-center justify-between border-b border-white/10 bg-[#1a1c24] px-5 py-4">
          <div>
            <div className="font-terminal text-sm tracking-[0.2em] text-[#00f0ff]">
              交易员工作手册
            </div>
            <div className="mt-1 text-xs text-slate-500">Martin 的阶段规则本</div>
          </div>
          <PrimaryButton tone="ghost" onClick={onClose} className="px-4 py-2 text-xs">
            关闭手册
          </PrimaryButton>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {entries.length === 0 ? (
            <div className="flex min-h-96 flex-col items-center justify-center text-center">
              <div className="font-terminal mb-4 text-3xl font-black tracking-[0.18em] text-slate-700">
                空白
              </div>
              <p className="max-w-md text-sm leading-7 text-slate-500">
                还没有解锁任何手册内容。先听完 Martin 的晨会教学。
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {entries.map((entry) => (
                <div key={entry.id} className="scene-enter">
                  <div className="mb-4 rounded-md border border-[#ffd700]/25 bg-[#ffd700]/[0.06] p-4">
                    <div className="font-terminal text-xs tracking-[0.18em] text-[#ffd700]">
                      已解锁
                    </div>
                    <h2 className="mt-2 text-2xl font-black text-slate-100">{entry.title}</h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {entry.sections.map((section) => (
                      <section
                        key={section.title}
                        className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] p-4"
                      >
                        <h3 className="font-terminal mb-3 text-sm tracking-[0.16em] text-[#00f0ff]">
                          {section.title}
                        </h3>
                        <ul className="space-y-2 text-sm leading-6 text-slate-300">
                          {section.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-2">
                              <span className="text-[#ffd700]">-</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StartScreen({ onStart, skipSignal }) {
  const [introDone, setIntroDone] = useState(false);
  const [titleReady, setTitleReady] = useState(false);
  const titleChars = "中环风云".split("");
  const introText =
    "一场金融风暴正在逼近。你是中环投行新来的期权交易员。第一天上班，导师 Martin 会教你用最基础的普通期权，接待第一位客户。";

  useEffect(() => {
    const timerId = window.setTimeout(() => setTitleReady(true), 2800);
    return () => window.clearTimeout(timerId);
  }, []);

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="opening-curtain" />
      <div className="title-location font-terminal mb-6 text-sm uppercase tracking-[0.32em] text-[#00f0ff]">
        Hong Kong · Central Options Desk
      </div>
      <div
        className={cn(
          "title-stage text-5xl font-black tracking-[0.12em] md:text-7xl",
          titleReady && "title-ready",
        )}
      >
        <div className="title-shadow" aria-hidden="true">
          {titleChars.map((char, index) => (
            <span
              key={`shadow-${char}-${index}`}
              className="title-char"
              style={{ animationDelay: `${1.65 + index * 0.15}s` }}
            >
              {char}
            </span>
          ))}
        </div>
        <h1 className="title-glow">
          {titleChars.map((char, index) => (
            <span
              key={`glow-${char}-${index}`}
              className="title-char"
              style={{ animationDelay: `${1.65 + index * 0.15}s` }}
            >
              {char}
            </span>
          ))}
        </h1>
      </div>
      <div className="title-subtitle font-terminal mt-5 text-xl tracking-[0.32em] text-[#ffd700]">
        CHAPTER 1 · 1997 亚洲金融风暴
      </div>
      <p className="mt-10 min-h-24 max-w-2xl text-lg leading-9 text-slate-400">
        <TypewriterText
          text={introText}
          speed={36}
          startDelay={2800}
          skipSignal={skipSignal}
          onDone={() => setIntroDone(true)}
        />
      </p>
      <div
        className={cn(
          "mt-10 transition duration-500",
          introDone ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <PrimaryButton onClick={onStart} className="px-14 py-4 text-lg">
          进入游戏
        </PrimaryButton>
      </div>
      <div className="title-footer font-terminal fixed bottom-8 z-10 text-xs tracking-[0.2em] text-slate-700">
        <span className="text-[#00f0ff]">FIN 7870</span> · Digital Investfair · <span className="text-[#00f0ff]">HSI OPTIONS</span> · HKEX
      </div>
    </div>
  );
}

function WelcomePanel() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="新人报到 / 交易台" accent="第一天上班" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-center justify-center rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/[0.05] p-6 text-center">
          <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-[linear-gradient(135deg,#00f0ff,#0088aa)] font-terminal text-5xl font-black text-[#0a0a1a] shadow-[0_0_38px_rgba(0,240,255,0.25)]">
            M
          </div>
          <div className="font-terminal text-sm tracking-[0.18em] text-[#00f0ff]">MENTOR MARTIN</div>
          <div className="mt-3 text-2xl font-black text-slate-100">“欢迎上班，新人。”</div>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            你不用一开始就懂金融市场。今天只学三个东西：方向、期权费、适当性。
          </p>
        </div>

        <div className="space-y-4">
          {[
            ["你的身份", "期权交易柜台的新手交易员，负责读懂客户需求并推荐合适产品。"],
            ["今天目标", "先不要碰复杂定价，只把普通期权 Call / Put / Premium 的直觉建立起来。"],
            ["Martin 的规则", "看不懂就打开手册。真正的交易员不是死记硬背，而是会查规则、会问问题。"],
          ].map(([label, text]) => (
            <div key={label} className="rounded-lg border border-cyan-400/15 bg-black/30 p-5">
              <div className="font-terminal mb-2 text-xs tracking-[0.16em] text-[#00f0ff]">{label}</div>
              <div className="text-base leading-8 text-slate-300">{text}</div>
            </div>
          ))}
        </div>
      </div>
    </TerminalCard>
  );
}

function BasicsLessonPanel() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第一课 / 什么是期权" accent="先讲直觉，不讲公式" />
      <div className="space-y-5 p-6">
        <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#00f0ff]">
            核心比喻：一张未来选择券
          </div>
          <p className="text-lg leading-9 text-slate-300">
            期权不是股票，也不是“我猜涨跌”的按钮。你可以把它想成一张
            <span className="font-bold text-[#ffd700]">未来选择券</span>：
            今天先付一笔小钱，未来如果情况对你有利，你就使用这张券；如果情况不利，你可以选择不用。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["买方", "付钱买到选择权。未来有利就用，不利可以不用。"],
            ["卖方", "先收钱，但未来可能要履行承诺。今天你主要从买方角度理解。"],
            ["期权费", "买方付出的入场券价格。判断错了，这笔钱可能全部损失。"],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] p-5">
              <div className="mb-3 text-xl font-black text-[#00f0ff]">{title}</div>
              <div className="text-sm leading-7 text-slate-300">{body}</div>
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-[#ffd700] bg-[#ffd700]/[0.06] p-4 text-sm leading-7 text-[#ffd700]">
          Martin 小口诀：期权买方买的是“权利”，不是“保证赚钱”。这句话记住，后面的客户决策就不会乱。
        </div>
      </div>
    </TerminalCard>
  );
}

function CallPutVisualExample() {
  const points = [80, 90, 100, 110, 120];

  return (
    <div className="mt-6 rounded-lg border border-cyan-400/15 bg-black/30 p-5">
      <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#00f0ff]">
        图表例子 / 到期价格怎么影响方向
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md border border-white/10 bg-[#080d19]/80 p-4">
          <svg viewBox="0 0 620 230" className="h-auto w-full" role="img" aria-label="Call 与 Put 到期方向图">
            <defs>
              <linearGradient id="callZone" x1="0" x2="1">
                <stop offset="0%" stopColor="rgba(255,215,0,0)" />
                <stop offset="100%" stopColor="rgba(255,215,0,0.2)" />
              </linearGradient>
              <linearGradient id="putZone" x1="1" x2="0">
                <stop offset="0%" stopColor="rgba(0,240,255,0)" />
                <stop offset="100%" stopColor="rgba(0,240,255,0.2)" />
              </linearGradient>
            </defs>

            <rect x="35" y="36" width="260" height="118" rx="8" fill="url(#putZone)" stroke="rgba(0,240,255,0.22)" />
            <rect x="325" y="36" width="260" height="118" rx="8" fill="url(#callZone)" stroke="rgba(255,215,0,0.22)" />

            <line x1="55" y1="132" x2="565" y2="132" stroke="rgba(226,232,240,0.45)" strokeWidth="2" />
            <line x1="310" y1="55" x2="310" y2="174" stroke="#ffffff" strokeDasharray="5 7" />
            <text x="310" y="44" textAnchor="middle" className="fill-slate-200 text-[13px]">
              行权价 100
            </text>

            {points.map((point) => {
              const x = 55 + ((point - 80) / 40) * 510;
              return (
                <g key={point}>
                  <line x1={x} x2={x} y1="126" y2="138" stroke="rgba(226,232,240,0.65)" />
                  <text x={x} y="160" textAnchor="middle" className="fill-slate-400 text-[12px]">
                    {point}
                  </text>
                </g>
              );
            })}

            <path
              d="M 55 87 L 310 132 L 565 132"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 55 132 L 310 132 L 565 87"
              fill="none"
              stroke="#ffd700"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <text x="118" y="74" className="fill-[#00f0ff] text-[16px] font-bold">
              Put 更开心
            </text>
            <text x="420" y="74" className="fill-[#ffd700] text-[16px] font-bold">
              Call 更开心
            </text>
            <text x="310" y="204" textAnchor="middle" className="fill-slate-400 text-[13px]">
              标的到期价格从低到高 →
            </text>
          </svg>
        </div>

        <div className="grid gap-3 text-sm leading-7 text-slate-300">
          <div className="rounded-md border border-cyan-400/20 bg-cyan-400/[0.05] p-4">
            <div className="font-terminal mb-2 text-xs tracking-[0.16em] text-[#00f0ff]">
              如果到期价格低于 100
            </div>
            Put 有价值，因为客户拥有“按 100 卖出”的权利；市场越低，这个卖出权越有用。
          </div>
          <div className="rounded-md border border-[#ffd700]/20 bg-[#ffd700]/[0.06] p-4">
            <div className="font-terminal mb-2 text-xs tracking-[0.16em] text-[#ffd700]">
              如果到期价格高于 100
            </div>
            Call 有价值，因为客户拥有“按 100 买入”的权利；市场越高，这个买入权越有用。
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
            现在先不用算多少钱，只记住方向：左边偏 Put，右边偏 Call。
          </div>
        </div>
      </div>
    </div>
  );
}

function IntroPanel() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第一课 / Call 与 Put" accent="方向判断" />
      <div className="p-6">
        <div className="font-terminal mb-4 text-xs tracking-[0.32em] text-[#00f0ff]">
          先判断客户方向，再谈产品
        </div>
        <h1 className="bg-[linear-gradient(90deg,#00f0ff,#ffd700)] bg-clip-text text-4xl font-black tracking-[0.08em] text-transparent md:text-6xl">
          CALL / PUT
        </h1>
        <div className="font-terminal mt-3 text-xl tracking-[0.22em] text-[#ffd700]">
          看涨与看跌，是交易台最先听见的两个词
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {day1Config.introCards.map((card) => (
            <div
              key={card.id}
              className={cn(
                "rounded-lg border p-5 shadow-[0_0_24px_rgba(0,240,255,0.06)]",
                card.tone === "gold"
                  ? "border-[#ffd700]/30 bg-[#ffd700]/[0.06]"
                  : "border-cyan-400/25 bg-cyan-400/[0.05]",
              )}
            >
              <div
                className={cn(
                  "font-terminal mb-3 text-xs tracking-[0.18em]",
                  card.tone === "gold" ? "text-[#ffd700]" : "text-[#00f0ff]",
                )}
              >
                {card.code}
              </div>
              <div className="mb-4 text-2xl font-black text-slate-100">{card.title}</div>
              <ul className="space-y-3 text-sm leading-7 text-slate-300">
                {card.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className={card.tone === "gold" ? "text-[#ffd700]" : "text-[#00f0ff]"}>
                      -
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-md border-l-4 border-[#00f0ff] bg-cyan-400/[0.04] p-4 text-sm leading-7 text-slate-300">
          第一关先不进入定价，只建立交易台最重要的直觉：客户看涨看 Call，客户看跌看 Put，买方为了这个权利支付期权费。
        </div>

        <CallPutVisualExample />
      </div>
    </TerminalCard>
  );
}

function PremiumLessonPanel() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第二课 / 期权费" accent="买方最大的心理账户" />
      <div className="grid gap-5 p-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-[#ffd700]/25 bg-[#ffd700]/[0.06] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#ffd700]">
            PREMIUM / 期权费
          </div>
          <h2 className="mb-4 text-2xl font-black text-slate-100">先付一笔钱，买未来的选择</h2>
          <p className="text-base leading-8 text-slate-300">
            如果客户买一份普通期权，他不是免费获得机会，而是先支付一笔
            <span className="font-bold text-[#ffd700]">期权费</span>。这笔钱就像电影票：
            你买了票，就获得进场权；最后电影好不好看，不会退票。
          </p>
        </div>

        <div className="space-y-4">
          {[
            ["市场方向判断正确", "期权可能产生价值，但还要先覆盖期权费，客户才真正赚钱。"],
            ["市场方向判断错误", "期权可能到期一文不值，客户损失已支付的期权费。"],
            ["最大损失直觉", "普通期权买方通常不会亏超过期权费，但这不等于产品稳赚。"],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal mb-2 text-xs tracking-[0.16em] text-[#00f0ff]">
                {title}
              </div>
              <div className="text-sm leading-7 text-slate-300">{body}</div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 rounded-lg border border-cyan-400/15 bg-black/30 p-5">
          <div className="font-terminal mb-4 text-xs tracking-[0.18em] text-[#00f0ff]">
            小例子
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
              <div className="text-sm text-slate-500">客户支付</div>
              <div className="mt-2 text-2xl font-black text-[#ffd700]">186 点期权费</div>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
              <div className="text-sm text-slate-500">换来</div>
              <div className="mt-2 text-2xl font-black text-[#00f0ff]">未来上涨机会</div>
            </div>
            <div className="rounded-md border border-red-500/20 bg-red-500/[0.05] p-4">
              <div className="text-sm text-slate-500">最坏情况</div>
              <div className="mt-2 text-2xl font-black text-red-300">亏掉 186 点</div>
            </div>
          </div>
        </div>
      </div>
    </TerminalCard>
  );
}

function VanillaRulePanel() {
  const examples = [
    ["中途先跌", "21,500 → 21,100 → 22,400", "只要最终到期高于行权价，普通 Call 仍可能有价值。"],
    ["中途先涨", "21,500 → 22,600 → 21,900", "如果最终到期低于行权价，普通 Call 可能没有价值。"],
    ["关键区别", "普通期权 ≠ 障碍期权", "普通期权不会因为中途碰到某个价格就自动敲出。"],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第三课 / 普通期权规则" accent="重点看到期价格" />
      <div className="space-y-5 p-6">
        <div className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#00f0ff]">
            VANILLA OPTION / 普通期权
          </div>
          <p className="text-lg leading-9 text-slate-300">
            “普通”两个字很重要。普通期权主要看
            <span className="font-bold text-[#ffd700]">最终到期价格</span>。
            中途市场上下波动不会让它自动消失。客户最终赚不赚钱，要看到期收益能不能覆盖期权费。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {examples.map(([title, path, note]) => (
            <div key={title} className="rounded-lg border border-cyan-400/15 bg-black/30 p-5">
              <div className="font-terminal mb-2 text-xs tracking-[0.16em] text-[#00f0ff]">
                {title}
              </div>
              <div className="mb-3 text-lg font-black text-[#ffd700]">{path}</div>
              <div className="text-sm leading-7 text-slate-300">{note}</div>
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-[#ffd700] bg-[#ffd700]/[0.06] p-4 text-sm leading-7 text-[#ffd700]">
          今天不要碰障碍期权、敲出、二叉树或复杂定价。你只要会读客户方向，并知道普通期权买方最大损失通常是期权费。
        </div>
      </div>
    </TerminalCard>
  );
}

function HandbookUpdatedPanel() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="系统消息" accent="工作手册新增页面" />
      <div className="flex min-h-[430px] flex-col items-center justify-center p-6 text-center">
        <div className="font-terminal mb-4 text-sm tracking-[0.32em] text-[#00f0ff]">
          工作手册已更新
        </div>
        <div className="bg-[linear-gradient(90deg,#00f0ff,#ffd700)] bg-clip-text text-4xl font-black tracking-[0.1em] text-transparent md:text-5xl">
          普通期权基础
        </div>
        <p className="mt-8 max-w-2xl text-base leading-8 text-slate-300">
          手册现在只解锁了最基础的普通期权页面。后面遇到客户和风险披露时，Martin 会继续补充新的规则，不会一次把所有内容都倒给你。
        </p>
      </div>
    </TerminalCard>
  );
}

function ClientArrivalPanel() {
  const client = day1Config.clientProfile;
  const profileRows = [
    ["姓名", client.name],
    ["客户类型", client.type],
    ["市场观点", client.marketView],
    ["风险承受", client.riskTolerance],
    ["目标", client.goal],
    ["预算", client.budget],
    ["经验", client.experience],
  ];

  return (
    <div className="scene-enter grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <TerminalCard className="overflow-hidden">
        <TerminalHeader label="客户资料" accent="散户订单流" />
        <div className="p-5">
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffd700,#ff8c00)] font-terminal text-3xl font-black text-[#0a0a1a] shadow-[0_0_36px_rgba(255,215,0,0.24)]">
            L
          </div>
          <div className="mb-5 text-center text-2xl font-bold text-[#ffd700]">{client.name}</div>
          <div className="space-y-3">
            {profileRows.map(([label, value]) => (
              <div
                key={label}
                className="grid gap-2 border-b border-white/10 pb-2 text-sm md:grid-cols-[140px_1fr]"
              >
                <div className="font-terminal text-xs tracking-[0.14em] text-slate-500">
                  {label}
                </div>
                <div className="text-slate-300">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </TerminalCard>

      <TerminalCard className="overflow-hidden">
        <TerminalHeader label="客户对白" accent="需求记录" />
        <div className="space-y-4 p-5">
          {client.dialogue.map((line) => (
            <div
              key={line}
              className="rounded-lg border border-cyan-400/15 bg-black/30 p-4 text-lg leading-8 text-slate-200"
            >
              <span className="font-terminal mr-2 text-xs text-[#ffd700]">李女士</span>
              “{line}”
            </div>
          ))}
        </div>
      </TerminalCard>
    </div>
  );
}

function ProductSelectionPanel({
  selectedProduct,
  productMessage,
  onSelectProduct,
  products = day1Config.products,
  correctProductId = day1Config.scoringRules.correctProduct,
  title = "产品选择台",
  accent = "选择一个产品",
}) {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label={title} accent={accent} />
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => {
            const selected = selectedProduct === product.id;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => onSelectProduct(product.id)}
                className={cn(
                  "rounded-lg border p-5 text-left transition duration-300",
                  selected
                    ? "border-[#ffd700]/70 bg-[#ffd700]/[0.08] shadow-[0_0_26px_rgba(255,215,0,0.18)]"
                    : "border-cyan-400/15 bg-black/25 hover:border-cyan-400/45 hover:bg-cyan-400/[0.06]",
                  product.locked && "border-slate-700 bg-slate-900/35 opacity-70",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-terminal text-xs tracking-[0.16em] text-slate-500">
                      {product.status}
                    </div>
                    <div
                      className={cn(
                        "mt-2 text-xl font-black",
                        product.locked
                          ? "text-slate-500"
                          : selected
                            ? "text-[#ffd700]"
                            : "text-[#00f0ff]",
                      )}
                    >
                      {product.name}
                    </div>
                    <div className="font-terminal mt-1 text-xs text-slate-500">{product.term}</div>
                  </div>
                  {selected && (
                    <div className="font-terminal rounded border border-[#ffd700]/40 px-2 py-1 text-xs text-[#ffd700]">
                      已选择
                    </div>
                  )}
                </div>

                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
                  {product.description.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[#ffd700]">-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {product.locked && (
                  <div className="mt-4 rounded border border-red-500/25 bg-red-500/[0.06] p-3 text-xs leading-5 text-red-300">
                    未解锁：Martin 还没有教授这个产品。
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {productMessage && (
          <div
            className={cn(
              "mt-5 rounded-md border-l-4 p-4 text-sm leading-7",
              selectedProduct === correctProductId
                ? "border-green-400 bg-green-400/[0.06] text-green-300"
                : "border-[#ffd700] bg-[#ffd700]/[0.06] text-[#ffd700]",
            )}
          >
            {productMessage}
          </div>
        )}
      </div>
    </TerminalCard>
  );
}

function RiskDisclosurePanel({
  selectedDisclosures,
  onToggleDisclosure,
  disclosureFeedback,
  items = day1Config.disclosureItems,
  instruction = "在确认交易前，选择你必须向李女士说明的风险内容。",
}) {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="风险披露" accent="选择必须说明的内容" />
      <div className="p-5">
        <h2 className="mb-2 text-2xl font-black text-slate-100">风险披露</h2>
        <p className="mb-5 text-sm leading-7 text-slate-400">
          {instruction}
        </p>

        <div className="space-y-3">
          {items.map((item, index) => {
            const checked = selectedDisclosures.includes(item.id);
            return (
              <label
                key={item.id}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition duration-300",
                  checked
                    ? "border-[#00f0ff]/60 bg-cyan-400/[0.08]"
                    : "border-cyan-400/15 bg-black/25 hover:border-cyan-400/35",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleDisclosure(item.id)}
                  className="mt-1 h-4 w-4 accent-cyan-400"
                />
                <div>
                  <div className="font-terminal mb-1 text-xs tracking-[0.16em] text-slate-500">
                    披露项 {index + 1}
                  </div>
                  <div className="text-sm leading-7 text-slate-200">{item.text}</div>
                </div>
              </label>
            );
          })}
        </div>

        {disclosureFeedback && (
          <div
            className={cn(
              "mt-5 rounded-md border-l-4 p-4 text-sm leading-7",
              disclosureFeedback.tone === "good"
                ? "border-green-400 bg-green-400/[0.06] text-green-300"
                : disclosureFeedback.tone === "danger"
                  ? "border-red-500 bg-red-500/[0.06] text-red-300"
                  : "border-[#ffd700] bg-[#ffd700]/[0.06] text-[#ffd700]",
            )}
          >
            {disclosureFeedback.text}
          </div>
        )}
      </div>
    </TerminalCard>
  );
}

function MarketRunPanel({ selectedProduct, marketHasRun, visibleMarketSteps }) {
  const market = day1Config.market;
  const chartPath = market.chartPath ?? market.path;
  const finalPrice = market.path[market.path.length - 1];
  const payoff = Math.max(finalPrice - market.strike, 0);
  const netPnl = payoff - market.premium;
  const selectedProductName =
    day1Config.products.find((product) => product.id === selectedProduct)?.name ?? "未选择产品";
  const activeCount = Math.min(Math.max(visibleMarketSteps, 1), chartPath.length);
  const activePrices = chartPath.slice(0, activeCount);
  const latestPrice = activePrices[activePrices.length - 1] ?? market.spot;
  const previousPrice = activePrices[activePrices.length - 2] ?? latestPrice;
  const tickChange = latestPrice - previousPrice;
  const totalChange = latestPrice - market.spot;
  const liveIntrinsic = Math.max(latestPrice - market.strike, 0);
  const liveNet = liveIntrinsic - market.premium;
  const finalShown = marketHasRun && visibleMarketSteps >= chartPath.length;

  const chart = useMemo(() => {
    const width = 760;
    const height = 320;
    const pad = { left: 54, right: 34, top: 34, bottom: 46 };
    const minPrice = Math.min(...chartPath, market.strike) - 220;
    const maxPrice = Math.max(...chartPath, market.strike) + 180;
    const plotWidth = width - pad.left - pad.right;
    const plotHeight = height - pad.top - pad.bottom;
    const xScale = (index) => pad.left + (index / (chartPath.length - 1)) * plotWidth;
    const yScale = (price) =>
      pad.top + ((maxPrice - price) / (maxPrice - minPrice)) * plotHeight;

    return {
      width,
      height,
      minPrice,
      maxPrice,
      xScale,
      yScale,
      yTicks: [21400, 21800, 22000, 22400],
    };
  }, [chartPath, market.strike]);

  const activeLine = activePrices
    .map((price, index) => `${chart.xScale(index)},${chart.yScale(price)}`)
    .join(" ");
  const areaPoints =
    activePrices.length > 1
      ? [
          `${chart.xScale(0)},${chart.yScale(chart.minPrice)}`,
          activeLine,
          `${chart.xScale(activePrices.length - 1)},${chart.yScale(chart.minPrice)}`,
        ].join(" ")
      : "";
  const latestX = chart.xScale(activePrices.length - 1);
  const latestY = chart.yScale(latestPrice);
  const progress = ((activeCount - 1) / (chartPath.length - 1)) * 100;

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="市场路径" accent={finalShown ? "收盘价已锁定" : "行情自动运行中"} />
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-5">
          {[
            ["标的", market.underlying],
            ["开盘", formatPoints(market.spot)],
            ["行权价", formatPoints(market.strike)],
            ["期权费", `${market.premium} 点`],
            ["期限", market.maturity],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs tracking-[0.14em] text-slate-500">
                {label}
              </div>
              <div className="mt-2 text-lg font-bold text-slate-100">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/[0.05] p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-[#ffd700]">
              已选产品
            </div>
            <div className="mt-2 text-xl font-black text-slate-100">{selectedProductName}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs text-slate-500">实时价格</div>
              <div className="live-price-pulse mt-2 text-3xl font-black text-[#00f0ff]">
                {formatPoints(latestPrice)}
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/30 p-4">
              <div className="font-terminal text-xs text-slate-500">本跳变动</div>
              <div
                className={cn(
                  "mt-2 text-2xl font-black",
                  tickChange >= 0 ? "text-green-400" : "text-red-400",
                )}
              >
                {tickChange >= 0 ? "+" : ""}
                {tickChange}
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/30 p-4">
              <div className="font-terminal text-xs text-slate-500">Call 实时净值</div>
              <div
                className={cn(
                  "mt-2 text-2xl font-black",
                  liveNet >= 0 ? "text-green-400" : "text-red-400",
                )}
              >
                {liveNet >= 0 ? "+" : ""}
                {liveNet}
              </div>
            </div>
          </div>
        </div>

        <div className="market-chart-panel mt-6 rounded-lg border border-cyan-400/15 bg-[#070d19]/85 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-terminal text-sm tracking-[0.18em] text-[#00f0ff]">
                LIVE HSI PATH
              </div>
              <div className="mt-1 text-xs text-slate-500">
                价格自动跳动，终点用于普通期权到期结算
              </div>
            </div>
            <div
              className={cn(
                "font-terminal rounded border px-3 py-1 text-xs tracking-[0.16em]",
                finalShown
                  ? "border-green-400/35 bg-green-400/[0.08] text-green-300"
                  : "border-[#ffd700]/35 bg-[#ffd700]/[0.08] text-[#ffd700]",
              )}
            >
              {finalShown ? "MARKET CLOSED" : "VOLATILITY LIVE"}
            </div>
          </div>

          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="relative z-10 w-full">
            <defs>
              <linearGradient id="marketArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,240,255,0.28)" />
                <stop offset="100%" stopColor="rgba(0,240,255,0)" />
              </linearGradient>
              <filter id="marketGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00f0ff" />
              </filter>
            </defs>
            <rect width={chart.width} height={chart.height} rx="10" fill="rgba(5,10,24,0.65)" />

            {chart.yTicks.map((tick) => (
              <g key={tick}>
                <line
                  x1={chart.xScale(0)}
                  x2={chart.xScale(chartPath.length - 1)}
                  y1={chart.yScale(tick)}
                  y2={chart.yScale(tick)}
                  stroke={tick === market.strike ? "#ffd700" : "rgba(148,163,184,0.14)"}
                  strokeDasharray={tick === market.strike ? "6 6" : "2 8"}
                />
                <text
                  x="44"
                  y={chart.yScale(tick) + 4}
                  textAnchor="end"
                  className={tick === market.strike ? "fill-[#ffd700] text-[12px]" : "fill-slate-500 text-[12px]"}
                >
                  {formatPoints(tick)}
                </text>
              </g>
            ))}

            <line
              x1={chart.xScale(0)}
              x2={chart.xScale(chartPath.length - 1)}
              y1={chart.yScale(chart.minPrice)}
              y2={chart.yScale(chart.minPrice)}
              stroke="rgba(226,232,240,0.28)"
            />

            {areaPoints && <polygon points={areaPoints} fill="url(#marketArea)" />}
            {activeLine && activePrices.length > 1 && (
              <polyline
                points={activeLine}
                fill="none"
                stroke="#00f0ff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#marketGlow)"
                className="chart-tension"
              />
            )}

            {activePrices.map((price, index) => (
              <circle
                key={`${price}-${index}`}
                cx={chart.xScale(index)}
                cy={chart.yScale(price)}
                r={index === activePrices.length - 1 ? 5 : 3}
                fill={price >= market.strike ? "#ffd700" : "#00f0ff"}
                opacity={index === activePrices.length - 1 ? 1 : 0.65}
              />
            ))}

            <circle cx={latestX} cy={latestY} r="13" fill="none" stroke="#00f0ff" strokeWidth="2" opacity="0.35">
              <animate attributeName="r" values="9;18;9" dur="0.9s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.75;0.1;0.75" dur="0.9s" repeatCount="indefinite" />
            </circle>
            <text x={latestX + 12} y={latestY - 12} className="fill-[#00f0ff] text-[13px] font-bold">
              {formatPoints(latestPrice)}
            </text>
            <text x={chart.xScale(chartPath.length - 1)} y={chart.height - 12} textAnchor="end" className="fill-slate-500 text-[12px]">
              进度 {Math.round(progress)}%
            </text>
          </svg>
        </div>

        {finalShown ? (
          <div className="scene-enter mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs text-slate-500">最终价格</div>
              <div className="mt-2 text-3xl font-black text-[#00f0ff]">
                {formatPoints(finalPrice)}
              </div>
            </div>
            <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs text-slate-500">Call 到期收益</div>
              <div className="mt-2 text-lg font-bold text-slate-100">
                max(22,400 - 22,000, 0) = <span className="text-[#00f0ff]">{payoff}</span>
              </div>
            </div>
            <div className="rounded-lg border border-green-400/20 bg-green-400/[0.05] p-4">
              <div className="font-terminal text-xs text-slate-500">净盈亏</div>
              <div className="mt-2 text-2xl font-black text-green-400">
                {payoff} - {market.premium} = +{netPnl}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-md border-l-4 border-[#ffd700] bg-[#ffd700]/[0.06] p-4 text-sm leading-7 text-[#ffd700]">
            行情正在自动播放：价格可能先跌、再反抽、再突破。不要被中途波动吓到，普通期权最后看的是到期价格。
          </div>
        )}
      </div>
    </TerminalCard>
  );
}

function ScoreBadge({ score }) {
  const tone =
    score === "A"
      ? "border-green-400/40 bg-green-400/[0.08] text-green-300"
      : score === "B" || score === "B-"
        ? "border-[#ffd700]/40 bg-[#ffd700]/[0.08] text-[#ffd700]"
        : score === "C"
          ? "border-orange-400/40 bg-orange-400/[0.08] text-orange-300"
          : "border-red-500/40 bg-red-500/[0.08] text-red-300";

  return (
    <span className={cn("font-terminal rounded border px-3 py-1 text-sm font-black", tone)}>
      {score}
    </span>
  );
}

function ReportPanel({ score }) {
  if (!score) {
    return (
      <TerminalCard className="scene-enter p-6">
        <div className="text-slate-400">报告正在等待市场路径运行完成。</div>
      </TerminalCard>
    );
  }

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="日终报告" accent="第一天待结算" />
      <div className="space-y-5 p-5">
        <div>
          <h2 className="text-3xl font-black text-slate-100">日终报告</h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            恒生指数从 21,500 上涨到 22,400。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-slate-500">
              产品
            </div>
            <div className="mt-2 text-2xl font-black text-[#00f0ff]">{score.productName}</div>
          </div>
          <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-slate-500">
              结果
            </div>
            <div className="mt-2 text-base leading-7 text-slate-200">{score.outcome}</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["收益", score.payoff],
            ["期权费", score.premium],
            ["客户盈亏", score.clientPnl],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-slate-500">
                {label}
              </div>
              <div className="mt-2 text-xl font-black text-slate-100">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["适当性", score.suitability],
            ["风险披露", score.riskDisclosure],
            ["客户结果", score.clientOutcome],
            ["总评", score.overall],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4"
            >
              <span className="font-terminal text-xs text-slate-500">{label}</span>
              <ScoreBadge score={value} />
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-[#ffd700] bg-[#ffd700]/[0.06] p-4 text-base leading-8 text-[#ffd700]">
          {score.martinComment}
        </div>
      </div>
    </TerminalCard>
  );
}

function CompletePanel() {
  const summary = [
    "Call 用于表达看涨观点。",
    "Put 用于表达看跌观点。",
    "期权费是买方为了获得期权权利支付的成本。",
    "普通期权买方的最大损失通常是期权费。",
    "适当性和市场结果同样重要。",
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第一天完成" accent="训练记录已保存" />
      <div className="flex min-h-[520px] flex-col items-center justify-center p-6 text-center">
        <div className="bg-[linear-gradient(90deg,#00f0ff,#ffd700)] bg-clip-text text-5xl font-black tracking-[0.12em] text-transparent md:text-6xl">
          第一日完成
        </div>
        <div className="mt-8 grid w-full max-w-2xl gap-3 text-left">
          {summary.map((item) => (
            <div
              key={item}
              className="rounded-md border border-cyan-400/15 bg-black/30 px-4 py-3 text-sm leading-7 text-slate-300"
            >
              <span className="font-terminal mr-2 text-[#00f0ff]">规则</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </TerminalCard>
  );
}

function Day2IntroPanel() {
  const lines = [
    "昨天你已经学会了普通期权是什么。",
    "今天我们要解决一个更实际的问题：期权价格到底是怎么来的？",
    "交易员不能随便给客户报价。我们需要用模型估算这个产品现在值多少钱。",
    "一个简单的定价模型就是二叉树。它把未来拆成一条条可能的上涨和下跌路径，然后从未来倒推回今天的价格。",
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第二天 / 定价柜台" accent="报价不是拍脑袋" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-center justify-center rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/[0.05] p-6 text-center">
          <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffd700,#00f0ff)] font-terminal text-5xl font-black text-[#0a0a1a] shadow-[0_0_38px_rgba(255,215,0,0.2)]">
            M
          </div>
          <div className="font-terminal text-sm tracking-[0.18em] text-[#00f0ff]">MARTIN 晨会</div>
          <div className="mt-3 text-2xl font-black text-slate-100">“今天学报价纪律。”</div>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            第二天不考新产品，考你能不能把模型价格、客户接受度和交易台利润放在同一张桌上。
          </p>
        </div>

        <div className="space-y-3">
          {lines.map((line, index) => (
            <div key={line} className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal mb-2 text-xs tracking-[0.18em] text-[#00f0ff]">
                MARTIN / {index + 1}
              </div>
              <div className="text-base leading-8 text-slate-300">{line}</div>
            </div>
          ))}
        </div>
      </div>
    </TerminalCard>
  );
}

function Day2PricingAnchorPanel() {
  const theoreticalPrice = day2Config.quoteRules.theoreticalPrice;
  const examples = [
    {
      label: "报价太低",
      quote: "120 点",
      note: `客户当然开心，但如果模型认为产品值 ${theoreticalPrice} 点，交易台等于用便宜价格卖出风险。`,
      tone: "danger",
    },
    {
      label: "接近理论价",
      quote: "200 点",
      note: `以 ${theoreticalPrice} 点理论价格为锚，再加一点利润空间，客户和交易台都比较容易接受。`,
      tone: "good",
    },
    {
      label: "报价太高",
      quote: "280 点",
      note: "交易台利润看起来厚，但专业客户会觉得不公平，很可能直接拒绝交易。",
      tone: "warn",
    },
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第一课 / 为什么要定价" accent="理论价格是报价锚点" />
      <div className="space-y-6 p-6">
        <div className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#00f0ff]">
            交易台直觉
          </div>
          <h2 className="text-3xl font-black text-slate-100">期权费不是随便报一个数字</h2>
          <p className="mt-4 text-base leading-8 text-slate-300">
            客户买期权，要支付期权费（Premium）。你作为交易员卖给客户这个权利，就要先估算：
            这个权利今天大概值多少钱？这个估算值就是理论价格（Theoretical Price）。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {examples.map((item) => (
            <div
              key={item.label}
              className={cn(
                "rounded-lg border p-5",
                item.tone === "good"
                  ? "border-green-400/30 bg-green-400/[0.07]"
                  : item.tone === "danger"
                    ? "border-red-500/30 bg-red-500/[0.07]"
                    : "border-[#ffd700]/30 bg-[#ffd700]/[0.07]",
              )}
            >
              <div className="font-terminal text-xs tracking-[0.16em] text-slate-500">
                {item.label}
              </div>
              <div className="mt-3 text-3xl font-black text-slate-100">{item.quote}</div>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.note}</p>
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-[#ffd700] bg-[#ffd700]/[0.06] p-4 text-base leading-8 text-[#ffd700]">
          今天先把 {theoreticalPrice} 点当成模型算出来的理论价格。你的任务不是背这个数字，而是理解：报价要围绕它上下调整。
        </div>
      </div>
    </TerminalCard>
  );
}

function Day2TreePathsLessonPanel() {
  const steps = [
    ["今天", "21,500", "这是现在的恒生指数价格。"],
    ["第一步上涨", "22,069", "如果市场上涨 2.65%，价格走到上方节点。"],
    ["第一步下跌", "20,946", "如果市场下跌 2.58%，价格走到下方节点。"],
    ["第二步合并", "三个中间节点", "上涨后下跌和下跌后上涨会回到同一个价格，所以可以合并显示。"],
    ["第三步到期", "四个终端节点", "最后一层就是到期价格，我们会在这些节点上直接计算期权收益。"],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第二课 / 二叉树路径" accent="把未来拆成分叉" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-cyan-400/15 bg-[#070d19]/80 p-5">
          <div className="font-terminal mb-5 text-xs tracking-[0.18em] text-[#00f0ff]">
            路径示意
          </div>
          <div className="space-y-4">
            <div className="mx-auto w-44 rounded-lg border border-[#00f0ff]/50 bg-cyan-400/[0.08] p-4 text-center">
              <div className="font-terminal text-xs text-slate-500">今天</div>
              <div className="text-2xl font-black text-[#00f0ff]">21,500</div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-lg border border-green-400/35 bg-green-400/[0.08] p-4 text-center">
                <div className="font-terminal text-xs text-green-300">上涨 2.65%</div>
                <div className="mt-2 text-2xl font-black text-slate-100">22,069</div>
              </div>
              <div className="rounded-lg border border-red-500/35 bg-red-500/[0.08] p-4 text-center">
                <div className="font-terminal text-xs text-red-300">下跌 2.58%</div>
                <div className="mt-2 text-2xl font-black text-slate-100">20,946</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {["22,653", "21,500", "20,405"].map((price, index) => (
                <div key={`${price}-${index}`} className="rounded-md border border-white/10 bg-black/35 p-3">
                  <div className="font-terminal text-[10px] text-slate-500">第二步</div>
                  <div className="mt-1 text-lg font-black text-slate-100">{price}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              {["23,253", "22,069", "20,946", "19,879"].map((price, index) => (
                <div
                  key={`${price}-${index}`}
                  className={cn(
                    "rounded-md border p-3",
                    index < 2
                      ? "border-[#ffd700]/35 bg-[#ffd700]/[0.08]"
                      : "border-white/10 bg-black/35",
                  )}
                >
                  <div className="font-terminal text-[10px] text-slate-500">到期</div>
                  <div className="mt-1 text-lg font-black text-slate-100">{price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-[#ffd700]/25 bg-[#ffd700]/[0.06] p-5">
            <h2 className="text-2xl font-black text-slate-100">二叉树不是水晶球</h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              它不说“市场一定上涨”或“市场一定下跌”。它只是把未来可能路线画出来，让交易员能逐个检查每条路线下期权可能值多少钱。
            </p>
          </div>
          {steps.map(([label, value, note]) => (
            <div key={label} className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[#00f0ff]">{label}</div>
              <div className="mt-2 text-2xl font-black text-[#ffd700]">{value}</div>
              <div className="mt-2 text-sm leading-7 text-slate-300">{note}</div>
            </div>
          ))}
        </div>
      </div>
    </TerminalCard>
  );
}

function Day2BackwardPriceLessonPanel() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第三课 / 到期收益与倒推" accent="先算未来，再回到今天" />
      <div className="space-y-6 p-6">
        <div className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#00f0ff]">
            普通看涨期权公式
          </div>
          <div className="text-3xl font-black text-slate-100">
            到期收益（Payoff）= max(最终价格 - 行权价（Strike）, 0)
          </div>
          <p className="mt-4 text-base leading-8 text-slate-300">
            看涨期权只有在最终价格高于行权价时才有价值。低于行权价时，买方不会用一个更贵的价格去买，所以到期收益为 0。
          </p>
        </div>

        <BinomialTreeVisual />

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["最后一层", "先看所有到期节点，算每条路径的到期收益。"],
            ["往前倒推", "把未来可能收益折算回前一层，再继续往今天推。"],
            ["今天价格", `教学简化后，模型给今天的理论价格：${day2Config.quoteRules.theoreticalPrice} 点。`],
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/[0.05] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[#ffd700]">{title}</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-[#00f0ff] bg-cyan-400/[0.06] p-4 text-base leading-8 text-slate-200">
          今天先别急着啃完整定价公式。你只要顺着树看：价格可能往上或往下走，到期后每条路各自结算，再一步步推回现在，就能得到一个报价参考。
        </div>
      </div>
    </TerminalCard>
  );
}

function Day2HandbookUpdatedPanel() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="系统提示" accent="工作手册新增页面" />
      <div className="flex min-h-[430px] flex-col items-center justify-center p-6 text-center">
        <div className="font-terminal mb-4 text-sm tracking-[0.32em] text-[#00f0ff]">
          工作手册已更新
        </div>
        <div className="bg-[linear-gradient(90deg,#00f0ff,#ffd700)] bg-clip-text text-4xl font-black tracking-[0.08em] text-transparent md:text-5xl">
          二叉树定价
        </div>
        <p className="mt-8 max-w-2xl text-base leading-8 text-slate-300">
          今天新增的是定价柜台规则。你已经拥有第一天的普通期权页面，现在多了一页用来判断报价是否接近理论价格。
        </p>
      </div>
    </TerminalCard>
  );
}

// ─── 中环数据台 ────────────────────────────────────────────────────────────────
// 真实数据来源：同组数学引擎队抓取的 CSV（vhsi_history.csv / option_chain_current.csv）
// 玩家在这里查找定价所需的 4 个关键参数，然后自己填进计算器。
const researchCards = [
  {
    id: "market_quote",
    icon: "📈",
    title: "行情终端 · Market Data",
    accent: "#00f0ff",
    rows: [
      { label: "标的", value: "恒生指数 HSI", note: "" },
      { label: "现价 S₀", value: "21,500 点", note: "今日开盘参考价" },
      { label: "VHSI 波动率指数 σ", value: "≈ 16%", note: "恒指 30 日隐含波动率（平静市场参考值）" },
      { label: "数据来源", value: "vhsi_history.csv", note: "同组数学引擎队抓取，2003–2026" },
    ],
    hint: "把 VHSI 当作 σ（波动率）填进计算器。注意：危机期间 VHSI 可飙到 60%+，今天用平静市场值。",
  },
  {
    id: "contract_spec",
    icon: "📋",
    title: "合约规格 · Contract Spec",
    accent: "#ffd700",
    rows: [
      { label: "产品", value: "恒指欧式看涨期权", note: "European Call，现金结算" },
      { label: "行权价 K", value: "22,000 点", note: "客户指定（OTM Call）" },
      { label: "到期日", value: "约 1 个月后", note: "参考真实期权链：2026-04-17 到期" },
      { label: "年化期限 T", value: "≈ 0.08 年", note: "1 个月 ÷ 12 ≈ 0.083" },
      { label: "合约乘数", value: "HK$ 50 / 点", note: "HKEX 标准" },
    ],
    hint: "把行权价 22,000 和年化期限 0.08 填进计算器。",
    realData: [
      "HK.HSI260417C21800000 — 行权价 21,800",
      "HK.HSI260417C22000000 — 行权价 22,000 ← 客户需求",
      "HK.HSI260417C22200000 — 行权价 22,200",
    ],
  },
  {
    id: "rate_board",
    icon: "🏦",
    title: "利率公告板 · Rate Board",
    accent: "#a78bfa",
    rows: [
      { label: "港元无风险利率 r", value: "2%", note: "参考 HIBOR 1 个月利率（教学简化值）" },
      { label: "参考基准", value: "HIBOR 1M", note: "香港银行同业拆息，由香港银行公会公布" },
      { label: "实际 HIBOR 区间", value: "1.5% – 3%", note: "视市场环境而定，今天用 2% 作教学锚点" },
    ],
    hint: "把 r = 2 填进计算器的「无风险利率 %」栏。",
  },
  {
    id: "index_profile",
    icon: "📊",
    title: "指数概况 · Index Profile",
    accent: "#4ade80",
    rows: [
      { label: "指数", value: "恒生指数 HSI", note: "香港交易所旗舰指数，50 只成分股" },
      { label: "年化股息率 q", value: "≈ 3.5%", note: "恒指历史平均股息率（Merton 模型需要）" },
      { label: "步数 N", value: "3 步", note: "教学简化：3 步二叉树，足够展示定价直觉" },
      { label: "注意", value: "今天先不计 q", note: "教学简化：计算器暂不含股息率，真实定价需扣除" },
    ],
    hint: "今天的计算器暂不含 q，但记住：真实恒指定价需要扣除约 3.5% 股息率，否则会系统性高估 Call 价格。",
  },
];

const day3ResearchCards = [
  {
    id: "market_quote_d3",
    icon: "📈",
    title: "行情终端 · Market Data",
    accent: "#00f0ff",
    rows: [
      { label: "标的", value: "恒生指数 HSI", note: "" },
      { label: "现价 S₀", value: "21,500 点", note: "今日开盘参考价（与昨天同一水平）" },
      { label: "VHSI 波动率指数 σ", value: "≈ 30%", note: "市场转紧张的隐含波动率（真实参照：2020-02-28 covid 避险升温，VHSI 跳到 32.7）" },
      { label: "数据来源", value: "vhsi_history.csv", note: "同组数学引擎队抓取，2003–2026" },
    ],
    hint: "把 VHSI 当作 σ 填进计算器。记住：波动率越高，标的越容易触及障碍线被敲出——这正是障碍产品对 σ 特别敏感的原因。",
  },
  {
    id: "barrier_contract",
    icon: "🚧",
    title: "障碍合约卡 · Barrier Spec",
    accent: "#ffd700",
    isNew: true,
    rows: [
      { label: "产品", value: "下跌敲出看涨期权", note: "Down-and-Out Call，现金结算" },
      { label: "行权价 K", value: "22,000 点", note: "客户指定（OTM Call，与普通 Call 相同）" },
      { label: "障碍价 Barrier", value: "21,000 点", note: "🔓 今日新增参数：标的向下触及即失效" },
      { label: "敲出类型", value: "向下触障即失效", note: "一旦碰到 21,000 提前结束，不复活" },
      { label: "到期日", value: "约 3 个月后", note: "参考真实期权链：2026-09 到期" },
      { label: "年化期限 T", value: "≈ 0.25 年", note: "3 个月 ÷ 12 = 0.25（比昨天的 1 个月长）" },
      { label: "合约乘数", value: "HK$ 50 / 点", note: "HKEX 标准" },
    ],
    hint: "今天比昨天多一个参数：障碍价 21,000。把 K=22,000、T=0.25、障碍价=21,000 都填进障碍版计算器。",
    realData: [
      "HK.HSI260918C22000000 — 行权价 22,000，到期 2026-09-18",
      "  └ 加挂下跌敲出条款：障碍 21,000（KO Barrier）",
      "对比普通 Call HK.HSI260918C22000000：同行权价、无障碍，期权费更高",
    ],
  },
  {
    id: "rate_board_d3",
    icon: "🏦",
    title: "利率公告板 · Rate Board",
    accent: "#a78bfa",
    rows: [
      { label: "港元无风险利率 r", value: "2%", note: "参考 HIBOR 1 个月利率（教学简化值）" },
      { label: "参考基准", value: "HIBOR 1M", note: "香港银行同业拆息，由香港银行公会公布" },
      { label: "实际 HIBOR 区间", value: "1.5% – 3%", note: "视市场环境而定，今天用 2% 作教学锚点" },
    ],
    hint: "把 r = 2 填进计算器的「无风险利率 %」栏（和昨天一样）。",
  },
  {
    id: "barrier_risk",
    icon: "⚠️",
    title: "障碍风险卡 · Barrier Risk",
    accent: "#f87171",
    isNew: true,
    rows: [
      { label: "障碍距现价", value: "约 2.33%", note: "(21,500 − 21,000) ÷ 21,500，离得很近" },
      { label: "敲出难度", value: "容易", note: "障碍离现价越近，越容易被打穿" },
      { label: "现实参照", value: "2020-03 恒指 ≈ 21,700", note: "盘中低见 21,139，这种障碍会被击穿" },
      { label: "代价与回报", value: "便宜 ↔ 易敲出", note: "障碍越近，期权费越便宜，但敲出风险越大" },
    ],
    hint: "要点：障碍设得离现价越近，期权费越便宜，但越容易敲出。今天障碍只在现价下方约 2.3%，是一张「便宜但脆弱」的合约。",
    realData: [
      "2020-02-17 恒指高点 28,055（疫情前）",
      "2020-03-19 盘中低点 21,139 ← 已跌破 21,000 障碍",
      "2020-03-23 收盘 21,696，VHSI 一度冲到 60+",
      "来源：hsi_2020_covid.csv（同组数学引擎队抓取）",
    ],
  },
];

function ResearchTerminalPanel({
  title = "中环数据台",
  accent = "定价参数查询 · Research Terminal",
  taskText,
  cards,
  footerHint,
}) {
  const [revealed, setRevealed] = React.useState({});

  const toggle = (id) =>
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label={title} accent={accent} />
      <div className="space-y-5 p-5">
        <div className="rounded-md border border-[#00f0ff]/20 bg-[#00f0ff]/[0.04] p-4 text-sm leading-7 text-slate-300">
          <span className="font-terminal text-[#00f0ff]">任务：</span>
          {taskText}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className="rounded-lg border bg-black/30 p-4"
              style={{ borderColor: `${card.accent}30` }}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">{card.icon}</span>
                <span
                  className="font-terminal text-xs tracking-[0.16em]"
                  style={{ color: card.accent }}
                >
                  {card.title}
                </span>
                {card.isNew && (
                  <span
                    className="ml-auto rounded-full border px-2 py-0.5 font-terminal text-[9px] font-black tracking-[0.18em]"
                    style={{
                      color: card.accent,
                      borderColor: `${card.accent}66`,
                      backgroundColor: `${card.accent}1a`,
                    }}
                  >
                    🔓 NEW
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {card.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start justify-between gap-3 rounded border border-white/5 bg-white/[0.02] px-3 py-2"
                  >
                    <span className="font-terminal text-[11px] tracking-[0.1em] text-slate-500 shrink-0">
                      {row.label}
                    </span>
                    <div className="text-right">
                      <span className="font-black text-slate-100 text-sm">{row.value}</span>
                      {row.note && (
                        <div className="mt-0.5 text-[11px] text-slate-500">{row.note}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {card.realData && (
                <div className="mt-3">
                  <button
                    onClick={() => toggle(card.id)}
                    className="font-terminal text-[11px] tracking-[0.12em] text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {revealed[card.id] ? "▲ 收起真实期权链" : "▼ 查看真实期权链（同组数据）"}
                  </button>
                  {revealed[card.id] && (
                    <div className="mt-2 rounded border border-white/10 bg-black/40 p-3 space-y-1">
                      {card.realData.map((line) => (
                        <div key={line} className="font-terminal text-[11px] text-slate-400">
                          {line}
                        </div>
                      ))}
                      <div className="mt-2 font-terminal text-[10px] text-slate-600">
                        来源：option_chain_current.csv（同组数学引擎队抓取，HKEX 真实数据）
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-md border border-white/10 bg-white/[0.03] p-4 text-xs leading-6 text-slate-500">
          {footerHint}
        </div>
      </div>
    </TerminalCard>
  );
}

function Day2ResearchTerminalPanel() {
  return (
    <ResearchTerminalPanel
      title="中环数据台"
      accent="定价参数查询 · Research Terminal"
      cards={researchCards}
      taskText={
        <>
          查阅下方 4 张资料卡，自己判断今天定价需要哪些关键参数——
          <span className="font-black text-slate-100"> S₀（标的现价）、K（行权价）、T（年化期限）、r（无风险利率）、σ（年化波动率）</span>。
          资料卡只给你原始行情，不给现成答案。把对应的数字找出来、记下来，等会儿手动填进二叉树计算器，算出理论价格，再去报价。
        </>
      }
      footerHint="提示：上面四张卡里藏着定价要用的全部数字，但没有现成的「速查表」。哪个数据对应计算器的哪个输入框，需要你自己判断——这正是交易员每天在做的事：sourcing the inputs。"
    />
  );
}

function Day3ResearchTerminalPanel() {
  return (
    <ResearchTerminalPanel
      title="中环数据台 · 障碍专场"
      accent="障碍参数查询 · Barrier Research"
      cards={day3ResearchCards}
      taskText={
        <>
          今天的产品多了一层「障碍」。除了昨天那几个参数，你还要查一个全新的关键数字——
          <span className="font-black text-[#ffd700]"> 障碍价 Barrier</span>。
          下面 4 张卡里，自己找出
          <span className="font-black text-slate-100"> S₀、K、T、r、σ </span>
          以及
          <span className="font-black text-[#ffd700]">障碍价 Barrier</span>
          ，记下来，等会儿填进障碍版计算器。注意：今天期限是 3 个月，比昨天长。
        </>
      }
      footerHint="提示：障碍合约卡里的「障碍价 Barrier」是今天新增的参数，也是计算器今天多出来的那一行。和昨天一样，没有速查表——哪个数据对应哪个输入框，自己判断。"
    />
  );
}

function Day2ClientArrivalPanel() {
  const client = day2Config.clientProfile;
  const profileRows = [
    ["姓名", client.name],
    ["客户类型", client.type],
    ["市场观点", client.marketView],
    ["风险承受能力", client.riskTolerance],
    ["目标", client.goal],
    ["产品需求", client.productNeed],
    ["预算", client.budget],
    ["经验", client.experience],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="客户资料" accent="机构客户订单" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-5">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-[#ffd700]/30 bg-[#ffd700]/[0.08] font-terminal text-4xl font-black text-[#ffd700]">
              王
            </div>
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[#00f0ff]">
                专业客户
              </div>
              <div className="mt-2 text-2xl font-black text-slate-100">{client.name}</div>
            </div>
          </div>
          <div className="grid gap-3">
            {profileRows.map(([label, value]) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                <div className="font-terminal text-xs tracking-[0.14em] text-slate-500">
                  {label}
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-200">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/[0.05] p-5">
          <div className="font-terminal mb-4 text-xs tracking-[0.18em] text-[#ffd700]">
            客户对白
          </div>
          <div className="space-y-4">
            {client.dialogue.map((line) => (
              <div key={line} className="rounded-md border border-white/10 bg-black/30 p-4 text-base leading-8 text-slate-200">
                王先生：“{line}”
              </div>
            ))}
          </div>
        </div>
      </div>
    </TerminalCard>
  );
}

function Day2ProductReviewPanel() {
  const product = day2Config.productSummary;
  const rows = [
    ["产品", product.product],
    ["标的", product.underlying],
    ["当前价格 Spot", formatPoints(product.spot)],
    ["行权价 Strike", formatPoints(product.strike)],
    ["期限", product.maturity],
    ["客户观点", product.clientView],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="产品确认" accent="客户已指定普通 Call" />
      <div className="space-y-5 p-6">
        <div className="rounded-lg border border-[#ffd700]/25 bg-[#ffd700]/[0.06] p-5">
          <div className="font-terminal mb-2 text-xs tracking-[0.18em] text-[#ffd700]">
            VANILLA CALL / 普通看涨期权
          </div>
          <div className="text-3xl font-black text-slate-100">{product.product}</div>
          <p className="mt-4 text-base leading-8 text-slate-300">
            {product.matchReason} 第二天的任务不是重新挑产品，而是确认结构后打开定价树，给出合理期权费（Premium）。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs tracking-[0.14em] text-slate-500">
                {label}
              </div>
              <div className="mt-2 text-xl font-black text-slate-100">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </TerminalCard>
  );
}

function BinomialTreeVisual() {
  const tree = day2Config.tree;
  const nodeMap = Object.fromEntries(tree.nodes.map((node) => [node.id, node]));

  return (
    <div className="rounded-lg border border-cyan-400/15 bg-[#070d19]/80 p-4">
      <div className="relative h-[980px] w-full min-w-0">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {tree.links.map(([fromId, toId]) => {
            const from = nodeMap[fromId];
            const to = nodeMap[toId];
            const hot = to.hot;
            return (
              <line
                key={`${fromId}-${toId}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={hot ? "rgba(255,215,0,0.48)" : "rgba(0,240,255,0.28)"}
                strokeWidth={hot ? 0.34 : 0.28}
                strokeDasharray={hot ? "1.4 1.4" : "1 1.2"}
              />
            );
          })}
        </svg>

        {tree.nodes.map((node) => (
          <div
            key={node.id}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border p-3 shadow-[0_0_24px_rgba(0,240,255,0.08)]",
              node.terminal ? "w-64" : "w-44",
              node.hot
                ? "border-[#ffd700]/70 bg-[#ffd700]/[0.12]"
                : node.terminal
                  ? "border-slate-700 bg-black/35 opacity-75"
                  : "border-cyan-400/30 bg-cyan-400/[0.06]",
            )}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className="font-terminal text-[10px] tracking-[0.14em] text-slate-500">
              {node.step}
            </div>
            <div className={cn("mt-1 text-xs", node.hot ? "text-[#ffd700]" : "text-[#00f0ff]")}>
              {node.label}
            </div>
            <div className="mt-1 text-xl font-black text-slate-100">{formatPoints(node.price)}</div>
            {typeof node.payoff === "number" && (
              <div className="mt-2 space-y-2">
                {node.formula && (
                  <div className="rounded border border-white/10 bg-black/25 px-2 py-1 text-xs leading-5 text-slate-300">
                    {node.formula}
                  </div>
                )}
                <div className={cn("rounded border px-2 py-1 text-xs font-black", node.hot ? "border-[#ffd700]/40 text-[#ffd700]" : "border-white/10 text-slate-500")}>
                  到期收益：{formatPoints(node.payoff)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function buildVanillaBinomialToolTree(params) {
  const spot = Number(params.spot);
  const strike = Number(params.strike);
  const rate = Number(params.rate) / 100;
  const sigma = Number(params.sigma) / 100;
  const maturity = Number(params.maturity);
  const steps = Math.max(1, Math.min(6, Number(params.steps)));
  const dt = maturity / steps;
  const up = Math.exp(sigma * Math.sqrt(dt));
  const down = 1 / up;
  const growth = Math.exp(rate * dt);
  const rawProbability = (growth - down) / (up - down);
  const probability = rawProbability;
  const discount = Math.exp(-rate * dt);

  const stockTree = Array.from({ length: steps + 1 }, (_, step) =>
    Array.from({ length: step + 1 }, (_, upMoves) => {
      const price = spot * up ** upMoves * down ** (step - upMoves);
      return {
        id: `${step}-${upMoves}`,
        step,
        upMoves,
        price,
      };
    }),
  );

  const optionValues = Array.from({ length: steps + 1 }, () => []);
  const payoffs = Array.from({ length: steps + 1 }, () => []);

  for (let upMoves = 0; upMoves <= steps; upMoves += 1) {
    const terminal = stockTree[steps][upMoves];
    const payoff = Math.max(terminal.price - strike, 0);
    payoffs[steps][upMoves] = payoff;
    optionValues[steps][upMoves] = payoff;
  }

  for (let step = steps - 1; step >= 0; step -= 1) {
    for (let upMoves = 0; upMoves <= step; upMoves += 1) {
      optionValues[step][upMoves] =
        discount *
        (probability * optionValues[step + 1][upMoves + 1] +
          (1 - probability) * optionValues[step + 1][upMoves]);
    }
  }

  const nodes = stockTree.flat().map((node) => ({
    ...node,
    optionValue: optionValues[node.step][node.upMoves],
    payoff: payoffs[node.step]?.[node.upMoves] ?? null,
    inTheMoney: node.price > strike,
    x: 10 + (node.step / steps) * 80,
    y:
      node.step === 0
        ? 50
        : 50 + ((node.step / 2 - node.upMoves) * 62) / Math.max(steps, 2),
  }));

  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const links = [];
  for (let step = 0; step < steps; step += 1) {
    for (let upMoves = 0; upMoves <= step; upMoves += 1) {
      const from = nodeMap[`${step}-${upMoves}`];
      const downNode = nodeMap[`${step + 1}-${upMoves}`];
      const upNode = nodeMap[`${step + 1}-${upMoves + 1}`];
      links.push({ id: `${from.id}-${downNode.id}`, from, to: downNode });
      links.push({ id: `${from.id}-${upNode.id}`, from, to: upNode });
    }
  }

  return {
    nodes,
    links,
    up,
    down,
    probability,
    noArbitrage: probability >= 0 && probability <= 1,
    vanillaPrice: optionValues[0][0],
  };
}

function buildBarrierBinomialToolTree(params) {
  const spot = Number(params.spot);
  const strike = Number(params.strike);
  const barrier = Number(params.barrier);
  const rate = Number(params.rate) / 100;
  const sigma = Number(params.sigma) / 100;
  const maturity = Number(params.maturity);
  const steps = Math.max(1, Math.min(6, Number(params.steps)));
  const dt = maturity / steps;
  const up = Math.exp(sigma * Math.sqrt(dt));
  const down = 1 / up;
  const growth = Math.exp(rate * dt);
  const rawProbability = (growth - down) / (up - down);
  const probability = rawProbability;
  const discount = Math.exp(-rate * dt);

  const stockTree = Array.from({ length: steps + 1 }, (_, step) =>
    Array.from({ length: step + 1 }, (_, upMoves) => {
      const price = spot * up ** upMoves * down ** (step - upMoves);
      return {
        id: `${step}-${upMoves}`,
        step,
        upMoves,
        price,
        knocked: price <= barrier,
      };
    }),
  );

  const vanillaValues = Array.from({ length: steps + 1 }, () => []);
  const barrierValues = Array.from({ length: steps + 1 }, () => []);

  for (let upMoves = 0; upMoves <= steps; upMoves += 1) {
    const terminal = stockTree[steps][upMoves];
    const payoff = Math.max(terminal.price - strike, 0);
    vanillaValues[steps][upMoves] = payoff;
    barrierValues[steps][upMoves] = terminal.knocked ? 0 : payoff;
  }

  for (let step = steps - 1; step >= 0; step -= 1) {
    for (let upMoves = 0; upMoves <= step; upMoves += 1) {
      vanillaValues[step][upMoves] =
        discount *
        (probability * vanillaValues[step + 1][upMoves + 1] +
          (1 - probability) * vanillaValues[step + 1][upMoves]);
      barrierValues[step][upMoves] = stockTree[step][upMoves].knocked
        ? 0
        : discount *
          (probability * barrierValues[step + 1][upMoves + 1] +
            (1 - probability) * barrierValues[step + 1][upMoves]);
    }
  }

  const nodes = stockTree.flat().map((node) => ({
    ...node,
    vanillaValue: vanillaValues[node.step][node.upMoves],
    barrierValue: barrierValues[node.step][node.upMoves],
    x: 10 + (node.step / steps) * 80,
    y:
      node.step === 0
        ? 50
        : 50 + ((node.step / 2 - node.upMoves) * 62) / Math.max(steps, 2),
  }));

  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const links = [];
  for (let step = 0; step < steps; step += 1) {
    for (let upMoves = 0; upMoves <= step; upMoves += 1) {
      const from = nodeMap[`${step}-${upMoves}`];
      const downNode = nodeMap[`${step + 1}-${upMoves}`];
      const upNode = nodeMap[`${step + 1}-${upMoves + 1}`];
      links.push({
        id: `${from.id}-${downNode.id}`,
        from,
        to: downNode,
        alive: !from.knocked && !downNode.knocked,
      });
      links.push({
        id: `${from.id}-${upNode.id}`,
        from,
        to: upNode,
        alive: !from.knocked && !upNode.knocked,
      });
    }
  }

  return {
    nodes,
    links,
    up,
    down,
    probability,
    noArbitrage: probability >= 0 && probability <= 1,
    vanillaPrice: vanillaValues[0][0],
    barrierPrice: barrierValues[0][0],
  };
}

// Day2 参数检查：与标准值的比较及 Martin 反馈
function checkDay2Params(params) {
  const standard = { spot: 21500, strike: 22000, rate: 2, sigma: 16, maturity: 0.08 };
  const tolerance = { spot: 200, strike: 200, rate: 0.5, sigma: 2, maturity: 0.01 };

  const issues = [];
  Object.keys(standard).forEach((key) => {
    const value = Number(params[key]);
    const stdValue = standard[key];
    const tol = tolerance[key];
    if (Math.abs(value - stdValue) > tol) {
      issues.push({ key, value, stdValue });
    }
  });
  return issues;
}

function BinomialPricingTool({
  mode = "vanilla",
  selectedQuote,
  quoteAnalysis,
  onUpdateQuote,
  onUpdateTheoretical,
  enableParamCheck = true, // Day2 用标准参数对照提醒；Day4 各客户参数不同，关掉
  quoteHint, // 报价输入框的提示文案（Day4 按客户定制）；不传则用默认
}) {
  const isBarrier = mode === "barrier";

  // 默认值故意设成各参数的最小值（占位），逼玩家自己从数据台抄真实参数填进来
  // 步数 N 是建模选择（不是要从数据台查的市场参数），固定锁死：Day2=3、Day3=4
  const fixedSteps = isBarrier ? 4 : 3;
  const [params, setParams] = useState(
    isBarrier
      ? { spot: 1000, strike: 1000, barrier: 1000, rate: -5, sigma: 1, maturity: 0.05, steps: fixedSteps }
      : { spot: 1000, strike: 1000, rate: -5, sigma: 1, maturity: 0.02, steps: fixedSteps },
  );

  const tree = useMemo(
    () =>
      isBarrier
        ? buildBarrierBinomialToolTree(params)
        : buildVanillaBinomialToolTree(params),
    [params, isBarrier],
  );

  // 每次 tree 重算，把最新理论价传给父组件（仅 vanilla 模式的 Day2 报价联动会传 onUpdateTheoretical）
  useEffect(() => {
    if (onUpdateTheoretical && Number.isFinite(tree.vanillaPrice)) {
      onUpdateTheoretical(Math.round(tree.vanillaPrice));
    }
  }, [tree.vanillaPrice, onUpdateTheoretical]);

  const maxSteps = isBarrier ? 4 : 3;
  const updateParam = (key, value) => {
    setParams((current) => ({
      ...current,
      [key]: key === "steps" ? Math.max(1, Math.min(maxSteps, Number(value))) : value,
    }));
  };

  // Day2 参数检查（仅 vanilla 模式）
  const day2ParamIssues = useMemo(
    () => (!isBarrier && enableParamCheck ? checkDay2Params(params) : []),
    [params, isBarrier, enableParamCheck],
  );

  const inputMeta = isBarrier
    ? [
        ["spot", "S0 现价", 1000, 50000, 100],
        ["strike", "K 行权价", 1000, 50000, 100],
        ["barrier", "障碍价格", 1000, 50000, 100],
        ["rate", "r 无风险利率 %", -5, 20, 0.25],
        ["sigma", "σ 波动率 %", 1, 80, 1],
        ["maturity", "T 年化期限", 0.05, 3, 0.05],
      ]
    : [
        ["spot", "S0 现价", 1000, 50000, 100],
        ["strike", "K 行权价", 1000, 50000, 100],
        ["rate", "r 无风险利率 %", -5, 20, 0.25],
        ["sigma", "σ 波动率 %", 1, 80, 1],
        ["maturity", "T 年化期限", 0.02, 3, 0.01],
      ];

  return (
    <div className="rounded-lg border border-cyan-400/15 bg-[#070d19]/85 p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-terminal text-xs tracking-[0.2em] text-[#00f0ff]">
            {isBarrier ? "障碍期权二叉树计算器" : "普通期权二叉树计算器"}
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
            {isBarrier
              ? "和昨天同一个计算器，今天多了一行金色的「障碍价格」。红色节点表示触及障碍被敲出，绿色路径表示仍然存活；下方并排比较普通 Call 与下跌敲出 Call 的模型价格。"
              : "这里先只看普通 Call。改变现价、行权价、波动率或步数，观察价格树、到期收益和今天理论价格如何同步变化。"}
          </p>
        </div>
        <div
          className={cn(
            "rounded-md border px-4 py-2 font-terminal text-xs",
            isBarrier
              ? "border-[#ffd700]/30 bg-[#ffd700]/[0.07] text-[#ffd700]"
              : "border-[#00f0ff]/30 bg-cyan-400/[0.07] text-[#00f0ff]",
          )}
        >
          {isBarrier ? "BARRIER MODE" : "VANILLA MODE"}
        </div>
      </div>

      <div
        className={cn(
          "grid gap-5",
          isBarrier
            ? "xl:grid-cols-[330px_minmax(0,1fr)]"
            : "xl:grid-cols-[300px_minmax(0,1fr)]",
        )}
      >
        <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
          <div className="font-terminal mb-4 text-xs tracking-[0.18em] text-[#00f0ff]">
            参数输入
          </div>
          <div className="grid gap-3">
            {inputMeta.map(([key, label, min, max, step]) => {
              const isBarrierRow = key === "barrier";
              return (
                <label key={key} className="grid gap-2">
                  <span
                    className={cn(
                      "font-terminal flex items-center gap-2 text-[11px] tracking-[0.12em]",
                      isBarrierRow ? "text-[#ffd700]" : "text-slate-500",
                    )}
                  >
                    {label}
                    {isBarrierRow && (
                      <span className="rounded-full border border-[#ffd700]/50 bg-[#ffd700]/[0.12] px-2 py-0.5 text-[9px] font-black tracking-[0.18em] text-[#ffd700]">
                        🔓 NEW
                      </span>
                    )}
                  </span>
                  <input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={params[key]}
                    onChange={(event) => updateParam(key, Number(event.target.value))}
                    className={cn(
                      "rounded-md border bg-[#07101d] px-3 py-2 font-terminal text-sm text-slate-100 outline-none transition",
                      isBarrierRow
                        ? "border-[#ffd700]/45 focus:border-[#ffd700]"
                        : "border-cyan-400/20 focus:border-[#00f0ff]",
                    )}
                  />
                </label>
              );
            })}

            <label className="grid gap-2">
              <span className="font-terminal flex items-center gap-2 text-[11px] tracking-[0.12em] text-slate-500">
                N 步数
                <span className="rounded-full border border-white/15 bg-white/[0.04] px-2 py-0.5 text-[9px] font-black tracking-[0.18em] text-slate-500">
                  🔒 固定
                </span>
              </span>
              <div className="rounded-md border border-white/10 bg-black/40 px-3 py-2 font-terminal text-sm text-slate-400">
                {params.steps} 步（建模选择，不用查）
              </div>
            </label>
          </div>

          <div className="mt-4 grid gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3 text-xs leading-6 text-slate-400">
            <div>
              上涨因子 u：
              <span className="font-terminal text-[#00f0ff]"> {tree.up.toFixed(4)}</span>
            </div>
            <div>
              下跌因子 d：
              <span className="font-terminal text-[#00f0ff]"> {tree.down.toFixed(4)}</span>
            </div>
            <div>
              风险中性概率 p：
              <span className="font-terminal text-[#ffd700]"> {tree.probability.toFixed(4)}</span>
            </div>
            {!tree.noArbitrage && (
              <div className="rounded border border-red-500/30 bg-red-500/[0.08] px-2 py-1 text-red-300">
                参数不满足 d &lt; e^(rΔt) &lt; u，风险中性概率超出 0-1。
              </div>
            )}
            {!isBarrier && (
              <div>
                普通 Call 理论价：
                <span className="font-terminal text-green-300"> {tree.vanillaPrice.toFixed(2)}</span>
              </div>
            )}
          </div>

          {!isBarrier && day2ParamIssues.length > 0 && (
            <div className="mt-4 rounded-md border border-orange-500/40 bg-orange-500/[0.08] p-3 text-xs leading-5 text-orange-300">
              <div className="font-terminal mb-2 tracking-[0.12em]">⚠️ Martin 提醒</div>
              {day2ParamIssues.map(({ key, value, stdValue }) => (
                <div key={key} className="mb-1">
                  {key === "spot" && `现价 S0：你填 ${Number(value).toLocaleString()} 点，数据台行情终端应该是 21,500`}
                  {key === "strike" && `行权价 K：你填 ${Number(value).toLocaleString()} 点，应该是 22,000`}
                  {key === "rate" && `利率 r：你填 ${value}%，应该是 2%`}
                  {key === "sigma" && `波动率 σ：你填 ${value}%，应该是 16%（来自 VHSI）`}
                  {key === "maturity" && `期限 T：你填 ${value} 年，1 个月应该是约 0.08 年`}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-cyan-400/15 bg-black/25 p-4">
          <div
            className={cn(
              "relative min-w-0 overflow-hidden rounded-md border border-white/10 bg-[#050b14]",
              isBarrier ? "h-[640px]" : "h-[560px]",
            )}
          >
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {tree.links.map((link) =>
                isBarrier ? (
                  <line
                    key={link.id}
                    x1={link.from.x}
                    y1={link.from.y}
                    x2={link.to.x}
                    y2={link.to.y}
                    stroke={link.alive ? "rgba(74,222,128,0.45)" : "rgba(239,68,68,0.42)"}
                    strokeWidth={0.28}
                    strokeDasharray={link.alive ? "1.2 1.1" : "1.8 1.3"}
                  />
                ) : (
                  <line
                    key={link.id}
                    x1={link.from.x}
                    y1={link.from.y}
                    x2={link.to.x}
                    y2={link.to.y}
                    stroke="rgba(0,240,255,0.34)"
                    strokeWidth={0.25}
                    strokeDasharray="1.2 1.1"
                  />
                ),
              )}
            </svg>

            {tree.nodes.map((node) => {
              if (isBarrier) {
                return (
                  <div
                    key={node.id}
                    className={cn(
                      "absolute w-32 -translate-x-1/2 -translate-y-1/2 rounded-lg border p-2 shadow-[0_0_18px_rgba(0,240,255,0.08)]",
                      node.knocked
                        ? "border-red-500/60 bg-red-500/[0.12]"
                        : "border-green-400/45 bg-green-400/[0.08]",
                    )}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    <div className="font-terminal text-[10px] tracking-[0.12em] text-slate-500">
                      t{node.step} / u{node.upMoves}
                    </div>
                    <div
                      className={cn(
                        "mt-1 text-lg font-black",
                        node.knocked ? "text-red-300" : "text-green-300",
                      )}
                    >
                      {formatPoints(Math.round(node.price))}
                    </div>
                    <div className="mt-1 text-[11px] leading-4 text-slate-400">
                      KO: {node.knocked ? "YES" : "NO"}
                    </div>
                  </div>
                );
              }
              const isTerminal = node.step === Number(params.steps);
              return (
                <div
                  key={node.id}
                  className={cn(
                    "absolute w-32 -translate-x-1/2 -translate-y-1/2 rounded-lg border p-2 shadow-[0_0_18px_rgba(0,240,255,0.08)]",
                    isTerminal && node.inTheMoney
                      ? "border-[#ffd700]/65 bg-[#ffd700]/[0.1]"
                      : "border-cyan-400/35 bg-cyan-400/[0.06]",
                  )}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div className="font-terminal text-[10px] tracking-[0.12em] text-slate-500">
                    t{node.step} / u{node.upMoves}
                  </div>
                  <div className="mt-1 text-lg font-black text-slate-100">
                    {formatPoints(Math.round(node.price))}
                  </div>
                  <div className="mt-1 text-[11px] leading-4 text-slate-400">
                    V: {node.optionValue.toFixed(1)}
                  </div>
                  {isTerminal && (
                    <div className={cn("mt-1 rounded border px-2 py-1 text-[10px] font-black", node.inTheMoney ? "border-[#ffd700]/35 text-[#ffd700]" : "border-white/10 text-slate-500")}>
                      Payoff: {node.payoff.toFixed(0)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {isBarrier ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.05] p-4">
                <div className="font-terminal text-xs tracking-[0.18em] text-[#00f0ff]">
                  普通 Call 理论价
                </div>
                <div className="mt-2 text-3xl font-black text-slate-100">
                  {tree.vanillaPrice.toFixed(2)}
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-400">
                  不观察障碍，只根据到期收益 max(S - K, 0) 倒推。
                </p>
              </div>
              <div className="rounded-lg border border-[#ffd700]/25 bg-[#ffd700]/[0.06] p-4">
                <div className="font-terminal text-xs tracking-[0.18em] text-[#ffd700]">
                  下跌敲出 Call 理论价
                </div>
                <div className="mt-2 text-3xl font-black text-[#ffd700]">
                  {tree.barrierPrice.toFixed(2)}
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-400">
                  一旦节点价格低于或等于障碍价，该节点之后价值归零。
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.05] p-4">
                <div className="font-terminal text-xs tracking-[0.18em] text-[#00f0ff]">
                  价格树
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-400">
                  现价和波动率会改变未来节点价格。
                </p>
              </div>
              <div className="rounded-lg border border-[#ffd700]/25 bg-[#ffd700]/[0.06] p-4">
                <div className="font-terminal text-xs tracking-[0.18em] text-[#ffd700]">
                  到期收益
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-400">
                  行权价 K 不改变价格树，但会改变终点 Payoff。
                </p>
              </div>
              <div className="rounded-lg border border-green-400/20 bg-green-400/[0.06] p-4">
                <div className="font-terminal text-xs tracking-[0.18em] text-green-300">
                  倒推价格
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-400">
                  从终点收益一路倒推，得到今天理论价格。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedQuote !== undefined && (
        <div className="mt-5 rounded-lg border border-[#ffd700]/25 bg-[#ffd700]/[0.05] p-5">
          <div className="mb-4">
            <div className="font-terminal text-xs tracking-[0.2em] text-[#ffd700]">
              报价输入 / Premium Quote
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
              {quoteHint
                ? quoteHint
                : isBarrier
                  ? "参考上面计算器算出的「下跌敲出 Call 理论价」，加上你认为合理的利润空间，给陈女士报一个期权费。"
                  : "参考上面计算器算出的「普通 Call 理论价」，加上你认为合理的利润空间，给王先生报一个期权费。"}
              <span className="text-slate-300">报多少由你决定——系统不会提前告诉你对不对，提交后才见分晓。</span>
            </p>
          </div>

          <label className="grid max-w-xs gap-2">
            <span className="font-terminal text-[11px] tracking-[0.14em] text-slate-500">
              你的报价（点）
            </span>
            <input
              type="number"
              min={day2Config.quoteRules.sliderMin}
              max={day2Config.quoteRules.sliderMax}
              step="5"
              placeholder="自己填一个报价"
              value={selectedQuote}
              onChange={(event) =>
                onUpdateQuote(event.target.value === "" ? "" : Number(event.target.value))
              }
              className="rounded-md border border-[#ffd700]/35 bg-[#07101d] px-4 py-3 font-terminal text-2xl font-black text-[#00f0ff] outline-none transition focus:border-[#ffd700]"
            />
          </label>
        </div>
      )}
    </div>
  );
}

function BinomialFormulaPanel() {
  const steps = [
    {
      title: "1. 先生成价格树",
      formula: "u = e^(σ√Δt),   d = 1/u",
      text: "从今天的价格 S0 出发，每一步价格可能乘以上涨因子 u 或下跌因子 d，于是形成一棵价格树。",
    },
    {
      title: "2. 到期节点算 Payoff",
      formula: "Call Payoff = max(S_T - K, 0)",
      text: "走到最右侧到期节点后，先计算每个终点的期权收益。普通 Call 只看最终价格是否高于行权价。",
    },
    {
      title: "3. 计算风险中性概率",
      formula: "p = (e^(rΔt) - d) / (u - d)",
      text: "p 不是主观上涨概率，而是让二叉树在无套利条件下可以折现倒推的风险中性概率。",
    },
    {
      title: "4. 从未来倒推回今天",
      formula: "V = e^{-rΔt} × [pV_up + (1-p)V_down]",
      text: "把下一步上涨和下跌的可能价值加权，再折现回来。一路倒推到最左侧，就是今天的理论价格。",
    },
  ];
  const symbols = [
    ["S0", "今天的标的价格，也就是计算起点"],
    ["S / S_T", "某个节点价格 / 到期最终价格。T 是到期时间 Terminal time"],
    ["K", "行权价。Call 到期时会拿最终价格和 K 比较"],
    ["u / d", "每一步向上或向下的价格倍数"],
    ["r", "无风险利率，用来把未来价值折现回今天"],
    ["Δt", "每一步代表的时间长度"],
    ["p", "风险中性概率，用来给上涨、下跌两种未来加权"],
    ["V", "期权在某个节点上的理论价值"],
  ];

  return (
    <div className="rounded-lg border border-[#ffd700]/25 bg-[#ffd700]/[0.05] p-5">
      <div className="font-terminal mb-3 text-xs tracking-[0.2em] text-[#ffd700]">
        定价机制 / 先懂公式，再看计算器
      </div>
      <div className="mb-5 text-2xl font-black text-slate-100">
        二叉树不是猜市场，而是把未来路径拆开，再从终点倒推今天价格
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {steps.map((step) => (
          <div key={step.title} className="rounded-lg border border-white/10 bg-black/25 p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-[#00f0ff]">
              {step.title}
            </div>
            <div className="mt-3 rounded-md border border-cyan-400/15 bg-cyan-400/[0.04] px-3 py-2 font-terminal text-sm text-[#ffd700]">
              {step.formula}
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{step.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-cyan-400/15 bg-black/25 p-4">
        <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#00f0ff]">
          符号说明 / 不用背，先知道它们在说什么
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {symbols.map(([symbol, meaning]) => (
            <div key={symbol} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
              <div className="font-terminal text-sm font-black text-[#ffd700]">{symbol}</div>
              <div className="mt-2 text-xs leading-6 text-slate-300">{meaning}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-md border-l-4 border-[#00f0ff] bg-cyan-400/[0.06] p-4 text-sm leading-7 text-slate-200">
        看计算器时重点观察三件事：价格树如何展开、行权价如何影响到期收益、终点收益如何倒推成今天的理论价格。
      </div>
    </div>
  );
}

function Day2TreeExplainerPanel({ selectedQuote, quoteAnalysis, onUpdateQuote, onUpdateTheoretical }) {
  const tree = day2Config.tree;
  const params = [
    ["标的", tree.underlying],
    ["当前价格 S0", formatPoints(tree.spot)],
    ["行权价 K", formatPoints(tree.strike)],
    ["上涨幅度", tree.upMove],
    ["下跌幅度", tree.downMove],
    ["步数", `${tree.steps} 步`],
    ["无风险利率", tree.riskFreeRate],
    ["简化理论价格", `${tree.theoreticalPrice} 点`],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="二叉树定价终端" accent="三步二叉树（3-step Binomial Tree）" />
      <div className="space-y-5 p-6">
        <div className="grid gap-3 md:grid-cols-4">
          {params.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-cyan-400/15 bg-black/30 p-3">
              <div className="font-terminal text-[11px] tracking-[0.14em] text-slate-500">
                {label}
              </div>
              <div className="mt-2 text-lg font-black text-slate-100">{value}</div>
            </div>
          ))}
        </div>

        <BinomialFormulaPanel />

        <div className="grid gap-4 md:grid-cols-3">
          {[
            "现价 S0 和波动率 σ 会改变未来价格节点，让价格树变宽或变窄。",
            "行权价 K 不会改变标的价格路径，但会改变每个到期节点的 Payoff。",
            "步数 N 越多，树越细；今天先看直觉，不要求你手算每个节点。",
          ].map((text, index) => (
            <div key={text} className="rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/[0.05] p-4 text-sm leading-7 text-[#ffd700]">
              <span className="font-terminal mr-2 text-[#00f0ff]">提示 {index + 1}</span>
              {text}
            </div>
          ))}
        </div>

        <BinomialPricingTool
          mode="vanilla"
          selectedQuote={selectedQuote}
          quoteAnalysis={quoteAnalysis}
          onUpdateQuote={onUpdateQuote}
          onUpdateTheoretical={onUpdateTheoretical}
        />
      </div>
    </TerminalCard>
  );
}

function Day2QuoteSliderPanel({
  selectedQuote,
  quoteAnalysis,
  onUpdateQuote,
  liveTheoretical = day2Config.quoteRules.theoreticalPrice,
  embedded = false,
}) {
  const rules = day2Config.quoteRules;
  const profit = selectedQuote - liveTheoretical;
  const fairLow = liveTheoretical + 4;
  const fairHigh = liveTheoretical + 34;
  const toneClass =
    quoteAnalysis.tone === "good"
      ? "border-green-400/30 bg-green-400/[0.08] text-green-300"
      : quoteAnalysis.tone === "danger"
        ? "border-red-500/35 bg-red-500/[0.08] text-red-300"
        : "border-[#ffd700]/35 bg-[#ffd700]/[0.08] text-[#ffd700]";

  const content = (
    <>
      <TerminalHeader label="报价终端（Pricing Terminal）" accent="调整期权费（Premium）" />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["你的报价", `${selectedQuote} 点`, "#00f0ff"],
            ["模型理论价", `${liveTheoretical} 点`, "#ffd700"],
            ["交易台利润", `${profit >= 0 ? "+" : ""}${profit} 点`, profit >= 0 ? "#4ade80" : "#f87171"],
            ["建议区间", `${fairLow} - ${fairHigh} 点`, "#e2e8f0"],
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs tracking-[0.14em] text-slate-500">
                {label}
              </div>
              <div className="mt-2 text-2xl font-black" style={{ color }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-cyan-400/15 bg-[#070d19]/80 p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[#00f0ff]">
                报价滑块
              </div>
              <div className="mt-1 text-sm text-slate-500">范围：{rules.sliderMin} - {rules.sliderMax} 点</div>
            </div>
            <div className={cn("rounded-md border px-4 py-2 font-terminal text-xs tracking-[0.14em]", toneClass)}>
              {quoteAnalysis.label}
            </div>
          </div>

          <input
            type="range"
            min={rules.sliderMin}
            max={rules.sliderMax}
            step="5"
            value={selectedQuote}
            onChange={(event) => onUpdateQuote(Number(event.target.value))}
            className="w-full accent-cyan-400"
          />
          <div className="mt-3 flex justify-between text-xs text-slate-500">
            <span>{rules.sliderMin}</span>
            <span>{liveTheoretical} 理论价</span>
            <span>{fairLow}–{fairHigh} 合理区间</span>
            <span>{liveTheoretical + 74} 拒绝线</span>
            <span>{rules.sliderMax}</span>
          </div>
        </div>

        <div className={cn("rounded-md border-l-4 p-4 text-base leading-8", toneClass)}>
          客户反应预览：{quoteAnalysis.customerPreview}
        </div>
      </div>
    </>
  );

  if (embedded) {
    return (
      <div className="overflow-hidden rounded-lg border border-[#ffd700]/25 bg-[#ffd700]/[0.04] shadow-[0_0_28px_rgba(255,215,0,0.08)]">
        {content}
      </div>
    );
  }

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      {content}
    </TerminalCard>
  );
}

function Day2ClientResponsePanel({ selectedQuote, clientResponse, liveTheoretical = day2Config.quoteRules.theoreticalPrice }) {
  const response = clientResponse ?? getQuoteAnalysis(selectedQuote, day2Config.quoteRules.theoreticalPrice);
  const acceptedText = response.accepted ? "交易接受" : "客户拒绝";

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="客户反馈" accent="报价回执" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#00f0ff]">
            报价记录
          </div>
          <div className="text-5xl font-black text-[#00f0ff]">{selectedQuote} 点</div>
          <div className="mt-4 text-sm leading-7 text-slate-400">
            报价已发出，等待市场结算。
          </div>
        </div>

        <div className="rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/[0.05] p-5">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-md border border-[#ffd700]/30 bg-black/40 font-terminal text-3xl font-black text-[#ffd700]">
              王
            </div>
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[#ffd700]">
                王先生
              </div>
              <div className="mt-1 text-sm text-slate-500">{acceptedText}</div>
            </div>
          </div>
          <div className="rounded-md border border-white/10 bg-black/30 p-5 text-xl font-black leading-9 text-slate-100">
            “{response.customerLine}”
          </div>
        </div>
      </div>
    </TerminalCard>
  );
}

function Day2MarketRunPanel({
  selectedQuote,
  liveTheoretical = day2Config.quoteRules.theoreticalPrice,
  marketHasRun,
  visibleMarketSteps,
}) {
  const market = day2Config.market;
  const path = market.path;
  const spot = path[0];
  const quote = Number.isFinite(Number(selectedQuote)) ? Number(selectedQuote) : 0;
  const accepted = getQuoteAnalysis(selectedQuote, day2Config.quoteRules.theoreticalPrice).accepted;

  const finalPrice = path[path.length - 1];
  const payoff = Math.max(finalPrice - market.strike, 0);
  const deskPnl = accepted ? quote - payoff : 0;

  const activeCount = Math.min(Math.max(visibleMarketSteps, 1), path.length);
  const activePrices = path.slice(0, activeCount);
  const latestPrice = activePrices[activePrices.length - 1] ?? spot;
  const previousPrice = activePrices[activePrices.length - 2] ?? latestPrice;
  const tickChange = latestPrice - previousPrice;
  const liveIntrinsic = Math.max(latestPrice - market.strike, 0);
  const liveDeskNet = accepted ? quote - liveIntrinsic : 0;
  const finalShown = marketHasRun && visibleMarketSteps >= path.length;

  const chart = useMemo(() => {
    const width = 760;
    const height = 320;
    const pad = { left: 54, right: 34, top: 34, bottom: 46 };
    const minPrice = Math.min(...path, market.strike) - 220;
    const maxPrice = Math.max(...path, market.strike) + 180;
    const plotWidth = width - pad.left - pad.right;
    const plotHeight = height - pad.top - pad.bottom;
    const xScale = (index) => pad.left + (index / (path.length - 1)) * plotWidth;
    const yScale = (price) =>
      pad.top + ((maxPrice - price) / (maxPrice - minPrice)) * plotHeight;
    return { width, height, minPrice, xScale, yScale, yTicks: [21500, 21800, 22000, 22200] };
  }, [path, market.strike]);

  const activeLine = activePrices
    .map((price, index) => `${chart.xScale(index)},${chart.yScale(price)}`)
    .join(" ");
  const areaPoints =
    activePrices.length > 1
      ? [
          `${chart.xScale(0)},${chart.yScale(chart.minPrice)}`,
          activeLine,
          `${chart.xScale(activePrices.length - 1)},${chart.yScale(chart.minPrice)}`,
        ].join(" ")
      : "";
  const latestX = chart.xScale(activePrices.length - 1);
  const latestY = chart.yScale(latestPrice);
  const progress = ((activeCount - 1) / (path.length - 1)) * 100;

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="市场路径" accent={finalShown ? "收盘价已锁定" : "行情自动运行中"} />
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-5">
          {[
            ["标的", "恒生指数 HSI"],
            ["开盘", formatPoints(spot)],
            ["行权价", formatPoints(market.strike)],
            ["你的报价", `${quote} 点`],
            ["期限", "1 个月"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs tracking-[0.14em] text-slate-500">
                {label}
              </div>
              <div className="mt-2 text-lg font-bold text-slate-100">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
            <div className="font-terminal text-xs text-slate-500">实时价格</div>
            <div className="live-price-pulse mt-2 text-3xl font-black text-[#00f0ff]">
              {formatPoints(latestPrice)}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/30 p-4">
            <div className="font-terminal text-xs text-slate-500">本跳变动</div>
            <div
              className={cn(
                "mt-2 text-2xl font-black",
                tickChange >= 0 ? "text-green-400" : "text-red-400",
              )}
            >
              {tickChange >= 0 ? "+" : ""}
              {tickChange}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/30 p-4">
            <div className="font-terminal text-xs text-slate-500">
              {accepted ? "交易台实时净值" : "交易状态"}
            </div>
            {accepted ? (
              <div
                className={cn(
                  "mt-2 text-2xl font-black",
                  liveDeskNet >= 0 ? "text-green-400" : "text-red-400",
                )}
              >
                {liveDeskNet >= 0 ? "+" : ""}
                {liveDeskNet}
              </div>
            ) : (
              <div className="mt-2 text-lg font-black text-red-300">未成交</div>
            )}
          </div>
        </div>

        <div className="market-chart-panel mt-6 rounded-lg border border-cyan-400/15 bg-[#070d19]/85 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-terminal text-sm tracking-[0.18em] text-[#00f0ff]">
                LIVE HSI PATH
              </div>
              <div className="mt-1 text-xs text-slate-500">
                价格自动跳动，终点用于普通 Call 到期结算
              </div>
            </div>
            <div
              className={cn(
                "font-terminal rounded border px-3 py-1 text-xs tracking-[0.16em]",
                finalShown
                  ? "border-green-400/35 bg-green-400/[0.08] text-green-300"
                  : "border-[#ffd700]/35 bg-[#ffd700]/[0.08] text-[#ffd700]",
              )}
            >
              {finalShown ? "MARKET CLOSED" : "VOLATILITY LIVE"}
            </div>
          </div>

          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="relative z-10 w-full">
            <defs>
              <linearGradient id="day2MarketArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,240,255,0.28)" />
                <stop offset="100%" stopColor="rgba(0,240,255,0)" />
              </linearGradient>
              <filter id="day2MarketGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00f0ff" />
              </filter>
            </defs>
            <rect width={chart.width} height={chart.height} rx="10" fill="rgba(5,10,24,0.65)" />

            {chart.yTicks.map((tick) => (
              <g key={tick}>
                <line
                  x1={chart.xScale(0)}
                  x2={chart.xScale(path.length - 1)}
                  y1={chart.yScale(tick)}
                  y2={chart.yScale(tick)}
                  stroke={tick === market.strike ? "#ffd700" : "rgba(148,163,184,0.14)"}
                  strokeDasharray={tick === market.strike ? "6 6" : "2 8"}
                />
                <text
                  x="44"
                  y={chart.yScale(tick) + 4}
                  textAnchor="end"
                  className={tick === market.strike ? "fill-[#ffd700] text-[12px]" : "fill-slate-500 text-[12px]"}
                >
                  {formatPoints(tick)}
                </text>
              </g>
            ))}

            {areaPoints && <polygon points={areaPoints} fill="url(#day2MarketArea)" />}
            {activeLine && activePrices.length > 1 && (
              <polyline
                points={activeLine}
                fill="none"
                stroke="#00f0ff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#day2MarketGlow)"
                className="chart-tension"
              />
            )}

            {activePrices.map((price, index) => (
              <circle
                key={`${price}-${index}`}
                cx={chart.xScale(index)}
                cy={chart.yScale(price)}
                r={index === activePrices.length - 1 ? 5 : 3}
                fill={price >= market.strike ? "#ffd700" : "#00f0ff"}
                opacity={index === activePrices.length - 1 ? 1 : 0.65}
              />
            ))}

            <circle cx={latestX} cy={latestY} r="13" fill="none" stroke="#00f0ff" strokeWidth="2" opacity="0.35">
              <animate attributeName="r" values="9;18;9" dur="0.9s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.75;0.1;0.75" dur="0.9s" repeatCount="indefinite" />
            </circle>
            <text x={latestX + 12} y={latestY - 12} className="fill-[#00f0ff] text-[13px] font-bold">
              {formatPoints(latestPrice)}
            </text>
            <text x={chart.xScale(path.length - 1)} y={chart.height - 12} textAnchor="end" className="fill-slate-500 text-[12px]">
              进度 {Math.round(progress)}%
            </text>
          </svg>
        </div>

        {finalShown ? (
          <div className="scene-enter mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs text-slate-500">最终价格</div>
              <div className="mt-2 text-3xl font-black text-[#00f0ff]">
                {formatPoints(finalPrice)}
              </div>
            </div>
            <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs text-slate-500">Call 到期收益</div>
              <div className="mt-2 text-lg font-bold text-slate-100">
                max({formatPoints(finalPrice)} - {formatPoints(market.strike)}, 0) ={" "}
                <span className="text-[#00f0ff]">{payoff}</span>
              </div>
            </div>
            {accepted ? (
              <div
                className={cn(
                  "rounded-lg border p-4",
                  deskPnl >= 0
                    ? "border-green-400/20 bg-green-400/[0.05]"
                    : "border-red-500/25 bg-red-500/[0.06]",
                )}
              >
                <div className="font-terminal text-xs text-slate-500">交易台结算</div>
                <div
                  className={cn(
                    "mt-2 text-2xl font-black",
                    deskPnl >= 0 ? "text-green-400" : "text-red-400",
                  )}
                >
                  {quote} - {payoff} = {deskPnl >= 0 ? "+" : ""}
                  {deskPnl}
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  你收的期权费减去要赔付的到期收益。
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-red-500/25 bg-red-500/[0.06] p-4">
                <div className="font-terminal text-xs text-slate-500">交易台结算</div>
                <div className="mt-2 text-2xl font-black text-red-300">未成交 · 0</div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  客户报价过高离开，这单没做成，交易台没有收入。
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-md border-l-4 border-[#ffd700] bg-[#ffd700]/[0.06] p-4 text-sm leading-7 text-[#ffd700]">
            行情正在自动播放：价格可能先跌、再反抽、再突破。别被中途波动吓到，普通 Call 最后只看到期价格落在行权价哪一边。
          </div>
        )}
      </div>
    </TerminalCard>
  );
}

function Day2ReportPanel({ score }) {
  if (!score) {
    return (
      <TerminalCard className="scene-enter p-6">
        <div className="text-slate-400">报告生成中。</div>
      </TerminalCard>
    );
  }

  const rows = [
    ["产品", "普通看涨期权 Vanilla Call"],
    ["理论价格", `${score.theoreticalPrice} 点`],
    ["你的报价", `${score.selectedQuote} 点`],
    ["模型利润空间", `${score.margin >= 0 ? "+" : ""}${score.margin} 点`],
    ["客户状态", score.clientStatus],
    ["模拟终值", `${formatPoints(score.marketFinalPrice)} 点`],
    ["模拟 Payoff", `${score.marketPayoff} 点`],
    ["交易台结算", `${score.deskPnl >= 0 ? "+" : ""}${score.deskPnl} 点`],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第二天日终报告" accent="定价柜台复盘" />
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-slate-500">
                {label}
              </div>
              <div className="mt-2 text-xl font-black text-slate-100">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["定价评分", score.pricingScore],
            ["风险披露", score.riskDisclosure],
            ["总评分", score.overall],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4"
            >
              <span className="font-terminal text-xs text-slate-500">{label}</span>
              <ScoreBadge score={value} />
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-[#00f0ff] bg-cyan-400/[0.06] p-4 text-base leading-8 text-slate-200">
          定价评价：{score.pricingComment}
        </div>

        <div className="rounded-md border border-cyan-400/15 bg-black/30 p-4 text-sm leading-7 text-slate-300">
          模拟市场路径：{score.marketPath.map((price) => formatPoints(price)).join(" → ")}。
          客户到期收益为 {score.marketPayoff} 点，客户净盈亏为 {score.clientPnl >= 0 ? "+" : ""}{score.clientPnl} 点。
        </div>

        <div className="rounded-md border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-400">
          教学说明：真实交易台会对冲方向风险（如用期货或反向期权轧平 Delta），此处展示的是未对冲的单笔结果，仅用于理解定价盈亏，不代表交易台真实风险敞口。
        </div>
      </div>
    </TerminalCard>
  );
}

function Day2CompletePanel() {
  const summary = [
    "二叉树展示了未来可能的价格路径。",
    "普通看涨期权的到期收益是 max(最终价格 - 行权价, 0)。",
    "理论价格是报价锚点，不是盈利保证。",
    "交易员报价要平衡公允价值、交易台利润和客户接受度。",
    "下一关会加入一个新规则：敲出障碍（Barrier）。",
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第二天完成" accent="定价训练完成" />
      <div className="flex min-h-[520px] flex-col items-center justify-center p-6 text-center">
        <div className="bg-[linear-gradient(90deg,#00f0ff,#ffd700)] bg-clip-text text-5xl font-black tracking-[0.12em] text-transparent md:text-6xl">
          第二天完成
        </div>
        <div className="mt-8 grid w-full max-w-2xl gap-3 text-left">
          {summary.map((item) => (
            <div
              key={item}
              className="rounded-md border border-cyan-400/15 bg-black/30 px-4 py-3 text-sm leading-7 text-slate-300"
            >
              <span className="font-terminal mr-2 text-[#00f0ff]">规则</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </TerminalCard>
  );
}

function Day3IntroPanel() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第三天晨会" accent="路径依赖产品" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-[#ffd700]/25 bg-[#ffd700]/[0.06] p-6">
          <div className="font-terminal mb-3 text-xs tracking-[0.2em] text-[#ffd700]">
            BARRIER OPTION / 障碍期权
          </div>
          <h1 className="text-4xl font-black leading-tight text-slate-100 md:text-5xl">
            不只看终点，还要看路上有没有碰线
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            前两天的普通期权像“到终点再结算”。第三天的障碍期权更像一份带红线的合约：
            中途碰到某个价格，产品命运就会改变。
          </p>
        </div>

        <div className="grid gap-4">
          {[
            ["普通期权", "主要看最终到期价格。中途价格怎么波动，通常不会提前终止。"],
            ["障碍期权", "额外观察一条障碍线。中途触碰障碍，产品可能敲入或敲出。"],
            ["今天重点", "只做敲出（Knock-Out）入门：碰到障碍线，产品提前失效。"],
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-cyan-400/15 bg-black/30 p-5">
              <div className="font-terminal text-xs tracking-[0.18em] text-[#00f0ff]">
                {title}
              </div>
              <div className="mt-3 text-sm leading-7 text-slate-300">{text}</div>
            </div>
          ))}
        </div>
      </div>
    </TerminalCard>
  );
}

function Day3BarrierConceptPanel() {
  const prices = [21500, 21800, 21400, 21100, 20950, 21600, 22400];
  const barrier = day3Config.market.barrier;

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第一课 / 障碍线" accent="Barrier 是合约红线" />
      <div className="space-y-5 p-6">
        <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#00f0ff]">
            直觉
          </div>
          <p className="text-lg leading-9 text-slate-300">
            障碍线不是预测线，而是
            <span className="font-bold text-[#ffd700]">合约规则线</span>。
            如果产品约定“跌到 21,000 点就敲出”，那市场只要中途碰到或跌破 21,000，
            后面再涨回来也要按敲出规则处理。
          </p>
        </div>

        <div className="rounded-lg border border-cyan-400/15 bg-[#070d19]/85 p-5">
          <svg viewBox="0 0 760 260" className="h-auto w-full" role="img" aria-label="障碍线示意图">
            <defs>
              <linearGradient id="day3PathGlow" x1="0" x2="1">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#ffd700" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map((tick) => (
              <line
                key={tick}
                x1="58"
                x2="710"
                y1={50 + tick * 46}
                y2={50 + tick * 46}
                stroke="rgba(148,163,184,0.13)"
              />
            ))}
            <line x1="58" x2="710" y1="168" y2="168" stroke="#ef4444" strokeWidth="2" strokeDasharray="8 8" />
            <text x="62" y="158" className="fill-red-300 text-[13px] font-bold">
              下方障碍线 {formatPoints(barrier)}
            </text>
            <polyline
              points={prices
                .map((price, index) => {
                  const x = 70 + index * 100;
                  const y = 205 - ((price - 20500) / 2100) * 150;
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="url(#day3PathGlow)"
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {prices.map((price, index) => {
              const x = 70 + index * 100;
              const y = 205 - ((price - 20500) / 2100) * 150;
              const danger = price <= barrier;
              return (
                <g key={`${price}-${index}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={danger ? 9 : 6}
                    fill={danger ? "#ef4444" : "#00f0ff"}
                    stroke={danger ? "#fecaca" : "#cffafe"}
                    strokeWidth="2"
                  />
                  <text x={x} y={y - 14} textAnchor="middle" className={danger ? "fill-red-300 text-[12px] font-bold" : "fill-slate-300 text-[12px]"}>
                    {formatPoints(price)}
                  </text>
                </g>
              );
            })}
            <text x="374" y="238" textAnchor="middle" className="fill-slate-500 text-[13px]">
              价格路径从左到右运行。障碍产品会记住中途有没有碰线。
            </text>
          </svg>
        </div>
      </div>
    </TerminalCard>
  );
}

function Day3KnockOutPanel() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第二课 / Knock-Out" accent="敲出后不可复活" />
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["1. 设定障碍线", "合约写明：例如恒指跌到 21,000 点或以下，产品敲出。"],
            ["2. 观察全过程", "不是只看收盘或到期。只要路径中碰到障碍，就触发规则。"],
            ["3. 敲出后归零", "产品提前失效。最后涨回去，也不能把已经敲出的期权叫回来。"],
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] p-5">
              <div className="font-terminal text-xs tracking-[0.18em] text-[#00f0ff]">
                {title}
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-red-500/25 bg-red-500/[0.06] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-red-300">
            交易台最常见误解
          </div>
          <div className="text-2xl font-black text-slate-100">
            “最后涨回来了，为什么还没收益？”
          </div>
          <p className="mt-4 text-base leading-8 text-slate-300">
            因为障碍期权看路径。只要中途敲出，合约就提前结束。最后价格漂亮，
            对已经结束的合约没有帮助。
          </p>
        </div>

        <div className="rounded-lg border border-[#ffd700]/25 bg-[#ffd700]/[0.06] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#ffd700]">
            为什么要设置障碍？
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [
                "换取更低期权费",
                "买方接受“碰线就失效”的额外条件，产品通常会比同类普通期权便宜。",
              ],
              [
                "表达更精细观点",
                "客户不只是说“会涨”，还可能认为“会涨，但不会先大跌到某条线”。障碍就是把这个观点写进合约。",
              ],
              [
                "控制交易台风险",
                "卖方收取较低期权费时，需要一条规则限制极端路径风险。障碍线就是风险边界。",
              ],
            ].map(([title, text]) => (
              <div key={title} className="rounded-md border border-white/10 bg-black/25 p-4">
                <div className="font-terminal text-xs tracking-[0.16em] text-[#00f0ff]">
                  {title}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md border-l-4 border-[#ffd700] bg-black/25 p-4 text-sm leading-7 text-[#ffd700]">
            Martin 小结：障碍不是白送的限制。它让产品更便宜、更贴合某种市场观点，但代价是客户必须承担路径风险。
          </div>
        </div>
      </div>
    </TerminalCard>
  );
}

function Day3CompareVanillaPanel({ selectedQuote, quoteAnalysis, onUpdateQuote, onUpdateTheoretical }) {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="定价树" accent="Barrier 定价" />
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-cyan-400/25 bg-cyan-400/[0.05] p-5">
            <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#00f0ff]">
              普通看涨期权
            </div>
            <div className="text-2xl font-black text-slate-100">只看最终价格</div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
              <li>- 没有敲出线</li>
              <li>- 期权费通常更贵</li>
              <li>- 如果最终价格高于行权价，产生到期收益</li>
            </ul>
            <div className="mt-5 rounded-md border border-white/10 bg-black/30 p-4">
              期权费示例：<span className="font-black text-[#00f0ff]">{day3Config.market.vanillaPremium} 点</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#ffd700]/30 bg-[#ffd700]/[0.06] p-5">
            <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#ffd700]">
              下跌敲出看涨期权
            </div>
            <div className="text-2xl font-black text-slate-100">更便宜，但会看路径</div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
              <li>- 有下方障碍线：{formatPoints(day3Config.market.barrier)}</li>
              <li>- 期权费更低</li>
              <li>- 中途触碰障碍，产品提前失效</li>
            </ul>
            <div className="mt-5 rounded-md border border-white/10 bg-black/30 p-4">
              期权费示例：<span className="font-black text-[#ffd700]">{day3Config.market.premium} 点</span>
            </div>
          </div>
        </div>

        <div className="rounded-md border-l-4 border-[#ffd700] bg-[#ffd700]/[0.06] p-4 text-base leading-8 text-[#ffd700]">
          Martin 小口诀：障碍期权不是”普通期权打折版”。它便宜，是因为客户把一部分路径风险接过去了。
        </div>

        <BinomialPricingTool
          mode="barrier"
          selectedQuote={selectedQuote}
          quoteAnalysis={quoteAnalysis}
          onUpdateQuote={onUpdateQuote}
          onUpdateTheoretical={onUpdateTheoretical}
        />
      </div>
    </TerminalCard>
  );
}

function Day3HandbookUpdatedPanel() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="系统提示" accent="工作手册新增页面" />
      <div className="flex min-h-[430px] flex-col items-center justify-center p-6 text-center">
        <div className="font-terminal mb-4 text-sm tracking-[0.32em] text-[#00f0ff]">
          工作手册已更新
        </div>
        <div className="bg-[linear-gradient(90deg,#00f0ff,#ffd700)] bg-clip-text text-4xl font-black tracking-[0.08em] text-transparent md:text-5xl">
          障碍期权
        </div>
        <p className="mt-8 max-w-2xl text-base leading-8 text-slate-300">
          新页面说明了障碍线、敲出规则、为什么更便宜，以及必须向客户披露的路径风险。
        </p>
      </div>
    </TerminalCard>
  );
}

function Day3ClientArrivalPanel() {
  const client = day3Config.clientProfile;
  const profileRows = [
    ["姓名", client.name],
    ["客户类型", client.type],
    ["市场观点", client.marketView],
    ["风险承受能力", client.riskTolerance],
    ["目标", client.goal],
    ["产品需求", client.productNeed],
    ["预算", client.budget],
    ["经验", client.experience],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="客户资料" accent="预算敏感订单" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-5">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-[#ffd700]/30 bg-[#ffd700]/[0.08] font-terminal text-4xl font-black text-[#ffd700]">
              陈
            </div>
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[#00f0ff]">
                预算敏感散户
              </div>
              <div className="mt-2 text-2xl font-black text-slate-100">{client.name}</div>
            </div>
          </div>
          <div className="grid gap-3">
            {profileRows.map(([label, value]) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                <div className="font-terminal text-xs tracking-[0.14em] text-slate-500">
                  {label}
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-200">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/[0.05] p-5">
          <div className="font-terminal mb-4 text-xs tracking-[0.18em] text-[#ffd700]">
            客户对白
          </div>
          <div className="space-y-4">
            {client.dialogue.map((line) => (
              <div key={line} className="rounded-md border border-white/10 bg-black/30 p-4 text-base leading-8 text-slate-200">
                陈女士：“{line}”
              </div>
            ))}
          </div>
        </div>
      </div>
    </TerminalCard>
  );
}

function RealDataContextCard({ context }) {
  if (!context) return null;
  return (
    <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/[0.05] p-4">
      <div className="flex items-center gap-2">
        <span className="font-terminal text-xs tracking-[0.16em] text-emerald-300">
          📡 {context.title}
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {context.bullets.map((line) => (
          <li key={line} className="flex gap-2 text-sm leading-7 text-slate-300">
            <span className="text-emerald-300">·</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 border-t border-white/10 pt-2 font-terminal text-[11px] leading-5 text-slate-500">
        {context.source}
      </div>
    </div>
  );
}

function Day3ClientResponsePanel({ selectedQuote, clientResponse }) {
  const response = clientResponse ?? getDay3QuoteAnalysis(selectedQuote);
  const acceptedText = response.accepted ? "交易接受" : "客户拒绝";

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="客户反馈" accent="障碍报价回执" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#00f0ff]">
            报价记录
          </div>
          <div className="text-5xl font-black text-[#00f0ff]">{selectedQuote} 点</div>
          <div className="mt-4 text-sm leading-7 text-slate-400">
            障碍报价已发出，等待市场结算。
          </div>
        </div>

        <div className="rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/[0.05] p-5">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-md border border-[#ffd700]/30 bg-black/40 font-terminal text-3xl font-black text-[#ffd700]">
              陈
            </div>
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[#ffd700]">
                陈女士
              </div>
              <div className="mt-1 text-sm text-slate-500">{acceptedText}</div>
            </div>
          </div>
          <div className="rounded-md border border-white/10 bg-black/30 p-5 text-xl font-black leading-9 text-slate-100">
            “{response.customerLine}”
          </div>
        </div>
      </div>
    </TerminalCard>
  );
}

function Day3MarketRunPanel({ selectedProduct, marketHasRun, visibleMarketSteps }) {
  const market = day3Config.market;
  const result = getDay3MarketResult();
  const activeCount = Math.min(Math.max(visibleMarketSteps, 1), market.path.length);
  const activePrices = market.path.slice(0, activeCount);
  const latestPrice = activePrices[activePrices.length - 1] ?? market.spot;
  const knockedNow = activePrices.some((price) => price <= market.barrier);
  const selectedProductName =
    day3Config.products.find((product) => product.id === selectedProduct)?.name ?? "未选择产品";
  const finalShown = marketHasRun && visibleMarketSteps >= market.path.length;

  const chart = useMemo(() => {
    const width = 820;
    const height = 360;
    const pad = { left: 58, right: 40, top: 34, bottom: 48 };
    const minPrice = Math.min(...market.path, market.barrier) - 260;
    const maxPrice = Math.max(...market.path, market.strike) + 220;
    const plotWidth = width - pad.left - pad.right;
    const plotHeight = height - pad.top - pad.bottom;
    const xScale = (index) => pad.left + (index / (market.path.length - 1)) * plotWidth;
    const yScale = (price) =>
      pad.top + ((maxPrice - price) / (maxPrice - minPrice)) * plotHeight;

    return { width, height, xScale, yScale, yTicks: [21000, 21500, 22000, 22400] };
  }, [market.barrier, market.path, market.strike]);

  const activeLine = activePrices
    .map((price, index) => `${chart.xScale(index)},${chart.yScale(price)}`)
    .join(" ");
  const barrierY = chart.yScale(market.barrier);
  const strikeY = chart.yScale(market.strike);

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="障碍市场路径" accent={finalShown ? "路径已结算" : "实时观察障碍线"} />
      <div className="space-y-5 p-5">
        <div className="grid gap-4 md:grid-cols-6">
          {[
            ["标的", market.underlying],
            ["现价", formatPoints(market.spot)],
            ["行权价", formatPoints(market.strike)],
            ["障碍线", formatPoints(market.barrier)],
            ["期权费", `${market.premium} 点`],
            ["期限", market.maturity],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs tracking-[0.14em] text-slate-500">
                {label}
              </div>
              <div className="mt-2 text-lg font-bold text-slate-100">{value}</div>
            </div>
          ))}
        </div>

        <RealDataContextCard context={market.marketContext} />

        <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/[0.05] p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-[#ffd700]">
              已选产品
            </div>
            <div className="mt-2 text-xl font-black text-slate-100">{selectedProductName}</div>
            <div className="mt-4 rounded-md border border-white/10 bg-black/30 p-3 text-sm leading-7 text-slate-300">
              当前价格：
              <span className={cn("font-terminal ml-1 text-2xl font-black", knockedNow ? "text-red-300" : "text-[#00f0ff]")}>
                {formatPoints(latestPrice)}
              </span>
            </div>
            <div
              className={cn(
                "mt-3 rounded-md border px-3 py-2 font-terminal text-xs tracking-[0.14em]",
                knockedNow
                  ? "border-red-500/40 bg-red-500/[0.08] text-red-300"
                  : "border-green-400/30 bg-green-400/[0.06] text-green-300",
              )}
            >
              {knockedNow ? "障碍已触碰 / 产品敲出" : "障碍尚未触碰"}
            </div>
          </div>

          <div className="market-chart-panel rounded-lg border border-cyan-400/15 bg-[#070d19]/85 p-4">
            <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-auto w-full" role="img" aria-label="Day 3 障碍期权市场路径">
              {chart.yTicks.map((tick) => (
                <g key={tick}>
                  <line x1="58" x2="780" y1={chart.yScale(tick)} y2={chart.yScale(tick)} stroke="rgba(148,163,184,0.15)" />
                  <text x="18" y={chart.yScale(tick) + 4} className="fill-slate-500 text-[12px]">
                    {formatPoints(tick)}
                  </text>
                </g>
              ))}
              <line x1="58" x2="780" y1={barrierY} y2={barrierY} stroke="#ef4444" strokeWidth="3" strokeDasharray="8 8" />
              <text x="625" y={barrierY - 10} className="fill-red-300 text-[13px] font-bold">
                敲出障碍 {formatPoints(market.barrier)}
              </text>
              <line x1="58" x2="780" y1={strikeY} y2={strikeY} stroke="#ffd700" strokeWidth="2" strokeDasharray="6 7" />
              <text x="625" y={strikeY - 10} className="fill-[#ffd700] text-[13px] font-bold">
                行权价 {formatPoints(market.strike)}
              </text>
              <polyline
                points={activeLine}
                fill="none"
                stroke={knockedNow ? "#ef4444" : "#00f0ff"}
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
                className="chart-tension"
              />
              {activePrices.map((price, index) => {
                const danger = price <= market.barrier;
                return (
                  <g key={`${price}-${index}`}>
                    <circle
                      cx={chart.xScale(index)}
                      cy={chart.yScale(price)}
                      r={danger ? 9 : 6}
                      fill={danger ? "#ef4444" : "#00f0ff"}
                      stroke={danger ? "#fecaca" : "#cffafe"}
                      strokeWidth="2"
                    />
                    <text
                      x={chart.xScale(index)}
                      y={chart.yScale(price) - 14}
                      textAnchor="middle"
                      className={danger ? "fill-red-300 text-[12px] font-bold" : "fill-slate-300 text-[12px]"}
                    >
                      {formatPoints(price)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {finalShown && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-red-500/25 bg-red-500/[0.06] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-red-300">
                敲出结果
              </div>
              <div className="mt-2 text-2xl font-black text-red-300">
                {result.knockedOut ? `第 ${result.knockedOutIndex + 1} 个价格点触碰障碍` : "未敲出"}
              </div>
            </div>
            <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-slate-500">
                最终价格
              </div>
              <div className="mt-2 text-2xl font-black text-[#00f0ff]">
                {formatPoints(result.finalPrice)}
              </div>
            </div>
            <div className="rounded-lg border border-[#ffd700]/25 bg-[#ffd700]/[0.06] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[#ffd700]">
                Barrier Call 净盈亏
              </div>
              <div className={cn("mt-2 text-2xl font-black", result.pnl >= 0 ? "text-green-400" : "text-red-300")}>
                {result.pnl >= 0 ? "+" : ""}
                {result.pnl} 点
              </div>
            </div>
          </div>
        )}
      </div>
    </TerminalCard>
  );
}

function Day3ReportPanel({ score }) {
  if (!score) {
    return (
      <TerminalCard className="scene-enter p-6">
        <div className="text-slate-400">报告生成中。</div>
      </TerminalCard>
    );
  }

  const rows = [
    ["产品", score.productName],
    ["你的报价", `${score.selectedQuote} 点`],
    ["客户状态", score.clientStatus],
    ["最终价格", `${formatPoints(score.finalPrice)} 点`],
    ["障碍线", `${formatPoints(day3Config.market.barrier)} 点`],
    ["敲出状态", score.knockedOut ? "已敲出" : "未敲出"],
    ["普通 Call 到期收益", `${score.vanillaPayoff} 点`],
    [
      "Barrier Call 净盈亏",
      score.quoteAccepted ? `${score.pnl >= 0 ? "+" : ""}${score.pnl} 点` : "未成交 · 0 点",
    ],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第三天日终报告" accent="障碍期权复盘" />
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-slate-500">
                {label}
              </div>
              <div className="mt-2 text-xl font-black text-slate-100">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["产品适当性", score.suitability],
            ["风险披露", score.riskDisclosure],
            ["路径判断", score.pathAwareness],
            ["总评分", score.overall],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4"
            >
              <span className="font-terminal text-xs text-slate-500">{label}</span>
              <ScoreBadge score={value} />
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-red-400 bg-red-500/[0.06] p-4 text-base leading-8 text-red-200">
          市场复盘：价格中途跌破 {formatPoints(day3Config.market.barrier)} 点，触发敲出。
          最终价格虽然回到 {formatPoints(score.finalPrice)} 点，但敲出产品已经提前失效。
        </div>

        <div className="rounded-md border-l-4 border-[#ffd700] bg-[#ffd700]/[0.06] p-4 text-base leading-8 text-[#ffd700]">
          Martin 复盘：{score.martinComment}
        </div>
      </div>
    </TerminalCard>
  );
}

function Day3CompletePanel() {
  const summary = [
    "普通期权主要看最终到期价格。",
    "障碍期权还要看中途路径是否触碰障碍线。",
    "Knock-Out 表示触碰障碍后产品提前失效。",
    "障碍期权更便宜，是因为客户承担了额外路径风险。",
    "适当性和风险披露在复杂产品里比市场方向更重要。",
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第三天完成" accent="障碍训练完成" />
      <div className="flex min-h-[520px] flex-col items-center justify-center p-6 text-center">
        <div className="bg-[linear-gradient(90deg,#00f0ff,#ffd700)] bg-clip-text text-5xl font-black tracking-[0.12em] text-transparent md:text-6xl">
          第三天完成
        </div>
        <div className="mt-8 grid w-full max-w-2xl gap-3 text-left">
          {summary.map((item) => (
            <div
              key={item}
              className="rounded-md border border-cyan-400/15 bg-black/30 px-4 py-3 text-sm leading-7 text-slate-300"
            >
              <span className="font-terminal mr-2 text-[#00f0ff]">规则</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </TerminalCard>
  );
}

// ===== 以下 Day4 CBBC 面板已归档（2026-06 改定价实战）=====
// 这些函数不再挂载到 MainPanel.panels / BottomActionBar，仅保留备查。
function Day4CbbcIntroPanel_ARCHIVED() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第四天晨会" accent="牛证、熊证与上方收回价" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-[#ffd700]/25 bg-[#ffd700]/[0.06] p-6">
          <div className="font-terminal mb-3 text-xs tracking-[0.2em] text-[#ffd700]">
            CBBC / 牛熊证
          </div>
          <h1 className="text-4xl font-black leading-tight text-slate-100 md:text-5xl">
            牛证看涨，熊证看跌，但两边都有危险线
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            牛熊证可以先当成一种带强制收回机制的杠杆型障碍产品。
            牛证押上涨，但怕标的向下碰到收回价；熊证押下跌，但怕标的向上碰到收回价。
            今天我们专门看熊证的上方收回价。
          </p>
        </div>

        <div className="grid gap-4">
          {[
            ["牛证 Bull CBBC", "适合看涨。标的上涨通常有利；但如果先跌到或低于下方收回价，会触发 MCE。"],
            ["熊证 Bear CBBC", "适合看跌。标的下跌通常有利；但如果先涨到或高于上方收回价，会触发 MCE。"],
            ["今日重点", "熊证的危险线在上方。市场最后跌下来也不够，中途先冲上收回价就已经出局。"],
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-cyan-400/15 bg-black/30 p-5">
              <div className="font-terminal text-xs tracking-[0.18em] text-[#00f0ff]">
                {title}
              </div>
              <div className="mt-3 text-sm leading-7 text-slate-300">{text}</div>
            </div>
          ))}
        </div>
      </div>
    </TerminalCard>
  );
}

function Day4CbbcHandbookUpdatedPanel_ARCHIVED() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="系统提示" accent="工作手册新增页面" />
      <div className="flex min-h-[430px] flex-col items-center justify-center p-6 text-center">
        <div className="font-terminal mb-4 text-sm tracking-[0.32em] text-[#00f0ff]">
          工作手册已更新
        </div>
        <div className="bg-[linear-gradient(90deg,#00f0ff,#ffd700)] bg-clip-text text-4xl font-black tracking-[0.08em] text-transparent md:text-5xl">
          牛熊证 / CBBC
        </div>
        <p className="mt-8 max-w-2xl text-base leading-8 text-slate-300">
          今天把 Day 3 的障碍规则应用到港股市场常见的牛熊证产品，并重点观察熊证的上方收回价。
        </p>
      </div>
    </TerminalCard>
  );
}

function Day4CbbcClientArrivalPanel_ARCHIVED() {
  const client = day4CbbcConfig_ARCHIVED.clientProfile;
  const profileRows = [
    ["姓名", client.name],
    ["客户类型", client.type],
    ["市场观点", client.marketView],
    ["风险承受能力", client.riskTolerance],
    ["目标", client.goal],
    ["产品需求", client.productNeed],
    ["预算", client.budget],
    ["经验", client.experience],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="客户资料" accent="CBBC 咨询订单" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-5">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-[#ffd700]/30 bg-[#ffd700]/[0.08] font-terminal text-4xl font-black text-[#ffd700]">
              周
            </div>
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[#00f0ff]">
                活跃零售客户
              </div>
              <div className="mt-2 text-2xl font-black text-slate-100">{client.name}</div>
            </div>
          </div>
          <div className="grid gap-3">
            {profileRows.map(([label, value]) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                <div className="font-terminal text-xs tracking-[0.14em] text-slate-500">
                  {label}
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-200">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/[0.05] p-5">
          <div className="font-terminal mb-4 text-xs tracking-[0.18em] text-[#ffd700]">
            客户对白
          </div>
          <div className="space-y-4">
            {client.dialogue.map((line) => (
              <div key={line} className="rounded-md border border-white/10 bg-black/30 p-4 text-base leading-8 text-slate-200">
                周女士：“{line}”
              </div>
            ))}
          </div>
        </div>
      </div>
    </TerminalCard>
  );
}

function Day4CbbcSuitabilityPanel_ARCHIVED({ selectedSuitability, suitabilityMessage, onSelectSuitability }) {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="适当性判断" accent="先判断客户，再判断产品" />
      <div className="space-y-5 p-6">
        <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#00f0ff]">
            问题
          </div>
          <div className="text-2xl font-black text-slate-100">
            周女士适合评估熊证吗？
          </div>
          <p className="mt-4 text-base leading-8 text-slate-300">
            她看跌、风险承受能力高，也知道 MCE 风险。现在要判断：能不能进入熊证推荐，而不是机械地回避所有 CBBC。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {day4CbbcConfig_ARCHIVED.suitabilityOptions.map((option) => {
            const selected = selectedSuitability === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectSuitability(option.id)}
                className={cn(
                  "rounded-lg border p-5 text-left transition duration-300",
                  selected
                    ? "border-[#ffd700]/70 bg-[#ffd700]/[0.08] shadow-[0_0_26px_rgba(255,215,0,0.18)]"
                    : "border-cyan-400/15 bg-black/25 hover:border-cyan-400/45 hover:bg-cyan-400/[0.06]",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-terminal text-xs tracking-[0.16em] text-slate-500">
                      {option.tag}
                    </div>
                    <div className={cn("mt-2 text-xl font-black", selected ? "text-[#ffd700]" : "text-[#00f0ff]")}>
                      {option.title}
                    </div>
                  </div>
                  {selected && (
                    <div className="font-terminal rounded border border-[#ffd700]/40 px-2 py-1 text-xs text-[#ffd700]">
                      已选择
                    </div>
                  )}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{option.description}</p>
              </button>
            );
          })}
        </div>

        {suitabilityMessage && (
          <div
            className={cn(
              "rounded-md border-l-4 p-4 text-sm leading-7",
              selectedSuitability === day4CbbcConfig_ARCHIVED.scoringRules.correctSuitability
                ? "border-green-400 bg-green-400/[0.06] text-green-300"
                : "border-[#ffd700] bg-[#ffd700]/[0.06] text-[#ffd700]",
            )}
          >
            {suitabilityMessage}
          </div>
        )}
      </div>
    </TerminalCard>
  );
}

function Day4CbbcMarketRunPanel_ARCHIVED({ selectedProduct, marketHasRun, visibleMarketSteps }) {
  const market = day4CbbcConfig_ARCHIVED.market;
  const result = getDay4CbbcMarketResult_ARCHIVED();
  const activeCount = Math.min(Math.max(visibleMarketSteps, 1), market.path.length);
  const activePrices = market.path.slice(0, activeCount);
  const latestPrice = activePrices[activePrices.length - 1] ?? market.spot;
  const mceNow = activePrices.some((price) => price >= market.cbbcCallPrice);
  const selectedProductName =
    day4CbbcConfig_ARCHIVED.products.find((product) => product.id === selectedProduct)?.name ?? "未选择产品";
  const finalShown = marketHasRun && visibleMarketSteps >= market.path.length;

  const chart = useMemo(() => {
    const width = 820;
    const height = 360;
    const pad = { left: 58, right: 40, top: 34, bottom: 48 };
    const minPrice = Math.min(...market.path, market.strike) - 260;
    const maxPrice = Math.max(...market.path, market.cbbcCallPrice) + 220;
    const plotWidth = width - pad.left - pad.right;
    const plotHeight = height - pad.top - pad.bottom;
    const xScale = (index) => pad.left + (index / (market.path.length - 1)) * plotWidth;
    const yScale = (price) =>
      pad.top + ((maxPrice - price) / (maxPrice - minPrice)) * plotHeight;

    return { width, height, xScale, yScale, yTicks: [20800, 21200, 21600, 22000] };
  }, [market.cbbcCallPrice, market.path, market.strike]);

  const activeLine = activePrices
    .map((price, index) => `${chart.xScale(index)},${chart.yScale(price)}`)
    .join(" ");
  const callPriceY = chart.yScale(market.cbbcCallPrice);
  const strikeY = chart.yScale(market.strike);

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="CBBC 市场路径" accent={finalShown ? "路径已结算" : "观察 MCE"} />
      <div className="space-y-5 p-5">
        <div className="grid gap-4 md:grid-cols-6">
          {[
            ["标的", market.underlying],
            ["现价", formatPoints(market.spot)],
            ["行权价", formatPoints(market.strike)],
            ["熊证收回价", formatPoints(market.cbbcCallPrice)],
            ["熊证成本", `${market.cbbcEntryCost} 点（约 ${market.cbbcLeverage}× 杠杆，示意）`],
            ["普通 Put 期权费", `${market.vanillaPremium} 点`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs tracking-[0.14em] text-slate-500">
                {label}
              </div>
              <div className="mt-2 text-lg font-bold text-slate-100">{value}</div>
            </div>
          ))}
        </div>

        <RealDataContextCard context={market.marketContext} />

        <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/[0.05] p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-[#ffd700]">
              玩家推荐
            </div>
            <div className="mt-2 text-xl font-black text-slate-100">{selectedProductName}</div>
            <div className="mt-4 rounded-md border border-white/10 bg-black/30 p-3 text-sm leading-7 text-slate-300">
              实时恒指：
              <span className={cn("font-terminal ml-1 text-2xl font-black", mceNow ? "text-red-300" : "text-[#00f0ff]")}>
                {formatPoints(latestPrice)}
              </span>
            </div>
            <div
              className={cn(
                "mt-3 rounded-md border px-3 py-2 font-terminal text-xs tracking-[0.14em]",
                mceNow
                  ? "border-red-500/40 bg-red-500/[0.08] text-red-300"
                  : "border-green-400/30 bg-green-400/[0.06] text-green-300",
              )}
            >
              {mceNow ? "Bear CBBC 已触发 MCE" : "Bear CBBC 尚未触发 MCE"}
            </div>
          </div>

          <div className="market-chart-panel rounded-lg border border-cyan-400/15 bg-[#070d19]/85 p-4">
            <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-auto w-full" role="img" aria-label="Day 4 CBBC 市场路径">
              {chart.yTicks.map((tick) => (
                <g key={tick}>
                  <line x1="58" x2="780" y1={chart.yScale(tick)} y2={chart.yScale(tick)} stroke="rgba(148,163,184,0.15)" />
                  <text x="18" y={chart.yScale(tick) + 4} className="fill-slate-500 text-[12px]">
                    {formatPoints(tick)}
                  </text>
                </g>
              ))}
              <line x1="58" x2="780" y1={callPriceY} y2={callPriceY} stroke="#ef4444" strokeWidth="3" strokeDasharray="8 8" />
              <text x="612" y={callPriceY - 10} className="fill-red-300 text-[13px] font-bold">
                熊证上方收回价 {formatPoints(market.cbbcCallPrice)}
              </text>
              <line x1="58" x2="780" y1={strikeY} y2={strikeY} stroke="#ffd700" strokeWidth="2" strokeDasharray="6 7" />
              <text x="612" y={strikeY - 10} className="fill-[#ffd700] text-[13px] font-bold">
                普通 Put 行权价 {formatPoints(market.strike)}
              </text>
              <polyline
                points={activeLine}
                fill="none"
                stroke={mceNow ? "#ef4444" : "#00f0ff"}
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
                className="chart-tension"
              />
              {activePrices.map((price, index) => {
                const danger = price >= market.cbbcCallPrice;
                return (
                  <g key={`${price}-${index}`}>
                    <circle
                      cx={chart.xScale(index)}
                      cy={chart.yScale(price)}
                      r={danger ? 9 : 6}
                      fill={danger ? "#ef4444" : "#00f0ff"}
                      stroke={danger ? "#fecaca" : "#cffafe"}
                      strokeWidth="2"
                    />
                    <text
                      x={chart.xScale(index)}
                      y={chart.yScale(price) - 14}
                      textAnchor="middle"
                      className={danger ? "fill-red-300 text-[12px] font-bold" : "fill-slate-300 text-[12px]"}
                    >
                      {formatPoints(price)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {finalShown && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-red-500/25 bg-red-500/[0.06] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-red-300">
                Bear CBBC 结果
              </div>
              <div className="mt-2 text-2xl font-black text-red-300">
                {result.mceTriggered ? `第 ${result.mceIndex + 1} 个价格点触发 MCE` : "未触发 MCE"}
              </div>
            </div>
            <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-slate-500">
                普通 Put 净盈亏
              </div>
              <div className={cn("mt-2 text-2xl font-black", result.vanillaPnl >= 0 ? "text-green-400" : "text-red-300")}>
                {result.vanillaPnl >= 0 ? "+" : ""}
                {result.vanillaPnl} 点
              </div>
            </div>
            <div className="rounded-lg border border-[#ffd700]/25 bg-[#ffd700]/[0.06] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[#ffd700]">
                教学结论
              </div>
              <div className="mt-2 text-base font-black leading-7 text-[#ffd700]">
                最后跌回来，不代表 MCE 后的熊证能复活。
              </div>
            </div>
          </div>
        )}
      </div>
    </TerminalCard>
  );
}

function Day4CbbcReportPanel_ARCHIVED({ score }) {
  if (!score) {
    return (
      <TerminalCard className="scene-enter p-6">
        <div className="text-slate-400">报告生成中。</div>
      </TerminalCard>
    );
  }

  const rows = [
    ["客户适当性判断", score.suitabilityChoice],
    ["推荐产品", score.productName],
    ["最终价格", `${formatPoints(score.finalPrice)} 点`],
    ["Bear CBBC 状态", score.mceTriggered ? "已触发 MCE" : "未触发 MCE"],
    ["Bear CBBC P&L", `${score.bearCbbcPnl >= 0 ? "+" : ""}${score.bearCbbcPnl} 点`],
    ["普通 Put P&L", `${score.vanillaPnl >= 0 ? "+" : ""}${score.vanillaPnl} 点`],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第四天日终报告" accent="CBBC 适当性复盘" />
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-slate-500">
                {label}
              </div>
              <div className="mt-2 text-xl font-black text-slate-100">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["适当性", score.suitabilityScore],
            ["产品推荐", score.productScore],
            ["风险说明", score.riskDisclosure],
            ["总评分", score.overall],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4"
            >
              <span className="font-terminal text-xs text-slate-500">{label}</span>
              <ScoreBadge score={value} />
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-red-400 bg-red-500/[0.06] p-4 text-base leading-8 text-red-200">
          路径复盘：恒指中途冲高触及熊证上方收回价 {formatPoints(day4CbbcConfig_ARCHIVED.market.cbbcCallPrice)} 点，
          触发 MCE。后面虽然跌到 {formatPoints(score.finalPrice)} 点，熊证也不会自动恢复。
        </div>

        <div className="rounded-md border-l-4 border-[#ffd700] bg-[#ffd700]/[0.06] p-4 text-base leading-8 text-[#ffd700]">
          Martin 复盘：{score.martinComment}
        </div>
      </div>
    </TerminalCard>
  );
}

function Day4CbbcCompletePanel_ARCHIVED() {
  const summary = [
    "Bull CBBC 是看涨杠杆产品，Bear CBBC 是看跌杠杆产品。",
    "CBBC 有收回价，触及收回价会触发强制收回事件（MCE）。",
    "牛证通常看下方收回价，熊证通常看上方收回价。",
    "MCE 后产品提前终止，残值不保证。",
    "最后方向判断正确，也可能因为中途 MCE 而损失。",
    "推荐 CBBC 前必须确认客户理解杠杆、收回价和残值风险。",
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="第四天完成" accent="CBBC 适当性训练完成" />
      <div className="flex min-h-[520px] flex-col items-center justify-center p-6 text-center">
        <div className="bg-[linear-gradient(90deg,#00f0ff,#ffd700)] bg-clip-text text-5xl font-black tracking-[0.12em] text-transparent md:text-6xl">
          第四天完成
        </div>
        <div className="mt-8 grid w-full max-w-2xl gap-3 text-left">
          {summary.map((item) => (
            <div
              key={item}
              className="rounded-md border border-cyan-400/15 bg-black/30 px-4 py-3 text-sm leading-7 text-slate-300"
            >
              <span className="font-terminal mr-2 text-[#00f0ff]">规则</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </TerminalCard>
  );
}
// ===== Day4 CBBC 归档面板结束 =====

// ===== Day4 实战篇 · 新面板（通用、index 驱动）=====

function Day4BriefingPanel() {
  const steps = [
    ["① 读方向", "客户看涨还是看跌？这决定产品大类。"],
    ["② 读风险与预算", "能不能接受附加条件（如跌破某线作废）？预算紧不紧？这决定普通还是障碍。"],
    ["③ 算理论价再报价", "把参数填进计算器算出理论价，加合理利润——不能太低（白送），也不能太高（吓跑）。"],
  ];
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="结业晨会" accent="三客户定价实战" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-[#ffd700]/25 bg-[#ffd700]/[0.06] p-6">
          <div className="font-terminal mb-3 text-xs tracking-[0.2em] text-[#ffd700]">
            结业实战 / GRADUATION
          </div>
          <h1 className="text-4xl font-black leading-tight text-slate-100 md:text-5xl">
            没有新产品，今天考的是你的定价判断
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            前三天你学了普通期权、二叉树定价、障碍期权。今天三位客户排队等你报价——
            用的全是你已经会的工具：普通 Call、障碍 Call，和那台二叉树计算器。
          </p>
          <p className="mt-4 text-base leading-8 text-slate-300">
            Martin 只给你通用原则，<span className="font-black text-[#ffd700]">不会告诉你该选什么、报多少</span>。
            选错或报错客户会有反应，但答案要你自己判断。
          </p>
        </div>

        <div className="grid gap-4">
          <div className="font-terminal text-xs tracking-[0.18em] text-[#00f0ff]">
            Martin 的通用原则
          </div>
          {steps.map(([title, text]) => (
            <div key={title} className="rounded-lg border border-cyan-400/15 bg-black/30 p-5">
              <div className="text-lg font-black text-[#00f0ff]">{title}</div>
              <div className="mt-2 text-sm leading-7 text-slate-300">{text}</div>
            </div>
          ))}
          <div className="rounded-md border-l-4 border-[#ffd700] bg-[#ffd700]/[0.06] p-4 text-sm leading-7 text-[#ffd700]">
            今日客户：3 位，难度递增、提示递减。最后一位不会告诉你要哪种产品。
          </div>
        </div>
      </div>
    </TerminalCard>
  );
}

function Day4ClientQueueBadge({ index, total }) {
  return (
    <div className="font-terminal flex items-center gap-2 text-xs tracking-[0.14em] text-slate-500">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border",
            i === index
              ? "border-[#ffd700]/70 bg-[#ffd700]/[0.12] text-[#ffd700]"
              : i < index
                ? "border-green-400/40 bg-green-400/[0.06] text-green-300"
                : "border-white/10 bg-black/30 text-slate-600",
          )}
        >
          {i + 1}
        </span>
      ))}
      <span className="ml-1">第 {index + 1} / {total} 位客户</span>
    </div>
  );
}

function Day4ClientProfilePanel({ client, index, total }) {
  const { profile } = client;
  const profileRows = [
    ["姓名", profile.name],
    ["客户类型", profile.type],
    ["市场观点", profile.marketView],
    ["风险承受能力", profile.riskTolerance],
    ["目标", profile.goal],
    ["产品需求", profile.productNeed],
    ["预算", profile.budget],
    ["经验", profile.experience],
  ];
  const isJudge = client.taskType === "judge";

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="客户资料" accent={isJudge ? "结业判断订单" : "实战报价订单"} />
      <div className="px-6 pt-5">
        <Day4ClientQueueBadge index={index} total={total} />
      </div>
      <div className="grid gap-6 p-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-5">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-[#ffd700]/30 bg-[#ffd700]/[0.08] font-terminal text-4xl font-black text-[#ffd700]">
              {client.avatar}
            </div>
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[#00f0ff]">
                {client.typeLabel}
              </div>
              <div className="mt-2 text-2xl font-black text-slate-100">{profile.name}</div>
            </div>
          </div>
          <div className="grid gap-3">
            {profileRows.map(([label, value]) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                <div className="font-terminal text-xs tracking-[0.14em] text-slate-500">
                  {label}
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-200">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/[0.05] p-5">
            <div className="font-terminal mb-4 text-xs tracking-[0.18em] text-[#ffd700]">
              客户对白
            </div>
            <div className="space-y-4">
              {client.dialogue.map((line) => (
                <div
                  key={line}
                  className="rounded-md border border-white/10 bg-black/30 p-4 text-base leading-8 text-slate-200"
                >
                  {profile.name}：“{line}”
                </div>
              ))}
            </div>
          </div>
          {isJudge && (
            <div className="rounded-md border-l-4 border-[#ffd700] bg-[#ffd700]/[0.06] p-4 text-sm leading-7 text-[#ffd700]">
              注意：他没说要哪种产品。下一步你要自己判断——从他的预算和「能接受跌破某位置作废」里嗅出该上普通 Call 还是障碍 Call。
            </div>
          )}
        </div>
      </div>
    </TerminalCard>
  );
}

function Day4ParamCard({ client }) {
  const { params } = client;
  const rows = [
    ["S₀ 现价", formatPoints(params.spot)],
    ["K 行权价", formatPoints(params.strike)],
    ...(client.mode === "barrier" ? [["障碍价格", formatPoints(params.barrier)]] : []),
    ["σ 波动率", `${params.sigma}%`],
    ["T 年化期限", `${params.maturity}（${client.mode === "barrier" ? "3 个月" : "1 个月"}）`],
    ["r 无风险利率", `${params.rate}%`],
    ["N 步数", `${params.steps} 步（固定）`],
  ];
  return (
    <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.04] p-5">
      <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#00f0ff]">
        {client.profile.name} 的成交参数（照着填进计算器）
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-md border border-white/10 bg-black/30 p-3">
            <div className="font-terminal text-[11px] tracking-[0.12em] text-slate-500">{label}</div>
            <div className="mt-1 text-lg font-black text-slate-100">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs leading-6 text-slate-500">
        计算器默认值是占位最小值，需要你把上面这些参数手动填进去，才能算出{client.profile.name}这单的理论价。
      </div>
    </div>
  );
}

function Day4PricingPanel({ client, selectedQuote, onUpdateQuote }) {
  const isBarrier = client.mode === "barrier";
  const quoteHint = isBarrier
    ? `参考计算器算出的「下跌敲出 Call 理论价」，加上合理利润，给${client.profile.name}报一个权利金。障碍产品的卖点是比普通 Call 便宜。`
    : `参考计算器算出的「普通 Call 理论价」，加上合理利润，给${client.profile.name}报一个权利金。`;
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader
        label="计算器报价"
        accent={isBarrier ? "障碍 Call · 盲报" : "普通 Call · 盲报"}
      />
      <div className="space-y-5 p-6">
        <Day4ParamCard client={client} />
        <BinomialPricingTool
          mode={client.mode}
          selectedQuote={selectedQuote}
          onUpdateQuote={onUpdateQuote}
          enableParamCheck={false}
          quoteHint={quoteHint}
        />
      </div>
    </TerminalCard>
  );
}

function Day4ClientResponsePanel({ client, selectedQuote, clientResponse }) {
  const response = clientResponse ?? getDay4QuoteAnalysis(selectedQuote, client);
  const acceptedText = response.accepted ? "交易接受" : "客户拒绝";
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="客户反馈" accent="报价回执" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[#00f0ff]">
            报价记录
          </div>
          <div className="text-5xl font-black text-[#00f0ff]">{selectedQuote} 点</div>
          <div className="mt-4 rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm leading-7 text-slate-400">
            理论价锚点 ≈ <span className="font-black text-slate-200">{response.theoretical} 点</span>
            ，你的利润 {response.margin >= 0 ? "+" : ""}
            {response.margin} 点。
          </div>
        </div>

        <div className="rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/[0.05] p-5">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-md border border-[#ffd700]/30 bg-black/40 font-terminal text-3xl font-black text-[#ffd700]">
              {client.avatar}
            </div>
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[#ffd700]">
                {client.profile.name}
              </div>
              <div className="mt-1 text-sm text-slate-500">{acceptedText}</div>
            </div>
          </div>
          <div className="rounded-md border border-white/10 bg-black/30 p-5 text-xl font-black leading-9 text-slate-100">
            “{response.customerLine}”
          </div>
        </div>
      </div>
    </TerminalCard>
  );
}

function Day4ScorecardPanel({ results, clients }) {
  const completed = results.filter(Boolean);
  const dealCount = completed.filter((r) => r.accepted).length;
  const correctProductCount = completed.filter((r) => r.productCorrect).length;
  const gradeOrder = { A: 4, B: 3, C: 2, D: 1 };
  const avg =
    completed.length > 0
      ? completed.reduce((sum, r) => sum + (gradeOrder[r.grade] ?? 1), 0) / completed.length
      : 0;
  const overall = avg >= 3.5 ? "A" : avg >= 2.5 ? "B" : avg >= 1.6 ? "C" : "D";

  const martinSummary = (() => {
    const parts = [];
    if (correctProductCount === clients.length) {
      parts.push("三位客户的产品判断全对——方向、预算、能不能接受敲出，你都读准了。");
    } else {
      parts.push(`产品判断对了 ${correctProductCount}/${clients.length} 单。选错产品，再漂亮的报价也救不回来。`);
    }
    if (dealCount === clients.length) {
      parts.push(`三单全部成交，定价区间拿捏得不错。`);
    } else if (dealCount === 0) {
      parts.push(`一单都没成交——报价离公允价值太远，客户全走了。模型是用来守纪律的。`);
    } else {
      parts.push(`成交 ${dealCount}/${clients.length} 单。`);
    }
    parts.push("记住：先读客户、再选产品、最后以理论价为锚加合理利润。这就是这四天的全部。");
    return parts.join("");
  })();

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="结业成绩单" accent="三客户定价复盘" />
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-[#ffd700]/25 bg-[#ffd700]/[0.06] p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-[#ffd700]">成交</div>
            <div className="mt-2 text-3xl font-black text-slate-100">
              {dealCount} / {clients.length} 单
            </div>
          </div>
          <div className="rounded-lg border border-cyan-400/15 bg-black/30 p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-slate-500">产品判断</div>
            <div className="mt-2 text-3xl font-black text-slate-100">
              {correctProductCount} / {clients.length} 对
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <span className="font-terminal text-xs text-slate-500">总评分</span>
            <ScoreBadge score={overall} />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-cyan-400/15">
          <div className="grid grid-cols-[1.1fr_1fr_0.9fr_0.7fr_0.5fr] gap-2 border-b border-white/10 bg-black/40 px-4 py-3 font-terminal text-[11px] tracking-[0.12em] text-slate-500">
            <span>客户</span>
            <span>产品</span>
            <span>报价 / 理论价</span>
            <span>结果</span>
            <span>评分</span>
          </div>
          {results.map((r, i) => {
            const client = clients[i];
            if (!r) {
              return (
                <div
                  key={client.id}
                  className="grid grid-cols-[1.1fr_1fr_0.9fr_0.7fr_0.5fr] gap-2 border-b border-white/5 px-4 py-3 text-sm text-slate-600"
                >
                  <span>{client.profile.name}</span>
                  <span className="col-span-4">未接待</span>
                </div>
              );
            }
            return (
              <div
                key={client.id}
                className="grid grid-cols-[1.1fr_1fr_0.9fr_0.7fr_0.5fr] items-center gap-2 border-b border-white/5 px-4 py-3 text-sm"
              >
                <span className="font-bold text-slate-200">{client.profile.name}</span>
                <span className={cn(r.productCorrect ? "text-green-300" : "text-red-300")}>
                  {r.productCorrect ? "✓ " : "✗ "}
                  {r.productName}
                </span>
                <span className="text-slate-300">
                  {r.quote} / {r.theoretical}
                  <span className={cn("ml-1", r.margin >= 0 ? "text-slate-500" : "text-red-300")}>
                    ({r.margin >= 0 ? "+" : ""}
                    {r.margin})
                  </span>
                </span>
                <span className={cn(r.accepted ? "text-green-300" : "text-red-300")}>
                  {r.accepted ? "成交" : "未成交·0"}
                </span>
                <ScoreBadge score={r.grade} />
              </div>
            );
          })}
        </div>

        <div className="rounded-md border-l-4 border-[#ffd700] bg-[#ffd700]/[0.06] p-4 text-base leading-8 text-[#ffd700]">
          Martin 总评：{martinSummary}
        </div>
      </div>
    </TerminalCard>
  );
}

function Day4GraduationPanel() {
  const summary = [
    "Day1：看懂期权——Call 看涨、Put 看跌，买方最大损失限于权利金。",
    "Day2：二叉树定价——理论价是报价的锚，不能太低（白送）也不能太高（吓跑）。",
    "Day3：障碍期权——便宜来自路径风险（敲出），不是无条件折扣。",
    "Day4：实战报价——先读客户方向与预算，再选普通 / 障碍，最后以理论价为锚加合理利润。",
  ];
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="结业" accent="新人定价训练完成" />
      <div className="flex min-h-[520px] flex-col items-center justify-center p-6 text-center">
        <div className="bg-[linear-gradient(90deg,#00f0ff,#ffd700)] bg-clip-text text-5xl font-black tracking-[0.12em] text-transparent md:text-6xl">
          结业完成
        </div>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
          你走完了从期权基础到实战定价的全过程。一个新人交易员该有的定价纪律，你已经练过一遍。
        </p>
        <div className="mt-8 grid w-full max-w-2xl gap-3 text-left">
          {summary.map((item) => (
            <div
              key={item}
              className="rounded-md border border-cyan-400/15 bg-black/30 px-4 py-3 text-sm leading-7 text-slate-300"
            >
              <span className="font-terminal mr-2 text-[#00f0ff]">回顾</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </TerminalCard>
  );
}

function MainPanel({
  stage,
  selectedProduct,
  productMessage,
  selectedSuitability,
  suitabilityMessage,
  selectedDisclosures,
  disclosureFeedback,
  marketHasRun,
  visibleMarketSteps,
  day1Score,
  selectedQuote,
  quoteAnalysis,
  liveTheoretical,
  clientResponse,
  day2Score,
  day3Score,
  day4ClientIndex,
  day4Results,
  actions,
}) {
  const day4Client = day4Clients[day4ClientIndex] ?? day4Clients[0];
  const panels = {
    day1_welcome: <WelcomePanel />,
    day1_lesson_basics: <BasicsLessonPanel />,
    day1_intro: <IntroPanel />,
    day1_lesson_premium: <PremiumLessonPanel />,
    day1_lesson_vanilla_rule: <VanillaRulePanel />,
    day1_handbook_updated: <HandbookUpdatedPanel />,
    day1_client_arrival: <ClientArrivalPanel />,
    day1_product_selection: (
      <ProductSelectionPanel
        selectedProduct={selectedProduct}
        productMessage={productMessage}
        onSelectProduct={actions.selectProduct}
      />
    ),
    day1_risk_disclosure: (
      <RiskDisclosurePanel
        selectedDisclosures={selectedDisclosures}
        onToggleDisclosure={actions.toggleDisclosure}
        disclosureFeedback={disclosureFeedback}
      />
    ),
    day1_market_run: (
      <MarketRunPanel
        selectedProduct={selectedProduct}
        marketHasRun={marketHasRun}
        visibleMarketSteps={visibleMarketSteps}
      />
    ),
    day1_report: <ReportPanel score={day1Score} />,
    day1_complete: <CompletePanel />,
    day2_intro: <Day2IntroPanel />,
    day2_lesson_pricing_anchor: <Day2PricingAnchorPanel />,
    day2_lesson_tree_paths: <Day2TreePathsLessonPanel />,
    day2_lesson_backward_price: <Day2BackwardPriceLessonPanel />,
    day2_handbook_updated: <Day2HandbookUpdatedPanel />,
    day2_research_terminal: <Day2ResearchTerminalPanel />,
    day2_client_arrival: <Day2ClientArrivalPanel />,
    day2_product_review: <Day2ProductReviewPanel />,
    day2_tree_explainer: (
      <Day2TreeExplainerPanel
        selectedQuote={selectedQuote}
        quoteAnalysis={quoteAnalysis}
        onUpdateQuote={actions.updateQuote}
        onUpdateTheoretical={actions.updateTheoretical}
      />
    ),
    day2_quote_slider: (
      <Day2QuoteSliderPanel
        selectedQuote={selectedQuote}
        quoteAnalysis={quoteAnalysis}
        onUpdateQuote={actions.updateQuote}
        liveTheoretical={liveTheoretical}
      />
    ),
    day2_risk_disclosure: (
      <RiskDisclosurePanel
        selectedDisclosures={selectedDisclosures}
        onToggleDisclosure={actions.toggleDisclosure}
        disclosureFeedback={disclosureFeedback}
        items={day2Config.disclosureItems}
        instruction="在确认报价前，请选择你必须向客户说明的内容。"
      />
    ),
    day2_client_response: (
      <Day2ClientResponsePanel
        selectedQuote={selectedQuote}
        clientResponse={clientResponse}
        liveTheoretical={liveTheoretical}
      />
    ),
    day2_market_run: (
      <Day2MarketRunPanel
        selectedQuote={selectedQuote}
        liveTheoretical={liveTheoretical}
        marketHasRun={marketHasRun}
        visibleMarketSteps={visibleMarketSteps}
      />
    ),
    day2_report: <Day2ReportPanel score={day2Score} />,
    day2_complete: <Day2CompletePanel />,
    day3_intro: <Day3IntroPanel />,
    day3_lesson_barrier_concept: <Day3BarrierConceptPanel />,
    day3_lesson_knock_out: <Day3KnockOutPanel />,
    day3_handbook_updated: <Day3HandbookUpdatedPanel />,
    day3_client_arrival: <Day3ClientArrivalPanel />,
    day3_product_selection: (
      <ProductSelectionPanel
        selectedProduct={selectedProduct}
        productMessage={productMessage}
        onSelectProduct={actions.selectProduct}
        products={day3Config.products}
        correctProductId={day3Config.scoringRules.correctProduct}
        title="障碍产品选择台"
        accent="选择一个适合客户的结构"
      />
    ),
    day3_research_terminal: <Day3ResearchTerminalPanel />,
    day3_lesson_compare_vanilla: (
      <Day3CompareVanillaPanel
        selectedQuote={selectedQuote}
        quoteAnalysis={quoteAnalysis}
        onUpdateQuote={actions.updateQuote}
        onUpdateTheoretical={actions.updateTheoretical}
      />
    ),
    day3_risk_disclosure: (
      <RiskDisclosurePanel
        selectedDisclosures={selectedDisclosures}
        onToggleDisclosure={actions.toggleDisclosure}
        disclosureFeedback={disclosureFeedback}
        items={day3Config.disclosureItems}
        instruction="在确认障碍期权交易前，选择你必须向陈女士说明的内容。"
      />
    ),
    day3_client_response: (
      <Day3ClientResponsePanel
        selectedQuote={selectedQuote}
        clientResponse={clientResponse}
      />
    ),
    day3_market_run: (
      <Day3MarketRunPanel
        selectedProduct={selectedProduct}
        marketHasRun={marketHasRun}
        visibleMarketSteps={visibleMarketSteps}
      />
    ),
    day3_report: <Day3ReportPanel score={day3Score} />,
    day3_complete: <Day3CompletePanel />,
    day4_intro: <Day4BriefingPanel />,
    day4_client_arrival: (
      <Day4ClientProfilePanel
        client={day4Client}
        index={day4ClientIndex}
        total={day4Clients.length}
      />
    ),
    day4_judge: (
      <ProductSelectionPanel
        selectedProduct={selectedProduct}
        productMessage={productMessage}
        onSelectProduct={actions.selectProduct}
        products={day4Client.judgeProducts ?? []}
        correctProductId={day4Client.correctProduct}
        title="产品判断台"
        accent="客户没说要哪种——你来判断"
      />
    ),
    day4_pricing: (
      <Day4PricingPanel
        client={day4Client}
        selectedQuote={selectedQuote}
        onUpdateQuote={actions.updateQuote}
      />
    ),
    day4_client_response: (
      <Day4ClientResponsePanel
        client={day4Client}
        selectedQuote={selectedQuote}
        clientResponse={clientResponse}
      />
    ),
    day4_scorecard: <Day4ScorecardPanel results={day4Results} clients={day4Clients} />,
    day4_complete: <Day4GraduationPanel />,
  };

  return <div className="min-h-[580px]">{panels[stage] ?? null}</div>;
}

export default function Day1TraderSimulator() {
  const [currentDay, setCurrentDay] = useState(1);
  const [currentStage, setCurrentStage] = useState("title_screen");
  const [handbookOpen, setHandbookOpen] = useState(false);
  const [handbookHasNew, setHandbookHasNew] = useState(false);
  const [handbookUnlockedEntries, setHandbookUnlockedEntries] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDisclosures, setSelectedDisclosures] = useState([]);
  const [marketHasRun, setMarketHasRun] = useState(false);
  const [visibleMarketSteps, setVisibleMarketSteps] = useState(1);
  const [day1Score, setDay1Score] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(day2Config.quoteRules.defaultQuote);
  const [liveTheoretical, setLiveTheoretical] = useState(day2Config.quoteRules.theoreticalPrice);
  const [clientResponse, setClientResponse] = useState(null);
  const [day2Score, setDay2Score] = useState(null);
  const [day3Score, setDay3Score] = useState(null);
  const [day4Score, setDay4Score] = useState(null);
  // Day4 实战篇：通用 stage + index 驱动的客户队列
  const [day4ClientIndex, setDay4ClientIndex] = useState(0);
  const [day4Results, setDay4Results] = useState([]);
  const [selectedSuitability, setSelectedSuitability] = useState(null);
  const [suitabilityMessage, setSuitabilityMessage] = useState("");
  const [productMessage, setProductMessage] = useState("");
  const [skipSignal, setSkipSignal] = useState(0);
  const [stageHistory, setStageHistory] = useState([]);
  const stageTrackerRef = useRef({ current: "title_screen", skipNext: false });

  const isDay2Stage = currentStage.startsWith("day2");
  const isDay3Stage = currentStage.startsWith("day3");
  const isDay4Stage = currentStage.startsWith("day4");
  const activeDisclosureConfig = isDay4Stage
    ? day4Config
    : isDay3Stage
      ? day3Config
      : isDay2Stage
        ? day2Config
        : day1Config;
  const correctDisclosureIds = activeDisclosureConfig.scoringRules.correctDisclosureIds;
  const misleadingDisclosureId = activeDisclosureConfig.scoringRules.misleadingDisclosureId;
  const marketPathLength = isDay4Stage
    ? day4Config.market.path.length
    : isDay3Stage
      ? day3Config.market.path.length
      : isDay2Stage
        ? day2Config.market.path.length
        : (day1Config.market.chartPath ?? day1Config.market.path).length;
  const marketComplete = marketHasRun && visibleMarketSteps >= marketPathLength;
  const quoteAnalysis = useMemo(
    () =>
      isDay3Stage
        ? getQuoteAnalysis(
            selectedQuote,
            day2Config.quoteRules.theoreticalPrice,
            day3Config.clientProfile.name,
            day3Config.clientProfile.type,
          )
        : getQuoteAnalysis(selectedQuote, day2Config.quoteRules.theoreticalPrice),
    [selectedQuote, isDay3Stage],
  );
  const isFullWidthStage = fullWidthStages.has(currentStage);

  const unlockHandbookEntry = (entryId) => {
    setHandbookUnlockedEntries((entries) => {
      return entries.includes(entryId) ? entries : [...entries, entryId];
    });
    setHandbookHasNew(true);
  };

  const openHandbook = () => {
    setHandbookOpen(true);
    setHandbookHasNew(false);
  };

  const closeHandbook = () => {
    setHandbookOpen(false);
  };

  useEffect(() => {
    const previousStage = stageTrackerRef.current.current;
    if (previousStage === currentStage) return;

    if (stageTrackerRef.current.skipNext) {
      stageTrackerRef.current.skipNext = false;
      stageTrackerRef.current.current = currentStage;
      return;
    }

    setStageHistory((history) => {
      if (history[history.length - 1] === previousStage) return history;
      return [...history, previousStage].slice(-40);
    });
    stageTrackerRef.current.current = currentStage;
  }, [currentStage]);

  const goBack = () => {
    const previousStage = stageHistory[stageHistory.length - 1];
    if (!previousStage) return;

    stageTrackerRef.current.skipNext = true;
    setStageHistory((history) => history.slice(0, -1));
    setCurrentStage(previousStage);
    setHandbookOpen(false);
    setSkipSignal((value) => value + 1);
  };

  const selectProduct = (productId) => {
    const products =
      currentStage === "day4_judge"
        ? (day4Clients[day4ClientIndex]?.judgeProducts ?? [])
        : currentStage === "day3_product_selection"
          ? day3Config.products
          : day1Config.products;
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    if (product.locked) {
      setProductMessage(product.feedback);
      return;
    }

    setSelectedProduct(productId);
    setProductMessage(product.feedback);
  };

  const confirmProduct = () => {
    if (currentStage === "day2_product_review") {
      setSelectedProduct("vanilla_call");
      setCurrentStage("day2_research_terminal");
      return;
    }

    if (!selectedProduct) {
      setProductMessage("请先选择一个可用产品，再确认推荐。");
      return;
    }

    if (currentStage === "day3_product_selection") {
      setSelectedDisclosures([]);
      setCurrentStage("day3_risk_disclosure");
      return;
    }

    if (currentStage === "day4_judge") {
      // 客户③：选好产品后进入计算器报价（产品对错记在提交报价时一并评分）
      setCurrentStage("day4_pricing");
      return;
    }

    unlockHandbookEntry("risk_disclosure");
    setCurrentStage("day1_risk_disclosure");
  };

  // 已归档（CBBC）：原 Day4 适当性判断，新流程不再使用。
  const selectSuitability = (suitabilityId) => {
    const option = day4CbbcConfig_ARCHIVED.suitabilityOptions.find((item) => item.id === suitabilityId);
    if (!option) return;

    setSelectedSuitability(suitabilityId);
    setSuitabilityMessage(option.feedback);
  };

  // 已归档（CBBC）：原 Day4 适当性确认，新流程不再使用。
  const confirmSuitability = () => {
    if (!selectedSuitability) {
      setSuitabilityMessage("请先判断客户是否适合 CBBC。");
      return;
    }

    setSelectedProduct(null);
    setProductMessage("");
    setCurrentStage("day4_product_selection");
  };

  // ===== Day4 实战篇 · 客户队列调度（通用 stage + index 驱动）=====
  const beginDay4Clients = () => {
    setDay4ClientIndex(0);
    setDay4Results([]);
    setSelectedProduct(null);
    setProductMessage("");
    setSelectedQuote(day2Config.quoteRules.defaultQuote);
    setClientResponse(null);
    setCurrentStage("day4_client_arrival");
  };

  const toDay4Task = () => {
    const client = day4Clients[day4ClientIndex];
    if (client?.taskType === "judge") {
      setSelectedProduct(null);
      setProductMessage("");
      setCurrentStage("day4_judge");
    } else {
      setCurrentStage("day4_pricing");
    }
  };

  const submitDay4Quote = () => {
    const client = day4Clients[day4ClientIndex];
    if (!client) return;
    const analysis = getDay4QuoteAnalysis(selectedQuote, client);
    // 客户③要先选对产品；①②产品已点名（默认正确）。
    const chosenProductId =
      client.taskType === "judge" ? selectedProduct : client.correctProduct;
    const productName =
      client.taskType === "judge"
        ? (client.judgeProducts?.find((p) => p.id === chosenProductId)?.name ?? "未选择产品")
        : client.productLabel;
    const productCorrect = chosenProductId === client.correctProduct;
    // 选错产品：再漂亮的报价也救不回来——判 D 且不成交。
    const grade = productCorrect ? analysis.score : "D";
    const accepted = productCorrect ? analysis.accepted : false;
    const result = {
      clientId: client.id,
      name: client.profile.name,
      productName,
      productCorrect,
      quote: Number(selectedQuote),
      theoretical: analysis.theoretical,
      margin: analysis.margin,
      accepted,
      grade,
    };
    setDay4Results((prev) => {
      const next = [...prev];
      next[day4ClientIndex] = result;
      return next;
    });
    const response = productCorrect
      ? analysis
      : {
          ...analysis,
          accepted: false,
          customerLine: "这个产品不是我要的，我先不买了。",
          status: "产品不匹配，客户离开",
        };
    setClientResponse(response);
    setCurrentStage("day4_client_response");
  };

  const nextDay4Client = () => {
    const nextIndex = day4ClientIndex + 1;
    if (nextIndex >= day4Clients.length) {
      setCurrentStage("day4_scorecard");
      return;
    }
    setDay4ClientIndex(nextIndex);
    setSelectedProduct(null);
    setProductMessage("");
    setSelectedQuote(day2Config.quoteRules.defaultQuote);
    setClientResponse(null);
    setCurrentStage("day4_client_arrival");
  };

  const toggleDisclosure = (disclosureId) => {
    setSelectedDisclosures((items) =>
      items.includes(disclosureId)
        ? items.filter((item) => item !== disclosureId)
        : [...items, disclosureId],
    );
  };

  const getRiskDisclosureScore = (
    items = selectedDisclosures,
    config = activeDisclosureConfig,
  ) => {
    const correctIds = config.scoringRules.correctDisclosureIds;
    const misleadingId = config.scoringRules.misleadingDisclosureId;

    if (items.includes(misleadingId)) return "D";

    const selectedCorrectCount = correctIds.filter((id) => items.includes(id)).length;
    if (selectedCorrectCount === correctIds.length) return "A";
    if (selectedCorrectCount === correctIds.length - 1) return "C";
    return "D";
  };

  const confirmDisclosure = () => {
    if (currentStage === "day4_risk_disclosure") {
      setCurrentStage("day4_market_run");
      setMarketHasRun(true);
      setVisibleMarketSteps(1);
      return;
    }

    if (currentStage === "day3_risk_disclosure") {
      const response = getDay3QuoteAnalysis(selectedQuote);
      setClientResponse(response);
      setCurrentStage("day3_client_response");
      return;
    }

    if (currentStage === "day2_risk_disclosure") {
      const response = getQuoteAnalysis(selectedQuote, day2Config.quoteRules.theoreticalPrice);
      setClientResponse(response);
      setCurrentStage("day2_client_response");
      return;
    }

    setCurrentStage("day1_market_run");
    setMarketHasRun(true);
    setVisibleMarketSteps(1);
  };

  const runMarket = () => {
    setMarketHasRun(true);
    setVisibleMarketSteps(1);
  };

  const evaluateDay1 = () => {
    const product = day1Config.products.find((item) => item.id === selectedProduct);
    const productName = product?.name ?? "未选择产品";
    const riskDisclosure = getRiskDisclosureScore();
    const market = day1Config.market;
    const finalPrice = market.path[market.path.length - 1];
    const callPayoff = Math.max(finalPrice - market.strike, 0);
    const callPnl = callPayoff - market.premium;

    if (selectedProduct === "vanilla_call") {
      const overall = riskDisclosure === "A" ? "A" : riskDisclosure === "C" ? "B" : "C";
      return {
        productName,
        outcome: "Call 到期为价内期权。",
        payoff: `${callPayoff} 点`,
        premium: `${market.premium} 点`,
        clientPnl: `+${callPnl} 点`,
        suitability: "A",
        riskDisclosure,
        clientOutcome: "A",
        overall,
        martinComment:
          "你把客户的看涨观点和普通 Call 匹配起来了。客户最大亏损限制在期权费内，并且在市场上涨后获得了收益。",
      };
    }

    if (selectedProduct === "vanilla_put") {
      return {
        productName,
        outcome: "市场上涨，Put 到期没有价值。",
        payoff: "0 点",
        premium: `${market.premium} 点`,
        clientPnl: `-${market.premium} 点`,
        suitability: "D",
        riskDisclosure,
        clientOutcome: "D",
        overall: "D",
        martinComment:
          "客户是看涨观点，但你选择了看跌产品。永远先把产品方向和客户的市场观点匹配起来。",
      };
    }

    return {
      productName,
      outcome: "指数上涨，直接买入指数获得收益，但下行亏损没有被限制。",
      payoff: "+900 点等效收益",
      premium: "没有期权费",
      clientPnl: "+900 点等效收益",
      suitability: "C",
      riskDisclosure,
      clientOutcome: "B",
      overall: riskDisclosure === "D" ? "D" : "C",
      martinComment:
        "客户确实因为市场上涨获利，但这个产品没有满足她“下行亏损有限”的需求。结果好不代表推荐一定适合。",
    };
  };

  const updateQuote = (value) => {
    setSelectedQuote(value);
    setClientResponse(null);
  };

  const updateTheoretical = (value) => {
    setLiveTheoretical(value);
    setClientResponse(null);
  };

  const showPricingTree = () => {
    setSelectedProduct("vanilla_call");
    setCurrentStage("day2_tree_explainer");
  };

  const confirmQuote = () => {
    setSelectedDisclosures([]);
    if (currentStage === "day3_lesson_compare_vanilla") {
      setCurrentStage("day3_risk_disclosure");
      return;
    }
    setCurrentStage("day2_risk_disclosure");
  };

  const evaluateDay2 = () => {
    const analysis = getQuoteAnalysis(selectedQuote, day2Config.quoteRules.theoreticalPrice);
    const pricingResult = getDay2PricingScore(selectedQuote, day2Config.quoteRules.theoreticalPrice);
    const marketResult = getDay2MarketResult(selectedQuote, day2Config.quoteRules.theoreticalPrice);
    const riskDisclosure = getRiskDisclosureScore(selectedDisclosures, day2Config);
    let overall = "B";

    if (pricingResult.score === "D" || riskDisclosure === "D") {
      overall = "D";
    } else if (pricingResult.score === "A" && riskDisclosure === "A") {
      overall = "A";
    } else if (riskDisclosure === "A" && (pricingResult.score === "B-" || pricingResult.score === "C")) {
      overall = "B";
    } else if (pricingResult.score === "C" || riskDisclosure === "C") {
      overall = "C";
    }

    const disclosureWarning =
      riskDisclosure === "A"
        ? ""
        : " 定价只是第一步。客户还必须明白：模型价格不是盈利保证。";

    return {
      theoreticalPrice: liveTheoretical,
      selectedQuote,
      margin: selectedQuote - liveTheoretical,
      marketPath: marketResult.path,
      marketFinalPrice: marketResult.finalPrice,
      marketPayoff: marketResult.payoff,
      deskPnl: marketResult.deskPnl,
      clientPnl: marketResult.clientPnl,
      clientStatus: analysis.status,
      pricingScore: pricingResult.score,
      pricingComment: pricingResult.comment,
      riskDisclosure,
      overall,
      martinComment: `${analysis.martinComment}${disclosureWarning}`,
    };
  };

  const evaluateDay3 = () => {
    const product = day3Config.products.find((item) => item.id === selectedProduct);
    const productName = product?.name ?? "未选择产品";
    const riskDisclosure = getRiskDisclosureScore(selectedDisclosures, day3Config);
    const result = getDay3MarketResult();
    const analysis = getDay3QuoteAnalysis(selectedQuote);
    const traded = analysis.accepted;
    const isCorrectProduct = selectedProduct === day3Config.scoringRules.correctProduct;
    const suitability =
      selectedProduct === "down_out_call"
        ? "A"
        : selectedProduct === "vanilla_call"
          ? "B"
          : selectedProduct === "up_out_call"
            ? "C"
            : "D";
    const pathAwareness = riskDisclosure === "A" ? "A" : riskDisclosure === "C" ? "C" : "D";

    let overall = "B";
    if (suitability === "D" || riskDisclosure === "D") {
      overall = "D";
    } else if (suitability === "A" && riskDisclosure === "A") {
      overall = "A";
    } else if (suitability === "C" || riskDisclosure === "C") {
      overall = "C";
    }

    const productComment = isCorrectProduct
      ? "你选中了下跌敲出看涨期权，方向、预算和客户接受额外条件都匹配。"
      : selectedProduct === "vanilla_call"
        ? "普通 Call 风险更简单，但没有满足客户想降低期权费的预算需求。"
        : selectedProduct === "up_out_call"
          ? "上涨敲出会在市场上涨过强时失效，和客户想参与上涨的目标冲突。"
          : "这个产品没有把客户的看涨观点和期权费预算结合起来。";

    const disclosureComment =
      riskDisclosure === "A"
        ? "你也把路径依赖和敲出风险讲清楚了。"
        : "但风险披露还不够完整。障碍产品必须强调：最终价格有利也不代表一定有收益。";

    return {
      productName,
      selectedQuote,
      clientStatus: analysis.status,
      quoteAccepted: traded,
      finalPrice: result.finalPrice,
      knockedOut: result.knockedOut,
      vanillaPayoff: result.vanillaPayoff,
      barrierPayoff: result.barrierPayoff,
      pnl: traded ? result.pnl : 0,
      suitability,
      riskDisclosure,
      pathAwareness,
      overall,
      martinComment: `${productComment}${disclosureComment}`,
    };
  };

  // 已归档（CBBC）：原 Day4 熊证适当性评分，新流程改用 submitDay4Quote + Day4ScorecardPanel。
  const evaluateDay4Cbbc_ARCHIVED = () => {
    const product = day4CbbcConfig_ARCHIVED.products.find((item) => item.id === selectedProduct);
    const productName = product?.name ?? "未选择产品";
    const suitabilityOption = day4CbbcConfig_ARCHIVED.suitabilityOptions.find(
      (item) => item.id === selectedSuitability,
    );
    const result = getDay4CbbcMarketResult_ARCHIVED();
    const riskDisclosure = getRiskDisclosureScore(selectedDisclosures, day4CbbcConfig_ARCHIVED);
    const suitabilityScore =
      selectedSuitability === day4CbbcConfig_ARCHIVED.scoringRules.correctSuitability ? "A" : "C";
    const productScore =
      selectedProduct === "bear_cbbc"
        ? "A"
        : selectedProduct === "vanilla_put"
          ? "B"
          : selectedProduct === "vanilla_call"
            ? "D"
            : "D";

    let overall = "B";
    if (productScore === "D" || riskDisclosure === "D") {
      overall = "D";
    } else if (suitabilityScore === "A" && productScore === "A" && riskDisclosure === "A") {
      overall = "A";
    } else if (suitabilityScore === "C" || productScore === "C" || riskDisclosure === "C") {
      overall = "C";
    }

    const productComment =
      selectedProduct === "bear_cbbc"
        ? "你选中了熊证：方向匹配客户看跌观点，也符合她愿意承担高风险、希望获得杠杆的需求。"
        : selectedProduct === "bull_cbbc"
          ? "Bull CBBC 是看涨工具，方向和客户看跌观点相反。"
          : selectedProduct === "vanilla_put"
            ? "普通 Put 方向正确、风险更简单，但没有提供客户想要的 CBBC 杠杆特征。"
            : "普通 Call 是看涨工具，方向和客户看跌观点相反。";

    const disclosureComment =
      riskDisclosure === "A"
        ? "CBBC 风险说明也完整覆盖了收回价、MCE、残值和杠杆。"
        : "但 CBBC 风险说明还不完整。客户必须理解 MCE 后不会因为市场反弹而恢复。";

    return {
      suitabilityChoice: suitabilityOption?.title ?? "未判断",
      productName,
      finalPrice: result.finalPrice,
      mceTriggered: result.mceTriggered,
      bearCbbcPnl: result.bearCbbcPnl,
      vanillaPnl: result.vanillaPnl,
      suitabilityScore,
      productScore,
      riskDisclosure,
      overall,
      martinComment: `${productComment}${disclosureComment}`,
    };
  };

  const startDay1 = () => {
    setCurrentDay(1);
    setCurrentStage("day1_welcome");
    setHandbookOpen(false);
    setHandbookHasNew(false);
    setHandbookUnlockedEntries([]);
    setSelectedProduct(null);
    setSelectedDisclosures([]);
    setMarketHasRun(false);
    setVisibleMarketSteps(1);
    setDay1Score(null);
    setSelectedQuote(day2Config.quoteRules.defaultQuote);
    setClientResponse(null);
    setDay2Score(null);
    setDay3Score(null);
    setDay4Score(null);
    setSelectedSuitability(null);
    setSuitabilityMessage("");
    setProductMessage("");
    setSkipSignal((value) => value + 1);
  };

  const restartDay1 = () => {
    setCurrentDay(1);
    setCurrentStage("title_screen");
    setHandbookOpen(false);
    setHandbookHasNew(false);
    setHandbookUnlockedEntries([]);
    setSelectedProduct(null);
    setSelectedDisclosures([]);
    setMarketHasRun(false);
    setVisibleMarketSteps(1);
    setDay1Score(null);
    setSelectedQuote(day2Config.quoteRules.defaultQuote);
    setClientResponse(null);
    setDay2Score(null);
    setDay3Score(null);
    setDay4Score(null);
    setSelectedSuitability(null);
    setSuitabilityMessage("");
    setProductMessage("");
    setSkipSignal((value) => value + 1);
  };

  const startDay2 = () => {
    setCurrentDay(2);
    setCurrentStage("day2_intro");
    setHandbookOpen(false);
    setHandbookHasNew(false);
    setHandbookUnlockedEntries((entries) =>
      Array.from(new Set([...entries, ...day1HandbookEntryIds])),
    );
    setSelectedProduct(null);
    setSelectedDisclosures([]);
    setMarketHasRun(false);
    setVisibleMarketSteps(1);
    setProductMessage("");
    setSelectedQuote(day2Config.quoteRules.defaultQuote);
    setClientResponse(null);
    setDay2Score(null);
    setDay3Score(null);
    setDay4Score(null);
    setSelectedSuitability(null);
    setSuitabilityMessage("");
    setSkipSignal((value) => value + 1);
  };

  const restartDay2 = () => {
    setCurrentDay(2);
    setCurrentStage("day2_intro");
    setHandbookOpen(false);
    setHandbookHasNew(false);
    setHandbookUnlockedEntries(day1HandbookEntryIds);
    setSelectedProduct(null);
    setSelectedDisclosures([]);
    setMarketHasRun(false);
    setVisibleMarketSteps(1);
    setProductMessage("");
    setSelectedQuote(day2Config.quoteRules.defaultQuote);
    setClientResponse(null);
    setDay2Score(null);
    setDay3Score(null);
    setDay4Score(null);
    setSelectedSuitability(null);
    setSuitabilityMessage("");
    setSkipSignal((value) => value + 1);
  };

  const startDay3 = () => {
    setCurrentDay(3);
    setCurrentStage("day3_intro");
    setHandbookOpen(false);
    setHandbookHasNew(false);
    setHandbookUnlockedEntries((entries) =>
      Array.from(new Set([...entries, ...day1HandbookEntryIds, ...day2HandbookEntryIds])),
    );
    setSelectedProduct(null);
    setSelectedDisclosures([]);
    setMarketHasRun(false);
    setVisibleMarketSteps(1);
    setProductMessage("");
    setSelectedQuote(day2Config.quoteRules.defaultQuote);
    setClientResponse(null);
    setDay2Score(null);
    setDay3Score(null);
    setDay4Score(null);
    setSelectedSuitability(null);
    setSuitabilityMessage("");
    setSkipSignal((value) => value + 1);
  };

  const restartDay3 = () => {
    setCurrentDay(3);
    setCurrentStage("day3_intro");
    setHandbookOpen(false);
    setHandbookHasNew(false);
    setHandbookUnlockedEntries([...day1HandbookEntryIds, ...day2HandbookEntryIds]);
    setSelectedProduct(null);
    setSelectedDisclosures([]);
    setMarketHasRun(false);
    setVisibleMarketSteps(1);
    setProductMessage("");
    setSelectedQuote(day2Config.quoteRules.defaultQuote);
    setClientResponse(null);
    setDay2Score(null);
    setDay3Score(null);
    setDay4Score(null);
    setSelectedSuitability(null);
    setSuitabilityMessage("");
    setSkipSignal((value) => value + 1);
  };

  const startDay4 = () => {
    setCurrentDay(4);
    setCurrentStage("day4_intro");
    setHandbookOpen(false);
    setHandbookHasNew(false);
    setHandbookUnlockedEntries((entries) =>
      Array.from(new Set([
        ...entries,
        ...day1HandbookEntryIds,
        ...day2HandbookEntryIds,
        ...day3HandbookEntryIds,
      ])),
    );
    setSelectedProduct(null);
    setSelectedSuitability(null);
    setSuitabilityMessage("");
    setSelectedDisclosures([]);
    setMarketHasRun(false);
    setVisibleMarketSteps(1);
    setProductMessage("");
    setSelectedQuote(day2Config.quoteRules.defaultQuote);
    setClientResponse(null);
    setDay2Score(null);
    setDay3Score(null);
    setDay4Score(null);
    setDay4ClientIndex(0);
    setDay4Results([]);
    setSkipSignal((value) => value + 1);
  };

  const restartDay4 = () => {
    setCurrentDay(4);
    setCurrentStage("day4_intro");
    setHandbookOpen(false);
    setHandbookHasNew(false);
    setHandbookUnlockedEntries([
      ...day1HandbookEntryIds,
      ...day2HandbookEntryIds,
      ...day3HandbookEntryIds,
    ]);
    setSelectedProduct(null);
    setSelectedSuitability(null);
    setSuitabilityMessage("");
    setSelectedDisclosures([]);
    setMarketHasRun(false);
    setVisibleMarketSteps(1);
    setProductMessage("");
    setSelectedQuote(day2Config.quoteRules.defaultQuote);
    setClientResponse(null);
    setDay2Score(null);
    setDay3Score(null);
    setDay4Score(null);
    setDay4ClientIndex(0);
    setDay4Results([]);
    setSkipSignal((value) => value + 1);
  };

  const disclosureFeedback = useMemo(() => {
    if (selectedDisclosures.includes(misleadingDisclosureId)) {
      return {
        tone: "danger",
        text: isDay4Stage
          ? "这句话会误导客户。MCE 后熊证不会因为市场回落而自动恢复。"
          : isDay3Stage
            ? "这句话会误导客户。障碍期权不能只看最终到期价格。"
            : isDay2Stage
              ? "这句话会误导客户。模型价格不是盈利保证。"
              : "这句话会误导客户。市场上涨不代表扣除期权费后一定赚钱。",
      };
    }

    const missing = correctDisclosureIds.filter((id) => !selectedDisclosures.includes(id));
    if (selectedDisclosures.length === 0) {
      return {
        tone: "warn",
        text: isDay4Stage
          ? "再检查一下工作手册。客户必须理解收回价、MCE、残值不保证和杠杆风险。"
          : isDay3Stage
            ? "再检查一下工作手册。客户必须理解障碍线、敲出和路径风险。"
            : isDay2Stage
              ? "再检查一下工作手册。客户必须理解期权费风险和模型风险。"
              : "查看工作手册。客户必须理解期权费可能损失，以及产品不保证盈利。",
      };
    }

    if (missing.length > 0) {
      return {
        tone: "warn",
        text: isDay4Stage
          ? "再检查一下工作手册。客户必须理解收回价、MCE、残值不保证和杠杆风险。"
          : isDay3Stage
            ? "再检查一下工作手册。客户必须理解障碍线、敲出和路径风险。"
            : isDay2Stage
              ? "再检查一下工作手册。客户必须理解期权费风险和模型风险。"
              : "查看工作手册。客户必须理解期权费可能损失，以及产品不保证盈利。",
      };
    }

    return {
      tone: "good",
      text: isDay4Stage
        ? "很好。这几项覆盖了收回价、MCE、残值不保证和杠杆风险。"
        : isDay3Stage
          ? "很好。这几项覆盖了路径依赖、敲出、最终价格误区和便宜背后的风险。"
          : isDay2Stage
            ? "很好。这几项覆盖了期权费损失、无保证盈利、模型风险和到期收益规则。"
            : "很好。这几项覆盖了期权费损失、最大亏损限制，以及不保证盈利。",
    };
  }, [
    correctDisclosureIds,
    isDay2Stage,
    isDay3Stage,
    isDay4Stage,
    misleadingDisclosureId,
    selectedDisclosures,
  ]);

  const mentorText = useMemo(() => {
    if (currentStage === "day1_product_selection" && productMessage) return productMessage;
    if (currentStage === "day3_product_selection" && productMessage) return productMessage;
    if (currentStage === "day4_judge" && productMessage) return productMessage;
    if (currentStage === "day1_risk_disclosure") return disclosureFeedback.text;
    if (currentStage === "day2_quote_slider") {
      return `${stageConfig[currentStage].mentor} 当前报价状态：${quoteAnalysis.label}。`;
    }
    if (currentStage === "day2_risk_disclosure") return disclosureFeedback.text;
    if (currentStage === "day3_risk_disclosure") return disclosureFeedback.text;
    if (currentStage === "day4_client_response" && clientResponse) {
      return `客户反馈：${clientResponse.status}。先读对客户、选对产品，再以理论价为锚加合理利润。`;
    }
    if (currentStage === "day2_client_response" && clientResponse) {
      return `客户反馈：${clientResponse.status}。报价不是只看成交，还要看交易台是否得到合理补偿。`;
    }
    if (currentStage === "day3_client_response" && clientResponse) {
      return `客户反馈：${clientResponse.status}。障碍产品的报价纪律：要比普通 Call 便宜，但也要给交易台留下合理利润。`;
    }
    if (currentStage === "day2_market_run" && marketComplete) {
      return "市场收在行权价上方一点点。普通 Call 的到期收益 = 到期价 − 行权价；交易台这单赚不赚，看你收的报价能不能盖住这笔赔付。";
    }
    if (currentStage === "day1_market_run" && marketComplete) {
      return "最终价格高于行权价。普通 Call 的到期收益是最终价格减去行权价，再扣除期权费得到净盈亏。";
    }
    if (currentStage === "day3_market_run" && marketComplete) {
      return "这就是障碍期权的重点：最终价格高于行权价，但中途已经跌破障碍线，敲出后产品不能复活。";
    }
    if (currentStage === "day1_report" && day1Score) return day1Score.martinComment;
    if (currentStage === "day2_report" && day2Score) return day2Score.martinComment;
    if (currentStage === "day3_report" && day3Score) return day3Score.martinComment;
    return stageConfig[currentStage]?.mentor ?? "";
  }, [
    clientResponse,
    currentStage,
    day1Score,
    day2Score,
    day3Score,
    day4Score,
    disclosureFeedback.text,
    marketComplete,
    productMessage,
    quoteAnalysis.label,
    suitabilityMessage,
  ]);

  useEffect(() => {
    if (!["day1_market_run", "day2_market_run", "day3_market_run", "day4_market_run"].includes(currentStage) || !marketHasRun) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setVisibleMarketSteps((count) => {
        if (count >= marketPathLength) {
          window.clearInterval(intervalId);
          return count;
        }
        return count + 1;
      });
    }, 520);

    return () => window.clearInterval(intervalId);
  }, [currentStage, marketHasRun, marketPathLength]);

  const viewReport = () => {
    if (currentStage === "day2_market_run") {
      setDay2Score(evaluateDay2());
      setCurrentStage("day2_report");
      return;
    }

    if (currentStage === "day3_market_run") {
      setDay3Score(evaluateDay3());
      setCurrentStage("day3_report");
      return;
    }

    setDay1Score(evaluateDay1());
    setCurrentStage("day1_report");
  };

  const actions = {
    startGame: startDay4,
    startDay1,
    startDay2,
    startDay3,
    startDay4,
    startBriefing: () => setCurrentStage("day1_lesson_basics"),
    toCallPutLesson: () => setCurrentStage("day1_intro"),
    toPremiumLesson: () => setCurrentStage("day1_lesson_premium"),
    toVanillaRuleLesson: () => setCurrentStage("day1_lesson_vanilla_rule"),
    toDay2PricingAnchor: () => setCurrentStage("day2_lesson_pricing_anchor"),
    toDay2TreePaths: () => setCurrentStage("day2_lesson_tree_paths"),
    toDay2BackwardPrice: () => setCurrentStage("day2_lesson_backward_price"),
    toDay3BarrierConcept: () => setCurrentStage("day3_lesson_barrier_concept"),
    toDay3KnockOut: () => setCurrentStage("day3_lesson_knock_out"),
    toDay3ResearchTerminal: () => setCurrentStage("day3_research_terminal"),
    toDay3CompareVanilla: () => setCurrentStage("day3_lesson_compare_vanilla"),
    finishLesson: () => {
      unlockHandbookEntry("vanilla_core");
      setCurrentStage("day1_handbook_updated");
    },
    finishDay2Intro: () => {
      unlockHandbookEntry("binomial_pricing");
      setCurrentStage("day2_handbook_updated");
    },
    finishDay3Intro: () => {
      unlockHandbookEntry("barrier_options");
      setCurrentStage("day3_handbook_updated");
    },
    openHandbook,
    closeHandbook,
    meetClient: () => {
      unlockHandbookEntry("suitability_rule");
      setCurrentStage("day1_client_arrival");
    },
    meetDay2Client: () => setCurrentStage("day2_client_arrival"),
    toResearchTerminal: () => setCurrentStage("day2_research_terminal"),
    toDay2TreeExplainer: () => setCurrentStage("day2_tree_explainer"),
    meetDay3Client: () => setCurrentStage("day3_client_arrival"),
    toProductSelection: () => setCurrentStage("day1_product_selection"),
    toDay2ProductReview: () => setCurrentStage("day2_product_review"),
    toDay3ProductSelection: () => setCurrentStage("day3_product_selection"),
    // Day4 实战篇队列调度
    beginDay4Clients,
    toDay4Task,
    submitDay4Quote,
    nextDay4Client,
    toDay4Scorecard: () => setCurrentStage("day4_scorecard"),
    selectProduct,
    confirmProduct,
    showPricingTree,
    toDay2Quote: () => setCurrentStage("day2_quote_slider"),
    updateQuote,
    updateTheoretical,
    confirmQuote,
    toggleDisclosure,
    confirmDisclosure,
    runMarket,
    toDay2MarketRun: () => {
      setCurrentStage("day2_market_run");
      setMarketHasRun(true);
      setVisibleMarketSteps(1);
    },
    toDay3MarketRun: () => {
      setCurrentStage("day3_market_run");
      setMarketHasRun(true);
      setVisibleMarketSteps(1);
    },
    viewReport,
    finishDay: () => setCurrentStage("day1_complete"),
    finishDay2: () => setCurrentStage("day2_complete"),
    finishDay3: () => setCurrentStage("day3_complete"),
    finishDay4: () => setCurrentStage("day4_complete"),
    restartDay1,
    restartDay2,
    restartDay3,
    restartDay4,
  };

  const skipCurrentTypewriter = (event) => {
    if (event.target.closest("button, a, input, textarea, select, label")) return;
    setSkipSignal((value) => value + 1);
  };

  if (currentStage === "title_screen") {
    return (
      <main
        className="font-cn relative min-h-screen overflow-hidden bg-[#0a0a1a] text-[#e0e0e0]"
        onClick={skipCurrentTypewriter}
      >
        <StyleBlock />
        <GlobalAtmosphere />
        <StartScreen onStart={actions.startGame} skipSignal={skipSignal} />
      </main>
    );
  }

  return (
    <main
      className="font-cn relative min-h-screen overflow-x-hidden bg-[#0a0a1a] text-[#e0e0e0]"
      onClick={skipCurrentTypewriter}
    >
      <StyleBlock />
      <GlobalAtmosphere />
      <SideData currentDay={currentDay} />

      <div className="relative z-10 flex min-h-screen flex-col px-4">
        <TopBar
          currentDay={currentDay}
          stage={currentStage}
          handbookHasNew={handbookHasNew}
          canGoBack={stageHistory.length > 0}
          onGoBack={goBack}
          onOpenHandbook={openHandbook}
        />

        <div
          className={cn(
            "mx-auto grid w-full flex-1 gap-5 py-5",
            isFullWidthStage
              ? "max-w-[1380px]"
              : "max-w-[1180px] lg:grid-cols-[minmax(0,1fr)_330px]",
          )}
        >
          <MainPanel
            stage={currentStage}
            selectedProduct={selectedProduct}
            productMessage={productMessage}
            selectedSuitability={selectedSuitability}
            suitabilityMessage={suitabilityMessage}
            selectedDisclosures={selectedDisclosures}
            disclosureFeedback={disclosureFeedback}
            marketHasRun={marketHasRun}
            visibleMarketSteps={visibleMarketSteps}
            day1Score={day1Score}
            selectedQuote={selectedQuote}
            quoteAnalysis={quoteAnalysis}
            liveTheoretical={liveTheoretical}
            clientResponse={clientResponse}
            day2Score={day2Score}
            day3Score={day3Score}
            day4ClientIndex={day4ClientIndex}
            day4Results={day4Results}
            actions={actions}
          />
          {!isFullWidthStage && <MentorPanel text={mentorText} skipSignal={skipSignal} />}
        </div>

        <BottomActionBar
          stage={currentStage}
          selectedProduct={selectedProduct}
          selectedSuitability={selectedSuitability}
          marketComplete={marketComplete}
          selectedQuote={selectedQuote}
          day4ClientIndex={day4ClientIndex}
          actions={actions}
        />
      </div>

      <HandbookOverlay
        open={handbookOpen}
        unlockedEntries={handbookUnlockedEntries}
        onClose={closeHandbook}
      />
    </main>
  );
}
