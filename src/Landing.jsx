import React from "react";

// Landing page for Central Trader. Matches the game's dark / orange-amber theme.
// "Step into the Desk" launches the game (parent flips the #play route).
// The concept deck (built in ppt-project/) is copied into public/ and served
// at BASE_URL so it works on both Vercel ("/") and GitHub Pages ("/trader-simulator/").

const DECK_PDF = import.meta.env.BASE_URL + "Central-Trader-Deck.pdf";
const DECK_PPTX = import.meta.env.BASE_URL + "Central-Trader-Deck.pptx";
const FILM_YT = "https://www.youtube-nocookie.com/embed/7jtWl-XFoLU";
const FILM_WATCH = "https://youtu.be/7jtWl-XFoLU";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

const Mono = ({ children, className = "" }) => (
  <span
    className={className}
    style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontVariantNumeric: "tabular-nums" }}
  >
    {children}
  </span>
);

const FEATURES = [
  ["Four trading days", "Basics, then binomial-tree pricing, then barrier options, then a live three-client round."],
  ["Real clients to quote", "Mr. Wang wants a call. Ms. Chen wants a barrier. Name your price and live with it."],
  ["A real pricing engine", "The same CRR binomial math runs under the hood. No black box, you build every node."],
  ["Graded at the end", "Quote fair, beat the market, manage the risk. The desk scores you."],
];

const DAYS = [
  ["Day 1", "The Ticket", "Calls, puts, payoff and premium. Read your first option."],
  ["Day 2", "The Price", "Build a binomial tree and price a vanilla call from first principles."],
  ["Day 3", "The Tripwire", "Barrier options. Cheaper, but one touch can knock them out."],
  ["Day 4", "Graduation", "Three clients, live market, real-time P&L. Run the desk."],
];

const CONCEPTS = [
  "Calls & Puts", "Payoff at expiry", "Moneyness", "The Greeks", "Binomial tree",
  "Black–Scholes", "Volatility", "Barrier options", "Put–call parity",
  "Risk-neutral pricing", "Delta hedging",
];

