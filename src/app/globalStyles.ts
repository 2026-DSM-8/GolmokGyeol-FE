import { css } from '@emotion/react'

export const globalStyles = css`
  :root {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #edeae4;
    background: #0d0c0b;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    --background: #0d0c0b;
    --ink: #edeae4;
    --sub: #98938a;
    --muted: #625e58;
    --card: #161514;
    --line: #292724;
    --accent: #ff9f43;
    --halo: rgba(255, 159, 67, .16);
    --quote: #1f1e1c;
    --violet: #a99bf7;
    --orange: #f5946e;
    --green: #63d5aa;
    --pink: #f28fb4;
    --serif: 'Noto Serif KR', 'Iropke Batang', 'Batang', serif;
  }

  * { box-sizing: border-box; }
  html { min-width: 320px; background: var(--background); }
  body { min-width: 320px; min-height: 100vh; margin: 0; background: var(--background); }
  button, input { color: inherit; font: inherit; }
  button, a { -webkit-tap-highlight-color: transparent; }
  button:focus-visible, a:focus-visible, input:focus-visible, [role='slider']:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }
  a { color: inherit; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
    }
  }
`
