import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

const day1Config = {
  day: 1,
  title: "Vanilla Option Basics",
  stages: {
    title_screen: {
      label: "Start Screen",
      system: "Title Screen",
      mentor: "",
    },
    day1_welcome: {
      label: "08:55 First Day on the Job",
      system: "New Hire Check-in",
      mentor:
        "Good morning, and welcome to the Central options desk. Today is your first day. Don't be nervous, I'll walk you through reading client needs step by step.",
    },
    day1_lesson_basics: {
      label: "09:00 Lesson 1: The Right to Choose",
      system: "Option Intuition",
      mentor:
        "Forget the formulas for now. The first thing an option means is the “right to choose”: the buyer pays a sum upfront in exchange for the right to decide later whether or not to trade.",
    },
    day1_intro: {
      label: "09:05 Call and Put",
      system: "Direction Lesson",
      mentor:
        "For now, two direction words are enough: Call is bullish, Put is bearish. When a client says “I think it'll go up,” the word Call should light up in your head.",
    },
    day1_lesson_premium: {
      label: "09:08 Premium",
      system: "Cost and Maximum Loss",
      mentor:
        "Buying an option isn't a free wish. The client pays a premium first. The upside is that if they're wrong, a vanilla option buyer usually loses at most that premium.",
    },
    day1_lesson_vanilla_rule: {
      label: "09:10 Vanilla Option Rules",
      system: "Expiry Price",
      mentor:
        "A vanilla option is like a ticket that settles at expiry. No matter how the price swings along the way, it never knocks out. What matters is which side of the strike the price lands on at the final expiry moment.",
    },
    day1_handbook_updated: {
      label: "09:12 Handbook Updated",
      system: "Handbook Sync",
      mentor:
        "Before you meet the client, open the handbook and take a look. It's not a book of all the answers; it's the rulebook available to you at your current stage.",
    },
    day1_client_arrival: {
      label: "09:15 First Client",
      system: "Reading Client Needs",
      mentor:
        "First read the client's direction: she's bullish. Then read her risk needs: she wants limited downside loss. Open the handbook if you need to; a vanilla call may fit this need.",
    },
    day1_product_selection: {
      label: "09:20 Product Selection",
      system: "Product Suitability",
      mentor:
        "The product has to match both the direction and the risk needs. Bullish with a desire for limited maximum loss usually points first to a vanilla call option.",
    },
    day1_risk_disclosure: {
      label: "09:25 Risk Disclosure",
      system: "Risk Disclosure",
      mentor:
        "The client must understand: the premium can be lost entirely, and being right on direction doesn't guarantee a profit. Never pitch the product as a sure win.",
    },
    day1_market_run: {
      label: "09:30 Market Run",
      system: "Market Path Simulation",
      mentor:
        "Run the fixed market path. On day one we only look at the expiry outcome of a vanilla option, with no live market feed and no complex pricing.",
    },
    day1_report: {
      label: "09:45 End-of-Day Report",
      system: "Trade Review",
      mentor:
        "A good trader doesn't just look at whether the client made money; they also explain whether the product suited the client. The outcome is only half the score.",
    },
    day1_complete: {
      label: "10:00 Day One Complete",
      system: "Stage Complete",
      mentor:
        "Nicely done. The focus of day one was direction matching, premium risk, and suitability discipline.",
    },
  },
  introCards: [
    {
      id: "call_intro",
      code: "CALL / Bullish",
      title: "Vanilla Call Option",
      tone: "gold",
      bullets: [
        "Suited to scenarios where the client expects the underlying price to rise",
        "The buyer pays a premium for the right to buy at the strike in the future",
        "A call only gains intrinsic value when the expiry price is above the strike",
        "The buyer's maximum loss is usually limited to the premium paid",
      ],
    },
    {
      id: "put_intro",
      code: "PUT / Bearish",
      title: "Vanilla Put Option",
      tone: "cyan",
      bullets: [
        "Suited to scenarios where the client expects the underlying price to fall",
        "The buyer pays a premium for the right to sell at the strike in the future",
        "A put only gains intrinsic value when the expiry price is below the strike",
        "A vanilla put is more like downside protection, not a guaranteed-return promise",
      ],
    },
  ],
  handbookEntries: [
    {
      id: "vanilla_core",
      title: "Vanilla Option Basics",
      sections: [
        {
          title: "Vanilla Call",
          bullets: [
            "Suited to a bullish view",
            "The buyer pays a premium",
            "At expiry, the call has value if the final price is above the strike",
            "The buyer's maximum loss is usually the premium",
          ],
        },
        {
          title: "Vanilla Put",
          bullets: [
            "Suited to a bearish view",
            "The buyer pays a premium",
            "At expiry, the put has value if the final price is below the strike",
            "The buyer's maximum loss is usually the premium",
          ],
        },
        {
          title: "Premium",
          bullets: [
            "The cost the buyer pays to obtain the right",
            "Even if they're wrong, the buyer's maximum loss is usually this premium",
          ],
        },
        {
          title: "Vanilla Option Rules",
          bullets: [
            "A vanilla option mainly depends on the final expiry price",
            "A vanilla option does not knock out due to price moves along the way",
            "We won't discuss pricing models today; just judge whether direction and risk match",
          ],
        },
      ],
    },
    {
      id: "suitability_rule",
      title: "Suitability Rules",
      sections: [
        {
          title: "Direction Matching",
          bullets: [
            "If the client is bullish, usually consider a call",
            "If the client is bearish, usually consider a put",
            "The product's direction must match the client's view first",
          ],
        },
        {
          title: "Risk Needs",
          bullets: [
            "If the client wants to cap their maximum loss, a vanilla option suits better than buying the asset outright",
            "Don't recommend a high-risk product just because the client wants to make money",
            "A good outcome doesn't necessarily mean the recommendation was suitable",
          ],
        },
      ],
    },
    {
      id: "risk_disclosure",
      title: "Risk Disclosure",
      sections: [
        {
          title: "Must Be Made Clear",
          bullets: [
            "An option is not a capital-protected, guaranteed-return product",
            "If the market direction is judged wrong, the premium may be lost entirely",
            "Even if the direction is right, the gain may be too small to cover the premium",
            "Don't tell the client “you're sure to make money as long as the market goes up”",
          ],
        },
      ],
    },
  ],
  clientProfile: {
    name: "Ms. Li",
    type: "Retail Investor",
    marketView: "Bullish on the Hang Seng Index",
    riskTolerance: "Moderate",
    goal: "Wants upside gains, but doesn't want to take large downside risk",
    budget: "Can pay a limited premium",
    experience: "Beginner",
    dialogue: [
      "I think the Hang Seng Index might rise next month.",
      "But I don't want to buy the index directly, because I'm worried about losing a lot if it drops.",
      "Is there a product that lets me participate in the upside while capping my maximum loss?",
    ],
  },
  products: [
    {
      id: "vanilla_call",
      name: "Vanilla Call Option",
      term: "Vanilla Call",
      status: "Available",
      description: [
        "Suited to a bullish view",
        "The buyer pays a premium upfront",
        "The buyer's maximum loss is usually limited to the premium",
        "No knock-out risk",
      ],
      feedback:
        "Good. The client is bullish and wants limited downside loss, so a vanilla call option fits this need.",
    },
    {
      id: "vanilla_put",
      name: "Vanilla Put Option",
      term: "Vanilla Put",
      status: "Available",
      description: [
        "Suited to a bearish view",
        "The buyer pays a premium upfront",
        "The buyer's maximum loss is usually limited to the premium",
        "No knock-out risk",
      ],
      feedback: "This product suits a bearish view, but the client is currently bullish on the Hang Seng Index.",
    },
    {
      id: "direct_index",
      name: "Buy the Index Directly",
      term: "Direct Index Purchase",
      status: "Available",
      description: [
        "Full participation in the upside",
        "Also full exposure to the downside",
        "Loss is not limited to a premium",
      ],
      feedback:
        "Buying the index directly does give upside exposure, but the downside loss is not limited to a premium.",
    },
    {
      id: "barrier_option",
      name: "Barrier Option",
      term: "Barrier Option",
      status: "Locked",
      locked: true,
      description: [
        "May be cheaper, but carries knock-out risk",
        "Not covered in today's training yet",
      ],
      feedback: "Not unlocked on day one. Martin hasn't taught this product yet.",
    },
  ],
  disclosureItems: [
    {
      id: "premium_fully_lost",
      text: "If the option has no value at expiry, the premium the client paid may be lost entirely.",
      correct: true,
    },
    {
      id: "max_loss_premium",
      text: "A vanilla option buyer's maximum loss is usually limited to the premium paid.",
      correct: true,
    },
    {
      id: "profit_not_guaranteed",
      text: "A call option provides upside exposure, but does not guarantee a profit.",
      correct: true,
    },
    {
      id: "guaranteed_profit",
      text: "As long as the market rises even slightly, the client is sure to make money.",
      correct: false,
    },
  ],
  market: {
    underlying: "Hang Seng Index",
    spot: 21500,
    strike: 22000,
    premium: 186,
    maturity: "1 month",
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
  title: "Pricing Desk",
  stages: {
    day2_intro: {
      label: "09:00 Morning Meeting",
      system: "Pricing Morning Meeting",
      mentor:
        "Yesterday you learned what a vanilla option is. Today we switch to a question that's closer to a real trading desk: what should this option actually be quoted at?",
    },
    day2_lesson_pricing_anchor: {
      label: "09:03 Lesson 1: The Quote Anchor",
      system: "Why We Price",
      mentor:
        "Remember one thing: a quote can't come from a gut feeling. The theoretical price is like the desk's anchor; it tells you roughly what the product is worth first.",
    },
    day2_lesson_tree_paths: {
      label: "09:06 Lesson 2: Binomial Tree Paths",
      system: "Up and Down Branches",
      mentor:
        "A binomial tree isn't predicting the market; it's breaking the future into a few possibilities. At each step it asks just two questions: what if it goes up? what if it goes down?",
    },
    day2_lesson_backward_price: {
      label: "09:09 Lesson 3: Working Backward from the Future",
      system: "Payoff and Theoretical Price",
      mentor:
        "The expiry payoff is computed at the final layer first, then worked backward to today. Today we use a simplified version, so just grasp the intuition; there are no complex formulas to memorize.",
    },
    day2_handbook_updated: {
      label: "09:12 Handbook Updated",
      system: "Binomial Tree Rules Sync",
      mentor:
        "Before you meet the client, open the handbook and take a look. Today's key rule is simple: the quote should be close to the theoretical price, not too low and not too high.",
    },
    day2_research_terminal: {
      label: "09:18 Central Data Desk",
      system: "Pricing Parameter Lookup",
      mentor:
        "The product structure is confirmed. Before you quote, head to the data desk and gather today's key parameters. Spot, volatility, rate, maturity: these numbers don't come out of thin air; each one has a source. Note them down, you'll plug them into the calculator shortly.",
    },
    day2_client_arrival: {
      label: "09:14 Client Arrives",
      system: "Institutional Client Needs",
      mentor:
        "He's already said clearly that he wants a vanilla call option. Today's focus isn't picking the product; it's quoting a reasonable premium.",
    },
    day2_product_review: {
      label: "09:16 Product Confirmation",
      system: "Confirm the Trade Structure",
      mentor:
        "First confirm the structure: bullish on the Hang Seng Index, 1 month, vanilla call. Once the structure is right, then it's time for pricing.",
    },
    day2_tree_explainer: {
      label: "09:22 Pricing Tree",
      system: "Intro to Binomial Tree Pricing",
      mentor:
        "Note that not every upward path makes the client money. A call option only has expiry value when the final price is above the strike.",
    },
    day2_quote_slider: {
      label: "09:32 Quote to Client",
      system: "Quote Slider",
      mentor:
        "Don't quote too low just to close the trade, and don't quote too high either. A good trader balances fair value, client acceptance, and desk profit.",
    },
    day2_risk_disclosure: {
      label: "09:38 Risk Disclosure",
      system: "Model and Option Risk",
      mentor:
        "A pricing model is not a profit guarantee. The client must understand the premium risk, the expiry-payoff rules, and that the model only estimates today's value.",
    },
    day2_client_response: {
      label: "09:43 Client Feedback",
      system: "Quote Result",
      mentor:
        "A professional client will scrutinize the quote. A price too far from theoretical value, whether too low or too high, leaves a problem behind.",
    },
    day2_market_run: {
      label: "09:46 Market Settlement",
      system: "Expiry Path Simulation",
      mentor:
        "Now watch how the market moves. The price jumps step by step, so keep your eye on the expiry price. A vanilla call settles purely on which side of the strike the final cell lands.",
    },
    day2_report: {
      label: "09:50 End-of-Day Report",
      system: "Pricing Review",
      mentor:
        "Pricing isn't memorizing answers; it's anchoring on the theoretical price first, then judging desk profit and client acceptance.",
    },
    day2_complete: {
      label: "10:00 Day Two Complete",
      system: "Stage Complete",
      mentor:
        "Today you completed your first model-anchored quote. Remember: the theoretical price is discipline, not a promise.",
    },
  },
  handbookEntries: [
    {
      id: "binomial_pricing",
      title: "Binomial Tree Pricing",
      sections: [
        {
          title: "Core Idea",
          bullets: [
            "A binomial tree models how the underlying price might rise or fall in the future",
            "At each step, the price can move up or move down",
            "At expiry, compute the option's payoff from the final price",
            "Then work backward from the final layer to get today's theoretical price",
          ],
        },
        {
          title: "Vanilla Call Option",
          bullets: [
            "Payoff = max(final price - strike, 0)",
            "If the final price is above the strike, the call has value",
            "If the final price is below the strike, the call's expiry value is 0",
          ],
        },
        {
          title: "Quoting Rules",
          bullets: [
            "The theoretical price is the reference value computed by the model",
            "A trader's quote to the client should usually be close to the theoretical price",
            "Quote too low: desk profit is too thin, and you may even take on unfavorable risk",
            "Quote too high: the client may reject the trade",
            "Reasonable quote = theoretical price + an appropriate profit margin",
          ],
        },
        {
          title: "Important Reminder",
          bullets: [
            "A pricing model does not guarantee how the market will move",
            "It only estimates the product's value today using different possible paths",
            "Day two covers vanilla option pricing only",
            "New product rules will be learned in later stages",
          ],
        },
      ],
    },
  ],
  clientProfile: {
    name: "Mr. Wang",
    type: "Institutional Client",
    marketView: "Bullish on the Hang Seng Index",
    riskTolerance: "Moderate",
    goal: "Capture upside over the next 1 month",
    productNeed: "Vanilla call option",
    budget: "Can accept a reasonable quote, but doesn't want to be overcharged",
    experience: "Professional client",
    dialogue: [
      "I want to buy a 1-month Hang Seng Index call option.",
      "I'm bullish on the market, but I care a lot about the quote.",
      "Give me a quote you consider fair, and I'll compare it against other desks.",
    ],
  },
  productSummary: {
    product: "Vanilla Call",
    underlying: "Hang Seng Index (HSI)",
    spot: 21500,
    strike: 22000,
    maturity: "1 month",
    clientView: "Bullish",
    matchReason: "A call option is suited to expressing a bullish view.",
  },
  tree: {
    underlying: "Hang Seng Index (HSI)",
    spot: 21500,
    strike: 22000,
    upMove: "+2.65%",
    downMove: "-2.58%",
    steps: 3,
    riskFreeRate: "2% (teaching default)",
    theoreticalPrice: 186,
    nodes: [
      { id: "s0", step: "Step 0", label: "Today", price: 21500, x: 8, y: 50 },
      { id: "u", step: "Step 1", label: "Up", price: 22069, x: 29, y: 35 },
      { id: "d", step: "Step 1", label: "Down", price: 20946, x: 29, y: 65 },
      {
        id: "uu",
        step: "Step 2",
        label: "Up-Up",
        price: 22653,
        x: 51,
        y: 22,
      },
      {
        id: "mid",
        step: "Step 2",
        label: "One Up, One Down",
        price: 21500,
        x: 51,
        y: 50,
      },
      {
        id: "dd",
        step: "Step 2",
        label: "Down-Down",
        price: 20405,
        x: 51,
        y: 78,
      },
      {
        id: "uuu",
        step: "Step 3",
        label: "Three Ups",
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
        step: "Step 3",
        label: "Two Ups, One Down",
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
        step: "Step 3",
        label: "One Up, Two Downs",
        price: 20946,
        payoff: 0,
        formula: "max(20,946 - 22,000, 0) = 0",
        terminal: true,
        x: 84,
        y: 64,
      },
      {
        id: "ddd",
        step: "Step 3",
        label: "Three Downs",
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
    underlying: "Hang Seng Index (HSI)",
    path: [21500, 21680, 21940, 22140],
    strike: 22000,
  },
  disclosureItems: [
    {
      id: "day2_premium_loss",
      text: "If the option has no value at expiry, the premium the client paid may be lost entirely.",
      correct: true,
    },
    {
      id: "day2_not_guaranteed",
      text: "A call option can provide upside gains, but does not guarantee a profit.",
      correct: true,
    },
    {
      id: "day2_model_paths",
      text: "The quote is based on a pricing model and possible future paths; it does not mean the market will move that way.",
      correct: true,
    },
    {
      id: "day2_below_strike_zero",
      text: "If the final price is below the strike, the call option's expiry payoff is 0.",
      correct: true,
    },
    {
      id: "day2_model_guarantee",
      text: "As long as the model gives a theoretical price, the client is sure to make money.",
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
  title: "Barrier Options",
  stages: {
    day3_intro: {
      label: "09:00 Morning Meeting",
      system: "Path-Risk Morning Meeting",
      mentor:
        "Over the past two days you've learned vanilla options and model-based quoting. Today we add a rule that genuinely changes the outcome: the barrier. The price isn't judged only at the final moment; if it hits a certain line along the way, the product can end outright.",
    },
    day3_lesson_barrier_concept: {
      label: "09:04 Lesson 1: The Barrier Level",
      system: "Barrier Intuition",
      mentor:
        "Think of the barrier as a red line in the trade contract. A vanilla option only looks at the expiry price; a barrier option also looks at the path, that is, whether it touched that red line along the way.",
    },
    day3_lesson_knock_out: {
      label: "09:08 Lesson 2: Knock-Out",
      system: "Knock-Out Rule",
      mentor:
        "Knock-out means: the moment the underlying price touches the barrier level, the option expires early. Even if the market later climbs back, a knocked-out product cannot come back to life.",
    },
    day3_handbook_updated: {
      label: "09:12 Handbook Updated",
      system: "Barrier Rules Sync",
      mentor:
        "The handbook now has a barrier-option page. Be sure to read it before meeting the client today: the easiest mistake with a barrier product is pitching it as if it were a vanilla option.",
    },
    day3_client_arrival: {
      label: "09:14 Client Arrives",
      system: "Budget-Sensitive Client",
      mentor:
        "She's bullish, but finds a vanilla call too expensive. First make sure of one thing: whether she can accept the rule that “if it drops below a certain line along the way, it expires early.”",
    },
    day3_product_selection: {
      label: "09:18 Product Selection",
      system: "Barrier Structure Matching",
      mentor:
        "The client is bullish, on a limited budget, and willing to accept downside barrier risk. Today's target product is a down-and-out call option, i.e. a Down-and-Out Call.",
    },
    day3_research_terminal: {
      label: "09:22 Barrier Data Desk",
      system: "Barrier Parameter Lookup",
      mentor:
        "Before pricing a barrier product, head to the data desk and gather the parameters. Today there's one extra key number compared with yesterday: the barrier level. You already know spot, volatility, rate, and maturity; focus on that barrier contract card and note the barrier level down.",
    },
    day3_lesson_compare_vanilla: {
      label: "09:26 Pricing Tree",
      system: "Barrier Pricing",
      mentor:
        "Now use the calculator to compare the theoretical price of the vanilla and the barrier. A barrier option is usually cheaper because the buyer accepts extra risk. Cheap isn't a coupon; it's a lower premium bought with knock-out risk.",
    },
    day3_risk_disclosure: {
      label: "09:38 Risk Disclosure",
      system: "Path-Risk Disclosure",
      mentor:
        "A barrier product must spell out the path risk: it's not only about the final price. Once the barrier level is touched, the client may get no payoff even if the final price looks great.",
    },
    day3_client_response: {
      label: "09:42 Client Feedback",
      system: "Barrier Quote Result",
      mentor:
        "A barrier product's selling point is that it's cheaper than a vanilla call. Quote too low and the desk earns less; quote too high and the client would rather just buy a vanilla call. See how Ms. Chen responds.",
    },
    day3_market_run: {
      label: "09:46 Market Path",
      system: "Knock-Out Path Simulation",
      mentor:
        "Now watch a fixed market path. Keep your eye on the barrier level, not only the final price. The path below is a teaching demo; alongside it I've put a real-world reference: during the 2020 COVID crash, the HSI really did fall to around 21,000, and the barrier could be breached at any moment.",
    },
    day3_report: {
      label: "09:52 End-of-Day Report",
      system: "Barrier Option Review",
      mentor:
        "The scoring focus for a barrier product is: whether the product suited the client, whether the knock-out risk was fully disclosed, and whether the client truly understood the path dependence.",
    },
    day3_complete: {
      label: "10:00 Day Three Complete",
      system: "Stage Complete",
      mentor:
        "Today you had your first lesson in path dependence. A vanilla option looks at the destination; a barrier option also looks at the journey.",
    },
  },
  handbookEntries: [
    {
      id: "barrier_options",
      title: "Barrier Options",
      sections: [
        {
          title: "Core Idea",
          bullets: [
            "A barrier option adds an extra barrier level",
            "The product's outcome depends not only on the final expiry price, but also on whether the barrier is touched along the way",
            "Touching the barrier can make the option activate early (knock-in) or expire early (knock-out)",
          ],
        },
        {
          title: "Knock-Out",
          bullets: [
            "Knock-out means the option expires early once the barrier is touched",
            "Once it's expired, the product won't automatically revive even if the final price returns to a favorable level",
            "A down-and-out call option (Down-and-Out Call) suits clients who are bullish but willing to take downside barrier risk",
          ],
        },
        {
          title: "Why It's Cheaper",
          bullets: [
            "A barrier option is usually cheaper than a comparable vanilla option",
            "The discount comes from the extra knock-out risk, not an unconditional reduction",
            "The client must understand: a lower premium is bought with more complex path risk",
          ],
        },
        {
          title: "Risk Disclosure",
          bullets: [
            "Must explain the barrier level and how it is observed",
            "Must explain that the product may expire early once the barrier is touched",
            "Must explain that even a favorable final price may yield no payoff if it had previously knocked out",
            "Don't pitch a barrier option as a cheaper version of a vanilla option",
            "This simulation demonstrates the path with discrete observation points; real barrier products are mostly monitored continuously, so knock-outs happen more easily",
          ],
        },
      ],
    },
  ],
  clientProfile: {
    name: "Ms. Chen",
    type: "Budget-Sensitive Retail Investor",
    marketView: "Bullish on the Hang Seng Index",
    riskTolerance: "Moderate-High",
    goal: "Wants to participate in future upside at a lower premium",
    productNeed: "Willing to accept extra conditions, but doesn't want losses to run out of control",
    budget: "Finds a vanilla call too expensive, wants a lower premium",
    experience: "Has bought vanilla options, but new to barrier structures",
    dialogue: [
      "I'm still bullish on the Hang Seng Index, but that vanilla call from yesterday is a bit pricey for me.",
      "If it could be cheaper, I'm willing to accept some extra conditions.",
      "Can you find me an option that fits my budget better than a vanilla call?",
    ],
  },
  products: [
    {
      id: "down_out_call",
      name: "Down-and-Out Call Option",
      term: "Down-and-Out Call",
      status: "Available",
      description: [
        "Suited to a bullish view",
        "Premium is lower than a comparable vanilla call",
        "If it touches the lower barrier level along the way, the product expires early",
        "The buyer's maximum loss is usually limited to the premium",
      ],
      feedback:
        "Both direction and budget match. The key is that you must clearly explain the lower barrier and the fact that it can't revive once knocked out.",
    },
    {
      id: "vanilla_call",
      name: "Vanilla Call Option",
      term: "Vanilla Call",
      status: "Available",
      description: [
        "Suited to a bullish view",
        "No knock-out risk",
        "Higher premium",
        "Mainly depends on the final expiry price",
      ],
      feedback:
        "A vanilla call has the right direction and simpler risk, but doesn't address the client's need to be “cheaper and willing to accept extra conditions.”",
    },
    {
      id: "up_out_call",
      name: "Up-and-Out Call Option",
      term: "Up-and-Out Call",
      status: "Available",
      description: [
        "May knock out if the price rises too far",
        "Conflicts with the client's goal of participating in the upside",
        "Requires a very clear explanation of the payoff cap and knock-out",
      ],
      feedback:
        "The client wants to participate in the upside. An up-and-out call expires when the market rises too strongly, which doesn't fit this client's instinct.",
    },
    {
      id: "direct_index",
      name: "Buy the Index Directly",
      term: "Direct Index Purchase",
      status: "Available",
      description: [
        "Full participation in the upside",
        "No premium",
        "Downside risk is not limited to a premium",
      ],
      feedback:
        "This isn't an option structure, and it doesn't meet the client's need to express a view with a limited premium.",
    },
  ],
  disclosureItems: [
    {
      id: "day3_path_dependent",
      text: "A barrier option depends not only on the final price, but also on whether the price path touches the barrier level along the way.",
      correct: true,
    },
    {
      id: "day3_knock_out_loss",
      text: "If the knock-out barrier is touched, the product may expire early, and the premium the client paid may be lost entirely.",
      correct: true,
    },
    {
      id: "day3_final_price_not_enough",
      text: "Even if the final price is above the strike, the client may get no payoff if it had already knocked out earlier.",
      correct: true,
    },
    {
      id: "day3_cheaper_reason",
      text: "A barrier option is cheaper because the client takes on extra knock-out risk.",
      correct: true,
    },
    {
      id: "day3_same_as_vanilla",
      text: "A barrier option is just like a vanilla option; you only need to look at the final expiry price.",
      correct: false,
    },
  ],
  market: {
    underlying: "Hang Seng Index",
    spot: 21500,
    strike: 22000,
    barrier: 21000,
    premium: 934,
    vanillaPremium: 1112,
    maturity: "3 months",
    path: [21500, 21820, 21460, 20950, 21680, 22400],
  },
  // Real market background: the teaching path is a simplified demo; here we cite real historical data as a "real-world reference".
  // Data source: real market data scraped by the math-engine team in our group (central-trader/data).
  marketContext: {
    title: "Real-World Reference · 2020 COVID Crash",
    source: "Data source: HSI daily hsi_2020_covid.csv + VHSI vhsi_history.csv (scraped by the math-engine team in our group)",
    bullets: [
      "On 2020-03-19 the HSI fell intraday to 21,139, right in line with this stage's spot of 21,500 and barrier of 21,000",
      "On 2020-03-23 the HSI closed at 21,696, rebounding only after touching this COVID-cycle low zone",
      "Over the same period the VHSI (HSI volatility index) spiked to 60.19 (2020-03-19); market panic made the lower barrier extremely easy to breach",
      "Real-world lesson: in high-volatility periods, a down-and-out barrier triggers more easily than in calm ones; the price of cheap is path risk",
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

// Archived: CBBC (Callable Bull/Bear Contract) content. In 2026-06 the user decided to change Day4 to "Three-Client Pricing Live Round / Graduation".
// This data is kept for reference (bull/bear, MCE, call price, suitability) and no longer drives the Day4 flow.
// If you ever want to bring CBBC back, just wire it into dayConfigs/stageConfig. See Day4Cbbc*_ARCHIVED for the matching old panels.
const day4CbbcConfig_ARCHIVED = {
  day: 4,
  title: "CBBCs and the Call Price",
  stages: {
    day4_intro: {
      label: "09:00 Morning Meeting",
      system: "CBBC Product Morning Meeting",
      mentor:
        "Today let's cover CBBCs more fully. A bull contract is bullish, a bear contract is bearish. Both carry leverage, and both have a call price. Today we'll use a bear contract's upper call price as our case study.",
    },
    day4_handbook_updated: {
      label: "09:05 Handbook Updated",
      system: "CBBC Rules Sync",
      mentor:
        "The handbook has a new CBBC page. Note the symmetry: a bull contract fears the underlying falling to the call price; a bear contract fears the underlying rising to the call price.",
    },
    day4_client_arrival: {
      label: "09:10 Client Arrives",
      system: "Reading Suitability",
      mentor:
        "First listen for the client's direction. She's bearish, wants leverage, and knows the mandatory call (forced redemption) risk. Today's focus is judging whether a bear contract fits, and how an upper call price triggers an MCE.",
    },
    day4_suitability_check: {
      label: "09:16 Suitability Assessment",
      system: "Is a CBBC Suitable",
      mentor:
        "This step is like a compliance gate. The client's direction, risk tolerance, product experience, and whether they understand the MCE all have to be weighed together.",
    },
    day4_product_selection: {
      label: "09:24 Product Recommendation",
      system: "Recommend the Final Product",
      mentor:
        "The client is bearish, wants leverage, and can accept the mandatory call. A bear contract matches the direction, but you must clearly explain the upper call price.",
    },
    day4_risk_disclosure: {
      label: "09:32 Risk Disclosure",
      system: "CBBC Risk Explanation",
      mentor:
        "A bear contract is not a cheaper version of a vanilla put. You must make it clear: if the underlying rises and touches the call price, it triggers an MCE, and even if the market falls again afterward, it won't recover.",
    },
    day4_market_run: {
      label: "09:42 Market Path",
      system: "CBBC Comparison Path",
      mentor:
        "This path shows you the upper barrier: the HSI first spikes up and triggers the bear contract's MCE, only falling later. The right final direction can't rescue an already-redeemed product. That real-world reference beside it is a live textbook: in February 2020 the HSI first spiked to 28,000, only crashing to 21,700 in March; spiking high then crashing is exactly the bear contract's worst nightmare.",
    },
    day4_report: {
      label: "09:52 End-of-Day Report",
      system: "CBBC Suitability Review",
      mentor:
        "The focus of day four is understanding the symmetry. A bull contract is bullish but fears a fall triggering the call; a bear contract is bearish but fears a rise triggering the call.",
    },
    day4_complete: {
      label: "10:00 Day Four Complete",
      system: "Stage Complete",
      mentor:
        "You've now seen both a lower barrier and an upper call price. What matters most for a path-dependent product isn't the destination; it's whether it touches a line along the way.",
    },
  },
  handbookEntries: [
    {
      id: "cbbc_basics",
      title: "CBBC",
      sections: [
        {
          title: "Core Idea",
          bullets: [
            "CBBC stands for Callable Bull/Bear Contract",
            "A bull contract (Bull CBBC) suits a bullish view: a rise in the underlying usually benefits a bull contract",
            "A bear contract (Bear CBBC) suits a bearish view: a fall in the underlying usually benefits a bear contract",
            "A CBBC usually carries leverage, so even a small move in the underlying can cause a noticeable change in the product price",
            "CBBCs are not vanilla options; they have a mandatory call mechanism",
          ],
        },
        {
          title: "Bull vs Bear Contract",
          bullets: [
            "A bull contract is like a leveraged bullish instrument, but a fall touching the call price triggers an MCE",
            "A bear contract is like a leveraged bearish instrument, but a rise touching the call price triggers an MCE",
            "A bull contract's danger line is usually below the spot",
            "A bear contract's danger line is usually above the spot",
          ],
        },
        {
          title: "Mandatory Call Event (MCE)",
          bullets: [
            "A CBBC has a call price",
            "Bull contract: if the underlying price touches or falls below the call price, a mandatory call event is triggered",
            "Bear contract: if the underlying price touches or rises above the call price, a mandatory call event is triggered",
            "Once an MCE is triggered, the product terminates early and trading stops",
            "This simulation uses discrete observation points; real CBBCs are monitored continuously, so a call happens more easily",
          ],
        },
        {
          title: "Residual Value and Loss",
          bullets: [
            "After an MCE, residual value is not guaranteed",
            "Some CBBCs may have residual value, some may have none",
            "Teaching simplification: today we treat residual value as 0 to emphasize mandatory-call risk",
            "The client's maximum loss is usually limited to the amount invested plus trading costs, but the loss happens very fast",
          ],
        },
        {
          title: "Price and Leverage (Teaching Simplification)",
          bullets: [
            "A real CBBC price ≈ |spot − strike| × conversion ratio + financing cost; it is not priced via a premium",
            "This simulation treats a bear contract as a leveraged linear bearish instrument: the invested amount is fixed, P&L = investment × leverage × the underlying's percentage fall",
            "So the “bear-contract cost/P&L” in the simulation is an illustrative leverage figure, not real conversion-ratio pricing",
            "Leverage amplifies gains and losses alike; until knocked out, the maximum loss is still capped at the invested amount",
          ],
        },
        {
          title: "Suitability Rules",
          bullets: [
            "The right direction does not mean the product is suitable",
            "If the client can't accept a mandatory call, a CBBC isn't suitable",
            "If the client has low risk tolerance, you shouldn't recommend a CBBC just for being cheap or for leverage",
            "The client must understand: even with the right final direction, they can still lose due to an MCE along the way",
            "Don't pitch a CBBC as a cheaper substitute for a vanilla option",
          ],
        },
      ],
    },
  ],
  clientProfile: {
    name: "Ms. Zhou",
    type: "Active Retail Client",
    marketView: "Bearish on the Hang Seng Index",
    riskTolerance: "High",
    goal: "Wants to participate in a short-term decline with a smaller outlay",
    productNeed: "Wants to learn about bear contracts; accepts leverage and mandatory-call risk",
    budget: "Willing to invest a limited amount, but wants a faster response on the way down",
    experience: "Has traded vanilla puts; first time formally trading a CBBC",
    dialogue: [
      "I think the Hang Seng Index might pull back in the short term. A vanilla put has simpler risk, but its premium and leverage aren't quite what I want.",
      "A friend mentioned bear contracts, saying they react faster on the way down, but I know it might get mandatorily called.",
      "Help me decide: if I want to take a bearish trade, is a bear contract suitable?",
    ],
  },
  suitabilityOptions: [
    {
      id: "not_suitable",
      title: "Not Suitable to Recommend a CBBC",
      tag: "Overly Conservative",
      description:
        "Although the client is bearish, a CBBC is ruled out entirely simply because there is mandatory-call risk.",
      feedback:
        "This is a bit overly conservative. Ms. Zhou has high risk tolerance and clearly understands the MCE risk, so you can continue evaluating a bear contract.",
    },
    {
      id: "suitable",
      title: "Can Evaluate a Bear CBBC",
      tag: "Correct",
      description:
        "The client is bearish, has high risk tolerance, and understands mandatory-call risk. A bear contract can be evaluated, but the upper call price must be fully disclosed.",
      feedback:
        "Correct call. She isn't a low-risk client and isn't avoiding the MCE; next, choose a bear contract that matches her direction and clearly explain the upper call price.",
    },
  ],
  products: [
    {
      id: "bull_cbbc",
      name: "HSI Bull Contract",
      term: "Bull CBBC",
      status: "Available",
      description: [
        "Suited to a bullish view",
        "Leveraged, more sensitive to price moves",
        "Touching or falling below the call price triggers an MCE",
        "Direction is opposite to this client's bearish view",
      ],
      feedback:
        "The client is bearish, and a bull contract points the opposite way. A bull contract is a bullish instrument, not suitable for this order.",
    },
    {
      id: "bear_cbbc",
      name: "HSI Bear Contract",
      term: "Bear CBBC",
      status: "Available",
      description: [
        "Suited to a bearish view",
        "Leveraged, more sensitive to price moves",
        "A rise in the underlying touching or above the call price triggers an MCE",
        "Uses an upper call price as the risk boundary",
      ],
      feedback:
        "Direction matches. The client is bearish and can take high risk, so a bear contract can be considered, but you must explain the upper call price and the MCE.",
    },
    {
      id: "vanilla_call",
      name: "Vanilla Call Option",
      term: "Vanilla Call",
      status: "Available",
      description: [
        "Suited to a bullish view",
        "No mandatory call event",
        "The buyer's maximum loss is usually limited to the premium",
        "Direction doesn't match the client's view",
      ],
      feedback:
        "A vanilla call has no MCE risk, but its direction is bullish, which doesn't match the client's bearish view.",
    },
    {
      id: "vanilla_put",
      name: "Vanilla Put Option",
      term: "Vanilla Put",
      status: "Available",
      description: [
        "Suited to a bearish view",
        "No mandatory call event",
        "The buyer's maximum loss is usually limited to the premium",
        "Simpler risk, but without the CBBC's leverage characteristics",
      ],
      feedback: "A vanilla put has the right direction and simpler risk, but the client explicitly wants to evaluate a leveraged bear contract. It can serve as a more conservative fallback.",
    },
  ],
  disclosureItems: [
    {
      id: "day4_mce",
      text: "A CBBC has a call price; touching the call price triggers a mandatory call event (MCE).",
      correct: true,
    },
    {
      id: "day4_bear_trigger",
      text: "In a bear contract, if the underlying price touches or rises above the call price, the product may terminate early.",
      correct: true,
    },
    {
      id: "day4_residual_not_guaranteed",
      text: "After an MCE, residual value is not guaranteed; under the teaching simplification, treat it as a possible total loss of the invested amount.",
      correct: true,
    },
    {
      id: "day4_leverage",
      text: "A CBBC is leveraged, so both price moves and the speed of losses can be amplified.",
      correct: true,
    },
    {
      id: "day4_recover_after_mce",
      text: "If the market falls back after an MCE, the bear contract will automatically resume trading and keep making money.",
      correct: false,
    },
  ],
  market: {
    underlying: "Hang Seng Index",
    spot: 21500,
    // Strike of the vanilla put comparison product (out-of-the-money put, below the spot of 21500)
    strike: 21200,
    // Bear contract structure: spot ≤ call price ≤ strike. Category-N bear contract: strike = call price = 22000, no residual value.
    cbbcStrike: 22000,
    cbbcCallPrice: 22000,
    cbbcEntryCost: 80,
    // A bear contract is a leveraged linear tracking instrument, not priced via a premium. Here an illustrative leverage multiple expresses "reacts faster on the way down".
    cbbcLeverage: 7,
    vanillaPremium: 150,
    maturity: "1 month",
    path: [21500, 21780, 22050, 21600, 21100, 20750],
  },
  // Real market background: the teaching path is a simplified demo; here we cite real historical data as a "real-world reference".
  // Data source: real market data scraped by the math-engine team in our group (central-trader/data).
  marketContext: {
    title: "Real-World Reference · 2020 COVID: Spike First, Then Crash",
    source: "Data source: HSI daily hsi_2020_covid.csv (scraped by the math-engine team in our group)",
    bullets: [
      "On 2020-02-17 the HSI reached as high as 28,055, a spike-first move, exactly the “upper call” scenario a bear contract fears most",
      "Holding a bear contract with a low upper call price at the time, this surge could have triggered a mandatory call (MCE)",
      "The pandemic then spread, and the HSI fell all the way to 21,696 on 2020-03-23, so the direction was actually right",
      "But an already-called bear contract can't revive: this stage's plot of “spike first to trigger an MCE, then crash” is a microcosm of the real market",
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
// Day4 Live Round · Three-Client Pricing Live Round (Graduation)
// Narrative: Several months after Day3 (the 2020 COVID crash), the HSI has recovered from the 21,000 low to 24,000-25,000.
// The player uses the skills learned in Day2 (vanilla option pricing) + Day3 (barrier option pricing) to give live quotes to 3 clients with differing needs.
// The three clients increase in difficulty with decreasing hints; client #3 doesn't name a product, so the player must judge whether to go vanilla or barrier.
// All theoretical-price anchors are computed live by the project's binomial tree (r=2%, vanilla N=3 / barrier N=4), matching the calculator exactly.
//   1) Mr. Zhang vanilla: S0 24000 / K 24500 / σ18% / T0.08 → 297.06 ≈ 297
//   2) Ms. Li barrier: S0 24000 / K 24500 / barrier 23000 / σ28% / T0.25 → 980.77 ≈ 981 (vanilla call 1167)
//   3) Mr. He barrier: S0 25000 / K 25500 / barrier 23500 / σ32% / T0.25 → 1184.20 ≈ 1184 (vanilla call 1411)
// ===================================================================
const day4Clients = [
  {
    id: "zhang",
    avatar: "Z",
    typeLabel: "Institutional Client",
    taskType: "price", // Product already named, quote directly
    mode: "vanilla",
    correctProduct: "vanilla_call",
    productLabel: "Vanilla Call",
    hintLevel: "Demonstration",
    params: { spot: 24000, strike: 24500, barrier: null, rate: 2, sigma: 18, maturity: 0.08, steps: 3 },
    theoretical: 297, // computed live 297.06, vanilla N=3
    vanillaRef: 297,
    profile: {
      name: "Mr. Zhang",
      type: "Institutional Client (conservative)",
      marketView: "Bullish on the Hang Seng Index",
      riskTolerance: "Moderate",
      goal: "Catch a move up with a 1-month option",
      productNeed: "The simplest bullish instrument, with loss limited to the premium",
      budget: "Can accept a reasonable quote, but doesn't want to be fleeced",
      experience: "Trades vanilla options year-round",
    },
    dialogue: [
      "I'm bullish on the HSI and want to buy a one-month call option.",
      "I want the cleanest kind: loss limited to the premium I pay, no extra conditions attached.",
      "Work out a fair price for me; I'll take it and compare against others.",
    ],
  },
  {
    id: "li",
    avatar: "L",
    typeLabel: "Budget-Sensitive Client",
    taskType: "price", // Need mentions "swap for cheaper / accept knock-out", effectively a half-naming
    mode: "barrier",
    correctProduct: "down_out_call",
    productLabel: "Barrier Call",
    hintLevel: "Reduced",
    params: { spot: 24000, strike: 24500, barrier: 23000, rate: 2, sigma: 28, maturity: 0.25, steps: 4 },
    theoretical: 981, // computed live 980.77, barrier N=4
    vanillaRef: 1167, // computed live 1167.35
    profile: {
      name: "Ms. Li",
      type: "Budget-Sensitive Client",
      marketView: "Bullish on the Hang Seng Index",
      riskTolerance: "Moderate-High",
      goal: "Bullish, but wants to keep the premium down",
      productNeed: "Willing to accept “expires early if it drops below a certain line along the way” in exchange for a cheaper price",
      budget: "A vanilla call is too expensive, wants something cheaper",
      experience: "Has bought vanilla options and dealt with barrier structures",
    },
    dialogue: [
      "I'm also bullish on the HSI, but that vanilla call last time was too expensive for me.",
      "If it can be cheaper, I'm willing to accept “it expires early if it drops below a certain line along the way.”",
      "Set me up with a bullish option cheaper than a vanilla call, and work out a fair price for me.",
    ],
  },
  {
    id: "he",
    avatar: "H",
    typeLabel: "Graduation Judgment Client",
    taskType: "judge", // Doesn't name a product; the player picks the product first, then quotes
    mode: "barrier",
    correctProduct: "down_out_call",
    productLabel: "Barrier Call",
    hintLevel: "Minimal",
    params: { spot: 25000, strike: 25500, barrier: 23500, rate: 2, sigma: 32, maturity: 0.25, steps: 4 },
    theoretical: 1184, // computed live 1184.20, barrier N=4
    vanillaRef: 1411, // computed live 1411.24
    profile: {
      name: "Mr. He",
      type: "Small Business Owner",
      marketView: "Bullish on the Hang Seng Index",
      riskTolerance: "Moderate-High",
      goal: "Bullish, wants to ride this move, but budget is very tight",
      productNeed: "Hasn't said which kind; you have to judge it yourself",
      budget: "Budget is only a little over a thousand; anything pricier is out of reach",
      experience: "Has bought both vanilla options and barrier options",
    },
    dialogue: [
      "I'm bullish on the HSI and want to ride this move.",
      "But my budget is very tight. I've only got a little over a thousand points, and I can't bring myself to pay a vanilla-call price.",
      "I'm not afraid of it dropping along the way. If it really breaches a certain level and gets voided, I can live with that. Use your judgment and set me up with something suitable.",
    ],
    judgeProducts: [
      {
        id: "vanilla_call",
        name: "Vanilla Call Option",
        term: "Vanilla Call",
        status: "Available",
        description: ["Suited to a bullish view", "No knock-out risk, the simplest structure", "Highest premium", "Depends only on the final expiry price"],
        feedback:
          "Right direction, but a vanilla call is the most expensive here, running straight into Mr. He's “budget only a little over a thousand” red line. He can't afford it.",
      },
      {
        id: "down_out_call",
        name: "Down-and-Out Call Option",
        term: "Down-and-Out Call",
        status: "Available",
        description: ["Suited to a bullish view", "Premium lower than a vanilla call", "Expires early if it drops below the lower barrier level along the way", "The buyer's maximum loss is usually limited to the premium"],
        feedback:
          "Correct call. Tight budget plus willingness to accept a downside knock-out: a barrier call trades a lower premium for path risk, fitting right into his budget. Compute its theoretical price, then quote.",
      },
      {
        id: "up_out_call",
        name: "Up-and-Out Call Option",
        term: "Up-and-Out Call",
        status: "Available",
        description: ["Bullish, but knocks out if it rises too much", "Conflicts with the goal of “participating in the upside”", "Requires a clear explanation of the payoff cap"],
        feedback:
          "He wants to participate in the upside; an up-and-out call expires when the market rises too strongly, which conflicts with his goal. Not a match.",
      },
    ],
  },
];

const day4Config = {
  day: 4,
  title: "Graduation Live Round · Three-Client Pricing",
  clients: day4Clients,
  handbookEntries: [],
  martinPrinciple: "Read the direction first, then risk tolerance and budget, and only then think about the product; always anchor the quote on the model's theoretical price, then add a reasonable profit.",
  // Safety placeholder: keeps the existing isDay4Stage derived logic (disclosure scoring / market-settlement path) from reading undefined.
  // The new Day4 flow has no risk-disclosure step and no automatic market settlement; these fields are purely defensive.
  disclosureItems: [],
  market: { path: [] },
  scoringRules: { correctDisclosureIds: [], misleadingDisclosureId: "__day4_none__" },
  stages: {
    day4_intro: {
      label: "09:00 Graduation Morning Meeting",
      system: "Three-Client Pricing Live Round",
      mentor:
        "No new products to learn today. Over the past three days you learned vanilla options, pricing, and barriers. Today is the graduation live round: three clients queued up waiting for your quote. I'll say the principle only once: read the direction first, then risk tolerance and budget, and only then think about the product; always anchor the quote on the model's theoretical price, then add a reasonable profit. I won't tell you what to pick or what to quote.",
    },
    day4_client_arrival: {
      label: "09:10 Client Arrives",
      system: "Understand Client Needs",
      mentor:
        "First read the client's profile and dialogue thoroughly. Direction, budget, whether they can accept extra conditions: the clues are all in there. Decide what to do only after you've read them.",
    },
    day4_judge: {
      label: "09:16 Judge the Product",
      system: "Pick the Structure Yourself",
      mentor:
        "This client didn't say which product he wants. Judge from his budget and risk language: should you go with a vanilla call, or a cheaper barrier call? Pick wrong and the client walks.",
    },
    day4_pricing: {
      label: "09:22 Quote via the Calculator",
      system: "Compute the Theoretical Price and Quote",
      mentor:
        "Plug the parameters from the client card into the calculator, compute the theoretical price, then add a reasonable profit and quote it. The system won't tell you in advance whether you're right; you'll find out only after you submit.",
    },
    day4_client_response: {
      label: "09:30 Client Feedback",
      system: "Quote Receipt",
      mentor:
        "See how the client responds. Quote too low and the desk gives away profit; quote too high and the client turns and walks. Fair plus profit is the pricing discipline.",
    },
    day4_scorecard: {
      label: "09:45 Graduation Scorecard",
      system: "Three-Trade Review",
      mentor:
        "All three clients are handled. Go trade by trade: did you pick the right product, how far off was the quote, how many trades were filled. This is everything you've learned in these four days.",
    },
    day4_complete: {
      label: "10:00 Graduation",
      system: "Training Complete",
      mentor:
        "From option basics to pricing, barriers, and today's live quoting, you've now walked through the pricing discipline a new trader should have.",
    },
  },
};

// Day4 quote evaluation: merges the two band sets, vanilla (from Day2) and barrier (from Day3), and produces copy based on client.mode.
// Vanilla band: theoretical +4 / +34 / +74; barrier band: theoretical ×1.183 (reasonable cap) / ×1.398 (rejection cap).
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
      label: "No Quote",
      status: "Not yet quoted",
      accepted: false,
      score: "D",
      customerLine: "You haven't given me a quote yet.",
      martinComment: `No quote yet. First compute the theoretical price of the ${productLabel} in the calculator, then add some profit and quote it to ${name}.`,
      margin: 0,
      theoretical,
    };
  }

  if (q < theoretical) {
    const bargain = Math.round(theoretical - q);
    return {
      id: "too_low",
      label: "Quote Too Low",
      status: "Filled, but the quote was too low and the desk lost profit",
      accepted: true,
      score: "C",
      customerLine: "Great price, done!",
      martinComment: `${name} signed with barely any haggling; he knows he got a bargain. The ${productLabel} model fair value is about ${anchor} points, but you only quoted ${Math.round(q)} points, effectively giving the client ${bargain} points for free. Look at the model's theoretical price first, then add profit.`,
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
        label: "Reasonable Quote",
        status: "Filled, beautifully priced",
        accepted: true,
        score: "A",
        customerLine: "Cheaper than a vanilla call, and not absurdly cheap either. Okay, done.",
        martinComment: `Beautiful. You anchored on the barrier model value of ${anchor} points and added ${margin} points of profit, so the client finds it a better deal than a vanilla call, and the desk gets compensated too. That's the discipline of barrier pricing.`,
        margin,
        theoretical,
      };
    }
    if (q <= rejectAbove) {
      return {
        id: "expensive",
        label: "On the Pricey Side",
        status: "Reluctantly filled, client not satisfied",
        accepted: true,
        score: "C",
        customerLine: "Isn't the whole point of a barrier product that it's cheap? This is a bit pricey… fine, this time then.",
        martinComment: `${name} signed with a frown. The selling point of a barrier product is its low price; quoting this high wipes out its biggest advantage. This kind of experience won't bring back repeat clients.`,
        margin,
        theoretical,
      };
    }
    return {
      id: "too_high",
      label: "Quote Too High",
      status: "Client refuses and walks away",
      accepted: false,
      score: "D",
      customerLine: "If it's this expensive, why would I even buy a barrier? I'd be better off just buying a vanilla call.",
      martinComment: `${name} got up and left. At this price for a barrier, the client would rather buy a vanilla call. A quote too far from fair value will lose even the best client.`,
      margin,
      theoretical,
    };
  }

  // vanilla band
  const fairLow = theoretical + 4;
  const fairHigh = theoretical + 34;
  const rejectAbove = theoretical + 74;
  if (q < fairLow) {
    return {
      id: "thin_margin",
      label: "Very Thin Margin",
      status: "Filled, but the margin is paper-thin",
      accepted: true,
      score: "B",
      customerLine: "Okay, I'll take that quote.",
      martinComment: `${name} accepted readily. You held the theoretical price of ${anchor} points, but the margin is almost invisible. The trade went through, but the desk basically worked this one for nothing.`,
      margin,
      theoretical,
    };
  }
  if (q <= fairHigh) {
    return {
      id: "fair",
      label: "Reasonable Quote",
      status: "Filled, beautifully priced",
      accepted: true,
      score: "A",
      customerLine: "Fair price, done.",
      martinComment: `Beautiful. You anchored on the model's theoretical price of ${anchor} points and left ${margin} points of profit, so the client accepted readily, and the desk made money too. That's pricing discipline.`,
      margin,
      theoretical,
    };
  }
  if (q <= rejectAbove) {
    return {
      id: "expensive",
      label: "On the Pricey Side",
      status: "Reluctantly filled, client not satisfied",
      accepted: true,
      score: "C",
      customerLine: "A bit pricey… fine, this time then.",
      martinComment: `${name} signed with a frown. You quoted on the high side, and the client is clearly unhappy. This kind of client experience won't bring back repeat business.`,
      margin,
      theoretical,
    };
  }
  return {
    id: "too_high",
    label: "Quote Too High",
    status: "Client refuses and walks away",
    accepted: false,
    score: "D",
    customerLine: "That price is outrageous. I'll go compare elsewhere.",
    martinComment: `${name} closed the notebook, got up, and left. Quoting this high scared the client off, and the trade is dead. The model is for keeping discipline, not for fleecing clients.`,
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

// ===== Client-side progress persistence (localStorage) =====
const CT_PROGRESS_KEY = "ct_progress_v1";
const CT_PROFILE_KEY = "ct_profile_v1";

const DEFAULT_PROFILE = { name: "Guest Trader" };
const EMPTY_PROGRESS = { day1: null, day2: null, day3: null, day4: null };

function loadProfile() {
  try {
    const raw = window.localStorage.getItem(CT_PROFILE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return { ...DEFAULT_PROFILE, ...parsed };
    }
    return { ...DEFAULT_PROFILE };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function saveProfile(profile) {
  try {
    window.localStorage.setItem(CT_PROFILE_KEY, JSON.stringify(profile ?? DEFAULT_PROFILE));
  } catch {
    /* storage unavailable (SSR / private mode); ignore */
  }
}

function loadProgress() {
  try {
    const raw = window.localStorage.getItem(CT_PROGRESS_KEY);
    if (!raw) return { ...EMPTY_PROGRESS };
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return { ...EMPTY_PROGRESS, ...parsed };
    }
    return { ...EMPTY_PROGRESS };
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

function saveDayProgress(day, record) {
  const current = loadProgress();
  const next = { ...current, ["day" + day]: record };
  try {
    window.localStorage.setItem(CT_PROGRESS_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable; still return the merged object for in-memory state */
  }
  return next;
}

// Map a letter grade to a rough percent for display (A=95, B=82, C=68, D=50).
const GRADE_PERCENT = { A: 95, "A-": 90, B: 82, "B-": 78, C: 68, D: 50 };
function gradeToPercent(grade) {
  if (!grade) return 0;
  return GRADE_PERCENT[grade] ?? 60;
}

// Derive initials from a display name, e.g. "Guest Trader" -> "GT".
function initialsFromName(name) {
  const parts = String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "GT";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatPoints(value) {
  return value.toLocaleString("en-US");
}

function getQuoteAnalysis(
  quote,
  theoretical = day2Config.quoteRules.theoreticalPrice,
  clientName = "Mr. Wang",
  clientDesc = "A professional client",
) {
  const margin = quote - theoretical;
  // Reasonable range: theoretical + 4 to theoretical + 34 (relative offsets, no longer hard-coded absolutes)
  const fairLow = theoretical + 4;
  const fairHigh = theoretical + 34;
  const rejectAbove = theoretical + 74;

  if (quote < theoretical) {
    const bargain = theoretical - quote;
    return {
      id: "too_low",
      label: "Quote Too Low",
      score: "D",
      tone: "danger",
      status: "Filled, but the quote was too low and the desk lost profit",
      accepted: true,
      customerPreview: "The client will grab this cheap price immediately.",
      customerLine: "That's a great price, done.",
      reportText:
        "Your quote was below the option's fair value, and the client accepted almost immediately, well aware they got a bargain.",
      martinComment:
        `${clientName}'s eyes lit up and he signed with barely any haggling. You quoted ${quote} points for an option worth about ${theoretical} points, effectively giving the client ${bargain} points for free. ${clientDesc} is best at snapping up bargains like this. Next time, look at the model's theoretical price first, then add profit; don't let the desk take a silent loss.`,
      margin,
      theoretical,
    };
  }

  if (quote < fairLow) {
    return {
      id: "thin_margin",
      label: "Very Thin Margin",
      score: "B-",
      tone: "warn",
      status: "Filled, but the margin is paper-thin",
      accepted: true,
      customerPreview: "The client will accept readily, but the desk earns almost nothing.",
      customerLine: "Okay, I'll take that quote.",
      reportText: "The quote is very client-friendly, but the desk's margin is almost invisible.",
      martinComment:
        "You held the theoretical price, but the margin is almost invisible. The trade went through, but the desk basically worked this one for nothing. A real desk would ask one more question: is this sliver of profit worth taking on this risk?",
      margin,
      theoretical,
    };
  }

  if (quote <= fairHigh) {
    return {
      id: "fair",
      label: "Reasonable Quote",
      score: "A",
      tone: "good",
      status: "Filled, beautifully priced",
      accepted: true,
      customerPreview: "The quote is fair, with a reasonable profit margin.",
      customerLine: "Fair price, done.",
      reportText: "You referenced the theoretical price and added a reasonable profit margin; both client and desk are satisfied.",
      martinComment:
        `Beautiful. You anchored on the model's theoretical price of ${theoretical} points and left ${margin} points of profit, so the client accepted readily, and the desk made money too. That's pricing discipline.`,
      margin,
      theoretical,
    };
  }

  if (quote <= rejectAbove) {
    return {
      id: "expensive",
      label: "On the Pricey Side",
      score: "C",
      tone: "warn",
      status: "Reluctantly filled, client not satisfied",
      accepted: true,
      customerPreview: "The client will frown and reluctantly accept.",
      customerLine: "A bit pricey… fine, this time then.",
      reportText: "The quote is above the reasonable range; the client reluctantly accepts but is clearly unhappy.",
      martinComment:
        `${clientName} signed with a frown. The trade went through, but you quoted on the high side and the client is clearly unhappy. This kind of client experience won't bring back repeat business; ${clientDesc} remembers who overcharged them.`,
      margin,
      theoretical,
    };
  }

  return {
    id: "too_high",
    label: "Quote Too High",
    score: "D",
    tone: "danger",
    status: "Client refuses and walks away",
    accepted: false,
    customerPreview: "The client will very likely turn and walk.",
    customerLine: "That price is outrageous. I'll go compare elsewhere.",
    reportText: "The quote was too high; the client refused on the spot and walked away, and the trade fell through.",
    martinComment:
      `${clientName} closed the notebook, got up, and left. Quoting this high scared the client off, the trade is dead, and the desk made nothing. The model is for keeping discipline, not for fleecing clients; a quote too far from fair value will lose even the best client.`,
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
      comment: "The quote was too high and the client refused the trade. The market later rose, but the desk made no trade and earned nothing.",
    };
  }

  if (quote < theoretical) {
    return {
      score: marketResult.deskPnl < 0 ? "D" : "C",
      comment:
        marketResult.deskPnl < 0
          ? "The quote was below the theoretical price; after the market rose, the desk actually took a loss. A cheap fill isn't a good quote."
          : "The quote was below the theoretical price; this time the market outcome still covered the payoff, but the pricing discipline was lacking.",
    };
  }

  if (quote >= fairLow && quote <= fairHigh) {
    return {
      score: marketResult.deskPnl >= 0 ? "A" : "B",
      comment:
        marketResult.deskPnl >= 0
          ? "The quote was close to the model price with a reasonable profit margin; after the simulated market settlement, the desk still had a positive P&L."
          : "Good pricing discipline, but this market path left the desk with a loss. The model is a quote anchor, not a profit guarantee.",
    };
  }

  if (quote < fairLow) {
    return {
      score: "B-",
      comment: "The quote held the theoretical price, but the profit margin is thin; after market settlement, you need to check whether this risk was worth it.",
    };
  }

  if (quote <= theoretical + 74) {
    return {
      score: "C",
      comment: "The quote was above the reasonable range; although the client reluctantly accepted, client satisfaction dropped.",
    };
  }

  return {
    score: "D",
    comment: "The quote was far from the model price, and the client refused the trade.",
  };
}

function getDay3MarketResult() {
  const market = day3Config.market;
  const finalPrice = market.path[market.path.length - 1];
  const knockedOutIndex = market.path.findIndex((price) => price <= market.barrier);
  const knockedOut = knockedOutIndex >= 0;
  const vanillaPayoff = Math.max(finalPrice - market.strike, 0);
  const barrierPayoff = knockedOut ? 0 : vanillaPayoff;
  return {
    finalPrice,
    knockedOut,
    knockedOutIndex,
    vanillaPayoff,
    barrierPayoff,
  };
}

// Day3 barrier quote evaluation: anchors on the barrier product's model fair value (day3Config.market.premium ≈ 934),
// with the range scaled by Day2's relative proportions (reasonable markup ~+2%..+18%; above ~+40% the client would rather buy a vanilla call and rejects).
function getDay3QuoteAnalysis(quote, theoretical = day3Config.market.premium) {
  const q = Number(quote);
  const margin = Math.round(q - theoretical);
  const anchor = Math.round(theoretical);
  const fairHigh = theoretical * 1.183;
  const rejectAbove = theoretical * 1.398;

  if (!Number.isFinite(q) || q <= 0) {
    return {
      id: "empty",
      label: "No Quote",
      status: "Not yet quoted",
      accepted: false,
      customerLine: "You haven't given me a quote yet.",
      martinComment: "No quote yet. First compute the barrier's theoretical price in the calculator, then add a little profit and quote it to Ms. Chen.",
      margin: 0,
      theoretical,
    };
  }

  if (q < theoretical) {
    const bargain = Math.round(theoretical - q);
    return {
      id: "too_low",
      label: "Quote Too Low",
      status: "Filled, but the quote was below the theoretical price and the desk's profit was squeezed",
      accepted: true,
      customerLine: "This is way cheaper than a vanilla call, done!",
      martinComment: `Ms. Chen signed readily; she got a bargain. The barrier model fair value is ${anchor} points, but you only quoted ${Math.round(q)} points, so the desk took in ${bargain} points less. A discount for the client is fine, but don't take it this far.`,
      margin,
      theoretical,
    };
  }

  if (q <= fairHigh) {
    return {
      id: "fair",
      label: "Reasonable Quote",
      status: "Filled, beautifully priced",
      accepted: true,
      customerLine: "Cheaper than a vanilla call, and not absurdly cheap either. Okay, done.",
      martinComment: `Beautiful. You anchored on the barrier model value of ${anchor} points and added ${margin} points of profit, so the client finds it a better deal than a vanilla call, and the desk gets compensated too. That's the discipline of barrier pricing.`,
      margin,
      theoretical,
    };
  }

  if (q <= rejectAbove) {
    return {
      id: "expensive",
      label: "On the Pricey Side",
      status: "Reluctantly filled, client not satisfied",
      accepted: true,
      customerLine: "Isn't the whole point of a barrier product that it's cheap? This is a bit pricey… fine, this time then.",
      martinComment: "Ms. Chen signed with a frown. The selling point of a barrier product is its low price; quoting this high wipes out its biggest advantage. This kind of experience won't bring back repeat clients.",
      margin,
      theoretical,
    };
  }

  return {
    id: "too_high",
    label: "Quote Too High",
    status: "Client refuses and walks away",
    accepted: false,
    customerLine: "If it's this expensive, why would I even buy a barrier? I'd be better off just buying a vanilla call.",
    martinComment: `Ms. Chen turned and left. A barrier priced higher than a vanilla call contradicts itself; of course the client won't sign. The quote is too far from the barrier fair value of ${anchor} points, and the trade is dead.`,
    margin,
    theoretical,
  };
}

// Archived (CBBC): the original Day4 bear-contract market settlement, no longer used in the new flow.
function getDay4CbbcMarketResult_ARCHIVED() {
  const market = day4CbbcConfig_ARCHIVED.market;
  const finalPrice = market.path[market.path.length - 1];
  const mceIndex = market.path.findIndex((price) => price >= market.cbbcCallPrice);
  const mceTriggered = mceIndex >= 0;
  // Vanilla put comparison product: uses the put's own strike (21200)
  const vanillaPayoff = Math.max(market.strike - finalPrice, 0);
  const vanillaPnl = vanillaPayoff - market.vanillaPremium;
  // The bear contract is modeled as "leveraged linear bearish exposure" (rather than an option payoff), avoiding the pseudo-arbitrage of "small cost for large intrinsic value".
  // MCE not triggered: P&L = invested amount × leverage × the underlying's percentage fall from entry (a fall is positive, a rise is negative).
  // MCE triggered: lose the entire investment (teaching simplification: residual value = 0). The loss floor is the invested amount.
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
      ctx.fillStyle = "rgba(91, 140, 255, 0.55)";

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
      <div className="pointer-events-none fixed inset-0 z-0 bg-[var(--bg)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(1100px_circle_at_50%_-15%,rgba(47,100,216,0.05),transparent_60%)]" />
    </>
  );
}

function StyleBlock() {
  return (
    <style>{`
      :root {
        --bg: #f6f7f9;
        --bg-elev: #ffffff;
        --surface: #ffffff;
        --surface-2: #f1f3f7;
        --border: #e4e8ef;
        --border-strong: #cfd6e1;
        --ink: #0f172a;
        --muted: #56627a;
        --faint: #8b95a7;
        --accent: #2f64d8;
        --accent-strong: #2454c4;
        --accent-weak: rgba(47,100,216,0.10);
        --pos: #1a7f4b;
        --neg: #c5303a;
        --notice: #9a6a17;
        --shadow: 0 1px 2px rgba(16,24,40,0.06), 0 10px 24px rgba(16,24,40,0.08);
      }
      html, body { background: var(--bg); color: var(--ink); }
      body {
        font-family: 'IBM Plex Sans', system-ui, -apple-system, Segoe UI, sans-serif;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
      }
      .font-terminal { font-family: 'JetBrains Mono', ui-monospace, monospace; font-variant-numeric: tabular-nums; }
      .font-cn { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
      .num { font-family: 'JetBrains Mono', ui-monospace, monospace; font-variant-numeric: tabular-nums; }
      .scene-enter { animation: fade-in-up 0.4s ease both; }
      .market-node { animation: node-pop 0.3s ease both; }
      .top-glow-line { display: none; }
      .pulse-dot { display: none; }
      .opening-curtain { display: none; }
      .market-chart-panel { position: relative; overflow: hidden; }
      .market-chart-panel::after { content: none; }
      .live-price-pulse { animation: none; }
      .chart-tension { animation: none; }
      .shine-button { position: relative; overflow: hidden; }
      .shine-button::before { content: none; }
      .handbook-new { box-shadow: 0 0 0 1px var(--accent), 0 0 0 4px var(--accent-weak); }
      .title-stage { position: relative; opacity: 0; animation: fade-in 0.6s ease 0.1s forwards; }
      .title-stage .title-char { display: inline-block; }
      .title-stage .title-shadow { display: none; }
      .title-stage .title-glow { color: var(--ink); }
      .title-stage.title-ready { opacity: 1; }
      .title-location { opacity: 0; animation: fade-in-down 0.6s ease 0.05s forwards; }
      .title-subtitle { opacity: 0; animation: fade-in 0.6s ease 0.3s forwards; }
      .title-footer { opacity: 0; animation: fade-in 0.6s ease 0.5s forwards; }
      .cursor {
        display: inline-block;
        width: 2px;
        height: 1.05em;
        margin-left: 2px;
        background: var(--accent);
        vertical-align: text-bottom;
        animation: blink 1s step-end infinite;
      }
      :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
      ::selection { background: var(--accent-weak); }
      @keyframes fade-in-down {
        from { opacity: 0; transform: translateY(-12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes node-pop {
        from { opacity: 0; transform: translateY(6px) scale(0.96); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
}

function PrimaryButton({ children, className = "", tone = "cyan", ...props }) {
  const tones = {
    cyan: "bg-[var(--accent-strong)] text-white hover:bg-[var(--accent)]",
    gold: "border border-[var(--notice)]/45 bg-[var(--notice)]/10 text-[var(--notice)] hover:bg-[var(--notice)]/16",
    red: "border border-[var(--neg)]/45 bg-[var(--neg)]/10 text-[var(--neg)] hover:bg-[var(--neg)]/16",
    ghost: "border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--ink)] hover:bg-[var(--surface-2)]",
  };

  return (
    <button
      type="button"
      className={cn(
        "rounded-md px-6 py-3 text-sm font-semibold tracking-[0.01em] transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40",
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
        "rounded-[10px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function TerminalHeader({ label, accent }) {
  return (
    <div className="font-terminal flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
      <span>{label}</span>
      {accent && <span className="normal-case text-[var(--accent)]">{accent}</span>}
    </div>
  );
}

function SideData({ currentDay }) {
  const side =
    currentDay === 4
      ? {
          leftStatus: "Theoretical Price",
          dayLabel: "Graduation Round",
          mode: "Live Quoting",
          topic: "Three-Client Pricing",
        }
      : currentDay === 3
      ? {
          leftStatus: "Barrier Level",
          dayLabel: "Day Three",
          mode: "Path",
          topic: "KNOCK-OUT",
        }
      : currentDay === 2
        ? {
            leftStatus: "Theoretical Price",
            dayLabel: "Day Two",
            mode: "Quoting",
            topic: "Binomial Tree",
          }
        : {
            leftStatus: "Fixed Path",
            dayLabel: "Day One",
            mode: "Teaching",
            topic: "CALL / PUT",
          };

  return (
    <>
      <div className="font-terminal fixed left-8 top-1/2 z-10 hidden -translate-y-1/2 text-sm leading-8 text-[var(--faint)] lg:block">
        <div className="text-[var(--muted)]">HSI</div>
        <div className="text-[var(--accent)]">21,500.00</div>
        <div className="text-[var(--pos)]">{side.leftStatus}</div>
        <div className="text-[var(--notice)]">{side.dayLabel}</div>
        <br />
        <div className="text-[var(--muted)]">Mode</div>
        <div className="text-[var(--accent)]">{side.mode}</div>
      </div>

      <div className="font-terminal fixed right-8 top-1/2 z-10 hidden -translate-y-1/2 text-right text-sm leading-8 text-[var(--faint)] lg:block">
        <div className="text-[var(--muted)]">Product</div>
        <div className="text-[var(--accent)]">
          {currentDay === 4
            ? "Vanilla / Barrier"
            : currentDay === 3
              ? "Barrier Option"
              : "Vanilla Option"}
        </div>
        <br />
        <div className="text-[var(--muted)]">Topic</div>
        <div className="text-[var(--accent)]">{side.topic}</div>
        <br />
        <div className="text-[var(--muted)]">Desk</div>
        <div className="text-[var(--accent)]">Central</div>
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
  profile,
  onOpenDashboard,
  onSignOut,
}) {
  const dayConfig = dayConfigs[currentDay] ?? day1Config;
  const stageMeta = stageConfig[stage] ?? { label: "Standby" };
  const [menuOpen, setMenuOpen] = useState(false);
  const accountRef = useRef(null);
  const displayName = profile?.name ?? "Guest Trader";
  const initials = initialsFromName(displayName);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointer = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handlePointer, { passive: true });
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] py-4 text-sm md:mt-5">
      <div className="font-terminal tracking-[0.16em] text-[var(--accent)]">
        Day {currentDay}: {dayConfig.title}
      </div>
      <div className="font-terminal text-[var(--muted)]">
        Time: <span className="text-[var(--ink)]">{stageMeta.label}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onGoBack}
          disabled={!canGoBack}
          className="font-terminal rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-4 py-2 text-xs font-bold tracking-[0.16em] text-[var(--accent)] transition duration-300 hover:bg-[var(--surface-2)] disabled:pointer-events-none disabled:opacity-35"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onOpenHandbook}
          className={cn(
            "font-terminal rounded-md border px-4 py-2 text-xs font-bold tracking-[0.16em] transition duration-300",
            handbookHasNew
              ? "handbook-new border-[#c9a44c]/70 bg-[#c9a44c]/15 text-[var(--notice)]"
              : "border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--accent)] hover:bg-[var(--surface-2)]",
          )}
        >
          Open Handbook {handbookHasNew ? "/ New" : ""}
        </button>

        <div className="relative" ref={accountRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Account menu"
            className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] py-1 pl-1 pr-2 transition duration-300 hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#5b8cff,#2e4a8f)] font-terminal text-xs font-black text-[#0b1018]">
              {initials}
            </span>
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className={cn(
                "h-3.5 w-3.5 text-[var(--muted)] transition-transform duration-200",
                menuOpen ? "rotate-180" : "",
              )}
            >
              <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {menuOpen && (
            <div
              role="menu"
              aria-label="Account"
              className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elev)] shadow-[0_18px_44px_rgba(0,0,0,0.55)]"
            >
              <div className="border-b border-[var(--border)] px-4 py-3">
                <div className="font-terminal text-sm font-bold text-[var(--ink)]">{displayName}</div>
                <div className="mt-0.5 text-[11px] text-[var(--muted)]">Local progress</div>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenDashboard?.();
                }}
                className="font-terminal block w-full px-4 py-2.5 text-left text-xs font-bold tracking-[0.12em] text-[var(--accent)] transition duration-200 hover:bg-[var(--accent-weak)]"
              >
                Dashboard
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onSignOut?.();
                }}
                className="font-terminal block w-full border-t border-[var(--border)] px-4 py-2.5 text-left text-xs font-bold tracking-[0.12em] text-[var(--neg)] transition duration-200 hover:bg-[var(--neg)]/[0.08]"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MentorPanel({ text, skipSignal }) {
  return (
    <TerminalCard className="h-full overflow-hidden">
      <TerminalHeader label="MENTOR PANEL / MARTIN" accent="Online" />
      <div className="p-5">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#5b8cff,#2e4a8f)] font-terminal text-2xl font-black text-[#0b1018] shadow-[var(--shadow)]">
            M
          </div>
          <div>
            <div className="font-terminal text-sm tracking-[0.18em] text-[var(--accent)]">
              Mentor MARTIN
            </div>
            <div className="mt-1 text-xs text-[var(--muted)]">New Trader Onboarding</div>
          </div>
        </div>

        <div className="min-h-36 rounded-md border-l-4 border-[#5b8cff] bg-[var(--surface-2)] p-4 text-base leading-8 text-[var(--ink)]">
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
  disclosureReady = false,
}) {
  const quoteEntered =
    selectedQuote !== "" && selectedQuote !== null && Number.isFinite(Number(selectedQuote));
  const day4IsJudge = day4Clients[day4ClientIndex]?.taskType === "judge";
  const day4IsLastClient = day4ClientIndex >= day4Clients.length - 1;
  const actionSets = {
    day1_welcome: (
      <PrimaryButton onClick={actions.startBriefing} className="px-10">
        Start Morning Meeting
      </PrimaryButton>
    ),
    day1_lesson_basics: (
      <PrimaryButton onClick={actions.toCallPutLesson} className="px-10">
        Continue: Call and Put
      </PrimaryButton>
    ),
    day1_intro: (
      <PrimaryButton onClick={actions.toPremiumLesson} className="px-10">
        Continue: Premium
      </PrimaryButton>
    ),
    day1_lesson_premium: (
      <PrimaryButton onClick={actions.toVanillaRuleLesson} className="px-10">
        Continue: Vanilla Option Rules
      </PrimaryButton>
    ),
    day1_lesson_vanilla_rule: (
      <PrimaryButton onClick={actions.finishLesson} className="px-10">
        Update Handbook
      </PrimaryButton>
    ),
    day1_handbook_updated: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.meetClient}>Meet the First Client</PrimaryButton>
      </>
    ),
    day1_client_arrival: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.toProductSelection}>
          Go to Product Selection
        </PrimaryButton>
      </>
    ),
    day1_product_selection: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmProduct} disabled={!selectedProduct}>
          Confirm Product
        </PrimaryButton>
      </>
    ),
    day1_risk_disclosure: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmDisclosure} disabled={!disclosureReady}>Confirm Disclosure</PrimaryButton>
      </>
    ),
    day1_market_run: (
      marketComplete ? (
        <PrimaryButton onClick={actions.viewReport} tone="gold">
          View Report
        </PrimaryButton>
      ) : null
    ),
    day1_report: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.finishDay}>Complete Day One</PrimaryButton>
      </>
    ),
    day1_complete: (
      <>
        <PrimaryButton tone="gold" onClick={actions.startDay2}>
          Enter Day Two: Pricing Desk
        </PrimaryButton>
        <PrimaryButton tone="ghost" onClick={actions.restartDay1}>
          Restart Day One
        </PrimaryButton>
      </>
    ),
    day2_intro: (
      <PrimaryButton onClick={actions.toDay2PricingAnchor} className="px-10">
        Start the Pricing Lesson
      </PrimaryButton>
    ),
    day2_lesson_pricing_anchor: (
      <PrimaryButton onClick={actions.toDay2TreePaths} className="px-10">
        Continue: Binomial Tree Paths
      </PrimaryButton>
    ),
    day2_lesson_tree_paths: (
      <PrimaryButton onClick={actions.toDay2BackwardPrice} className="px-10">
        Continue: Payoff and Backward Induction
      </PrimaryButton>
    ),
    day2_lesson_backward_price: (
      <PrimaryButton onClick={actions.finishDay2Intro} className="px-10">
        Update Handbook
      </PrimaryButton>
    ),
    day2_handbook_updated: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.meetDay2Client}>Meet the Client</PrimaryButton>
      </>
    ),
    day2_research_terminal: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.toDay2TreeExplainer}>Parameters Noted, Go to the Pricing Desk</PrimaryButton>
      </>
    ),
    day2_client_arrival: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.toDay2ProductReview}>
          Go to Product Confirmation
        </PrimaryButton>
      </>
    ),
    day2_product_review: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmProduct}>Confirm Product</PrimaryButton>
      </>
    ),
    day2_tree_explainer: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmQuote} disabled={!quoteEntered}>
          {quoteEntered ? "Continue to Risk Disclosure" : "Please Enter a Quote First"}
        </PrimaryButton>
      </>
    ),
    day2_quote_slider: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmQuote}>Confirm Quote</PrimaryButton>
      </>
    ),
    day2_risk_disclosure: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmDisclosure} disabled={!disclosureReady}>
          Confirm Risk Disclosure
        </PrimaryButton>
      </>
    ),
    day2_client_response: (
      <PrimaryButton onClick={actions.toDay2MarketRun}>View Market Settlement</PrimaryButton>
    ),
    day2_market_run: (
      marketComplete ? (
        <PrimaryButton onClick={actions.viewReport} tone="gold">
          View Report
        </PrimaryButton>
      ) : (
        <PrimaryButton disabled>Market Running…</PrimaryButton>
      )
    ),
    day2_report: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.finishDay2}>Complete Day Two</PrimaryButton>
      </>
    ),
    day2_complete: (
      <>
        <PrimaryButton tone="gold" onClick={actions.startDay3}>
          Enter Day Three: Barrier Options
        </PrimaryButton>
        <PrimaryButton tone="ghost" onClick={actions.restartDay2}>
          Restart Day Two
        </PrimaryButton>
      </>
    ),
    day3_intro: (
      <PrimaryButton onClick={actions.toDay3BarrierConcept} className="px-10">
        Start the Barrier Lesson
      </PrimaryButton>
    ),
    day3_lesson_barrier_concept: (
      <PrimaryButton onClick={actions.toDay3KnockOut} className="px-10">
        Continue: What Is Knock-Out
      </PrimaryButton>
    ),
    day3_lesson_knock_out: (
      <PrimaryButton onClick={actions.finishDay3Intro} className="px-10">
        Update Handbook
      </PrimaryButton>
    ),
    day3_research_terminal: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.toDay3CompareVanilla}>
          Parameters Noted, Continue to Pricing
        </PrimaryButton>
      </>
    ),
    day3_lesson_compare_vanilla: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmQuote} disabled={!quoteEntered}>
          {quoteEntered ? "Continue to Risk Disclosure" : "Please Enter a Quote First"}
        </PrimaryButton>
      </>
    ),
    day3_handbook_updated: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.meetDay3Client}>Meet the Client</PrimaryButton>
      </>
    ),
    day3_client_arrival: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.toDay3ProductSelection}>
          Go to Product Selection
        </PrimaryButton>
      </>
    ),
    day3_product_selection: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.toDay3ResearchTerminal}>
          Go to the Data Desk for Parameters
        </PrimaryButton>
      </>
    ),
    day3_risk_disclosure: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmDisclosure} disabled={!disclosureReady}>
          Confirm Risk Disclosure
        </PrimaryButton>
      </>
    ),
    day3_client_response: (
      <PrimaryButton onClick={actions.toDay3MarketRun}>View Market Settlement</PrimaryButton>
    ),
    day3_market_run: (
      marketComplete ? (
        <PrimaryButton onClick={actions.viewReport} tone="gold">
          View Report
        </PrimaryButton>
      ) : null
    ),
    day3_report: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.finishDay3}>Complete Day Three</PrimaryButton>
      </>
    ),
    day3_complete: (
      <>
        <PrimaryButton tone="gold" onClick={actions.startDay4}>
          Enter the Graduation Round: Three-Client Pricing
        </PrimaryButton>
        <PrimaryButton tone="ghost" onClick={actions.restartDay3}>
          Restart Day Three
        </PrimaryButton>
      </>
    ),
    day4_intro: (
      <PrimaryButton onClick={actions.beginDay4Clients} className="px-10">
        Start Meeting Clients
      </PrimaryButton>
    ),
    day4_client_arrival: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.toDay4Task}>
          {day4IsJudge ? "I've Read the Needs, Go Judge the Product" : "I've Read the Needs, Go Quote"}
        </PrimaryButton>
      </>
    ),
    day4_judge: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.confirmProduct} disabled={!selectedProduct}>
          Confirm Product, Go to Quoting
        </PrimaryButton>
      </>
    ),
    day4_pricing: (
      <>
        <PrimaryButton tone="ghost" onClick={actions.openHandbook}>
          Open Handbook
        </PrimaryButton>
        <PrimaryButton onClick={actions.submitDay4Quote} disabled={!quoteEntered}>
          {quoteEntered ? "Submit Quote" : "Please Enter a Quote First"}
        </PrimaryButton>
      </>
    ),
    day4_client_response: (
      <PrimaryButton onClick={actions.nextDay4Client} tone="gold">
        {day4IsLastClient ? "View Graduation Scorecard" : "Next Client"}
      </PrimaryButton>
    ),
    day4_scorecard: (
      <PrimaryButton onClick={actions.finishDay4} tone="gold" className="px-10">
        Complete Graduation
      </PrimaryButton>
    ),
    day4_complete: (
      <>
        <PrimaryButton tone="ghost" disabled>
          All Lessons Complete
        </PrimaryButton>
        <PrimaryButton tone="gold" onClick={actions.restartDay4}>
          Restart the Graduation Round
        </PrimaryButton>
      </>
    ),
  };

  return (
    <div className="mx-auto mb-5 flex w-full max-w-[1180px] flex-wrap items-center justify-end gap-3 border-t border-[var(--border)] pt-4">
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
      <div className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col border-l border-[var(--border)] bg-[var(--bg)]/95 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-2)] px-5 py-4">
          <div>
            <div className="font-terminal text-sm tracking-[0.2em] text-[var(--accent)]">
              Trader's Handbook
            </div>
            <div className="mt-1 text-xs text-[var(--muted)]">Martin's Stage Rulebook</div>
          </div>
          <PrimaryButton tone="ghost" onClick={onClose} className="px-4 py-2 text-xs">
            Close Handbook
          </PrimaryButton>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {entries.length === 0 ? (
            <div className="flex min-h-96 flex-col items-center justify-center text-center">
              <div className="font-terminal mb-4 text-3xl font-black tracking-[0.18em] text-[var(--faint)]">
                Empty
              </div>
              <p className="max-w-md text-sm leading-7 text-[var(--muted)]">
                No handbook content unlocked yet. First sit through Martin's morning-meeting lesson.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {entries.map((entry) => (
                <div key={entry.id} className="scene-enter">
                  <div className="mb-4 rounded-md border border-[#c9a44c]/25 bg-[#c9a44c]/[0.06] p-4">
                    <div className="font-terminal text-xs tracking-[0.18em] text-[var(--notice)]">
                      Unlocked
                    </div>
                    <h2 className="mt-2 text-2xl font-black text-[var(--ink)]">{entry.title}</h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {entry.sections.map((section) => (
                      <section
                        key={section.title}
                        className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4"
                      >
                        <h3 className="font-terminal mb-3 text-sm tracking-[0.16em] text-[var(--accent)]">
                          {section.title}
                        </h3>
                        <ul className="space-y-2 text-sm leading-6 text-[var(--ink)]">
                          {section.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-2">
                              <span className="text-[var(--notice)]">-</span>
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

function StartScreen({ onStart }) {
  const introText =
    "You are a new options trader at a Central investment bank during the 1997 Asian financial crisis. Over four days, your mentor Martin guides you from vanilla calls and puts to binomial pricing and barrier options, with a real client to advise at each step.";

  return (
    <div className="scene-enter relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      <div className="font-terminal mb-5 text-xs uppercase tracking-[0.26em] text-[var(--accent)]">
        Hong Kong · Central Options Desk
      </div>
      <h1 className="text-5xl font-bold tracking-tight text-[var(--ink)] md:text-6xl">
        Central Trader
      </h1>
      <div className="mt-4 text-sm font-medium uppercase tracking-[0.16em] text-[var(--notice)]">
        Chapter 1 · 1997 Asian Financial Crisis
      </div>
      <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--muted)]">{introText}</p>
      <div className="mt-10 flex flex-col items-center gap-3">
        <PrimaryButton onClick={onStart} className="px-12 py-3.5 text-base">
          Start the Simulator
        </PrimaryButton>
        <span className="text-xs text-[var(--faint)]">
          A four-day options course, from vanilla calls to barrier options. No finance background required.
        </span>
      </div>
      <div className="mt-16 font-terminal text-xs tracking-[0.14em] text-[var(--faint)]">
        <span className="text-[var(--accent)]">FIN 7870</span> · Digital Investfair ·{" "}
        <span className="text-[var(--accent)]">HSI Options</span> · HKEX
      </div>
    </div>
  );
}

// Sign in / create account screen. Only rendered when Supabase is configured and
// there is no active session. Themed to match StartScreen and the finance tokens.
function AuthScreen({ authError, setAuthError }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const emailRef = useRef(null);

  const isSignup = mode === "signup";

  // Focus the email field on mount for keyboard-first sign in.
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const switchMode = (next) => {
    if (next === mode) return;
    setMode(next);
    setAuthError("");
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setAuthError("");
    setNotice("");
    setSubmitting(true);
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) {
          setAuthError(error.message);
          return;
        }
        // If email confirmation is on, no session is returned yet; tell the
        // user to confirm. Otherwise the auth state listener takes over.
        if (data?.user && !data?.session) {
          setNotice("Account created. Check your email to confirm, then sign in.");
          setMode("signin");
          setPassword("");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setAuthError(error.message);
          return;
        }
      }
    } catch (err) {
      setAuthError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const hasError = Boolean(authError);
  const inputClass =
    "w-full rounded-md border border-[var(--border-strong)] bg-[var(--bg-elev)] px-3 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--faint)] outline-none transition-colors duration-200 focus:border-[var(--accent)]";
  const labelClass =
    "font-terminal mb-1.5 block text-xs uppercase tracking-[0.14em] text-[var(--muted)]";

  return (
    <div className="scene-enter relative z-10 mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-16">
      <div className="font-terminal mb-3 text-xs uppercase tracking-[0.26em] text-[var(--accent)]">
        Hong Kong · Central Options Desk
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-[var(--ink)]">Central Trader</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">Sign in to save your progress to the cloud.</p>

      <div className="mt-8 w-full rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
        {/* Segmented toggle: Sign In / Create Account */}
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] p-1">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            aria-pressed={!isSignup}
            className={cn(
              "rounded-md px-3 py-2 text-xs font-semibold tracking-[0.04em] transition-colors duration-200",
              !isSignup
                ? "bg-[var(--accent-strong)] text-white"
                : "text-[var(--muted)] hover:text-[var(--ink)]",
            )}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            aria-pressed={isSignup}
            className={cn(
              "rounded-md px-3 py-2 text-xs font-semibold tracking-[0.04em] transition-colors duration-200",
              isSignup
                ? "bg-[var(--accent-strong)] text-white"
                : "text-[var(--muted)] hover:text-[var(--ink)]",
            )}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {isSignup && (
            <div className="mb-4">
              <label htmlFor="auth-name" className={labelClass}>
                Name
              </label>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="auth-email" className={labelClass}>
              Email
            </label>
            <input
              id="auth-email"
              ref={emailRef}
              type="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={hasError}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div className="mb-5">
            <label htmlFor="auth-password" className={labelClass}>
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={hasError}
              placeholder="Your password"
              className={inputClass}
            />
          </div>

          <div aria-live="polite" className="min-h-[1.25rem]">
            {hasError && <p className="text-sm font-medium text-[var(--neg)]">{authError}</p>}
            {!hasError && notice && (
              <p className="text-sm font-medium text-[var(--pos)]">{notice}</p>
            )}
          </div>

          <PrimaryButton type="submit" disabled={submitting} className="mt-3 w-full">
            {submitting
              ? isSignup
                ? "Creating account..."
                : "Signing in..."
              : isSignup
                ? "Create Account"
                : "Sign In"}
          </PrimaryButton>
        </form>
      </div>

      <div className="mt-8 font-terminal text-xs tracking-[0.14em] text-[var(--faint)]">
        <span className="text-[var(--accent)]">FIN 7870</span> · Digital Investfair · HKEX
      </div>
    </div>
  );
}

function WelcomePanel() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="New Hire Check-in / Desk" accent="First Day on the Job" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-center justify-center rounded-lg border border-[#c9a44c]/20 bg-[#c9a44c]/[0.05] p-6 text-center">
          <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-[linear-gradient(135deg,#5b8cff,#2e4a8f)] font-terminal text-5xl font-black text-[#0b1018] shadow-[var(--shadow)]">
            M
          </div>
          <div className="font-terminal text-sm tracking-[0.18em] text-[var(--accent)]">MENTOR MARTIN</div>
          <div className="mt-3 text-2xl font-black text-[var(--ink)]">“Welcome aboard, rookie.”</div>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            You don't need to understand the financial markets right away. Today you only learn three things: direction, premium, and suitability.
          </p>
        </div>

        <div className="space-y-4">
          {[
            ["Your Role", "A new trader on the options desk, responsible for reading client needs and recommending suitable products."],
            ["Today's Goal", "Don't touch complex pricing yet; just build up the intuition for vanilla options: Call / Put / Premium."],
            ["Martin's Rule", "Open the handbook when you're unsure. A real trader doesn't memorize by rote; they look up the rules and ask questions."],
          ].map(([label, text]) => (
            <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
              <div className="font-terminal mb-2 text-xs tracking-[0.16em] text-[var(--accent)]">{label}</div>
              <div className="text-base leading-8 text-[var(--ink)]">{text}</div>
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
      <TerminalHeader label="Lesson 1 / What Is an Option" accent="Intuition First, No Formulas" />
      <div className="space-y-5 p-6">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--accent)]">
            Core Analogy: A Future-Choice Voucher
          </div>
          <p className="text-lg leading-9 text-[var(--ink)]">
            An option isn't a stock, nor a “guess up or down” button. Think of it as a
            <span className="font-bold text-[var(--notice)]">future-choice voucher</span>:
            you pay a small sum today, and if things turn out in your favor, you use the voucher; if they don't, you can choose not to.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Buyer", "Pays to acquire the right to choose. Uses it if the future is favorable, skips it if not."],
            ["Seller", "Collects money upfront, but may have to honor a commitment later. Today you mainly view it from the buyer's side."],
            ["Premium", "The entry-ticket price the buyer pays. If they're wrong, this money may be lost entirely."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
              <div className="mb-3 text-xl font-black text-[var(--accent)]">{title}</div>
              <div className="text-sm leading-7 text-[var(--ink)]">{body}</div>
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-[#c9a44c] bg-[#c9a44c]/[0.06] p-4 text-sm leading-7 text-[var(--notice)]">
          Martin's mnemonic: an option buyer is buying a “right,” not a “guarantee of profit.” Keep this in mind and your later client decisions won't go astray.
        </div>
      </div>
    </TerminalCard>
  );
}

function CallPutVisualExample() {
  const points = [80, 90, 100, 110, 120];

  return (
    <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
      <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--accent)]">
        Chart Example / How the Expiry Price Affects Direction
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4">
          <svg viewBox="0 0 620 230" className="h-auto w-full" role="img" aria-label="Call and Put expiry-direction chart">
            <defs>
              <linearGradient id="callZone" x1="0" x2="1">
                <stop offset="0%" stopColor="rgba(201,164,76,0)" />
                <stop offset="100%" stopColor="rgba(201,164,76,0.2)" />
              </linearGradient>
              <linearGradient id="putZone" x1="1" x2="0">
                <stop offset="0%" stopColor="rgba(91,140,255,0)" />
                <stop offset="100%" stopColor="rgba(91,140,255,0.2)" />
              </linearGradient>
            </defs>

            <rect x="35" y="36" width="260" height="118" rx="8" fill="url(#putZone)" stroke="rgba(91,140,255,0.22)" />
            <rect x="325" y="36" width="260" height="118" rx="8" fill="url(#callZone)" stroke="rgba(201,164,76,0.22)" />

            <line x1="55" y1="132" x2="565" y2="132" stroke="rgba(71,85,105,0.45)" strokeWidth="2" />
            <line x1="310" y1="55" x2="310" y2="174" stroke="#94a3b8" strokeDasharray="5 7" />
            <text x="310" y="44" textAnchor="middle" className="fill-[#0f172a] text-[13px]">
              Strike 100
            </text>

            {points.map((point) => {
              const x = 55 + ((point - 80) / 40) * 510;
              return (
                <g key={point}>
                  <line x1={x} x2={x} y1="126" y2="138" stroke="rgba(71,85,105,0.65)" />
                  <text x={x} y="160" textAnchor="middle" className="fill-[#56627a] text-[12px]">
                    {point}
                  </text>
                </g>
              );
            })}

            <path
              d="M 55 87 L 310 132 L 565 132"
              fill="none"
              stroke="#5b8cff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 55 132 L 310 132 L 565 87"
              fill="none"
              stroke="#c9a44c"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <text x="118" y="74" className="fill-[#5b8cff] text-[16px] font-bold">
              Put Wins
            </text>
            <text x="420" y="74" className="fill-[#c9a44c] text-[16px] font-bold">
              Call Wins
            </text>
            <text x="310" y="204" textAnchor="middle" className="fill-[#56627a] text-[13px]">
              Underlying expiry price, low to high →
            </text>
          </svg>
        </div>

        <div className="grid gap-3 text-sm leading-7 text-[var(--ink)]">
          <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="font-terminal mb-2 text-xs tracking-[0.16em] text-[var(--accent)]">
              If the Expiry Price Is Below 100
            </div>
            The put has value, because the client holds the right to “sell at 100”; the lower the market, the more useful that right to sell.
          </div>
          <div className="rounded-md border border-[#c9a44c]/20 bg-[#c9a44c]/[0.06] p-4">
            <div className="font-terminal mb-2 text-xs tracking-[0.16em] text-[var(--notice)]">
              If the Expiry Price Is Above 100
            </div>
            The call has value, because the client holds the right to “buy at 100”; the higher the market, the more useful that right to buy.
          </div>
          <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4">
            For now, don't worry about how much it's worth; just remember the direction: Put on the left, Call on the right.
          </div>
        </div>
      </div>
    </div>
  );
}

function IntroPanel() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Lesson 1 / Call and Put" accent="Reading Direction" />
      <div className="p-6">
        <div className="font-terminal mb-4 text-xs tracking-[0.32em] text-[var(--accent)]">
          Read the Client's Direction First, Then Talk Product
        </div>
        <h1 className="bg-[linear-gradient(90deg,#5b8cff,#c9a44c)] bg-clip-text text-4xl font-black tracking-[0.08em] text-transparent md:text-6xl">
          CALL / PUT
        </h1>
        <div className="font-terminal mt-3 text-xl tracking-[0.22em] text-[var(--notice)]">
          Bullish and bearish: the first two words a desk hears
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {day1Config.introCards.map((card) => (
            <div
              key={card.id}
              className={cn(
                "rounded-lg border p-5 shadow-[var(--shadow)]",
                card.tone === "gold"
                  ? "border-[#c9a44c]/30 bg-[#c9a44c]/[0.06]"
                  : "border-[var(--border-strong)] bg-[var(--surface-2)]",
              )}
            >
              <div
                className={cn(
                  "font-terminal mb-3 text-xs tracking-[0.18em]",
                  card.tone === "gold" ? "text-[var(--notice)]" : "text-[var(--accent)]",
                )}
              >
                {card.code}
              </div>
              <div className="mb-4 text-2xl font-black text-[var(--ink)]">{card.title}</div>
              <ul className="space-y-3 text-sm leading-7 text-[var(--ink)]">
                {card.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className={card.tone === "gold" ? "text-[var(--notice)]" : "text-[var(--accent)]"}>
                      -
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-md border-l-4 border-[#5b8cff] bg-[var(--surface-2)] p-4 text-sm leading-7 text-[var(--ink)]">
          Stage one doesn't get into pricing yet; it just builds the desk's most important intuition: a bullish client points to Call, a bearish client points to Put, and the buyer pays a premium for that right.
        </div>

        <CallPutVisualExample />
      </div>
    </TerminalCard>
  );
}

function PremiumLessonPanel() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Lesson 2 / Premium" accent="The Buyer's Biggest Mental Account" />
      <div className="grid gap-5 p-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-[#c9a44c]/25 bg-[#c9a44c]/[0.06] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--notice)]">
            PREMIUM
          </div>
          <h2 className="mb-4 text-2xl font-black text-[var(--ink)]">Pay Upfront to Buy a Future Choice</h2>
          <p className="text-base leading-8 text-[var(--ink)]">
            When a client buys a vanilla option, they don't get the opportunity for free; they pay a
            <span className="font-bold text-[var(--notice)]">premium</span> first. It's like a movie ticket:
            buy the ticket and you get to go in; whether the movie turns out good or not, there are no refunds.
          </p>
        </div>

        <div className="space-y-4">
          {[
            ["Market Direction Right", "The option may gain value, but it must first cover the premium before the client truly profits."],
            ["Market Direction Wrong", "The option may expire worthless, and the client loses the premium paid."],
            ["Max-Loss Intuition", "A vanilla option buyer usually won't lose more than the premium, but that doesn't make the product a sure win."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal mb-2 text-xs tracking-[0.16em] text-[var(--accent)]">
                {title}
              </div>
              <div className="text-sm leading-7 text-[var(--ink)]">{body}</div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="font-terminal mb-4 text-xs tracking-[0.18em] text-[var(--accent)]">
            A Small Example
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="text-sm text-[var(--muted)]">Client Pays</div>
              <div className="mt-2 text-2xl font-black text-[var(--notice)]">186-point premium</div>
            </div>
            <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="text-sm text-[var(--muted)]">In Return For</div>
              <div className="mt-2 text-2xl font-black text-[var(--accent)]">Future upside opportunity</div>
            </div>
            <div className="rounded-md border border-red-500/20 bg-red-500/[0.05] p-4">
              <div className="text-sm text-[var(--muted)]">Worst Case</div>
              <div className="mt-2 text-2xl font-black text-[var(--neg)]">Lose 186 points</div>
            </div>
          </div>
        </div>
      </div>
    </TerminalCard>
  );
}

function VanillaRulePanel() {
  const examples = [
    ["Dips First Along the Way", "21,500 → 21,100 → 22,400", "As long as the final expiry is above the strike, a vanilla call can still have value."],
    ["Rises First Along the Way", "21,500 → 22,600 → 21,900", "If the final expiry is below the strike, a vanilla call may have no value."],
    ["The Key Difference", "Vanilla option ≠ barrier option", "A vanilla option doesn't auto-knock-out just because it touches some price along the way."],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Lesson 3 / Vanilla Option Rules" accent="Focus on the Expiry Price" />
      <div className="space-y-5 p-6">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--accent)]">
            VANILLA OPTION
          </div>
          <p className="text-lg leading-9 text-[var(--ink)]">
            The word “vanilla” matters. A vanilla option depends mainly on the
            <span className="font-bold text-[var(--notice)]">final expiry price</span>.
            Market swings along the way don't make it disappear. Whether the client profits in the end depends on whether the expiry payoff covers the premium.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {examples.map(([title, path, note]) => (
            <div key={title} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
              <div className="font-terminal mb-2 text-xs tracking-[0.16em] text-[var(--accent)]">
                {title}
              </div>
              <div className="mb-3 text-lg font-black text-[var(--notice)]">{path}</div>
              <div className="text-sm leading-7 text-[var(--ink)]">{note}</div>
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-[#c9a44c] bg-[#c9a44c]/[0.06] p-4 text-sm leading-7 text-[var(--notice)]">
          Don't touch barrier options, knock-outs, binomial trees, or complex pricing today. You just need to read the client's direction and know that a vanilla option buyer's maximum loss is usually the premium.
        </div>
      </div>
    </TerminalCard>
  );
}

function HandbookUpdatedPanel() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="System Message" accent="New Handbook Page Added" />
      <div className="flex min-h-[430px] flex-col items-center justify-center p-6 text-center">
        <div className="font-terminal mb-4 text-sm tracking-[0.32em] text-[var(--accent)]">
          Handbook Updated
        </div>
        <div className="bg-[linear-gradient(90deg,#5b8cff,#c9a44c)] bg-clip-text text-4xl font-black tracking-[0.1em] text-transparent md:text-5xl">
          Vanilla Option Basics
        </div>
        <p className="mt-8 max-w-2xl text-base leading-8 text-[var(--ink)]">
          The handbook has only unlocked the most basic vanilla-option page for now. As you meet clients and reach risk disclosure later, Martin will keep adding new rules; he won't dump everything on you at once.
        </p>
      </div>
    </TerminalCard>
  );
}

function ClientArrivalPanel() {
  const client = day1Config.clientProfile;
  const profileRows = [
    ["Name", client.name],
    ["Client Type", client.type],
    ["Market View", client.marketView],
    ["Risk Tolerance", client.riskTolerance],
    ["Goal", client.goal],
    ["Budget", client.budget],
    ["Experience", client.experience],
  ];

  return (
    <div className="scene-enter grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <TerminalCard className="overflow-hidden">
        <TerminalHeader label="Client Profile" accent="Retail Order Flow" />
        <div className="p-5">
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,#c9a44c,#b9863a)] font-terminal text-3xl font-black text-[#0b1018] shadow-[var(--shadow)]">
            L
          </div>
          <div className="mb-5 text-center text-2xl font-bold text-[var(--notice)]">{client.name}</div>
          <div className="space-y-3">
            {profileRows.map(([label, value]) => (
              <div
                key={label}
                className="grid gap-2 border-b border-[var(--border)] pb-2 text-sm md:grid-cols-[140px_1fr]"
              >
                <div className="font-terminal text-xs tracking-[0.14em] text-[var(--muted)]">
                  {label}
                </div>
                <div className="text-[var(--ink)]">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </TerminalCard>

      <TerminalCard className="overflow-hidden">
        <TerminalHeader label="Client Dialogue" accent="Needs Log" />
        <div className="space-y-4 p-5">
          {client.dialogue.map((line) => (
            <div
              key={line}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 text-lg leading-8 text-[var(--ink)]"
            >
              <span className="font-terminal mr-2 text-xs text-[var(--notice)]">Ms. Li</span>
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
  title = "Product Selection Desk",
  accent = "Select a Product",
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
                    ? "border-[#c9a44c]/70 bg-[#c9a44c]/[0.08] shadow-[var(--shadow)]"
                    : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[#5b8cff]/45 hover:bg-[var(--surface-2)]",
                  product.locked && "border-slate-700 bg-slate-900/35 opacity-70",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-terminal text-xs tracking-[0.16em] text-[var(--muted)]">
                      {product.status}
                    </div>
                    <div
                      className={cn(
                        "mt-2 text-xl font-black",
                        product.locked
                          ? "text-[var(--muted)]"
                          : selected
                            ? "text-[var(--notice)]"
                            : "text-[var(--accent)]",
                      )}
                    >
                      {product.name}
                    </div>
                    <div className="font-terminal mt-1 text-xs text-[var(--muted)]">{product.term}</div>
                  </div>
                  {selected && (
                    <div className="font-terminal rounded border border-[#c9a44c]/40 px-2 py-1 text-xs text-[var(--notice)]">
                      Selected
                    </div>
                  )}
                </div>

                <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--ink)]">
                  {product.description.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[var(--notice)]">-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {product.locked && (
                  <div className="mt-4 rounded border border-red-500/25 bg-red-500/[0.06] p-3 text-xs leading-5 text-[var(--neg)]">
                    Locked: Martin hasn't taught this product yet.
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
                ? "border-green-400 bg-green-400/[0.06] text-[var(--pos)]"
                : "border-[#c9a44c] bg-[#c9a44c]/[0.06] text-[var(--notice)]",
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
  instruction = "Before confirming the trade, select the risks you must explain to Ms. Li.",
}) {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Risk Disclosure" accent="Select What Must Be Explained" />
      <div className="p-5">
        <h2 className="mb-2 text-2xl font-black text-[var(--ink)]">Risk Disclosure</h2>
        <p className="mb-5 text-sm leading-7 text-[var(--muted)]">
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
                    ? "border-[#5b8cff]/60 bg-[var(--surface-2)]"
                    : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[#5b8cff]/35",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleDisclosure(item.id)}
                  className="mt-1 h-4 w-4 accent-[#5b8cff]"
                />
                <div>
                  <div className="font-terminal mb-1 text-xs tracking-[0.16em] text-[var(--muted)]">
                    Disclosure {index + 1}
                  </div>
                  <div className="text-sm leading-7 text-[var(--ink)]">{item.text}</div>
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
                ? "border-green-400 bg-green-400/[0.06] text-[var(--pos)]"
                : disclosureFeedback.tone === "danger"
                  ? "border-red-500 bg-red-500/[0.06] text-[var(--neg)]"
                  : "border-[#c9a44c] bg-[#c9a44c]/[0.06] text-[var(--notice)]",
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
    day1Config.products.find((product) => product.id === selectedProduct)?.name ?? "No Product Selected";
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
      <TerminalHeader label="Market Path" accent={finalShown ? "Closing Price Locked" : "Market Running Automatically"} />
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-5">
          {[
            ["Underlying", market.underlying],
            ["Open", formatPoints(market.spot)],
            ["Strike", formatPoints(market.strike)],
            ["Premium", `${market.premium} pts`],
            ["Maturity", market.maturity],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs tracking-[0.14em] text-[var(--muted)]">
                {label}
              </div>
              <div className="mt-2 text-lg font-bold text-[var(--ink)]">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-lg border border-[#c9a44c]/20 bg-[#c9a44c]/[0.05] p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-[var(--notice)]">
              Selected Product
            </div>
            <div className="mt-2 text-xl font-black text-[var(--ink)]">{selectedProductName}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs text-[var(--muted)]">Live Price</div>
              <div className="live-price-pulse mt-2 text-3xl font-black text-[var(--accent)]">
                {formatPoints(latestPrice)}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs text-[var(--muted)]">Tick Change</div>
              <div
                className={cn(
                  "mt-2 text-2xl font-black",
                  tickChange >= 0 ? "text-[var(--pos)]" : "text-[var(--neg)]",
                )}
              >
                {tickChange >= 0 ? "+" : ""}
                {tickChange}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs text-[var(--muted)]">Call Live Net</div>
              <div
                className={cn(
                  "mt-2 text-2xl font-black",
                  liveNet >= 0 ? "text-[var(--pos)]" : "text-[var(--neg)]",
                )}
              >
                {liveNet >= 0 ? "+" : ""}
                {liveNet}
              </div>
            </div>
          </div>
        </div>

        <div className="market-chart-panel mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/85 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-terminal text-sm tracking-[0.18em] text-[var(--accent)]">
                LIVE HSI PATH
              </div>
              <div className="mt-1 text-xs text-[var(--muted)]">
                The price ticks automatically; the endpoint is used for vanilla-option expiry settlement
              </div>
            </div>
            <div
              className={cn(
                "font-terminal rounded border px-3 py-1 text-xs tracking-[0.16em]",
                finalShown
                  ? "border-green-400/35 bg-green-400/[0.08] text-[var(--pos)]"
                  : "border-[#c9a44c]/35 bg-[#c9a44c]/[0.08] text-[var(--notice)]",
              )}
            >
              {finalShown ? "MARKET CLOSED" : "VOLATILITY LIVE"}
            </div>
          </div>

          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="relative z-10 w-full">
            <defs>
              <linearGradient id="marketArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(91,140,255,0.28)" />
                <stop offset="100%" stopColor="rgba(91,140,255,0)" />
              </linearGradient>
              <filter id="marketGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#5b8cff" />
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
                  stroke={tick === market.strike ? "#c9a44c" : "rgba(148,163,184,0.14)"}
                  strokeDasharray={tick === market.strike ? "6 6" : "2 8"}
                />
                <text
                  x="44"
                  y={chart.yScale(tick) + 4}
                  textAnchor="end"
                  className={tick === market.strike ? "fill-[#c9a44c] text-[12px]" : "fill-slate-500 text-[12px]"}
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
              stroke="rgba(71,85,105,0.28)"
            />

            {areaPoints && <polygon points={areaPoints} fill="url(#marketArea)" />}
            {activeLine && activePrices.length > 1 && (
              <polyline
                points={activeLine}
                fill="none"
                stroke="#5b8cff"
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
                fill={price >= market.strike ? "#c9a44c" : "#5b8cff"}
                opacity={index === activePrices.length - 1 ? 1 : 0.65}
              />
            ))}

            <circle cx={latestX} cy={latestY} r="13" fill="none" stroke="#5b8cff" strokeWidth="2" opacity="0.35">
              <animate attributeName="r" values="9;18;9" dur="0.9s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.75;0.1;0.75" dur="0.9s" repeatCount="indefinite" />
            </circle>
            <text x={latestX + 12} y={latestY - 12} className="fill-[#5b8cff] text-[13px] font-bold">
              {formatPoints(latestPrice)}
            </text>
            <text x={chart.xScale(chartPath.length - 1)} y={chart.height - 12} textAnchor="end" className="fill-slate-500 text-[12px]">
              Progress {Math.round(progress)}%
            </text>
          </svg>
        </div>

        {finalShown ? (
          <div className="scene-enter mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs text-[var(--muted)]">Final Price</div>
              <div className="mt-2 text-3xl font-black text-[var(--accent)]">
                {formatPoints(finalPrice)}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs text-[var(--muted)]">Call Expiry Payoff</div>
              <div className="mt-2 text-lg font-bold text-[var(--ink)]">
                max(22,400 - 22,000, 0) = <span className="text-[var(--accent)]">{payoff}</span>
              </div>
            </div>
            <div className="rounded-lg border border-green-400/20 bg-green-400/[0.05] p-4">
              <div className="font-terminal text-xs text-[var(--muted)]">Net P&L</div>
              <div className="mt-2 text-2xl font-black text-[var(--pos)]">
                {payoff} - {market.premium} = +{netPnl}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-md border-l-4 border-[#c9a44c] bg-[#c9a44c]/[0.06] p-4 text-sm leading-7 text-[var(--notice)]">
            The market is playing out automatically: the price may dip first, snap back, then break out. Don't be scared by the swings along the way; a vanilla option ultimately depends on the expiry price.
          </div>
        )}
      </div>
    </TerminalCard>
  );
}

function ScoreBadge({ score }) {
  const tone =
    score === "A"
      ? "border-green-400/40 bg-green-400/[0.08] text-[var(--pos)]"
      : score === "B" || score === "B-"
        ? "border-[#c9a44c]/40 bg-[#c9a44c]/[0.08] text-[var(--notice)]"
        : score === "C"
          ? "border-orange-400/40 bg-orange-400/[0.08] text-orange-300"
          : "border-red-500/40 bg-red-500/[0.08] text-[var(--neg)]";

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
        <div className="text-[var(--muted)]">The report is waiting for the market path to finish running.</div>
      </TerminalCard>
    );
  }

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="End-of-Day Report" accent="Day One Pending Settlement" />
      <div className="space-y-5 p-5">
        <div>
          <h2 className="text-3xl font-black text-[var(--ink)]">End-of-Day Report</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            The Hang Seng Index rose from 21,500 to 22,400.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-[var(--muted)]">
              Product
            </div>
            <div className="mt-2 text-2xl font-black text-[var(--accent)]">{score.productName}</div>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-[var(--muted)]">
              Outcome
            </div>
            <div className="mt-2 text-base leading-7 text-[var(--ink)]">{score.outcome}</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Payoff", score.payoff],
            ["Premium", score.premium],
            ["Client P&L", score.clientPnl],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[var(--muted)]">
                {label}
              </div>
              <div className="mt-2 text-xl font-black text-[var(--ink)]">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Suitability", score.suitability],
            ["Risk Disclosure", score.riskDisclosure],
            ["Client Outcome", score.clientOutcome],
            ["Overall", score.overall],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4"
            >
              <span className="font-terminal text-xs text-[var(--muted)]">{label}</span>
              <ScoreBadge score={value} />
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-[#c9a44c] bg-[#c9a44c]/[0.06] p-4 text-base leading-8 text-[var(--notice)]">
          {score.martinComment}
        </div>
      </div>
    </TerminalCard>
  );
}

function CompletePanel() {
  const summary = [
    "A call expresses a bullish view.",
    "A put expresses a bearish view.",
    "The premium is the cost the buyer pays to acquire the option right.",
    "A vanilla option buyer's maximum loss is usually the premium.",
    "Suitability matters just as much as the market outcome.",
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Day One Complete" accent="Training Record Saved" />
      <div className="flex min-h-[520px] flex-col items-center justify-center p-6 text-center">
        <div className="bg-[linear-gradient(90deg,#5b8cff,#c9a44c)] bg-clip-text text-5xl font-black tracking-[0.12em] text-transparent md:text-6xl">
          Day One Complete
        </div>
        <div className="mt-8 grid w-full max-w-2xl gap-3 text-left">
          {summary.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm leading-7 text-[var(--ink)]"
            >
              <span className="font-terminal mr-2 text-[var(--accent)]">Rule</span>
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
    "Yesterday you learned what a vanilla option is.",
    "Today we tackle a more practical question: where does the option price actually come from?",
    "A trader can't just quote clients off the cuff. We need a model to estimate what the product is worth right now.",
    "One simple pricing model is the binomial tree. It breaks the future into possible up and down paths, then works backward from the future to today's price.",
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Day Two / Pricing Desk" accent="A Quote Isn't a Gut Call" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-center justify-center rounded-lg border border-[#c9a44c]/20 bg-[#c9a44c]/[0.05] p-6 text-center">
          <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-[linear-gradient(135deg,#c9a44c,#5b8cff)] font-terminal text-5xl font-black text-[#0b1018] shadow-[var(--shadow)]">
            M
          </div>
          <div className="font-terminal text-sm tracking-[0.18em] text-[var(--accent)]">MARTIN'S MORNING MEETING</div>
          <div className="mt-3 text-2xl font-black text-[var(--ink)]">“Today we learn pricing discipline.”</div>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Day two doesn't test new products; it tests whether you can put model price, client acceptance, and desk profit on the same table.
          </p>
        </div>

        <div className="space-y-3">
          {lines.map((line, index) => (
            <div key={line} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal mb-2 text-xs tracking-[0.18em] text-[var(--accent)]">
                MARTIN / {index + 1}
              </div>
              <div className="text-base leading-8 text-[var(--ink)]">{line}</div>
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
      label: "Quote Too Low",
      quote: "120 pts",
      note: `The client is happy, of course, but if the model says the product is worth ${theoreticalPrice} points, the desk is effectively selling risk at a cheap price.`,
      tone: "danger",
    },
    {
      label: "Close to Theoretical",
      quote: "200 pts",
      note: `Anchor on the theoretical price of ${theoreticalPrice} points, add a little profit margin, and both client and desk find it easier to accept.`,
      tone: "good",
    },
    {
      label: "Quote Too High",
      quote: "280 pts",
      note: "The desk profit looks fat, but a professional client will think it unfair and may well reject the trade outright.",
      tone: "warn",
    },
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Lesson 1 / Why We Price" accent="The Theoretical Price Is the Quote Anchor" />
      <div className="space-y-6 p-6">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--accent)]">
            Desk Intuition
          </div>
          <h2 className="text-3xl font-black text-[var(--ink)]">A Premium Isn't Just a Number You Pull Out of Thin Air</h2>
          <p className="mt-4 text-base leading-8 text-[var(--ink)]">
            A client buying an option pays a premium. As the trader selling them this right, you must first estimate:
            roughly what is this right worth today? That estimate is the theoretical price.
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
                    : "border-[#c9a44c]/30 bg-[#c9a44c]/[0.07]",
              )}
            >
              <div className="font-terminal text-xs tracking-[0.16em] text-[var(--muted)]">
                {item.label}
              </div>
              <div className="mt-3 text-3xl font-black text-[var(--ink)]">{item.quote}</div>
              <p className="mt-4 text-sm leading-7 text-[var(--ink)]">{item.note}</p>
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-[#c9a44c] bg-[#c9a44c]/[0.06] p-4 text-base leading-8 text-[var(--notice)]">
          For now, treat {theoreticalPrice} points as the theoretical price the model computed. Your job isn't to memorize this number, but to understand: the quote should be adjusted up or down around it.
        </div>
      </div>
    </TerminalCard>
  );
}

function Day2TreePathsLessonPanel() {
  const steps = [
    ["Today", "21,500", "This is the current Hang Seng Index price."],
    ["Step 1 Up", "22,069", "If the market rises 2.65%, the price moves to the upper node."],
    ["Step 1 Down", "20,946", "If the market falls 2.58%, the price moves to the lower node."],
    ["Step 2 Recombine", "Three middle nodes", "Up-then-down and down-then-up return to the same price, so they can be merged in the display."],
    ["Step 3 Expiry", "Four terminal nodes", "The final layer is the expiry price; we'll compute the option payoff directly at these nodes."],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Lesson 2 / Binomial Tree Paths" accent="Break the Future into Branches" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="font-terminal mb-5 text-xs tracking-[0.18em] text-[var(--accent)]">
            Path Diagram
          </div>
          <div className="space-y-4">
            <div className="mx-auto w-44 rounded-lg border border-[#5b8cff]/50 bg-[var(--surface-2)] p-4 text-center">
              <div className="font-terminal text-xs text-[var(--muted)]">Today</div>
              <div className="text-2xl font-black text-[var(--accent)]">21,500</div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-lg border border-green-400/35 bg-green-400/[0.08] p-4 text-center">
                <div className="font-terminal text-xs text-[var(--pos)]">Up 2.65%</div>
                <div className="mt-2 text-2xl font-black text-[var(--ink)]">22,069</div>
              </div>
              <div className="rounded-lg border border-red-500/35 bg-red-500/[0.08] p-4 text-center">
                <div className="font-terminal text-xs text-[var(--neg)]">Down 2.58%</div>
                <div className="mt-2 text-2xl font-black text-[var(--ink)]">20,946</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {["22,653", "21,500", "20,405"].map((price, index) => (
                <div key={`${price}-${index}`} className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3">
                  <div className="font-terminal text-[10px] text-[var(--muted)]">Step 2</div>
                  <div className="mt-1 text-lg font-black text-[var(--ink)]">{price}</div>
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
                      ? "border-[#c9a44c]/35 bg-[#c9a44c]/[0.08]"
                      : "border-[var(--border)] bg-[var(--surface-2)]",
                  )}
                >
                  <div className="font-terminal text-[10px] text-[var(--muted)]">Expiry</div>
                  <div className="mt-1 text-lg font-black text-[var(--ink)]">{price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-[#c9a44c]/25 bg-[#c9a44c]/[0.06] p-5">
            <h2 className="text-2xl font-black text-[var(--ink)]">A Binomial Tree Is Not a Crystal Ball</h2>
            <p className="mt-4 text-base leading-8 text-[var(--ink)]">
              It doesn't say “the market will definitely rise” or “the market will definitely fall.” It just maps out the possible future routes, so the trader can check, route by route, what the option might be worth.
            </p>
          </div>
          {steps.map(([label, value, note]) => (
            <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[var(--accent)]">{label}</div>
              <div className="mt-2 text-2xl font-black text-[var(--notice)]">{value}</div>
              <div className="mt-2 text-sm leading-7 text-[var(--ink)]">{note}</div>
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
      <TerminalHeader label="Lesson 3 / Payoff and Backward Induction" accent="Compute the Future First, Then Return to Today" />
      <div className="space-y-6 p-6">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--accent)]">
            Vanilla Call Formula
          </div>
          <div className="text-3xl font-black text-[var(--ink)]">
            Payoff = max(final price - strike, 0)
          </div>
          <p className="mt-4 text-base leading-8 text-[var(--ink)]">
            A call option only has value when the final price is above the strike. Below the strike, the buyer won't pay a higher price to buy, so the expiry payoff is 0.
          </p>
        </div>

        <BinomialTreeVisual />

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Final Layer", "First look at all the expiry nodes and compute the payoff for each path."],
            ["Work Backward", "Discount the possible future payoffs back to the previous layer, then keep stepping back toward today."],
            ["Today's Price", `After the teaching simplification, the model gives today's theoretical price: ${day2Config.quoteRules.theoreticalPrice} points.`],
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-[#c9a44c]/20 bg-[#c9a44c]/[0.05] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[var(--notice)]">{title}</div>
              <p className="mt-3 text-sm leading-7 text-[var(--ink)]">{text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-[#5b8cff] bg-[var(--surface-2)] p-4 text-base leading-8 text-[var(--ink)]">
          Don't rush to digest the full pricing formula today. Just follow the tree: the price can go up or down, each path settles at expiry, then you step it back to now, and you get a quote reference.
        </div>
      </div>
    </TerminalCard>
  );
}

function Day2HandbookUpdatedPanel() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="System Notice" accent="New Handbook Page Added" />
      <div className="flex min-h-[430px] flex-col items-center justify-center p-6 text-center">
        <div className="font-terminal mb-4 text-sm tracking-[0.32em] text-[var(--accent)]">
          Handbook Updated
        </div>
        <div className="bg-[linear-gradient(90deg,#5b8cff,#c9a44c)] bg-clip-text text-4xl font-black tracking-[0.08em] text-transparent md:text-5xl">
          Binomial Tree Pricing
        </div>
        <p className="mt-8 max-w-2xl text-base leading-8 text-[var(--ink)]">
          Today's addition is the pricing-desk rules. You already have day one's vanilla-option page; now there's an extra page for judging whether a quote is close to the theoretical price.
        </p>
      </div>
    </TerminalCard>
  );
}

// ─── Central Data Desk ────────────────────────────────────────────────────────
// Real data source: CSVs scraped by the math-engine team in our group (vhsi_history.csv / option_chain_current.csv)
// Here the player looks up the 4 key parameters needed for pricing, then fills them into the calculator themselves.
const researchCards = [
  {
    id: "market_quote",
    icon: "📈",
    title: "Market Terminal · Market Data",
    accent: "#5b8cff",
    rows: [
      { label: "Underlying", value: "Hang Seng Index (HSI)", note: "" },
      { label: "Spot S₀", value: "21,500 pts", note: "Today's opening reference price" },
      { label: "VHSI Volatility Index σ", value: "≈ 16%", note: "HSI 30-day implied volatility (calm-market reference value)" },
      { label: "Data Source", value: "vhsi_history.csv", note: "Scraped by the math-engine team in our group, 2003-2026" },
    ],
    hint: "Use the VHSI as σ (volatility) in the calculator. Note: in a crisis the VHSI can spike to 60%+; today we use a calm-market value.",
  },
  {
    id: "contract_spec",
    icon: "📋",
    title: "Contract Spec",
    accent: "#c9a44c",
    rows: [
      { label: "Product", value: "HSI European Call Option", note: "European Call, cash-settled" },
      { label: "Strike K", value: "22,000 pts", note: "Client-specified (OTM call)" },
      { label: "Expiry Date", value: "About 1 month out", note: "Per the real option chain: expires 2026-04-17" },
      { label: "Annualized Maturity T", value: "≈ 0.08 yr", note: "1 month ÷ 12 ≈ 0.083" },
      { label: "Contract Multiplier", value: "HK$ 50 / pt", note: "HKEX standard" },
    ],
    hint: "Fill in the strike of 22,000 and the annualized maturity of 0.08 in the calculator.",
    realData: [
      "HK.HSI260417C21800000: strike 21,800",
      "HK.HSI260417C22000000: strike 22,000 ← client need",
      "HK.HSI260417C22200000: strike 22,200",
    ],
  },
  {
    id: "rate_board",
    icon: "🏦",
    title: "Rate Board",
    accent: "#5b8cff",
    rows: [
      { label: "HKD Risk-Free Rate r", value: "2%", note: "Per the 1-month HIBOR rate (teaching-simplified value)" },
      { label: "Reference Benchmark", value: "HIBOR 1M", note: "Hong Kong Interbank Offered Rate, published by the Hong Kong Association of Banks" },
      { label: "Actual HIBOR Range", value: "1.5% - 3%", note: "Depends on market conditions; today we use 2% as the teaching anchor" },
    ],
    hint: "Enter r = 2 in the calculator's “Risk-Free Rate %” field.",
  },
  {
    id: "index_profile",
    icon: "📊",
    title: "Index Profile",
    accent: "#34c77b",
    rows: [
      { label: "Index", value: "Hang Seng Index (HSI)", note: "HKEX's flagship index, 50 constituent stocks" },
      { label: "Annualized Dividend Yield q", value: "≈ 3.5%", note: "HSI historical average dividend yield (must be deducted for dividend-adjusted pricing)" },
      { label: "Number of Steps N", value: "3 steps", note: "Teaching simplification: a 3-step binomial tree, enough to show the pricing intuition" },
      { label: "Note", value: "q not counted today", note: "Teaching simplification: the calculator omits the dividend yield for now; real pricing needs to deduct it" },
    ],
    hint: "Today's calculator omits q for now, but remember: real HSI pricing needs to deduct about a 3.5% dividend yield, or it systematically overestimates the call price.",
  },
];

const day3ResearchCards = [
  {
    id: "market_quote_d3",
    icon: "📈",
    title: "Market Terminal · Market Data",
    accent: "#5b8cff",
    rows: [
      { label: "Underlying", value: "Hang Seng Index (HSI)", note: "" },
      { label: "Spot S₀", value: "21,500 pts", note: "Today's opening reference price (same level as yesterday)" },
      { label: "VHSI Volatility Index σ", value: "≈ 30%", note: "Implied volatility as the market turns tense (real-world reference: on 2020-02-28 COVID risk-aversion rose and the VHSI jumped to 32.7)" },
      { label: "Data Source", value: "vhsi_history.csv", note: "Scraped by the math-engine team in our group, 2003-2026" },
    ],
    hint: "Use the VHSI as σ in the calculator. Remember: the higher the volatility, the more easily the underlying touches the barrier level and knocks out; that's exactly why a barrier product is especially sensitive to σ.",
  },
  {
    id: "barrier_contract",
    icon: "🚧",
    title: "Barrier Contract Card · Barrier Spec",
    accent: "#c9a44c",
    isNew: true,
    rows: [
      { label: "Product", value: "Down-and-Out Call Option", note: "Down-and-Out Call, cash-settled" },
      { label: "Strike K", value: "22,000 pts", note: "Client-specified (OTM call, same as the vanilla call)" },
      { label: "Barrier", value: "21,000 pts", note: "🔓 New parameter today: the option expires if the underlying touches it downward" },
      { label: "Knock-Out Type", value: "Expires on a downward barrier touch", note: "Once it touches 21,000, it ends early and does not revive" },
      { label: "Expiry Date", value: "About 3 months out", note: "Per the real option chain: expires 2026-09" },
      { label: "Annualized Maturity T", value: "≈ 0.25 yr", note: "3 months ÷ 12 = 0.25 (longer than yesterday's 1 month)" },
      { label: "Contract Multiplier", value: "HK$ 50 / pt", note: "HKEX standard" },
    ],
    hint: "Today has one more parameter than yesterday: the barrier level of 21,000. Enter K=22,000, T=0.25, and barrier=21,000 into the barrier version of the calculator.",
    realData: [
      "HK.HSI260918C22000000: strike 22,000, expires 2026-09-18",
      "  └ With an added down-and-out clause: barrier 21,000 (KO Barrier)",
      "vs. the vanilla call HK.HSI260918C22000000: same strike, no barrier, higher premium",
    ],
  },
  {
    id: "rate_board_d3",
    icon: "🏦",
    title: "Rate Board",
    accent: "#5b8cff",
    rows: [
      { label: "HKD Risk-Free Rate r", value: "2%", note: "Per the 1-month HIBOR rate (teaching-simplified value)" },
      { label: "Reference Benchmark", value: "HIBOR 1M", note: "Hong Kong Interbank Offered Rate, published by the Hong Kong Association of Banks" },
      { label: "Actual HIBOR Range", value: "1.5% - 3%", note: "Depends on market conditions; today we use 2% as the teaching anchor" },
    ],
    hint: "Enter r = 2 in the calculator's “Risk-Free Rate %” field (same as yesterday).",
  },
  {
    id: "barrier_risk",
    icon: "⚠️",
    title: "Barrier Risk Card · Barrier Risk",
    accent: "#f87171",
    isNew: true,
    rows: [
      { label: "Barrier Distance from Spot", value: "About 2.33%", note: "(21,500 − 21,000) ÷ 21,500, very close" },
      { label: "Knock-Out Difficulty", value: "Easy", note: "The closer the barrier is to the spot, the more easily it's breached" },
      { label: "Real-World Reference", value: "2020-03 HSI ≈ 21,700", note: "Intraday low of 21,139; a barrier like this would be breached" },
      { label: "Cost vs Reward", value: "Cheap ↔ easy to knock out", note: "The closer the barrier, the cheaper the premium, but the greater the knock-out risk" },
    ],
    hint: "Key point: the closer the barrier is set to the spot, the cheaper the premium, but the more easily it knocks out. Today the barrier is only about 2.3% below the spot, a “cheap but fragile” contract.",
    realData: [
      "2020-02-17 HSI high of 28,055 (pre-pandemic)",
      "2020-03-19 intraday low of 21,139 ← already below the 21,000 barrier",
      "2020-03-23 close of 21,696, VHSI briefly spiked above 60",
      "Source: hsi_2020_covid.csv (scraped by the math-engine team in our group)",
    ],
  },
];

// Dedicated data cards for client #3 (Mr. He · graduation judgment): echoing "decreasing hints", instead of the Day4ParamCard
// approach of laying out parameters + "fill them in as shown", this uses the Day2/Day3 data-desk style so the player sources them.
// The barrier level only appears after the player has judged the barrier product and reached the quoting page; it doesn't give the answer away beforehand.
const day4HeResearchCards = [
  {
    id: "market_quote_d4he",
    icon: "📈",
    title: "Market Terminal · Market Data",
    accent: "#5b8cff",
    rows: [
      { label: "Underlying", value: "Hang Seng Index (HSI)", note: "" },
      { label: "Spot S₀", value: "25,000 pts", note: "Months after the COVID crash, the HSI has recovered from its low" },
      { label: "VHSI Volatility Index σ", value: "≈ 32%", note: "The market isn't fully calm yet; implied volatility is still elevated" },
      { label: "Data Source", value: "vhsi_history.csv", note: "Scraped by the math-engine team in our group" },
    ],
  },
  {
    id: "he_order",
    icon: "🚧",
    title: "Mr. He's Order · Client Order",
    accent: "#c9a44c",
    rows: [
      { label: "Strike K", value: "25,500 pts", note: "Mr. He wants to exercise at this level" },
      { label: "Acceptable Knock-Out Line", value: "23,500 pts", note: "He said “if it really breaches a certain level and gets voided, I can live with that”" },
      { label: "Maturity", value: "About 3 months", note: "He wants to ride this HSI rebound" },
      { label: "Annualized Maturity T", value: "≈ 0.25 yr", note: "3 months ÷ 12" },
    ],
  },
  {
    id: "rate_board_d4he",
    icon: "🏦",
    title: "Rate Board",
    accent: "#5b8cff",
    rows: [
      { label: "HKD Risk-Free Rate r", value: "2%", note: "The same teaching anchor as the previous days" },
    ],
  },
];

function ResearchTerminalPanel({
  title = "Central Data Desk",
  accent = "Pricing Parameter Lookup · Research Terminal",
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
        <div className="rounded-md border border-[#5b8cff]/20 bg-[#5b8cff]/[0.04] p-4 text-sm leading-7 text-[var(--ink)]">
          <span className="font-terminal text-[var(--accent)]">Task: </span>
          {taskText}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className="rounded-lg border bg-[var(--surface-2)] p-4"
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
                    className="flex items-start justify-between gap-3 rounded border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2"
                  >
                    <span className="font-terminal text-[11px] tracking-[0.1em] text-[var(--muted)] shrink-0">
                      {row.label}
                    </span>
                    <div className="text-right">
                      <span className="font-black text-[var(--ink)] text-sm">{row.value}</span>
                      {row.note && (
                        <div className="mt-0.5 text-[11px] text-[var(--muted)]">{row.note}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {card.realData && (
                <div className="mt-3">
                  <button
                    onClick={() => toggle(card.id)}
                    className="font-terminal text-[11px] tracking-[0.12em] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                  >
                    {revealed[card.id] ? "▲ Collapse Real Option Chain" : "▼ View Real Option Chain (our group's data)"}
                  </button>
                  {revealed[card.id] && (
                    <div className="mt-2 rounded border border-[var(--border)] bg-black/40 p-3 space-y-1">
                      {card.realData.map((line) => (
                        <div key={line} className="font-terminal text-[11px] text-[var(--muted)]">
                          {line}
                        </div>
                      ))}
                      <div className="mt-2 font-terminal text-[10px] text-[var(--muted)]">
                        Source: option_chain_current.csv (scraped by the math-engine team in our group, real HKEX data)
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4 text-xs leading-6 text-[var(--muted)]">
          {footerHint}
        </div>
      </div>
    </TerminalCard>
  );
}

function Day2ResearchTerminalPanel() {
  return (
    <ResearchTerminalPanel
      title="Central Data Desk"
      accent="Pricing Parameter Lookup · Research Terminal"
      cards={researchCards}
      taskText={
        <>
          Review the 4 data cards below and decide for yourself which key parameters today's pricing needs:
          <span className="font-black text-[var(--ink)]"> S₀ (spot), K (strike), T (annualized maturity), r (risk-free rate), σ (annualized volatility)</span>.
          The cards give you only raw market data, not ready-made answers. Find the relevant numbers, note them down, then manually enter them into the binomial-tree calculator, compute the theoretical price, and go quote.
        </>
      }
      footerHint="Hint: the four cards above hide all the numbers you need for pricing, but there's no ready-made “cheat sheet.” Which data maps to which input field is for you to judge; this is exactly what traders do every day: sourcing the inputs."
    />
  );
}

function Day3ResearchTerminalPanel() {
  return (
    <ResearchTerminalPanel
      title="Central Data Desk · Barrier Edition"
      accent="Barrier Parameter Lookup · Barrier Research"
      cards={day3ResearchCards}
      taskText={
        <>
          Today's product adds an extra layer: the barrier. On top of yesterday's parameters, you also need to look up one brand-new key number:
          <span className="font-black text-[var(--notice)]"> the barrier level</span>.
          From the 4 cards below, find for yourself
          <span className="font-black text-[var(--ink)]"> S₀, K, T, r, σ </span>
          as well as the
          <span className="font-black text-[var(--notice)]">barrier level</span>
          , note them down, then enter them into the barrier version of the calculator. Note: today's maturity is 3 months, longer than yesterday.
        </>
      }
      footerHint="Hint: the “barrier level” on the barrier contract card is today's new parameter, and the extra row in the calculator today. As with yesterday, there's no cheat sheet; judge for yourself which data maps to which input field."
    />
  );
}

function Day2ClientArrivalPanel() {
  const client = day2Config.clientProfile;
  const profileRows = [
    ["Name", client.name],
    ["Client Type", client.type],
    ["Market View", client.marketView],
    ["Risk Tolerance", client.riskTolerance],
    ["Goal", client.goal],
    ["Product Need", client.productNeed],
    ["Budget", client.budget],
    ["Experience", client.experience],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Client Profile" accent="Institutional Client Order" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-[#c9a44c]/30 bg-[#c9a44c]/[0.08] font-terminal text-4xl font-black text-[var(--notice)]">
              W
            </div>
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[var(--accent)]">
                Professional Client
              </div>
              <div className="mt-2 text-2xl font-black text-[var(--ink)]">{client.name}</div>
            </div>
          </div>
          <div className="grid gap-3">
            {profileRows.map(([label, value]) => (
              <div key={label} className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3">
                <div className="font-terminal text-xs tracking-[0.14em] text-[var(--muted)]">
                  {label}
                </div>
                <div className="mt-1 text-sm leading-6 text-[var(--ink)]">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#c9a44c]/20 bg-[#c9a44c]/[0.05] p-5">
          <div className="font-terminal mb-4 text-xs tracking-[0.18em] text-[var(--notice)]">
            Client Dialogue
          </div>
          <div className="space-y-4">
            {client.dialogue.map((line) => (
              <div key={line} className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4 text-base leading-8 text-[var(--ink)]">
                Mr. Wang: “{line}”
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
    ["Product", product.product],
    ["Underlying", product.underlying],
    ["Spot", formatPoints(product.spot)],
    ["Strike", formatPoints(product.strike)],
    ["Maturity", product.maturity],
    ["Client View", product.clientView],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Product Confirmation" accent="Client Has Specified a Vanilla Call" />
      <div className="space-y-5 p-6">
        <div className="rounded-lg border border-[#c9a44c]/25 bg-[#c9a44c]/[0.06] p-5">
          <div className="font-terminal mb-2 text-xs tracking-[0.18em] text-[var(--notice)]">
            VANILLA CALL
          </div>
          <div className="text-3xl font-black text-[var(--ink)]">{product.product}</div>
          <p className="mt-4 text-base leading-8 text-[var(--ink)]">
            {product.matchReason} The task on day two isn't to re-pick a product, but to confirm the structure, open the pricing tree, and give a reasonable premium.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs tracking-[0.14em] text-[var(--muted)]">
                {label}
              </div>
              <div className="mt-2 text-xl font-black text-[var(--ink)]">{value}</div>
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
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
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
                stroke={hot ? "rgba(201,164,76,0.48)" : "rgba(91,140,255,0.28)"}
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
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border p-3 shadow-[var(--shadow)]",
              node.terminal ? "w-64" : "w-44",
              node.hot
                ? "border-[#c9a44c]/70 bg-[#c9a44c]/[0.12]"
                : node.terminal
                  ? "border-slate-700 bg-[var(--surface-2)] opacity-75"
                  : "border-[var(--border-strong)] bg-[var(--surface-2)]",
            )}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className="font-terminal text-[10px] tracking-[0.14em] text-[var(--muted)]">
              {node.step}
            </div>
            <div className={cn("mt-1 text-xs", node.hot ? "text-[var(--notice)]" : "text-[var(--accent)]")}>
              {node.label}
            </div>
            <div className="mt-1 text-xl font-black text-[var(--ink)]">{formatPoints(node.price)}</div>
            {typeof node.payoff === "number" && (
              <div className="mt-2 space-y-2">
                {node.formula && (
                  <div className="rounded border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 text-xs leading-5 text-[var(--ink)]">
                    {node.formula}
                  </div>
                )}
                <div className={cn("rounded border px-2 py-1 text-xs font-black", node.hot ? "border-[#c9a44c]/40 text-[var(--notice)]" : "border-[var(--border)] text-[var(--muted)]")}>
                  Payoff: {formatPoints(node.payoff)}
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

// Use the pricing engine to compute theoretical prices live, overriding the hardcoded placeholder values in config
// Day2 vanilla: S0=21500/K=22000/σ=16%/T=0.08/N=3 → 185.94 ≈ 186
day2Config.quoteRules.theoreticalPrice = Math.round(
  buildVanillaBinomialToolTree({ spot: 21500, strike: 22000, rate: 2, sigma: 16, maturity: 0.08, steps: 3 }).vanillaPrice
);
// Day3 barrier: S0=21500/K=22000/barrier=21000/σ=30%/T=0.25/N=4 → 934.16 ≈ 934
day3Config.market.premium = Math.round(
  buildBarrierBinomialToolTree({ spot: 21500, strike: 22000, barrier: 21000, rate: 2, sigma: 30, maturity: 0.25, steps: 4 }).barrierPrice
);
// Day3 vanilla ref: same params, no barrier → 1111.73 ≈ 1112
day3Config.market.vanillaPremium = Math.round(
  buildVanillaBinomialToolTree({ spot: 21500, strike: 22000, rate: 2, sigma: 30, maturity: 0.25, steps: 4 }).vanillaPrice
);

// Day4 client theoretical prices (barrier N=4 / vanilla N=3)
day4Clients[0].theoretical = Math.round(
  buildVanillaBinomialToolTree({ spot: 24000, strike: 24500, rate: 2, sigma: 18, maturity: 0.08, steps: 3 }).vanillaPrice
);
day4Clients[1].theoretical = Math.round(
  buildBarrierBinomialToolTree({ spot: 24000, strike: 24500, barrier: 23000, rate: 2, sigma: 28, maturity: 0.25, steps: 4 }).barrierPrice
);
day4Clients[2].theoretical = Math.round(
  buildBarrierBinomialToolTree({ spot: 25000, strike: 25500, barrier: 23500, rate: 2, sigma: 32, maturity: 0.25, steps: 4 }).barrierPrice
);

// Day2 zero-theoretical-price guard: ensures liveTheoretical only updates when the computed price is >= 1 point
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
  enableParamCheck = true, // Day2 uses standard-parameter comparison reminders; Day4 clients have different parameters, so turn it off
  quoteHint, // Hint text for the quote input field (customized per client on Day4); falls back to default if not passed
}) {
  const isBarrier = mode === "barrier";

  // Defaults are deliberately set to each parameter's minimum (placeholder), forcing the player to copy the real parameters from the data desk themselves
  // The number of steps N is a modeling choice (not a market parameter to look up at the data desk), and is locked fixed: Day2=3, Day3=4
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

  // On every tree recompute, pass the latest theoretical price to the parent component (only the vanilla-mode Day2 quote linkage passes onUpdateTheoretical)
  useEffect(() => {
    if (onUpdateTheoretical && Math.round(tree.vanillaPrice) >= 1) {
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

  // Day2 parameter check (vanilla mode only)
  const day2ParamIssues = useMemo(
    () => (!isBarrier && enableParamCheck ? checkDay2Params(params) : []),
    [params, isBarrier, enableParamCheck],
  );

  const inputMeta = isBarrier
    ? [
        ["spot", "S0 Spot", 1000, 50000, 100],
        ["strike", "K Strike", 1000, 50000, 100],
        ["barrier", "Barrier Level", 1000, 50000, 100],
        ["rate", "r Risk-Free Rate %", -5, 20, 0.25],
        ["sigma", "σ Volatility %", 1, 80, 1],
        ["maturity", "T Annualized Maturity", 0.05, 3, 0.05],
      ]
    : [
        ["spot", "S0 Spot", 1000, 50000, 100],
        ["strike", "K Strike", 1000, 50000, 100],
        ["rate", "r Risk-Free Rate %", -5, 20, 0.25],
        ["sigma", "σ Volatility %", 1, 80, 1],
        ["maturity", "T Annualized Maturity", 0.02, 3, 0.01],
      ];

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/85 p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-terminal text-xs tracking-[0.2em] text-[var(--accent)]">
            {isBarrier ? "Barrier Option Binomial Tree Calculator" : "Vanilla Option Binomial Tree Calculator"}
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            {isBarrier
              ? "Same calculator as yesterday, with one extra gold row today: the “barrier level.” Red nodes indicate the barrier was touched and knocked out, green paths indicate it's still alive; below, the model prices of a vanilla call and a down-and-out call are compared side by side."
              : "Here we look at a vanilla call only for now. Change the spot, strike, volatility, or number of steps, and watch how the price tree, expiry payoffs, and today's theoretical price update together."}
          </p>
        </div>
        <div
          className={cn(
            "rounded-md border px-4 py-2 font-terminal text-xs",
            isBarrier
              ? "border-[#c9a44c]/30 bg-[#c9a44c]/[0.07] text-[var(--notice)]"
              : "border-[#5b8cff]/30 bg-[var(--surface-2)] text-[var(--accent)]",
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
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
          <div className="font-terminal mb-4 text-xs tracking-[0.18em] text-[var(--accent)]">
            Parameter Input
          </div>
          <div className="grid gap-3">
            {inputMeta.map(([key, label, min, max, step]) => {
              const isBarrierRow = key === "barrier";
              return (
                <label key={key} className="grid gap-2">
                  <span
                    className={cn(
                      "font-terminal flex items-center gap-2 text-[11px] tracking-[0.12em]",
                      isBarrierRow ? "text-[var(--notice)]" : "text-[var(--muted)]",
                    )}
                  >
                    {label}
                    {isBarrierRow && (
                      <span className="rounded-full border border-[#c9a44c]/50 bg-[#c9a44c]/[0.12] px-2 py-0.5 text-[9px] font-black tracking-[0.18em] text-[var(--notice)]">
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
                      "rounded-md border bg-[var(--surface-2)] px-3 py-2 font-terminal text-sm text-[var(--ink)] outline-none transition",
                      isBarrierRow
                        ? "border-[#c9a44c]/45 focus:border-[#c9a44c]"
                        : "border-[var(--border)] focus:border-[#5b8cff]",
                    )}
                  />
                </label>
              );
            })}

            <label className="grid gap-2">
              <span className="font-terminal flex items-center gap-2 text-[11px] tracking-[0.12em] text-[var(--muted)]">
                N Steps
                <span className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] px-2 py-0.5 text-[9px] font-black tracking-[0.18em] text-[var(--muted)]">
                  🔒 Fixed
                </span>
              </span>
              <div className="rounded-md border border-[var(--border)] bg-black/40 px-3 py-2 font-terminal text-sm text-[var(--muted)]">
                {params.steps} steps (modeling choice, no need to look up)
              </div>
            </label>
          </div>

          <div className="mt-4 grid gap-3 rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3 text-xs leading-6 text-[var(--muted)]">
            <div>
              Up factor u:
              <span className="font-terminal text-[var(--accent)]"> {tree.up.toFixed(4)}</span>
            </div>
            <div>
              Down factor d:
              <span className="font-terminal text-[var(--accent)]"> {tree.down.toFixed(4)}</span>
            </div>
            <div>
              Risk-neutral probability p:
              <span className="font-terminal text-[var(--notice)]"> {tree.probability.toFixed(4)}</span>
            </div>
            {!tree.noArbitrage && (
              <div className="rounded border border-red-500/30 bg-red-500/[0.08] px-2 py-1 text-[var(--neg)]">
                Parameters don't satisfy d &lt; e^(rΔt) &lt; u; the risk-neutral probability is outside 0-1.
              </div>
            )}
            {!isBarrier && (
              <div>
                Vanilla Call theoretical price:
                <span className="font-terminal text-[var(--pos)]"> {tree.vanillaPrice.toFixed(2)}</span>
              </div>
            )}
          </div>

          {!isBarrier && day2ParamIssues.length > 0 && (
            <div className="mt-4 rounded-md border border-orange-500/40 bg-orange-500/[0.08] p-3 text-xs leading-5 text-orange-300">
              <div className="font-terminal mb-2 tracking-[0.12em]">⚠️ Martin's Reminder</div>
              {day2ParamIssues.map(({ key, value, stdValue }) => (
                <div key={key} className="mb-1">
                  {key === "spot" && `Spot S0: you entered ${Number(value).toLocaleString()} pts; the data desk's market terminal should be 21,500`}
                  {key === "strike" && `Strike K: you entered ${Number(value).toLocaleString()} pts; it should be 22,000`}
                  {key === "rate" && `Rate r: you entered ${value}%; it should be 2%`}
                  {key === "sigma" && `Volatility σ: you entered ${value}%; it should be 16% (from the VHSI)`}
                  {key === "maturity" && `Maturity T: you entered ${value} yr; 1 month should be about 0.08 yr`}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
          <div
            className={cn(
              "relative min-w-0 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg)]",
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
                    stroke="rgba(91,140,255,0.34)"
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
                      "absolute w-32 -translate-x-1/2 -translate-y-1/2 rounded-lg border p-2 shadow-[var(--shadow)]",
                      node.knocked
                        ? "border-red-500/60 bg-red-500/[0.12]"
                        : "border-green-400/45 bg-green-400/[0.08]",
                    )}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    <div className="font-terminal text-[10px] tracking-[0.12em] text-[var(--muted)]">
                      t{node.step} / u{node.upMoves}
                    </div>
                    <div
                      className={cn(
                        "mt-1 text-lg font-black",
                        node.knocked ? "text-[var(--neg)]" : "text-[var(--pos)]",
                      )}
                    >
                      {formatPoints(Math.round(node.price))}
                    </div>
                    <div className="mt-1 text-[11px] leading-4 text-[var(--muted)]">
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
                    "absolute w-32 -translate-x-1/2 -translate-y-1/2 rounded-lg border p-2 shadow-[var(--shadow)]",
                    isTerminal && node.inTheMoney
                      ? "border-[#c9a44c]/65 bg-[#c9a44c]/[0.1]"
                      : "border-[#5b8cff]/35 bg-[var(--surface-2)]",
                  )}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div className="font-terminal text-[10px] tracking-[0.12em] text-[var(--muted)]">
                    t{node.step} / u{node.upMoves}
                  </div>
                  <div className="mt-1 text-lg font-black text-[var(--ink)]">
                    {formatPoints(Math.round(node.price))}
                  </div>
                  <div className="mt-1 text-[11px] leading-4 text-[var(--muted)]">
                    V: {node.optionValue.toFixed(1)}
                  </div>
                  {isTerminal && (
                    <div className={cn("mt-1 rounded border px-2 py-1 text-[10px] font-black", node.inTheMoney ? "border-[#c9a44c]/35 text-[var(--notice)]" : "border-[var(--border)] text-[var(--muted)]")}>
                      Payoff: {node.payoff.toFixed(0)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {isBarrier ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
                <div className="font-terminal text-xs tracking-[0.18em] text-[var(--accent)]">
                  Vanilla Call Theoretical Price
                </div>
                <div className="mt-2 text-3xl font-black text-[var(--ink)]">
                  {tree.vanillaPrice.toFixed(2)}
                </div>
                <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
                  Ignores the barrier; worked backward purely from the expiry payoff max(S - K, 0).
                </p>
              </div>
              <div className="rounded-lg border border-[#c9a44c]/25 bg-[#c9a44c]/[0.06] p-4">
                <div className="font-terminal text-xs tracking-[0.18em] text-[var(--notice)]">
                  Down-and-Out Call Theoretical Price
                </div>
                <div className="mt-2 text-3xl font-black text-[var(--notice)]">
                  {tree.barrierPrice.toFixed(2)}
                </div>
                <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
                  Once a node price falls to or below the barrier level, the value from that node onward goes to zero.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
                <div className="font-terminal text-xs tracking-[0.18em] text-[var(--accent)]">
                  Price Tree
                </div>
                <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
                  The spot and volatility change the future node prices.
                </p>
              </div>
              <div className="rounded-lg border border-[#c9a44c]/25 bg-[#c9a44c]/[0.06] p-4">
                <div className="font-terminal text-xs tracking-[0.18em] text-[var(--notice)]">
                  Expiry Payoff
                </div>
                <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
                  The strike K doesn't change the price tree, but it does change the terminal payoff.
                </p>
              </div>
              <div className="rounded-lg border border-green-400/20 bg-green-400/[0.06] p-4">
                <div className="font-terminal text-xs tracking-[0.18em] text-[var(--pos)]">
                  Backward-Induced Price
                </div>
                <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
                  Working backward from the terminal payoffs gives today's theoretical price.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedQuote !== undefined && (
        <div className="mt-5 rounded-lg border border-[#c9a44c]/25 bg-[#c9a44c]/[0.05] p-5">
          <div className="mb-4">
            <div className="font-terminal text-xs tracking-[0.2em] text-[var(--notice)]">
              Quote Input / Premium Quote
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]">
              {quoteHint
                ? quoteHint
                : isBarrier
                  ? "Using the “Down-and-Out Call theoretical price” computed by the calculator above, add a profit margin you consider reasonable, and quote Ms. Chen a premium."
                  : "Using the “Vanilla Call theoretical price” computed by the calculator above, add a profit margin you consider reasonable, and quote Mr. Wang a premium."}
              <span className="text-[var(--ink)]">How much to quote is up to you; the system won't tell you in advance whether you're right; you'll find out only after you submit.</span>
            </p>
          </div>

          <label className="grid max-w-xs gap-2">
            <span className="font-terminal text-[11px] tracking-[0.14em] text-[var(--muted)]">
              Your Quote (points)
            </span>
            <input
              type="number"
              min={day2Config.quoteRules.sliderMin}
              max={day2Config.quoteRules.sliderMax}
              step="5"
              placeholder="Enter a quote yourself"
              value={selectedQuote}
              onChange={(event) =>
                onUpdateQuote(event.target.value === "" ? "" : Number(event.target.value))
              }
              className="rounded-md border border-[#c9a44c]/35 bg-[var(--surface-2)] px-4 py-3 font-terminal text-2xl font-black text-[var(--accent)] outline-none transition focus:border-[#c9a44c]"
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
      title: "1. Generate the Price Tree First",
      formula: "u = e^(σ√Δt),   d = 1/u",
      text: "Starting from today's price S0, at each step the price can multiply by the up factor u or the down factor d, forming a price tree.",
    },
    {
      title: "2. Compute the Payoff at the Expiry Nodes",
      formula: "Call Payoff = max(S_T - K, 0)",
      text: "Once you reach the rightmost expiry nodes, compute the option payoff at each terminal point first. A vanilla call only looks at whether the final price is above the strike.",
    },
    {
      title: "3. Compute the Risk-Neutral Probability",
      formula: "p = (e^(rΔt) - d) / (u - d)",
      text: "p is not a subjective probability of an up move; it's the risk-neutral probability that lets the binomial tree be discounted backward under no-arbitrage conditions.",
    },
    {
      title: "4. Work Backward from the Future to Today",
      formula: "V = e^{-rΔt} × [pV_up + (1-p)V_down]",
      text: "Weight the possible up and down values of the next step, then discount them back. Work backward all the way to the far left, and that's today's theoretical price.",
    },
  ];
  const symbols = [
    ["S0", "Today's underlying price, i.e. the starting point of the calculation"],
    ["S / S_T", "A node price / the final price at expiry. T is the terminal time"],
    ["K", "The strike. At expiry, a call compares the final price against K"],
    ["u / d", "The price multiple for each up or down step"],
    ["r", "The risk-free rate, used to discount future value back to today"],
    ["Δt", "The length of time each step represents"],
    ["p", "The risk-neutral probability, used to weight the up and down futures"],
    ["V", "The option's theoretical value at a given node"],
  ];

  return (
    <div className="rounded-lg border border-[#c9a44c]/25 bg-[#c9a44c]/[0.05] p-5">
      <div className="font-terminal mb-3 text-xs tracking-[0.2em] text-[var(--notice)]">
        Pricing Mechanism / Understand the Formula First, Then Use the Calculator
      </div>
      <div className="mb-5 text-2xl font-black text-[var(--ink)]">
        A binomial tree doesn't guess the market; it breaks the future into paths, then works backward from the endpoints to today's price
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {steps.map((step) => (
          <div key={step.title} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-[var(--accent)]">
              {step.title}
            </div>
            <div className="mt-3 rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-terminal text-sm text-[var(--notice)]">
              {step.formula}
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--ink)]">{step.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--accent)]">
          Symbol Glossary / No Need to Memorize, Just Know What They Mean
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {symbols.map(([symbol, meaning]) => (
            <div key={symbol} className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3">
              <div className="font-terminal text-sm font-black text-[var(--notice)]">{symbol}</div>
              <div className="mt-2 text-xs leading-6 text-[var(--ink)]">{meaning}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-md border-l-4 border-[#5b8cff] bg-[var(--surface-2)] p-4 text-sm leading-7 text-[var(--ink)]">
        When using the calculator, focus on three things: how the price tree unfolds, how the strike affects the expiry payoff, and how the terminal payoffs are worked backward into today's theoretical price.
      </div>
    </div>
  );
}

function Day2TreeExplainerPanel({ selectedQuote, quoteAnalysis, onUpdateQuote, onUpdateTheoretical }) {
  const tree = day2Config.tree;
  const params = [
    ["Underlying", tree.underlying],
    ["Spot S0", formatPoints(tree.spot)],
    ["Strike K", formatPoints(tree.strike)],
    ["Up Move", tree.upMove],
    ["Down Move", tree.downMove],
    ["Steps", `${tree.steps} steps`],
    ["Risk-Free Rate", tree.riskFreeRate],
    ["Simplified Theoretical Price", `${tree.theoreticalPrice} pts`],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Binomial Tree Pricing Terminal" accent="3-step Binomial Tree" />
      <div className="space-y-5 p-6">
        <div className="grid gap-3 md:grid-cols-4">
          {params.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
              <div className="font-terminal text-[11px] tracking-[0.14em] text-[var(--muted)]">
                {label}
              </div>
              <div className="mt-2 text-lg font-black text-[var(--ink)]">{value}</div>
            </div>
          ))}
        </div>

        <BinomialFormulaPanel />

        <div className="grid gap-4 md:grid-cols-3">
          {[
            "The spot S0 and volatility σ change the future price nodes, making the price tree wider or narrower.",
            "The strike K doesn't change the underlying's price path, but it does change the payoff at each expiry node.",
            "The more steps N, the finer the tree; today just grasp the intuition, and you're not asked to compute every node by hand.",
          ].map((text, index) => (
            <div key={text} className="rounded-lg border border-[#c9a44c]/20 bg-[#c9a44c]/[0.05] p-4 text-sm leading-7 text-[var(--notice)]">
              <span className="font-terminal mr-2 text-[var(--accent)]">Hint {index + 1}</span>
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
      ? "border-green-400/30 bg-green-400/[0.08] text-[var(--pos)]"
      : quoteAnalysis.tone === "danger"
        ? "border-red-500/35 bg-red-500/[0.08] text-[var(--neg)]"
        : "border-[#c9a44c]/35 bg-[#c9a44c]/[0.08] text-[var(--notice)]";

  const content = (
    <>
      <TerminalHeader label="Pricing Terminal" accent="Adjust the Premium" />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Your Quote", `${selectedQuote} pts`, "#5b8cff"],
            ["Model Theoretical Price", `${liveTheoretical} pts`, "#c9a44c"],
            ["Desk Profit", `${profit >= 0 ? "+" : ""}${profit} pts`, profit >= 0 ? "#34c77b" : "#f87171"],
            ["Suggested Range", `${fairLow} - ${fairHigh} pts`, "#e2e8f0"],
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs tracking-[0.14em] text-[var(--muted)]">
                {label}
              </div>
              <div className="mt-2 text-2xl font-black" style={{ color }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[var(--accent)]">
                Quote Slider
              </div>
              <div className="mt-1 text-sm text-[var(--muted)]">Range: {rules.sliderMin} - {rules.sliderMax} pts</div>
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
            aria-label="Your quote in points"
            aria-valuetext={`${selectedQuote} points`}
            className="w-full touch-manipulation accent-[#5b8cff]"
          />
          <div className="mt-3 flex justify-between text-xs text-[var(--muted)]">
            <span>{rules.sliderMin}</span>
            <span>{liveTheoretical} theoretical</span>
            <span>{fairLow}-{fairHigh} fair range</span>
            <span>{liveTheoretical + 74} rejection line</span>
            <span>{rules.sliderMax}</span>
          </div>
        </div>

        <div className={cn("rounded-md border-l-4 p-4 text-base leading-8", toneClass)}>
          Client reaction preview: {quoteAnalysis.customerPreview}
        </div>
      </div>
    </>
  );

  if (embedded) {
    return (
      <div className="overflow-hidden rounded-lg border border-[#c9a44c]/25 bg-[#c9a44c]/[0.04] shadow-[var(--shadow)]">
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
  const acceptedText = response.accepted ? "Trade Accepted" : "Client Refused";

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Client Feedback" accent="Quote Receipt" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--accent)]">
            Quote Record
          </div>
          <div className="text-5xl font-black text-[var(--accent)]">{selectedQuote} pts</div>
          <div className="mt-4 text-sm leading-7 text-[var(--muted)]">
            The quote has been sent; awaiting market settlement.
          </div>
        </div>

        <div className="rounded-lg border border-[#c9a44c]/20 bg-[#c9a44c]/[0.05] p-5">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-md border border-[#c9a44c]/30 bg-black/40 font-terminal text-3xl font-black text-[var(--notice)]">
              W
            </div>
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[var(--notice)]">
                Mr. Wang
              </div>
              <div className="mt-1 text-sm text-[var(--muted)]">{acceptedText}</div>
            </div>
          </div>
          <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-5 text-xl font-black leading-9 text-[var(--ink)]">
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
      <TerminalHeader label="Market Path" accent={finalShown ? "Closing Price Locked" : "Market Running Automatically"} />
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-5">
          {[
            ["Underlying", "Hang Seng Index (HSI)"],
            ["Open", formatPoints(spot)],
            ["Strike", formatPoints(market.strike)],
            ["Your Quote", `${quote} pts`],
            ["Maturity", "1 month"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs tracking-[0.14em] text-[var(--muted)]">
                {label}
              </div>
              <div className="mt-2 text-lg font-bold text-[var(--ink)]">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="font-terminal text-xs text-[var(--muted)]">Live Price</div>
            <div className="live-price-pulse mt-2 text-3xl font-black text-[var(--accent)]">
              {formatPoints(latestPrice)}
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="font-terminal text-xs text-[var(--muted)]">Tick Change</div>
            <div
              className={cn(
                "mt-2 text-2xl font-black",
                tickChange >= 0 ? "text-[var(--pos)]" : "text-[var(--neg)]",
              )}
            >
              {tickChange >= 0 ? "+" : ""}
              {tickChange}
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="font-terminal text-xs text-[var(--muted)]">
              {accepted ? "Desk Live Net" : "Trade Status"}
            </div>
            {accepted ? (
              <div className={cn("mt-2 text-2xl font-black", liveDeskNet >= 0 ? "text-[var(--pos)]" : "text-[var(--neg)]")}>
                {quote} - {liveIntrinsic} = {liveDeskNet >= 0 ? "+" : ""}{liveDeskNet}
              </div>
            ) : (
              <div className="mt-2 text-lg font-black text-[var(--neg)]">No Deal</div>
            )}
          </div>
        </div>

        <div className="market-chart-panel mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/85 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-terminal text-sm tracking-[0.18em] text-[var(--accent)]">
                LIVE HSI PATH
              </div>
              <div className="mt-1 text-xs text-[var(--muted)]">
                The price ticks automatically; the endpoint is used for the vanilla call's expiry settlement
              </div>
            </div>
            <div
              className={cn(
                "font-terminal rounded border px-3 py-1 text-xs tracking-[0.16em]",
                finalShown
                  ? "border-green-400/35 bg-green-400/[0.08] text-[var(--pos)]"
                  : "border-[#c9a44c]/35 bg-[#c9a44c]/[0.08] text-[var(--notice)]",
              )}
            >
              {finalShown ? "MARKET CLOSED" : "VOLATILITY LIVE"}
            </div>
          </div>

          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="relative z-10 w-full">
            <defs>
              <linearGradient id="day2MarketArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(91,140,255,0.28)" />
                <stop offset="100%" stopColor="rgba(91,140,255,0)" />
              </linearGradient>
              <filter id="day2MarketGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#5b8cff" />
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
                  stroke={tick === market.strike ? "#c9a44c" : "rgba(148,163,184,0.14)"}
                  strokeDasharray={tick === market.strike ? "6 6" : "2 8"}
                />
                <text
                  x="44"
                  y={chart.yScale(tick) + 4}
                  textAnchor="end"
                  className={tick === market.strike ? "fill-[#c9a44c] text-[12px]" : "fill-slate-500 text-[12px]"}
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
                stroke="#5b8cff"
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
                fill={price >= market.strike ? "#c9a44c" : "#5b8cff"}
                opacity={index === activePrices.length - 1 ? 1 : 0.65}
              />
            ))}

            <circle cx={latestX} cy={latestY} r="13" fill="none" stroke="#5b8cff" strokeWidth="2" opacity="0.35">
              <animate attributeName="r" values="9;18;9" dur="0.9s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.75;0.1;0.75" dur="0.9s" repeatCount="indefinite" />
            </circle>
            <text x={latestX + 12} y={latestY - 12} className="fill-[#5b8cff] text-[13px] font-bold">
              {formatPoints(latestPrice)}
            </text>
            <text x={chart.xScale(path.length - 1)} y={chart.height - 12} textAnchor="end" className="fill-slate-500 text-[12px]">
              Progress {Math.round(progress)}%
            </text>
          </svg>
        </div>

        {finalShown ? (
          <div className="scene-enter mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs text-[var(--muted)]">Final Price</div>
              <div className="mt-2 text-3xl font-black text-[var(--accent)]">
                {formatPoints(finalPrice)}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs text-[var(--muted)]">Call Expiry Payoff</div>
              <div className="mt-2 text-lg font-bold text-[var(--ink)]">
                max({formatPoints(finalPrice)} - {formatPoints(market.strike)}, 0) ={" "}
                <span className="text-[var(--accent)]">{payoff}</span>
              </div>
            </div>
            <div className={cn("rounded-lg border p-4", accepted && (payoff - quote) >= 0 ? "border-green-400/20 bg-green-400/[0.05]" : "border-[var(--border)] bg-[var(--surface-2)]")}>
              <div className="font-terminal text-xs text-[var(--muted)]">Client Net P&L</div>
              <div className={cn("mt-2 text-2xl font-black", accepted ? ((payoff - quote) >= 0 ? "text-[var(--pos)]" : "text-[var(--neg)]") : "text-[var(--muted)]")}>
                {accepted ? `${(payoff - quote) >= 0 ? "+" : ""}${payoff - quote}` : "No Deal · 0"}
              </div>
              {accepted && <p className="mt-2 text-xs leading-5 text-[var(--muted)]">Expiry payoff minus the premium paid.</p>}
            </div>
            <div className={cn("rounded-lg border p-4", accepted ? (deskPnl >= 0 ? "border-green-400/20 bg-green-400/[0.05]" : "border-red-500/25 bg-red-500/[0.06]") : "border-[var(--border)] bg-[var(--surface-2)]")}>
              <div className="font-terminal text-xs text-[var(--muted)]">Desk Settlement</div>
              <div className={cn("mt-2 text-2xl font-black", accepted ? (deskPnl >= 0 ? "text-[var(--pos)]" : "text-[var(--neg)]") : "text-[var(--muted)]")}>
                {accepted ? `${deskPnl >= 0 ? "+" : ""}${deskPnl}` : "No Deal · 0"}
              </div>
              {accepted && <p className="mt-2 text-xs leading-5 text-[var(--muted)]">The premium you collected minus the expiry payoff you owe.</p>}
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-md border-l-4 border-[#c9a44c] bg-[#c9a44c]/[0.06] p-4 text-sm leading-7 text-[var(--notice)]">
            The market is playing out automatically: the price may dip first, snap back, then break out. Don't be scared by the swings along the way; a vanilla call ultimately depends only on which side of the strike the expiry price lands.
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
        <div className="text-[var(--muted)]">Generating report.</div>
      </TerminalCard>
    );
  }

  const rows = [
    ["Product", "Vanilla Call"],
    ["Theoretical Price", `${score.theoreticalPrice} pts`],
    ["Your Quote", `${score.selectedQuote} pts`],
    ["Model Profit Margin", `${score.margin >= 0 ? "+" : ""}${score.margin} pts`],
    ["Client Status", score.clientStatus],
    ["Simulated Final Value", `${formatPoints(score.marketFinalPrice)} pts`],
    ["Simulated Payoff", `${score.marketPayoff} pts`],
    ["Client Net P&L", score.quoteAccepted ? `${score.clientPnl >= 0 ? "+" : ""}${score.clientPnl} pts` : "No Deal · 0 pts"],
    ["Desk Settlement", `${score.deskPnl >= 0 ? "+" : ""}${score.deskPnl} pts`],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Day Two End-of-Day Report" accent="Pricing Desk Review" />
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[var(--muted)]">
                {label}
              </div>
              <div className="mt-2 text-xl font-black text-[var(--ink)]">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Pricing Score", score.pricingScore],
            ["Risk Disclosure", score.riskDisclosure],
            ["Overall Score", score.overall],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4"
            >
              <span className="font-terminal text-xs text-[var(--muted)]">{label}</span>
              <ScoreBadge score={value} />
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-[#5b8cff] bg-[var(--surface-2)] p-4 text-base leading-8 text-[var(--ink)]">
          Pricing assessment: {score.pricingComment}
        </div>

        <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm leading-7 text-[var(--ink)]">
          Simulated market path: {score.marketPath.map((price) => formatPoints(price)).join(" → ")}.
          The client's expiry payoff is {score.marketPayoff} points, and the client's net P&L is {score.clientPnl >= 0 ? "+" : ""}{score.clientPnl} points.
        </div>

        <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm leading-7 text-[var(--muted)]">
          Teaching note: a real desk would hedge directional risk (e.g. flattening Delta with futures or offsetting options). What's shown here is the unhedged result of a single trade, used only to understand pricing P&L; it doesn't represent the desk's true risk exposure.
        </div>
      </div>
    </TerminalCard>
  );
}

function Day2CompletePanel() {
  const summary = [
    "A binomial tree shows the possible future price paths.",
    "A vanilla call's expiry payoff is max(final price - strike, 0).",
    "The theoretical price is a quote anchor, not a profit guarantee.",
    "A trader's quote must balance fair value, desk profit, and client acceptance.",
    "The next stage adds a new rule: the knock-out barrier.",
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Day Two Complete" accent="Pricing Training Complete" />
      <div className="flex min-h-[520px] flex-col items-center justify-center p-6 text-center">
        <div className="bg-[linear-gradient(90deg,#5b8cff,#c9a44c)] bg-clip-text text-5xl font-black tracking-[0.12em] text-transparent md:text-6xl">
          Day Two Complete
        </div>
        <div className="mt-8 grid w-full max-w-2xl gap-3 text-left">
          {summary.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm leading-7 text-[var(--ink)]"
            >
              <span className="font-terminal mr-2 text-[var(--accent)]">Rule</span>
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
      <TerminalHeader label="Day Three Morning Meeting" accent="Path-Dependent Products" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-[#c9a44c]/25 bg-[#c9a44c]/[0.06] p-6">
          <div className="font-terminal mb-3 text-xs tracking-[0.2em] text-[var(--notice)]">
            BARRIER OPTION
          </div>
          <h1 className="text-4xl font-black leading-tight text-[var(--ink)] md:text-5xl">
            Not just the destination, but whether it touches a line along the way
          </h1>
          <p className="mt-5 text-base leading-8 text-[var(--ink)]">
            The vanilla options of the past two days were like “settle at the destination.” Day three's barrier option is more like a contract with a red line:
            touch a certain price along the way, and the product's fate changes.
          </p>
        </div>

        <div className="grid gap-4">
          {[
            ["Vanilla Option", "Depends mainly on the final expiry price. No matter how the price swings along the way, it usually doesn't terminate early."],
            ["Barrier Option", "Additionally observes a barrier level. Touch the barrier along the way and the product may knock in or knock out."],
            ["Today's Focus", "An intro to knock-out only: touch the barrier level and the product expires early."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
              <div className="font-terminal text-xs tracking-[0.18em] text-[var(--accent)]">
                {title}
              </div>
              <div className="mt-3 text-sm leading-7 text-[var(--ink)]">{text}</div>
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
      <TerminalHeader label="Lesson 1 / The Barrier Level" accent="The Barrier Is the Contract's Red Line" />
      <div className="space-y-5 p-6">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--accent)]">
            Intuition
          </div>
          <p className="text-lg leading-9 text-[var(--ink)]">
            The barrier isn't a prediction line; it's a
            <span className="font-bold text-[var(--notice)]">contract rule line</span>.
            If the product stipulates “knock out if it falls to 21,000,” then the moment the market touches or drops below 21,000 along the way,
            it must be handled under the knock-out rule even if it later climbs back.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/85 p-5">
          <svg viewBox="0 0 760 260" className="h-auto w-full" role="img" aria-label="Barrier level diagram">
            <defs>
              <linearGradient id="day3PathGlow" x1="0" x2="1">
                <stop offset="0%" stopColor="#5b8cff" />
                <stop offset="100%" stopColor="#c9a44c" />
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
              Lower Barrier {formatPoints(barrier)}
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
                    fill={danger ? "#ef4444" : "#5b8cff"}
                    stroke={danger ? "#fecaca" : "#cdd9f5"}
                    strokeWidth="2"
                  />
                  <text x={x} y={y - 14} textAnchor="middle" className={danger ? "fill-red-300 text-[12px] font-bold" : "fill-[#1f2937] text-[12px]"}>
                    {formatPoints(price)}
                  </text>
                </g>
              );
            })}
            <text x="374" y="238" textAnchor="middle" className="fill-slate-500 text-[13px]">
              The price path runs left to right. A barrier product remembers whether it touched the line along the way.
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
      <TerminalHeader label="Lesson 2 / Knock-Out" accent="No Revival After Knock-Out" />
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["1. Set the Barrier Level", "The contract states, for example: if the HSI falls to 21,000 or below, the product knocks out."],
            ["2. Observe the Whole Path", "Not just the close or expiry. The moment the path touches the barrier, the rule triggers."],
            ["3. Goes to Zero After Knock-Out", "The product expires early. Even if it climbs back at the end, a knocked-out option can't be called back."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
              <div className="font-terminal text-xs tracking-[0.18em] text-[var(--accent)]">
                {title}
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--ink)]">{text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-red-500/25 bg-red-500/[0.06] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--neg)]">
            The Desk's Most Common Misconception
          </div>
          <div className="text-2xl font-black text-[var(--ink)]">
            “It climbed back at the end, so why is there still no payoff?”
          </div>
          <p className="mt-4 text-base leading-8 text-[var(--ink)]">
            Because a barrier option depends on the path. The moment it knocks out along the way, the contract ends early. A beautiful final price
            does nothing for a contract that has already ended.
          </p>
        </div>

        <div className="rounded-lg border border-[#c9a44c]/25 bg-[#c9a44c]/[0.06] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--notice)]">
            Why Set a Barrier?
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [
                "In Exchange for a Lower Premium",
                "By accepting the extra condition of “expires if it touches the line,” the buyer usually gets a product cheaper than a comparable vanilla option.",
              ],
              [
                "To Express a More Refined View",
                "The client doesn't just say “it'll rise”; they may think “it'll rise, but won't first plunge to a certain line.” A barrier writes that view into the contract.",
              ],
              [
                "To Control Desk Risk",
                "When the seller collects a lower premium, they need a rule to cap extreme path risk. The barrier level is that risk boundary.",
              ],
            ].map(([title, text]) => (
              <div key={title} className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4">
                <div className="font-terminal text-xs tracking-[0.16em] text-[var(--accent)]">
                  {title}
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--ink)]">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md border-l-4 border-[#c9a44c] bg-[var(--surface-2)] p-4 text-sm leading-7 text-[var(--notice)]">
            Martin's takeaway: a barrier isn't a free restriction. It makes the product cheaper and better-fitted to a particular market view, but the cost is that the client must take on path risk.
          </div>
        </div>
      </div>
    </TerminalCard>
  );
}

function Day3CompareVanillaPanel({ selectedQuote, quoteAnalysis, onUpdateQuote, onUpdateTheoretical }) {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Pricing Tree" accent="Barrier Pricing" />
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface-2)] p-5">
            <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--accent)]">
              Vanilla Call Option
            </div>
            <div className="text-2xl font-black text-[var(--ink)]">Depends Only on the Final Price</div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--ink)]">
              <li>- No knock-out line</li>
              <li>- Premium is usually more expensive</li>
              <li>- Produces an expiry payoff if the final price is above the strike</li>
            </ul>
            <div className="mt-5 rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4">
              Example premium: <span className="font-black text-[var(--accent)]">{day3Config.market.vanillaPremium} pts</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#c9a44c]/30 bg-[#c9a44c]/[0.06] p-5">
            <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--notice)]">
              Down-and-Out Call Option
            </div>
            <div className="text-2xl font-black text-[var(--ink)]">Cheaper, but Watches the Path</div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--ink)]">
              <li>- Has a lower barrier: {formatPoints(day3Config.market.barrier)}</li>
              <li>- Lower premium</li>
              <li>- Expires early if it touches the barrier along the way</li>
            </ul>
            <div className="mt-5 rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4">
              Example premium: <span className="font-black text-[var(--notice)]">{day3Config.market.premium} pts</span>
            </div>
          </div>
        </div>

        <div className="rounded-md border-l-4 border-[#c9a44c] bg-[#c9a44c]/[0.06] p-4 text-base leading-8 text-[var(--notice)]">
          Martin's mnemonic: a barrier option isn't a “discounted vanilla option.” It's cheap because the client takes on part of the path risk.
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
      <TerminalHeader label="System Notice" accent="New Handbook Page Added" />
      <div className="flex min-h-[430px] flex-col items-center justify-center p-6 text-center">
        <div className="font-terminal mb-4 text-sm tracking-[0.32em] text-[var(--accent)]">
          Handbook Updated
        </div>
        <div className="bg-[linear-gradient(90deg,#5b8cff,#c9a44c)] bg-clip-text text-4xl font-black tracking-[0.08em] text-transparent md:text-5xl">
          Barrier Options
        </div>
        <p className="mt-8 max-w-2xl text-base leading-8 text-[var(--ink)]">
          The new page explains the barrier level, the knock-out rule, why it's cheaper, and the path risk that must be disclosed to the client.
        </p>
      </div>
    </TerminalCard>
  );
}

function Day3ClientArrivalPanel() {
  const client = day3Config.clientProfile;
  const profileRows = [
    ["Name", client.name],
    ["Client Type", client.type],
    ["Market View", client.marketView],
    ["Risk Tolerance", client.riskTolerance],
    ["Goal", client.goal],
    ["Product Need", client.productNeed],
    ["Budget", client.budget],
    ["Experience", client.experience],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Client Profile" accent="Budget-Sensitive Order" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-[#c9a44c]/30 bg-[#c9a44c]/[0.08] font-terminal text-4xl font-black text-[var(--notice)]">
              C
            </div>
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[var(--accent)]">
                Budget-Sensitive Retail Investor
              </div>
              <div className="mt-2 text-2xl font-black text-[var(--ink)]">{client.name}</div>
            </div>
          </div>
          <div className="grid gap-3">
            {profileRows.map(([label, value]) => (
              <div key={label} className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3">
                <div className="font-terminal text-xs tracking-[0.14em] text-[var(--muted)]">
                  {label}
                </div>
                <div className="mt-1 text-sm leading-6 text-[var(--ink)]">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#c9a44c]/20 bg-[#c9a44c]/[0.05] p-5">
          <div className="font-terminal mb-4 text-xs tracking-[0.18em] text-[var(--notice)]">
            Client Dialogue
          </div>
          <div className="space-y-4">
            {client.dialogue.map((line) => (
              <div key={line} className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4 text-base leading-8 text-[var(--ink)]">
                Ms. Chen: “{line}”
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
        <span className="font-terminal text-xs tracking-[0.16em] text-[var(--pos)]">
          📡 {context.title}
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {context.bullets.map((line) => (
          <li key={line} className="flex gap-2 text-sm leading-7 text-[var(--ink)]">
            <span className="text-[var(--pos)]">·</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 border-t border-[var(--border)] pt-2 font-terminal text-[11px] leading-5 text-[var(--muted)]">
        {context.source}
      </div>
    </div>
  );
}

function Day3ClientResponsePanel({ selectedQuote, clientResponse }) {
  const response = clientResponse ?? getDay3QuoteAnalysis(selectedQuote);
  const acceptedText = response.accepted ? "Trade Accepted" : "Client Refused";

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Client Feedback" accent="Barrier Quote Receipt" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--accent)]">
            Quote Record
          </div>
          <div className="text-5xl font-black text-[var(--accent)]">{selectedQuote} pts</div>
          <div className="mt-4 text-sm leading-7 text-[var(--muted)]">
            The barrier quote has been sent; awaiting market settlement.
          </div>
        </div>

        <div className="rounded-lg border border-[#c9a44c]/20 bg-[#c9a44c]/[0.05] p-5">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-md border border-[#c9a44c]/30 bg-black/40 font-terminal text-3xl font-black text-[var(--notice)]">
              C
            </div>
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[var(--notice)]">
                Ms. Chen
              </div>
              <div className="mt-1 text-sm text-[var(--muted)]">{acceptedText}</div>
            </div>
          </div>
          <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-5 text-xl font-black leading-9 text-[var(--ink)]">
            “{response.customerLine}”
          </div>
        </div>
      </div>
    </TerminalCard>
  );
}

function Day3MarketRunPanel({ selectedProduct, selectedQuote, marketHasRun, visibleMarketSteps }) {
  const market = day3Config.market;
  const result = getDay3MarketResult();
  const clientPnl = result.barrierPayoff - Number(selectedQuote);
  const activeCount = Math.min(Math.max(visibleMarketSteps, 1), market.path.length);
  const activePrices = market.path.slice(0, activeCount);
  const latestPrice = activePrices[activePrices.length - 1] ?? market.spot;
  const knockedNow = activePrices.some((price) => price <= market.barrier);
  const selectedProductName =
    day3Config.products.find((product) => product.id === selectedProduct)?.name ?? "No Product Selected";
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
      <TerminalHeader label="Barrier Market Path" accent={finalShown ? "Path Settled" : "Watching the Barrier Level Live"} />
      <div className="space-y-5 p-5">
        <div className="grid gap-4 md:grid-cols-6">
          {[
            ["Underlying", market.underlying],
            ["Spot", formatPoints(market.spot)],
            ["Strike", formatPoints(market.strike)],
            ["Barrier", formatPoints(market.barrier)],
            ["Reference Theoretical Price", `${market.premium} pts`],
            ["Maturity", market.maturity],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs tracking-[0.14em] text-[var(--muted)]">
                {label}
              </div>
              <div className="mt-2 text-lg font-bold text-[var(--ink)]">{value}</div>
            </div>
          ))}
        </div>

        <RealDataContextCard context={market.marketContext} />

        <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-lg border border-[#c9a44c]/20 bg-[#c9a44c]/[0.05] p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-[var(--notice)]">
              Selected Product
            </div>
            <div className="mt-2 text-xl font-black text-[var(--ink)]">{selectedProductName}</div>
            <div className="mt-4 rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm leading-7 text-[var(--ink)]">
              Current price:
              <span className={cn("font-terminal ml-1 text-2xl font-black", knockedNow ? "text-[var(--neg)]" : "text-[var(--accent)]")}>
                {formatPoints(latestPrice)}
              </span>
            </div>
            <div
              className={cn(
                "mt-3 rounded-md border px-3 py-2 font-terminal text-xs tracking-[0.14em]",
                knockedNow
                  ? "border-red-500/40 bg-red-500/[0.08] text-[var(--neg)]"
                  : "border-green-400/30 bg-green-400/[0.06] text-[var(--pos)]",
              )}
            >
              {knockedNow ? "Barrier Touched / Product Knocked Out" : "Barrier Not Yet Touched"}
            </div>
          </div>

          <div className="market-chart-panel rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/85 p-4">
            <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-auto w-full" role="img" aria-label="Day 3 barrier option market path">
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
                Knock-Out Barrier {formatPoints(market.barrier)}
              </text>
              <line x1="58" x2="780" y1={strikeY} y2={strikeY} stroke="#c9a44c" strokeWidth="2" strokeDasharray="6 7" />
              <text x="625" y={strikeY - 10} className="fill-[#c9a44c] text-[13px] font-bold">
                Strike {formatPoints(market.strike)}
              </text>
              <polyline
                points={activeLine}
                fill="none"
                stroke={knockedNow ? "#ef4444" : "#5b8cff"}
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
                      fill={danger ? "#ef4444" : "#5b8cff"}
                      stroke={danger ? "#fecaca" : "#cdd9f5"}
                      strokeWidth="2"
                    />
                    <text
                      x={chart.xScale(index)}
                      y={chart.yScale(price) - 14}
                      textAnchor="middle"
                      className={danger ? "fill-red-300 text-[12px] font-bold" : "fill-[#1f2937] text-[12px]"}
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
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-red-500/25 bg-red-500/[0.06] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[var(--neg)]">
                Knock-Out Result
              </div>
              <div className="mt-2 text-2xl font-black text-[var(--neg)]">
                {result.knockedOut ? `Price point #${result.knockedOutIndex + 1} touched the barrier` : "Not Knocked Out"}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[var(--muted)]">
                Final Price
              </div>
              <div className="mt-2 text-2xl font-black text-[var(--accent)]">
                {formatPoints(result.finalPrice)}
              </div>
            </div>
            <div className="rounded-lg border border-[#c9a44c]/25 bg-[#c9a44c]/[0.06] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[var(--notice)]">
                Client Net P&L
              </div>
              <div className={cn("mt-2 text-2xl font-black", clientPnl >= 0 ? "text-[var(--pos)]" : "text-[var(--neg)]")}>
                {clientPnl >= 0 ? "+" : ""}
                {clientPnl} pts
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[var(--muted)]">Desk Settlement</div>
              <div className={cn("mt-2 text-2xl font-black", -clientPnl >= 0 ? "text-[var(--pos)]" : "text-[var(--neg)]")}>
                {-clientPnl >= 0 ? "+" : ""}{-clientPnl} pts
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
        <div className="text-[var(--muted)]">Generating report.</div>
      </TerminalCard>
    );
  }

  const rows = [
    ["Product", score.productName],
    ["Your Quote", `${score.selectedQuote} pts`],
    ["Client Status", score.clientStatus],
    ["Final Price", `${formatPoints(score.finalPrice)} pts`],
    ["Barrier", `${formatPoints(day3Config.market.barrier)} pts`],
    ["Knock-Out Status", score.knockedOut ? "Knocked Out" : "Not Knocked Out"],
    ["Vanilla Call Expiry Payoff", `${score.vanillaPayoff} pts`],
    [
      "Client Net P&L",
      score.quoteAccepted ? `${score.clientPnl >= 0 ? "+" : ""}${score.clientPnl} pts` : "No Deal · 0 pts",
    ],
    [
      "Desk Settlement",
      score.quoteAccepted ? `${score.deskPnl >= 0 ? "+" : ""}${score.deskPnl} pts` : "No Deal · 0 pts",
    ],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Day Three End-of-Day Report" accent="Barrier Option Review" />
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[var(--muted)]">
                {label}
              </div>
              <div className="mt-2 text-xl font-black text-[var(--ink)]">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Product Suitability", score.suitability],
            ["Risk Disclosure", score.riskDisclosure],
            ["Path Awareness", score.pathAwareness],
            ["Overall Score", score.overall],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4"
            >
              <span className="font-terminal text-xs text-[var(--muted)]">{label}</span>
              <ScoreBadge score={value} />
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-red-400 bg-red-500/[0.06] p-4 text-base leading-8 text-[var(--neg)]">
          Market review: the price dropped below {formatPoints(day3Config.market.barrier)} points along the way, triggering a knock-out.
          Although the final price returned to {formatPoints(score.finalPrice)} points, the knocked-out product had already expired early.
        </div>

        <div className="rounded-md border-l-4 border-[#c9a44c] bg-[#c9a44c]/[0.06] p-4 text-base leading-8 text-[var(--notice)]">
          Martin's review: {score.martinComment}
        </div>
      </div>
    </TerminalCard>
  );
}

function Day3CompletePanel() {
  const summary = [
    "A vanilla option depends mainly on the final expiry price.",
    "A barrier option also depends on whether the path touches the barrier level along the way.",
    "Knock-out means the product expires early once the barrier is touched.",
    "A barrier option is cheaper because the client takes on extra path risk.",
    "For complex products, suitability and risk disclosure matter more than market direction.",
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Day Three Complete" accent="Barrier Training Complete" />
      <div className="flex min-h-[520px] flex-col items-center justify-center p-6 text-center">
        <div className="bg-[linear-gradient(90deg,#5b8cff,#c9a44c)] bg-clip-text text-5xl font-black tracking-[0.12em] text-transparent md:text-6xl">
          Day Three Complete
        </div>
        <div className="mt-8 grid w-full max-w-2xl gap-3 text-left">
          {summary.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm leading-7 text-[var(--ink)]"
            >
              <span className="font-terminal mr-2 text-[var(--accent)]">Rule</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </TerminalCard>
  );
}

// ===== The Day4 CBBC panels below are archived (changed to the pricing live round in 2026-06) =====
// These functions are no longer mounted to MainPanel.panels / BottomActionBar; kept for reference only.
function Day4CbbcIntroPanel_ARCHIVED() {
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Day Four Morning Meeting" accent="Bull, Bear, and the Upper Call Price" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-[#c9a44c]/25 bg-[#c9a44c]/[0.06] p-6">
          <div className="font-terminal mb-3 text-xs tracking-[0.2em] text-[var(--notice)]">
            CBBC
          </div>
          <h1 className="text-4xl font-black leading-tight text-[var(--ink)] md:text-5xl">
            A bull contract is bullish, a bear contract bearish, but both have a danger line
          </h1>
          <p className="mt-5 text-base leading-8 text-[var(--ink)]">
            For now, think of a CBBC as a leveraged barrier product with a mandatory-call mechanism.
            A bull contract bets on a rise, but fears the underlying touching the call price on the way down; a bear contract bets on a fall, but fears the underlying touching the call price on the way up.
            Today we focus specifically on a bear contract's upper call price.
          </p>
        </div>

        <div className="grid gap-4">
          {[
            ["Bull CBBC", "Suited to a bullish view. A rise in the underlying is usually favorable; but if it first falls to or below the lower call price, it triggers an MCE."],
            ["Bear CBBC", "Suited to a bearish view. A fall in the underlying is usually favorable; but if it first rises to or above the upper call price, it triggers an MCE."],
            ["Today's Focus", "A bear contract's danger line is on the upside. The market falling in the end isn't enough; spiking up to the call price along the way already knocks you out."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
              <div className="font-terminal text-xs tracking-[0.18em] text-[var(--accent)]">
                {title}
              </div>
              <div className="mt-3 text-sm leading-7 text-[var(--ink)]">{text}</div>
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
      <TerminalHeader label="System Notice" accent="New Handbook Page Added" />
      <div className="flex min-h-[430px] flex-col items-center justify-center p-6 text-center">
        <div className="font-terminal mb-4 text-sm tracking-[0.32em] text-[var(--accent)]">
          Handbook Updated
        </div>
        <div className="bg-[linear-gradient(90deg,#5b8cff,#c9a44c)] bg-clip-text text-4xl font-black tracking-[0.08em] text-transparent md:text-5xl">
          CBBC
        </div>
        <p className="mt-8 max-w-2xl text-base leading-8 text-[var(--ink)]">
          Today we apply Day 3's barrier rules to the CBBC products common in the Hong Kong market, focusing on a bear contract's upper call price.
        </p>
      </div>
    </TerminalCard>
  );
}

function Day4CbbcClientArrivalPanel_ARCHIVED() {
  const client = day4CbbcConfig_ARCHIVED.clientProfile;
  const profileRows = [
    ["Name", client.name],
    ["Client Type", client.type],
    ["Market View", client.marketView],
    ["Risk Tolerance", client.riskTolerance],
    ["Goal", client.goal],
    ["Product Need", client.productNeed],
    ["Budget", client.budget],
    ["Experience", client.experience],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Client Profile" accent="CBBC Consultation Order" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-[#c9a44c]/30 bg-[#c9a44c]/[0.08] font-terminal text-4xl font-black text-[var(--notice)]">
              Z
            </div>
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[var(--accent)]">
                Active Retail Client
              </div>
              <div className="mt-2 text-2xl font-black text-[var(--ink)]">{client.name}</div>
            </div>
          </div>
          <div className="grid gap-3">
            {profileRows.map(([label, value]) => (
              <div key={label} className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3">
                <div className="font-terminal text-xs tracking-[0.14em] text-[var(--muted)]">
                  {label}
                </div>
                <div className="mt-1 text-sm leading-6 text-[var(--ink)]">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#c9a44c]/20 bg-[#c9a44c]/[0.05] p-5">
          <div className="font-terminal mb-4 text-xs tracking-[0.18em] text-[var(--notice)]">
            Client Dialogue
          </div>
          <div className="space-y-4">
            {client.dialogue.map((line) => (
              <div key={line} className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4 text-base leading-8 text-[var(--ink)]">
                Ms. Zhou: “{line}”
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
      <TerminalHeader label="Suitability Assessment" accent="Judge the Client First, Then the Product" />
      <div className="space-y-5 p-6">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--accent)]">
            Question
          </div>
          <div className="text-2xl font-black text-[var(--ink)]">
            Is Ms. Zhou suitable to evaluate a bear contract?
          </div>
          <p className="mt-4 text-base leading-8 text-[var(--ink)]">
            She's bearish, has high risk tolerance, and understands the MCE risk. The judgment now: can you proceed to recommending a bear contract, rather than mechanically avoiding all CBBCs.
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
                    ? "border-[#c9a44c]/70 bg-[#c9a44c]/[0.08] shadow-[var(--shadow)]"
                    : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[#5b8cff]/45 hover:bg-[var(--surface-2)]",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-terminal text-xs tracking-[0.16em] text-[var(--muted)]">
                      {option.tag}
                    </div>
                    <div className={cn("mt-2 text-xl font-black", selected ? "text-[var(--notice)]" : "text-[var(--accent)]")}>
                      {option.title}
                    </div>
                  </div>
                  {selected && (
                    <div className="font-terminal rounded border border-[#c9a44c]/40 px-2 py-1 text-xs text-[var(--notice)]">
                      Selected
                    </div>
                  )}
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--ink)]">{option.description}</p>
              </button>
            );
          })}
        </div>

        {suitabilityMessage && (
          <div
            className={cn(
              "rounded-md border-l-4 p-4 text-sm leading-7",
              selectedSuitability === day4CbbcConfig_ARCHIVED.scoringRules.correctSuitability
                ? "border-green-400 bg-green-400/[0.06] text-[var(--pos)]"
                : "border-[#c9a44c] bg-[#c9a44c]/[0.06] text-[var(--notice)]",
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
    day4CbbcConfig_ARCHIVED.products.find((product) => product.id === selectedProduct)?.name ?? "No Product Selected";
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
      <TerminalHeader label="CBBC Market Path" accent={finalShown ? "Path Settled" : "Watching for an MCE"} />
      <div className="space-y-5 p-5">
        <div className="grid gap-4 md:grid-cols-6">
          {[
            ["Underlying", market.underlying],
            ["Spot", formatPoints(market.spot)],
            ["Strike", formatPoints(market.strike)],
            ["Bear Contract Call Price", formatPoints(market.cbbcCallPrice)],
            ["Bear Contract Cost", `${market.cbbcEntryCost} pts (about ${market.cbbcLeverage}× leverage, illustrative)`],
            ["Vanilla Put Premium", `${market.vanillaPremium} pts`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs tracking-[0.14em] text-[var(--muted)]">
                {label}
              </div>
              <div className="mt-2 text-lg font-bold text-[var(--ink)]">{value}</div>
            </div>
          ))}
        </div>

        <RealDataContextCard context={market.marketContext} />

        <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-lg border border-[#c9a44c]/20 bg-[#c9a44c]/[0.05] p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-[var(--notice)]">
              Player's Recommendation
            </div>
            <div className="mt-2 text-xl font-black text-[var(--ink)]">{selectedProductName}</div>
            <div className="mt-4 rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm leading-7 text-[var(--ink)]">
              Live HSI:
              <span className={cn("font-terminal ml-1 text-2xl font-black", mceNow ? "text-[var(--neg)]" : "text-[var(--accent)]")}>
                {formatPoints(latestPrice)}
              </span>
            </div>
            <div
              className={cn(
                "mt-3 rounded-md border px-3 py-2 font-terminal text-xs tracking-[0.14em]",
                mceNow
                  ? "border-red-500/40 bg-red-500/[0.08] text-[var(--neg)]"
                  : "border-green-400/30 bg-green-400/[0.06] text-[var(--pos)]",
              )}
            >
              {mceNow ? "Bear CBBC Has Triggered an MCE" : "Bear CBBC Has Not Yet Triggered an MCE"}
            </div>
          </div>

          <div className="market-chart-panel rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/85 p-4">
            <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-auto w-full" role="img" aria-label="Day 4 CBBC market path">
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
                Bear Contract Upper Call Price {formatPoints(market.cbbcCallPrice)}
              </text>
              <line x1="58" x2="780" y1={strikeY} y2={strikeY} stroke="#c9a44c" strokeWidth="2" strokeDasharray="6 7" />
              <text x="612" y={strikeY - 10} className="fill-[#c9a44c] text-[13px] font-bold">
                Vanilla Put Strike {formatPoints(market.strike)}
              </text>
              <polyline
                points={activeLine}
                fill="none"
                stroke={mceNow ? "#ef4444" : "#5b8cff"}
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
                      fill={danger ? "#ef4444" : "#5b8cff"}
                      stroke={danger ? "#fecaca" : "#cdd9f5"}
                      strokeWidth="2"
                    />
                    <text
                      x={chart.xScale(index)}
                      y={chart.yScale(price) - 14}
                      textAnchor="middle"
                      className={danger ? "fill-red-300 text-[12px] font-bold" : "fill-[#1f2937] text-[12px]"}
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
              <div className="font-terminal text-xs tracking-[0.16em] text-[var(--neg)]">
                Bear CBBC Result
              </div>
              <div className="mt-2 text-2xl font-black text-[var(--neg)]">
                {result.mceTriggered ? `Price point #${result.mceIndex + 1} triggered the MCE` : "MCE Not Triggered"}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[var(--muted)]">
                Vanilla Put Net P&L
              </div>
              <div className={cn("mt-2 text-2xl font-black", result.vanillaPnl >= 0 ? "text-[var(--pos)]" : "text-[var(--neg)]")}>
                {result.vanillaPnl >= 0 ? "+" : ""}
                {result.vanillaPnl} pts
              </div>
            </div>
            <div className="rounded-lg border border-[#c9a44c]/25 bg-[#c9a44c]/[0.06] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[var(--notice)]">
                Teaching Conclusion
              </div>
              <div className="mt-2 text-base font-black leading-7 text-[var(--notice)]">
                Falling back at the end doesn't mean a bear contract can revive after an MCE.
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
        <div className="text-[var(--muted)]">Generating report.</div>
      </TerminalCard>
    );
  }

  const rows = [
    ["Client Suitability Decision", score.suitabilityChoice],
    ["Recommended Product", score.productName],
    ["Final Price", `${formatPoints(score.finalPrice)} pts`],
    ["Bear CBBC Status", score.mceTriggered ? "MCE Triggered" : "MCE Not Triggered"],
    ["Bear CBBC P&L", `${score.bearCbbcPnl >= 0 ? "+" : ""}${score.bearCbbcPnl} pts`],
    ["Vanilla Put P&L", `${score.vanillaPnl >= 0 ? "+" : ""}${score.vanillaPnl} pts`],
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Day Four End-of-Day Report" accent="CBBC Suitability Review" />
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="font-terminal text-xs tracking-[0.16em] text-[var(--muted)]">
                {label}
              </div>
              <div className="mt-2 text-xl font-black text-[var(--ink)]">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Suitability", score.suitabilityScore],
            ["Product Recommendation", score.productScore],
            ["Risk Explanation", score.riskDisclosure],
            ["Overall Score", score.overall],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4"
            >
              <span className="font-terminal text-xs text-[var(--muted)]">{label}</span>
              <ScoreBadge score={value} />
            </div>
          ))}
        </div>

        <div className="rounded-md border-l-4 border-red-400 bg-red-500/[0.06] p-4 text-base leading-8 text-[var(--neg)]">
          Path review: the HSI spiked up along the way and touched the bear contract's upper call price of {formatPoints(day4CbbcConfig_ARCHIVED.market.cbbcCallPrice)} points,
          triggering an MCE. Even though it later fell to {formatPoints(score.finalPrice)} points, the bear contract won't automatically recover.
        </div>

        <div className="rounded-md border-l-4 border-[#c9a44c] bg-[#c9a44c]/[0.06] p-4 text-base leading-8 text-[var(--notice)]">
          Martin's review: {score.martinComment}
        </div>
      </div>
    </TerminalCard>
  );
}

function Day4CbbcCompletePanel_ARCHIVED() {
  const summary = [
    "A Bull CBBC is a leveraged bullish product, a Bear CBBC a leveraged bearish product.",
    "A CBBC has a call price; touching it triggers a mandatory call event (MCE).",
    "A bull contract usually watches the lower call price, a bear contract the upper call price.",
    "After an MCE, the product terminates early and residual value is not guaranteed.",
    "Even with the right final direction, you can still lose due to an MCE along the way.",
    "Before recommending a CBBC, you must confirm the client understands leverage, the call price, and residual-value risk.",
  ];

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Day Four Complete" accent="CBBC Suitability Training Complete" />
      <div className="flex min-h-[520px] flex-col items-center justify-center p-6 text-center">
        <div className="bg-[linear-gradient(90deg,#5b8cff,#c9a44c)] bg-clip-text text-5xl font-black tracking-[0.12em] text-transparent md:text-6xl">
          Day Four Complete
        </div>
        <div className="mt-8 grid w-full max-w-2xl gap-3 text-left">
          {summary.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm leading-7 text-[var(--ink)]"
            >
              <span className="font-terminal mr-2 text-[var(--accent)]">Rule</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </TerminalCard>
  );
}
// ===== End of archived Day4 CBBC panels =====

// ===== Day4 Live Round · New panels (generic, index-driven) =====

function Day4BriefingPanel() {
  const steps = [
    ["① Read the Direction", "Is the client bullish or bearish? This decides the product category."],
    ["② Read Risk and Budget", "Can they accept extra conditions (e.g. voided if it drops below a line)? Is the budget tight? This decides vanilla vs barrier."],
    ["③ Compute the Theoretical Price, Then Quote", "Enter the parameters into the calculator, compute the theoretical price, and add a reasonable profit, not too low (giving it away) and not too high (scaring them off)."],
  ];
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Graduation Morning Meeting" accent="Three-Client Pricing Live Round" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-[#c9a44c]/25 bg-[#c9a44c]/[0.06] p-6">
          <div className="font-terminal mb-3 text-xs tracking-[0.2em] text-[var(--notice)]">
            GRADUATION ROUND
          </div>
          <h1 className="text-4xl font-black leading-tight text-[var(--ink)] md:text-5xl">
            No new products: today tests your pricing judgment
          </h1>
          <p className="mt-5 text-base leading-8 text-[var(--ink)]">
            Over the past three days you learned vanilla options, binomial-tree pricing, and barrier options. Today three clients queue up for your quote:
            using only the tools you already know: the vanilla call, the barrier call, and that binomial-tree calculator.
          </p>
          <p className="mt-4 text-base leading-8 text-[var(--ink)]">
            Martin gives you only the general principles; <span className="font-black text-[var(--notice)]">he won't tell you what to pick or what to quote</span>.
            The client reacts if you pick or quote wrong, but the answer is for you to judge.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="font-terminal text-xs tracking-[0.18em] text-[var(--accent)]">
            Martin's General Principles
          </div>
          {steps.map(([title, text]) => (
            <div key={title} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
              <div className="text-lg font-black text-[var(--accent)]">{title}</div>
              <div className="mt-2 text-sm leading-7 text-[var(--ink)]">{text}</div>
            </div>
          ))}
          <div className="rounded-md border-l-4 border-[#c9a44c] bg-[#c9a44c]/[0.06] p-4 text-sm leading-7 text-[var(--notice)]">
            Today's clients: 3, increasing in difficulty with decreasing hints. The last one won't tell you which product they want.
          </div>
        </div>
      </div>
    </TerminalCard>
  );
}

function Day4ClientQueueBadge({ index, total }) {
  return (
    <div className="font-terminal flex items-center gap-2 text-xs tracking-[0.14em] text-[var(--muted)]">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border",
            i === index
              ? "border-[#c9a44c]/70 bg-[#c9a44c]/[0.12] text-[var(--notice)]"
              : i < index
                ? "border-green-400/40 bg-green-400/[0.06] text-[var(--pos)]"
                : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]",
          )}
        >
          {i + 1}
        </span>
      ))}
      <span className="ml-1">Client {index + 1} / {total}</span>
    </div>
  );
}

function Day4ClientProfilePanel({ client, index, total }) {
  const { profile } = client;
  const profileRows = [
    ["Name", profile.name],
    ["Client Type", profile.type],
    ["Market View", profile.marketView],
    ["Risk Tolerance", profile.riskTolerance],
    ["Goal", profile.goal],
    ["Product Need", profile.productNeed],
    ["Budget", profile.budget],
    ["Experience", profile.experience],
  ];
  const isJudge = client.taskType === "judge";

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Client Profile" accent={isJudge ? "Graduation Judgment Order" : "Live Quote Order"} />
      <div className="px-6 pt-5">
        <Day4ClientQueueBadge index={index} total={total} />
      </div>
      <div className="grid gap-6 p-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-[#c9a44c]/30 bg-[#c9a44c]/[0.08] font-terminal text-4xl font-black text-[var(--notice)]">
              {client.avatar}
            </div>
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[var(--accent)]">
                {client.typeLabel}
              </div>
              <div className="mt-2 text-2xl font-black text-[var(--ink)]">{profile.name}</div>
            </div>
          </div>
          <div className="grid gap-3">
            {profileRows.map(([label, value]) => (
              <div key={label} className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3">
                <div className="font-terminal text-xs tracking-[0.14em] text-[var(--muted)]">
                  {label}
                </div>
                <div className="mt-1 text-sm leading-6 text-[var(--ink)]">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-[#c9a44c]/20 bg-[#c9a44c]/[0.05] p-5">
            <div className="font-terminal mb-4 text-xs tracking-[0.18em] text-[var(--notice)]">
              Client Dialogue
            </div>
            <div className="space-y-4">
              {client.dialogue.map((line) => (
                <div
                  key={line}
                  className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4 text-base leading-8 text-[var(--ink)]"
                >
                  {profile.name}: “{line}”
                </div>
              ))}
            </div>
          </div>
          {isJudge && (
            <div className="rounded-md border-l-4 border-[#c9a44c] bg-[#c9a44c]/[0.06] p-4 text-sm leading-7 text-[var(--notice)]">
              Note: he didn't say which product he wants. Next, you have to judge it yourself; sniff out from his budget and his “can accept being voided if it drops below a certain level” whether to go with a vanilla call or a barrier call.
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
    ["S₀ Spot", formatPoints(params.spot)],
    ["K Strike", formatPoints(params.strike)],
    ...(client.mode === "barrier" ? [["Barrier Level", formatPoints(params.barrier)]] : []),
    ["σ Volatility", `${params.sigma}%`],
    ["T Annualized Maturity", `${params.maturity} (${client.mode === "barrier" ? "3 months" : "1 month"})`],
    ["r Risk-Free Rate", `${params.rate}%`],
    ["N Steps", `${params.steps} steps (fixed)`],
  ];
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
      <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--accent)]">
        {client.profile.name}'s Trade Parameters (fill them into the calculator as shown)
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3">
            <div className="font-terminal text-[11px] tracking-[0.12em] text-[var(--muted)]">{label}</div>
            <div className="mt-1 text-lg font-black text-[var(--ink)]">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs leading-6 text-[var(--muted)]">
        The calculator defaults are placeholder minimums; you need to enter these parameters above by hand to compute the theoretical price for {client.profile.name}'s trade.
      </div>
    </div>
  );
}

// Graduation data cards (no outer card shell, embedded above the calculator on the quoting page): reuse the Day2/Day3 data-desk "source it yourself" style.
function Day4SourcingCards({ cards }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
      <div className="mb-3 rounded-md border border-[#5b8cff]/20 bg-[#5b8cff]/[0.05] p-4 text-sm leading-7 text-[var(--ink)]">
        <span className="font-terminal text-[var(--accent)]">Task: </span>
        Mr. He didn't give you a parameter list. You've already judged the product for him; now gather the numbers you need for pricing from the material below yourself:
        <span className="font-black text-[var(--ink)]"> S₀, K, σ, T, r</span>
        , plus this trade's <span className="font-black text-[var(--notice)]">barrier level</span>. No cheat sheet, and no one telling you which number goes in which field. You've graduated; rely on yourself.
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className="rounded-lg border bg-[var(--surface-2)] p-4"
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
            </div>
            <div className="space-y-2">
              {card.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-3 rounded border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2"
                >
                  <span className="font-terminal text-[11px] tracking-[0.1em] text-[var(--muted)] shrink-0">
                    {row.label}
                  </span>
                  <div className="text-right">
                    <span className="font-black text-[var(--ink)] text-sm">{row.value}</span>
                    {row.note && (
                      <div className="mt-0.5 text-[11px] text-[var(--muted)]">{row.note}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs leading-6 text-[var(--muted)]">
        Which data maps to which input field is for you to judge; you've done it many times over the past three days. The calculator defaults are placeholder minimums; fill them in by hand.
      </div>
    </div>
  );
}

function Day4PricingPanel({ client, selectedQuote, onUpdateQuote }) {
  const isBarrier = client.mode === "barrier";
  const isJudge = client.taskType === "judge";
  const quoteHint = isBarrier
    ? `Using the “Down-and-Out Call theoretical price” computed by the calculator, add a reasonable profit, and quote ${client.profile.name} a premium. The barrier product's selling point is that it's cheaper than a vanilla call.`
    : `Using the “Vanilla Call theoretical price” computed by the calculator, add a reasonable profit, and quote ${client.profile.name} a premium.`;
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader
        label="Quote via the Calculator"
        accent={isBarrier ? "Barrier Call · Blind Quote" : "Vanilla Call · Blind Quote"}
      />
      <div className="space-y-5 p-6">
        {isJudge ? (
          <Day4SourcingCards cards={day4HeResearchCards} />
        ) : (
          <Day4ParamCard client={client} />
        )}
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
  const acceptedText = response.accepted ? "Trade Accepted" : "Client Refused";
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Client Feedback" accent="Quote Receipt" />
      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="font-terminal mb-3 text-xs tracking-[0.18em] text-[var(--accent)]">
            Quote Record
          </div>
          <div className="text-5xl font-black text-[var(--accent)]">{selectedQuote} pts</div>
          <div className="mt-4 rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm leading-7 text-[var(--muted)]">
            Theoretical price anchor ≈ <span className="font-black text-[var(--ink)]">{response.theoretical} pts</span>
            , your profit {response.margin >= 0 ? "+" : ""}
            {response.margin} pts.
          </div>
        </div>

        <div className="rounded-lg border border-[#c9a44c]/20 bg-[#c9a44c]/[0.05] p-5">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-md border border-[#c9a44c]/30 bg-black/40 font-terminal text-3xl font-black text-[var(--notice)]">
              {client.avatar}
            </div>
            <div>
              <div className="font-terminal text-xs tracking-[0.18em] text-[var(--notice)]">
                {client.profile.name}
              </div>
              <div className="mt-1 text-sm text-[var(--muted)]">{acceptedText}</div>
            </div>
          </div>
          <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-5 text-xl font-black leading-9 text-[var(--ink)]">
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
      parts.push("Product judgment correct on all three clients: direction, budget, and whether they can accept a knock-out, you read them all right. ");
    } else {
      parts.push(`Product judgment correct on ${correctProductCount}/${clients.length} trades. Pick the wrong product, and no quote, however beautiful, can rescue it. `);
    }
    if (dealCount === clients.length) {
      parts.push(`All three trades filled; you judged the pricing range well. `);
    } else if (dealCount === 0) {
      parts.push(`Not a single trade filled; the quotes were too far from fair value, and every client walked. The model is for keeping discipline. `);
    } else {
      parts.push(`${dealCount}/${clients.length} trades filled. `);
    }
    parts.push("Remember: read the client first, then pick the product, then anchor on the theoretical price and add a reasonable profit. That's everything from these four days.");
    return parts.join("");
  })();

  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Graduation Scorecard" accent="Three-Client Pricing Review" />
      <div className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-[#c9a44c]/25 bg-[#c9a44c]/[0.06] p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-[var(--notice)]">Filled</div>
            <div className="mt-2 text-3xl font-black text-[var(--ink)]">
              {dealCount} / {clients.length} trades
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="font-terminal text-xs tracking-[0.16em] text-[var(--muted)]">Product Judgment</div>
            <div className="mt-2 text-3xl font-black text-[var(--ink)]">
              {correctProductCount} / {clients.length} correct
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <span className="font-terminal text-xs text-[var(--muted)]">Overall Score</span>
            <ScoreBadge score={overall} />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-[var(--border)]">
          <div className="grid grid-cols-[1.1fr_1fr_0.9fr_0.7fr_0.5fr] gap-2 border-b border-[var(--border)] bg-black/40 px-4 py-3 font-terminal text-[11px] tracking-[0.12em] text-[var(--muted)]">
            <span>Client</span>
            <span>Product</span>
            <span>Quote / Theoretical</span>
            <span>Result</span>
            <span>Grade</span>
          </div>
          {results.map((r, i) => {
            const client = clients[i];
            if (!r) {
              return (
                <div
                  key={client.id}
                  className="grid grid-cols-[1.1fr_1fr_0.9fr_0.7fr_0.5fr] gap-2 border-b border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)]"
                >
                  <span>{client.profile.name}</span>
                  <span className="col-span-4">Not Served</span>
                </div>
              );
            }
            return (
              <div
                key={client.id}
                className="grid grid-cols-[1.1fr_1fr_0.9fr_0.7fr_0.5fr] items-center gap-2 border-b border-[var(--border)] px-4 py-3 text-sm"
              >
                <span className="font-bold text-[var(--ink)]">{client.profile.name}</span>
                <span className={cn(r.productCorrect ? "text-[var(--pos)]" : "text-[var(--neg)]")}>
                  {r.productCorrect ? "✓ " : "✗ "}
                  {r.productName}
                </span>
                <span className="text-[var(--ink)]">
                  {r.quote} / {r.theoretical}
                  <span className={cn("ml-1", r.margin >= 0 ? "text-[var(--muted)]" : "text-[var(--neg)]")}>
                    ({r.margin >= 0 ? "+" : ""}
                    {r.margin})
                  </span>
                </span>
                <span className={cn(r.accepted ? "text-[var(--pos)]" : "text-[var(--neg)]")}>
                  {r.accepted ? "Filled" : "No Deal·0"}
                </span>
                <ScoreBadge score={r.grade} />
              </div>
            );
          })}
        </div>

        <div className="rounded-md border-l-4 border-[#c9a44c] bg-[#c9a44c]/[0.06] p-4 text-base leading-8 text-[var(--notice)]">
          Martin's overall: {martinSummary}
        </div>
      </div>
    </TerminalCard>
  );
}

function Day4GraduationPanel() {
  const summary = [
    "Day 1: Understand options. Call is bullish, Put is bearish, the buyer's maximum loss is limited to the premium.",
    "Day 2: Binomial-tree pricing. The theoretical price is the quote anchor, not too low (giving it away) and not too high (scaring them off).",
    "Day 3: Barrier options. The discount comes from path risk (knock-out), not an unconditional reduction.",
    "Day 4: Live quoting. Read the client's direction and budget first, then pick vanilla / barrier, then anchor on the theoretical price and add a reasonable profit.",
  ];
  return (
    <TerminalCard className="scene-enter overflow-hidden">
      <TerminalHeader label="Graduation" accent="New-Trader Pricing Training Complete" />
      <div className="flex min-h-[520px] flex-col items-center justify-center p-6 text-center">
        <div className="bg-[linear-gradient(90deg,#5b8cff,#c9a44c)] bg-clip-text text-5xl font-black tracking-[0.12em] text-transparent md:text-6xl">
          Graduation Complete
        </div>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--ink)]">
          You've walked through the whole process from option basics to live pricing. The pricing discipline a new trader should have, you've practiced it all.
        </p>
        <div className="mt-8 grid w-full max-w-2xl gap-3 text-left">
          {summary.map((item) => (
            <div
              key={item}
              className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm leading-7 text-[var(--ink)]"
            >
              <span className="font-terminal mr-2 text-[var(--accent)]">Recap</span>
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
        instruction="Before confirming the quote, select what you must explain to the client."
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
        title="Barrier Product Selection Desk"
        accent="Select a Structure That Suits the Client"
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
        instruction="Before confirming the barrier option trade, select what you must explain to Ms. Chen."
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
        selectedQuote={selectedQuote}
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
        title="Product Judgment Desk"
        accent="The Client Didn't Say Which, You Decide"
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

const DASHBOARD_DAYS = [
  { day: 1, topic: "Vanilla Calls & Puts" },
  { day: 2, topic: "Binomial Pricing" },
  { day: 3, topic: "Barrier Options" },
  { day: 4, topic: "Graduation Round" },
];

function ProgressDashboard({ profile, progress, onReplayDay, onClose }) {
  const completedCount = DASHBOARD_DAYS.filter(
    (d) => progress?.["day" + d.day],
  ).length;
  const totalDays = DASHBOARD_DAYS.length;
  const percent = Math.round((completedCount / totalDays) * 100);
  const displayName = profile?.name ?? "Guest Trader";

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="scene-enter mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-[0.04em] text-[var(--ink)] md:text-4xl">
            Your progress
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Signed in as{" "}
            <span className="font-terminal text-[var(--accent)]">{displayName}</span>
          </p>
        </div>
        <PrimaryButton tone="ghost" onClick={onClose} aria-label="Back to the game">
          Back
        </PrimaryButton>
      </div>

      <TerminalCard className="mb-8 overflow-hidden">
        <TerminalHeader label="OVERALL COMPLETION" accent={`${completedCount} / ${totalDays} days`} />
        <div className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-terminal text-xs tracking-[0.16em] text-[var(--muted)]">
              Training days completed
            </span>
            <span className="font-terminal text-xl font-black text-[var(--ink)]">{percent}%</span>
          </div>
          <div
            className="h-3 w-full overflow-hidden rounded-full bg-[var(--surface-2)]"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall training completion"
          >
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </TerminalCard>

      <div className="grid gap-4 md:grid-cols-2">
        {DASHBOARD_DAYS.map(({ day, topic }) => {
          const record = progress?.["day" + day];
          const completed = Boolean(record);
          return (
            <TerminalCard key={day} className="overflow-hidden">
              <div className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-terminal text-xs tracking-[0.18em] text-[var(--accent)]">
                      Day {day}
                    </div>
                    <div className="mt-1 text-lg font-black text-[var(--ink)]">{topic}</div>
                  </div>
                  <span
                    className={cn(
                      "font-terminal rounded-full border px-3 py-1 text-[11px] font-bold tracking-[0.12em]",
                      completed
                        ? "border-[var(--pos)]/40 bg-[var(--pos)]/[0.10] text-[var(--pos)]"
                        : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--faint)]",
                    )}
                  >
                    {completed ? "Completed" : "Not started"}
                  </span>
                </div>

                {completed ? (
                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <div className="font-terminal text-[10px] tracking-[0.16em] text-[var(--faint)]">
                        GRADE
                      </div>
                      <div className="font-terminal text-4xl font-black leading-none text-[var(--ink)]">
                        {record.grade}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-terminal text-xl font-black text-[var(--accent)]">
                        {record.score}%
                      </div>
                      <div className="mt-1 text-[11px] text-[var(--muted)]">
                        {formatDate(record.completedAt)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
                    Finish this day to record a grade here.
                  </p>
                )}

                <div className="mt-5 pt-2">
                  <button
                    type="button"
                    onClick={() => onReplayDay(day)}
                    aria-label={`Replay Day ${day}: ${topic}`}
                    className="font-terminal w-full rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-xs font-bold tracking-[0.16em] text-[var(--accent)] transition duration-300 hover:bg-[var(--accent-weak)] hover:text-[var(--accent-strong)]"
                  >
                    {completed ? "Replay" : "Start"}
                  </button>
                </div>
              </div>
            </TerminalCard>
          );
        })}
      </div>
    </div>
  );
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
  // Day4 live round: a generic stage + index-driven client queue
  const [day4ClientIndex, setDay4ClientIndex] = useState(0);
  const [day4Results, setDay4Results] = useState([]);
  const [selectedSuitability, setSelectedSuitability] = useState(null);
  const [suitabilityMessage, setSuitabilityMessage] = useState("");
  const [productMessage, setProductMessage] = useState("");
  const [skipSignal, setSkipSignal] = useState(0);
  const [stageHistory, setStageHistory] = useState([]);
  const stageTrackerRef = useRef({ current: "title_screen", skipNext: false });

  // ===== Progress dashboard + account + persistence =====
  const [profile, setProfile] = useState(loadProfile);
  const [progress, setProgress] = useState(loadProgress);
  const [stageBeforeDashboard, setStageBeforeDashboard] = useState(null);

  // ===== Supabase auth (graceful fallback) =====
  // When Supabase is not configured, authChecked starts true and session stays
  // null so the render path below never shows a gate: the app runs in the same
  // local guest mode it always has. When configured, we resolve the session and
  // gate the app behind AuthScreen until the user signs in.
  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(!isSupabaseConfigured);
  const [authError, setAuthError] = useState("");

  // Resolve the current session on mount and keep it in sync. Only runs when
  // Supabase is configured; otherwise the app stays in local guest mode.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });
    return () => {
      active = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  // When a session becomes available, load (or create) the user's profile and
  // pull their saved progress from Supabase into the same shapes the UI uses.
  useEffect(() => {
    if (!isSupabaseConfigured || !session?.user) return;
    let active = true;
    const user = session.user;

    (async () => {
      // Profile: read the row; create one on first sign in if missing.
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      if (profileRow) {
        setProfile({ name: profileRow.name || "Trader" });
      } else {
        const fallbackName =
          user.user_metadata?.name || (user.email ? user.email.split("@")[0] : "Trader");
        const { error: upsertErr } = await supabase
          .from("profiles")
          .upsert({ id: user.id, name: fallbackName });
        if (upsertErr) console.error("Failed to create profile:", upsertErr.message);
        if (!active) return;
        setProfile({ name: fallbackName });
      }

      // Progress: map cloud rows into { day1, day2, day3, day4 } records.
      const { data: progressRows } = await supabase
        .from("progress")
        .select("day, grade, score, completed_at")
        .eq("user_id", user.id);
      if (!active) return;
      if (progressRows && progressRows.length > 0) {
        const mapped = { ...EMPTY_PROGRESS };
        for (const row of progressRows) {
          mapped["day" + row.day] = {
            grade: row.grade,
            score: row.score,
            completedAt: row.completed_at,
          };
        }
        setProgress(mapped);
      }
    })();

    return () => {
      active = false;
    };
  }, [session]);

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

  // Persist a single day's record. ALWAYS writes local (localStorage + in-memory
  // state) so the no-keys guest path is unchanged. When Supabase is configured
  // and a user is signed in, also upsert the row to the cloud (fire and forget;
  // local is the source of truth for the UI). record = { grade, score, completedAt }.
  const persistDayProgress = (day, record) => {
    setProgress((prev) => ({ ...(prev ?? EMPTY_PROGRESS), ["day" + day]: record }));
    saveDayProgress(day, record);
    if (isSupabaseConfigured && session?.user) {
      supabase
        .from("progress")
        .upsert({
          user_id: session.user.id,
          day,
          grade: record.grade,
          score: record.score,
          completed_at: record.completedAt,
        })
        .then(({ error }) => {
          if (error) console.error("Failed to sync progress to Supabase:", error.message);
        });
    }
  };

  // Persist a day's result once it has a final letter grade. Guarded so each
  // completion is written only once (re-runs overwrite the previous record).
  const recordDayProgress = (day, grade) => {
    if (!grade) return;
    const score = gradeToPercent(grade);
    const existing = progress?.["day" + day];
    if (existing && existing.grade === grade && existing.score === score) {
      return; // already recorded this exact result; skip the write
    }
    persistDayProgress(day, {
      grade,
      score,
      completedAt: new Date().toISOString(),
    });
  };

  useEffect(() => {
    if (day1Score?.overall) recordDayProgress(1, day1Score.overall);
  }, [day1Score]);
  useEffect(() => {
    if (day2Score?.overall) recordDayProgress(2, day2Score.overall);
  }, [day2Score]);
  useEffect(() => {
    if (day3Score?.overall) recordDayProgress(3, day3Score.overall);
  }, [day3Score]);
  // Day4 has no single score object; derive the overall grade from the
  // three-client results once the graduation scorecard is reached.
  useEffect(() => {
    if (currentStage !== "day4_scorecard" && currentStage !== "day4_complete") return;
    const completed = day4Results.filter(Boolean);
    if (completed.length === 0) return;
    const gradeOrder = { A: 4, B: 3, C: 2, D: 1 };
    const avg =
      completed.reduce((sum, r) => sum + (gradeOrder[r.grade] ?? 1), 0) / completed.length;
    const overall = avg >= 3.5 ? "A" : avg >= 2.5 ? "B" : avg >= 1.6 ? "C" : "D";
    recordDayProgress(4, overall);
  }, [currentStage, day4Results]);

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
      setProductMessage("Please select an available product before confirming the recommendation.");
      return;
    }

    if (currentStage === "day3_product_selection") {
      setSelectedDisclosures([]);
      setCurrentStage("day3_risk_disclosure");
      return;
    }

    if (currentStage === "day4_judge") {
      // Client #3: after picking the product, go to the calculator quote (product correctness is scored together when the quote is submitted)
      setCurrentStage("day4_pricing");
      return;
    }

    unlockHandbookEntry("risk_disclosure");
    setCurrentStage("day1_risk_disclosure");
  };

  // Archived (CBBC): the original Day4 suitability judgment, no longer used in the new flow.
  const selectSuitability = (suitabilityId) => {
    const option = day4CbbcConfig_ARCHIVED.suitabilityOptions.find((item) => item.id === suitabilityId);
    if (!option) return;

    setSelectedSuitability(suitabilityId);
    setSuitabilityMessage(option.feedback);
  };

  // Archived (CBBC): the original Day4 suitability confirmation, no longer used in the new flow.
  const confirmSuitability = () => {
    if (!selectedSuitability) {
      setSuitabilityMessage("Please first judge whether the client is suitable for a CBBC.");
      return;
    }

    setSelectedProduct(null);
    setProductMessage("");
    setCurrentStage("day4_product_selection");
  };

  // ===== Day4 live round · client queue scheduling (generic stage + index-driven) =====
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
    // Client #3 must pick the right product first; clients #1/#2 have a named product (correct by default).
    const chosenProductId =
      client.taskType === "judge" ? selectedProduct : client.correctProduct;
    const productName =
      client.taskType === "judge"
        ? (client.judgeProducts?.find((p) => p.id === chosenProductId)?.name ?? "No Product Selected")
        : client.productLabel;
    const productCorrect = chosenProductId === client.correctProduct;
    // Wrong product: no quote, however beautiful, can rescue it; graded D and not filled.
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
          customerLine: "This isn't the product I wanted. I'll pass for now.",
          status: "Product doesn't match, client leaves",
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
    const productName = product?.name ?? "No Product Selected";
    const riskDisclosure = getRiskDisclosureScore();
    const market = day1Config.market;
    const finalPrice = market.path[market.path.length - 1];
    const callPayoff = Math.max(finalPrice - market.strike, 0);
    const callPnl = callPayoff - market.premium;

    if (selectedProduct === "vanilla_call") {
      const overall = riskDisclosure === "A" ? "A" : riskDisclosure === "C" ? "B" : "C";
      return {
        productName,
        outcome: "The call expires in-the-money.",
        payoff: `${callPayoff} pts`,
        premium: `${market.premium} pts`,
        clientPnl: `+${callPnl} pts`,
        suitability: "A",
        riskDisclosure,
        clientOutcome: "A",
        overall,
        martinComment:
          "You matched the client's bullish view with a vanilla call. The client's maximum loss is capped at the premium, and they gained a payoff after the market rose.",
      };
    }

    if (selectedProduct === "vanilla_put") {
      return {
        productName,
        outcome: "The market rose, and the put expires worthless.",
        payoff: "0 pts",
        premium: `${market.premium} pts`,
        clientPnl: `-${market.premium} pts`,
        suitability: "D",
        riskDisclosure,
        clientOutcome: "D",
        overall: "D",
        martinComment:
          "The client was bullish, but you chose a bearish product. Always match the product's direction to the client's market view first.",
      };
    }

    return {
      productName,
      outcome: "The index rose; buying the index directly produced a gain, but the downside loss was not limited.",
      payoff: "+900 pts equivalent gain",
      premium: "No premium",
      clientPnl: "+900 pts equivalent gain",
      suitability: "C",
      riskDisclosure,
      clientOutcome: "B",
      overall: riskDisclosure === "D" ? "D" : "C",
      martinComment:
        "The client did profit from the market rise, but this product didn't meet her need for “limited downside loss.” A good outcome doesn't mean the recommendation was suitable.",
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
        : " Pricing is only the first step. The client must also understand: the model price is not a profit guarantee.";

    return {
      theoreticalPrice: liveTheoretical,
      selectedQuote,
      quoteAccepted: analysis.accepted,
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
    const productName = product?.name ?? "No Product Selected";
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
      ? "You picked the down-and-out call option; direction, budget, and the client's acceptance of extra conditions all match."
      : selectedProduct === "vanilla_call"
        ? "A vanilla call has simpler risk, but didn't meet the client's budget need to lower the premium."
        : selectedProduct === "up_out_call"
          ? "An up-and-out call expires when the market rises too strongly, conflicting with the client's goal of participating in the upside."
          : "This product didn't combine the client's bullish view with their premium budget.";

    const disclosureComment =
      riskDisclosure === "A"
        ? "You also clearly explained the path dependence and knock-out risk."
        : "But the risk disclosure isn't complete enough. A barrier product must stress: a favorable final price doesn't guarantee a payoff.";

    return {
      productName,
      selectedQuote,
      clientStatus: analysis.status,
      quoteAccepted: traded,
      finalPrice: result.finalPrice,
      knockedOut: result.knockedOut,
      vanillaPayoff: result.vanillaPayoff,
      barrierPayoff: result.barrierPayoff,
      clientPnl: traded ? result.barrierPayoff - Number(selectedQuote) : 0,
      deskPnl: traded ? Number(selectedQuote) - result.barrierPayoff : 0,
      suitability,
      riskDisclosure,
      pathAwareness,
      overall,
      martinComment: `${productComment}${disclosureComment}`,
    };
  };

  // Archived (CBBC): the original Day4 bear-contract suitability scoring; the new flow uses submitDay4Quote + Day4ScorecardPanel instead.
  const evaluateDay4Cbbc_ARCHIVED = () => {
    const product = day4CbbcConfig_ARCHIVED.products.find((item) => item.id === selectedProduct);
    const productName = product?.name ?? "No Product Selected";
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
        ? "You picked the bear contract: the direction matches the client's bearish view, and it fits her willingness to take high risk and desire for leverage."
        : selectedProduct === "bull_cbbc"
          ? "A Bull CBBC is a bullish instrument, opposite in direction to the client's bearish view."
          : selectedProduct === "vanilla_put"
            ? "A vanilla put has the right direction and simpler risk, but doesn't provide the CBBC leverage the client wanted."
            : "A vanilla call is a bullish instrument, opposite in direction to the client's bearish view.";

    const disclosureComment =
      riskDisclosure === "A"
        ? "The CBBC risk explanation also fully covers the call price, MCE, residual value, and leverage."
        : "But the CBBC risk explanation isn't complete. The client must understand that after an MCE it won't recover on a market rebound.";

    return {
      suitabilityChoice: suitabilityOption?.title ?? "Not Judged",
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
          ? "This statement would mislead the client. After an MCE, a bear contract won't automatically recover on a market pullback."
          : isDay3Stage
            ? "This statement would mislead the client. A barrier option can't be judged solely on the final expiry price."
            : isDay2Stage
              ? "This statement would mislead the client. The model price is not a profit guarantee."
              : "This statement would mislead the client. A market rise doesn't guarantee a profit after deducting the premium.",
      };
    }

    const missing = correctDisclosureIds.filter((id) => !selectedDisclosures.includes(id));
    if (selectedDisclosures.length === 0) {
      return {
        tone: "warn",
        text: isDay4Stage
          ? "Check the handbook again. The client must understand the call price, MCE, no guaranteed residual value, and leverage risk."
          : isDay3Stage
            ? "Check the handbook again. The client must understand the barrier level, knock-out, and path risk."
            : isDay2Stage
              ? "Check the handbook again. The client must understand premium risk and model risk."
              : "Check the handbook. The client must understand that the premium can be lost, and that the product doesn't guarantee a profit.",
      };
    }

    if (missing.length > 0) {
      return {
        tone: "warn",
        text: isDay4Stage
          ? "Check the handbook again. The client must understand the call price, MCE, no guaranteed residual value, and leverage risk."
          : isDay3Stage
            ? "Check the handbook again. The client must understand the barrier level, knock-out, and path risk."
            : isDay2Stage
              ? "Check the handbook again. The client must understand premium risk and model risk."
              : "Check the handbook. The client must understand that the premium can be lost, and that the product doesn't guarantee a profit.",
      };
    }

    return {
      tone: "good",
      text: isDay4Stage
        ? "Good. These items cover the call price, MCE, no guaranteed residual value, and leverage risk."
        : isDay3Stage
          ? "Good. These items cover path dependence, knock-out, the final-price misconception, and the risk behind the low price."
          : isDay2Stage
            ? "Good. These items cover premium loss, no guaranteed profit, model risk, and the expiry-payoff rules."
            : "Good. These items cover premium loss, the maximum-loss cap, and no guaranteed profit.",
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
      return `${stageConfig[currentStage].mentor} Current quote status: ${quoteAnalysis.label}.`;
    }
    if (currentStage === "day2_risk_disclosure") return disclosureFeedback.text;
    if (currentStage === "day3_risk_disclosure") return disclosureFeedback.text;
    if (currentStage === "day4_client_response" && clientResponse) {
      return `Client feedback: ${clientResponse.status}. Read the client right, pick the right product, then anchor on the theoretical price and add a reasonable profit.`;
    }
    if (currentStage === "day2_client_response" && clientResponse) {
      return `Client feedback: ${clientResponse.status}. A quote isn't only about closing the trade; it's also about whether the desk gets reasonable compensation.`;
    }
    if (currentStage === "day3_client_response" && clientResponse) {
      return `Client feedback: ${clientResponse.status}. The pricing discipline for a barrier product: cheaper than a vanilla call, but still leaving the desk a reasonable profit.`;
    }
    if (currentStage === "day2_market_run" && marketComplete) {
      return "The market closed just above the strike. A vanilla call's expiry payoff = expiry price − strike; whether the desk profits on this trade depends on whether the premium you charged covers that payout.";
    }
    if (currentStage === "day1_market_run" && marketComplete) {
      return "The final price is above the strike. A vanilla call's expiry payoff is the final price minus the strike, then minus the premium to get the net P&L.";
    }
    if (currentStage === "day3_market_run" && marketComplete) {
      return "This is the crux of a barrier option: the final price is above the strike, but it already dropped below the barrier level along the way, and after knocking out the product can't revive.";
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

  // ===== Progress dashboard + account menu navigation =====
  const openDashboard = () => {
    setStageBeforeDashboard(currentStage);
    setHandbookOpen(false);
    setCurrentStage("dashboard");
  };

  const closeDashboard = () => {
    const target = stageBeforeDashboard ?? "title_screen";
    setStageBeforeDashboard(null);
    stageTrackerRef.current.skipNext = true;
    setCurrentStage(target);
  };

  // Replay a day by reusing that day's existing start routine, which resets
  // per-day state (selectedProduct / quote / scores) and jumps to its first stage.
  const dayStarters = { 1: startDay1, 2: startDay2, 3: startDay3, 4: startDay4 };
  const replayDay = (day) => {
    setStageBeforeDashboard(null);
    const starter = dayStarters[day];
    if (starter) {
      starter();
      return;
    }
    // Fallback: jump straight to the day's first stage and clear shared state.
    const firstStageName = { 1: "day1_welcome", 2: "day2_intro", 3: "day3_intro", 4: "day4_intro" };
    setCurrentDay(day);
    setSelectedProduct(null);
    setSelectedQuote(day2Config.quoteRules.defaultQuote);
    setClientResponse(null);
    setCurrentStage(firstStageName[day] ?? "title_screen");
  };

  const signOut = async () => {
    setStageBeforeDashboard(null);
    setHandbookOpen(false);
    setCurrentStage("title_screen");
    if (isSupabaseConfigured) {
      // onAuthStateChange clears the session, which drops us to the AuthScreen.
      setAuthError("");
      const { error } = await supabase.auth.signOut();
      if (error) console.error("Sign out failed:", error.message);
      return;
    }
    // Non-configured (guest) path: reset the local profile as before.
    const guest = { name: "Guest Trader" };
    setProfile(guest);
    saveProfile(guest);
  };

  const actions = {
    startGame: startDay1,
    startDay1,
    startDay2,
    startDay3,
    startDay4,
    openDashboard,
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
    // Day4 live round queue scheduling
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

  // ===== Auth gate (configured mode only) =====
  // While the session is being resolved, show a minimal themed loader. Once
  // resolved with no session, require sign in. When Supabase is not configured
  // authChecked is true and session is null is irrelevant (gate is skipped).
  if (isSupabaseConfigured && !authChecked) {
    return (
      <main className="font-cn relative flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--ink)]">
        <StyleBlock />
        <div className="font-terminal text-sm tracking-[0.18em] text-[var(--muted)]">Loading...</div>
      </main>
    );
  }

  if (isSupabaseConfigured && authChecked && !session) {
    return (
      <main className="font-cn relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--ink)]">
        <StyleBlock />
        <GlobalAtmosphere />
        <AuthScreen authError={authError} setAuthError={setAuthError} />
      </main>
    );
  }

  if (currentStage === "title_screen") {
    return (
      <main
        className="font-cn relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--ink)]"
        onClick={skipCurrentTypewriter}
      >
        <StyleBlock />
        <GlobalAtmosphere />
        <StartScreen onStart={actions.startGame} skipSignal={skipSignal} />
      </main>
    );
  }

  if (currentStage === "dashboard") {
    return (
      <main className="font-cn relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--ink)]">
        <StyleBlock />
        <GlobalAtmosphere />
        <div className="relative z-10 min-h-screen">
          <ProgressDashboard
            profile={profile}
            progress={progress}
            onClose={closeDashboard}
            onReplayDay={replayDay}
          />
        </div>
      </main>
    );
  }

  return (
    <main
      className="font-cn relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--ink)]"
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
          profile={profile}
          onOpenDashboard={openDashboard}
          onSignOut={signOut}
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
          disclosureReady={
            correctDisclosureIds.every((id) => selectedDisclosures.includes(id)) &&
            !selectedDisclosures.includes(misleadingDisclosureId)
          }
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