export default function Landing({ onPlay }) {
  const cardBase =
    "rounded-2xl border border-white/10 bg-[#181b23] p-6 transition hover:border-white/20 hover:bg-[#20242e]";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0f1014] text-[#f4f1ea]" style={{ fontFamily: FONT }}>
      {/* ambient glows, same recipe as the game */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(720px_circle_at_6%_-8%,rgba(255,122,77,0.16),transparent_55%),radial-gradient(640px_circle_at_100%_0%,rgba(251,191,36,0.10),transparent_55%)]" />

      <div className="relative z-10">
        {/* NAV */}
        <nav className="sticky top-0 z-30 border-b border-white/10 bg-[#0f1014]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="h-7 w-7 shrink-0 rounded-lg" style={{ background: "linear-gradient(135deg,#ff7a4d,#fbbf24)" }} />
              <Mono className="text-sm font-bold tracking-[0.18em] text-[#f4f1ea]">CENTRAL TRADER</Mono>
            </div>
            <div className="flex items-center gap-5">
              <a href="#film" className="hidden text-sm text-[#a7a299] transition hover:text-[#f4f1ea] sm:inline">Watch</a>
              <a href="#deck" className="hidden text-sm text-[#a7a299] transition hover:text-[#f4f1ea] sm:inline">The deck</a>
              <a href="#how" className="hidden text-sm text-[#a7a299] transition hover:text-[#f4f1ea] sm:inline">How it works</a>
              <button
                onClick={onPlay}
                className="hidden whitespace-nowrap rounded-full bg-[#ff7a4d] px-4 py-2 text-sm font-bold text-[#0b1018] transition hover:brightness-110 sm:block"
              >
                Step into the Desk →
              </button>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <header className="mx-auto max-w-4xl px-5 pt-20 pb-16 text-center sm:pt-28">
          <Mono className="text-xs font-bold tracking-[0.32em] text-[#fbbf24]">DIGITAL INVESTFAIR · HKBU FIN 7870</Mono>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
            Learn to price options by <span className="text-[#ff7a4d]">trading them.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#a7a299]">
            A four-day options desk on the Hang Seng Index. Build the pricing math, quote real clients,
            and find out if your number was fair, all in the browser.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={onPlay}
              className="w-full rounded-full bg-[#ff7a4d] px-7 py-3.5 text-base font-bold text-[#0b1018] shadow-[0_8px_30px_rgba(255,122,77,0.35)] transition hover:brightness-110 sm:w-auto"
            >
              Step into the Desk →
            </button>
            <a
              href="#deck"
              className="w-full rounded-full border border-white/15 px-7 py-3.5 text-center text-base font-semibold text-[#f4f1ea] transition hover:border-white/30 hover:bg-white/5 sm:w-auto"
            >
              See the concepts
            </a>
          </div>
          <Mono className="mt-7 block text-xs tracking-[0.14em] text-[#6f6b62]">
            Hang Seng Index Option · European · cash-settled · HK$50 / point
          </Mono>
        </header>

        {/* FEATURES */}
        <section id="how" className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(([h, b], i) => (
              <div key={h} className={cardBase}>
                <Mono className="text-xs font-bold tracking-[0.2em] text-[#ff7a4d]">0{i + 1}</Mono>
                <h3 className="mt-3 text-lg font-bold">{h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#a7a299]">{b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FILM */}
        <section id="film" className="mx-auto max-w-5xl px-5 py-12">
          <div className="mb-7 text-center">
            <Mono className="text-xs font-bold tracking-[0.26em] text-[#fbbf24]">THE FILM · 12 MINUTES</Mono>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Watch the story first</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#a7a299]">
              A cinematic run through real market history and the four days ahead, before you take the seat.
            </p>
          </div>
          <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            <iframe
              src={FILM_YT}
              title="Central Trader — the film"
              className="h-full w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="mt-3 text-center">
            <a href={FILM_WATCH} target="_blank" rel="noreferrer" className="text-sm text-[#a7a299] transition hover:text-[#f4f1ea]">
              Watch on YouTube ↗
            </a>
          </div>
        </section>

        {/* FOUR DAYS */}
        <section className="mx-auto max-w-6xl px-5 py-12">
          <div className="mb-8 text-center">
            <Mono className="text-xs font-bold tracking-[0.26em] text-[#fbbf24]">FOUR DAYS ON THE DESK</Mono>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">From your first ticket to running the book</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {DAYS.map(([d, t, b]) => (
              <div key={d} className={cardBase + " relative"}>
                <Mono className="text-xs font-bold tracking-[0.18em] text-[#a7a299]">{d}</Mono>
                <h3 className="mt-2 text-xl font-extrabold text-[#ff7a4d]">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#a7a299]">{b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DECK */}
        <section id="deck" className="mx-auto max-w-6xl px-5 py-12">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Mono className="text-xs font-bold tracking-[0.26em] text-[#fbbf24]">THE CONCEPTS, IN 20 SLIDES</Mono>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">The full options primer</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#a7a299]">
                Every idea the game leans on, explained from scratch: payoff, the Greeks, the binomial
                tree, Black–Scholes, volatility, barriers and put–call parity.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <a href={DECK_PDF} target="_blank" rel="noreferrer"
                 className="rounded-full bg-[#fbbf24] px-5 py-2.5 text-sm font-bold text-[#0b1018] transition hover:brightness-110">
                Download PDF
              </a>
              <a href={DECK_PPTX}
                 className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-[#f4f1ea] transition hover:border-white/30 hover:bg-white/5">
                .pptx
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#181b23]">
            <object data={DECK_PDF + "#view=FitH"} type="application/pdf" className="h-[420px] w-full sm:h-[620px]">
              <div className="flex h-full items-center justify-center p-10 text-center text-sm text-[#a7a299]">
                Your browser can’t preview the PDF here.&nbsp;
                <a href={DECK_PDF} target="_blank" rel="noreferrer" className="text-[#ff7a4d] underline">Open it in a new tab.</a>
              </div>
            </object>
          </div>
        </section>

        {/* CONCEPTS CHIPS */}
        <section className="mx-auto max-w-5xl px-5 py-10">
          <div className="flex flex-wrap justify-center gap-2.5">
            {CONCEPTS.map((c) => (
              <Mono key={c} className="rounded-full border border-white/10 bg-[#181b23] px-4 py-2 text-xs tracking-[0.08em] text-[#a7a299]">
                {c}
              </Mono>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div
            className="relative overflow-hidden rounded-3xl border border-white/10 px-8 py-14 text-center"
            style={{ background: "linear-gradient(135deg,rgba(255,122,77,0.14),rgba(251,191,36,0.08))" }}
          >
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Reading is one thing. Quoting a live price is another.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-[#cdc8be]">
              Four days, real clients, one grade. Think you can price it fair?
            </p>
            <button
              onClick={onPlay}
              className="mt-8 rounded-full bg-[#ff7a4d] px-8 py-4 text-base font-bold text-[#0b1018] shadow-[0_8px_30px_rgba(255,122,77,0.4)] transition hover:brightness-110"
            >
              Step into the Desk →
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-7 text-center sm:flex-row sm:text-left">
            <Mono className="text-xs tracking-[0.14em] text-[#6f6b62]">CENTRAL TRADER · DIGITAL INVESTFAIR · FIN 7870</Mono>
            <p className="text-xs italic text-[#6f6b62]">With thanks to Professor Martin, the inspiration behind this project.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
