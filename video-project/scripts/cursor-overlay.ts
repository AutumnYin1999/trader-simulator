// cursor-overlay.ts — CSS cursor + click ripple, adopted from playwright-recording skill.
export const CURSOR_INIT_SCRIPT = `
(() => {
  const css = \`
    #__cursor { position: fixed; width: 24px; height: 24px; border-radius: 50%;
      background: rgba(58,160,255,0.9); pointer-events: none; z-index: 2147483647;
      transition: transform 0.05s linear; }
    #__ripple { position: fixed; width: 60px; height: 60px; border-radius: 50%;
      border: 3px solid rgba(58,160,255,0.9); pointer-events: none; z-index: 2147483646;
      transform: translate(-50%, -50%) scale(0); }
    @keyframes rip { from { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                     to   { transform: translate(-50%, -50%) scale(1.4); opacity: 0; } }
    #__ripple.go { animation: rip 0.6s ease-out forwards; }
  \`;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
  const c = document.createElement('div'); c.id = '__cursor'; document.body.appendChild(c);
  const r = document.createElement('div'); r.id = '__ripple'; document.body.appendChild(r);
  (window as any).__moveCursor = (x: number, y: number) => { c.style.transform = \`translate(\${x}px, \${y}px)\`; };
  (window as any).__ripple = (x: number, y: number) => {
    r.style.left = x + 'px'; r.style.top = y + 'px';
    r.classList.remove('go'); void r.offsetWidth; r.classList.add('go');
  };
})();
`;

export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
