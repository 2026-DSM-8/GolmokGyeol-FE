import { css } from '@emotion/react'

export const globalStyles = css`
  :root {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #eae7e0;
    background: #171613;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    --background: #171613;
    --ink: #eae7e0;
    --sub: #9b968b;
    --card: #211f1b;
    --line: #38352f;
    --accent: #d18a2a;
    --halo: rgba(209, 138, 42, .2);
    --quote: #28251f;
    --violet: #7f77dd;
    --orange: #d85a30;
    --green: #1d9e75;
    --pink: #d4537e;
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
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
  .point-violet { color: var(--violet); fill: var(--violet); background: var(--violet); }
  .point-orange { color: var(--orange); fill: var(--orange); background: var(--orange); }
  .point-green { color: var(--green); fill: var(--green); background: var(--green); }
  .point-pink { color: var(--pink); fill: var(--pink); background: var(--pink); }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: none; }
  }
  @keyframes card-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: none; }
  }
  @keyframes halo-breathe {
    0%, 100% { opacity: .18; transform: scale(.88); }
    50% { opacity: .3; transform: scale(1.12); }
  }
  @keyframes drift-0 {
    0% { transform: translate(0, 0); }
    50% { transform: translate(14px, -10px); }
    100% { transform: translate(-10px, 12px); }
  }
  @keyframes drift-1 {
    0% { transform: translate(0, 0); }
    50% { transform: translate(-12px, 8px); }
    100% { transform: translate(9px, -13px); }
  }
  @keyframes drift-2 {
    0% { transform: translate(0, 0); }
    50% { transform: translate(8px, 12px); }
    100% { transform: translate(-13px, -8px); }
  }

  .landing-page {
    position: relative;
    height: 100vh;
    min-height: 680px;
    overflow: hidden;
    color: var(--ink);
    background: var(--background);
  }
  .taste-backdrop {
    position: absolute;
    inset: 0;
    filter: blur(6px);
    opacity: .5;
    pointer-events: none;
  }
  .backdrop-dot {
    position: absolute;
    display: block;
    aspect-ratio: 1;
    border-radius: 50%;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
  .drift-0 { animation-name: drift-0; }
  .drift-1 { animation-name: drift-1; }
  .drift-2 { animation-name: drift-2; }
  .landing-content {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: fade-up 700ms cubic-bezier(.2, .6, .3, 1) both;
  }
  .landing-brand {
    margin: 0;
    color: var(--sub);
    font-size: 12px;
    letter-spacing: .55em;
    text-indent: .55em;
  }
  .landing-content h1 {
    margin: 20px 0 0;
    color: var(--ink);
    font-family: var(--serif);
    font-size: clamp(28px, 4.6vw, 42px);
    font-weight: 500;
    line-height: 1.5;
    text-align: center;
  }
  .landing-lede { margin: 14px 0 0; color: var(--sub); font-size: 15px; text-align: center; }
  .search-form {
    display: flex;
    align-items: center;
    gap: 6px;
    width: min(560px, 86vw);
    margin-top: 38px;
    padding: 6px 6px 6px 24px;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: var(--card);
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }
  .search-form:focus-within { border-color: var(--sub); box-shadow: 0 0 0 5px var(--halo); }
  .search-form input {
    flex: 1;
    min-width: 0;
    padding: 8px 0;
    border: 0;
    outline: 0;
    color: var(--ink);
    background: transparent;
    font-size: 15px;
    letter-spacing: .01em;
  }
  .search-form input::placeholder { color: var(--sub); opacity: .65; }
  .search-form button {
    flex: none;
    padding: 10px 22px;
    border: 0;
    border-radius: 999px;
    color: var(--background);
    background: var(--ink);
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }
  .search-examples { max-width: min(640px, 90vw); margin-top: 20px; }
  .search-examples > div { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
  .search-examples button {
    padding: 8px 16px;
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--sub);
    background: transparent;
    cursor: pointer;
    font-size: 13px;
    letter-spacing: .01em;
    transition: color 150ms ease, border-color 150ms ease;
  }
  .search-examples button:hover { color: var(--ink); border-color: var(--sub); }
  .landing-footer { margin-top: 56px; color: var(--sub); font-size: 12px; letter-spacing: .08em; }

  .map-page { min-height: 100vh; color: var(--ink); background: var(--background); }
  .map-query-header { padding: 18px 24px 0; }
  .map-query-row { display: flex; align-items: center; gap: 10px; }
  .map-back-button {
    padding: 4px 8px 4px 0;
    border: 0;
    color: var(--ink);
    background: transparent;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
  }
  .map-query-pill, .map-query-form input {
    max-width: 72vw;
    padding: 9px 18px;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--ink);
    background: var(--card);
    font-size: 14px;
    letter-spacing: .01em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .map-query-pill { cursor: text; }
  .map-query-form { display: flex; flex: 1; }
  .map-query-form input { width: min(520px, 72vw); outline: 0; border-color: var(--sub); }
  .map-query-chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px 0 0 26px; }
  .map-query-chips button {
    padding: 6px 14px;
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--sub);
    background: transparent;
    cursor: pointer;
    font-size: 12.5px;
    letter-spacing: .01em;
  }
  .map-query-chips button:hover { color: var(--ink); border-color: var(--sub); }
  .map-layout {
    --map-size: clamp(620px, calc(100vh - 147px), 760px);
    display: grid;
    grid-template-columns: minmax(0, var(--map-size)) minmax(320px, 440px);
    align-items: flex-start;
    justify-content: center;
    gap: 28px;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 22px 24px 44px;
  }
  .map-column { min-width: 0; }
  .taste-map-shell {
    position: relative;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 1;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: var(--card);
    touch-action: none;
  }
  .taste-map { display: block; width: 100%; height: 100%; user-select: none; }
  .map-base { fill: var(--card); }
  .axis-line { fill: none; stroke: var(--line); stroke-width: 1; stroke-dasharray: 5 5; }
  .axis-label { fill: var(--sub); font-size: 18px; letter-spacing: .05em; }
  .quadrant-label { font-size: 17px; letter-spacing: .06em; opacity: .75; }
  .restaurant-point { cursor: pointer; opacity: .3; transition: opacity 150ms ease, r 150ms ease; }
  .restaurant-point.recommended { opacity: 1; }
  .restaurant-point:hover { opacity: 1; }
  .taste-point { cursor: grab; outline: none; }
  .is-dragging .taste-point { cursor: grabbing; }
  .taste-halo { fill: var(--accent); transform-box: fill-box; transform-origin: center; animation: halo-breathe 3.2s ease-in-out infinite; }
  .taste-core { fill: var(--accent); }
  .recommendation-rail { min-width: 0; }
  .taste-traits { min-height: 22px; margin: 0 0 12px; color: var(--sub); font-size: 13px; letter-spacing: .03em; }
  .taste-traits span { display: inline-block; width: 8px; height: 8px; margin-right: 8px; border-radius: 50%; background: var(--accent); }
  .recommendation-list { display: flex; flex-direction: column; gap: 12px; }
  .recommendation-card {
    width: 100%;
    padding: 16px 18px;
    border: 1px solid var(--line);
    border-radius: 14px;
    color: var(--ink);
    background: var(--card);
    cursor: pointer;
    text-align: left;
    animation: card-in 240ms cubic-bezier(.4, 0, .2, 1) var(--card-delay) both;
    transition: border-color 150ms ease;
  }
  .recommendation-card:hover { border-color: var(--sub); }
  .card-title-row { display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px; }
  .card-swatch { align-self: center; flex: none; width: 8px; height: 8px; border-radius: 50%; }
  .card-title-row h3 { margin: 0; font-family: var(--serif); font-size: 17px; font-weight: 500; }
  .card-meta { color: var(--sub); font-size: 12px; white-space: nowrap; }
  .hidden-badge { padding: 2px 8px; border-radius: 999px; color: var(--accent); background: var(--halo); font-size: 11px; white-space: nowrap; }
  .recommendation-card blockquote { margin: 8px 0 0; overflow: hidden; color: var(--sub); font-size: 13.5px; line-height: 1.65; text-overflow: ellipsis; white-space: nowrap; }

  .detail-page { min-height: 100vh; color: var(--ink); background: var(--background); animation: fade-up 400ms cubic-bezier(.2, .6, .3, 1) both; }
  .detail-container { width: 100%; max-width: 760px; margin: 0 auto; padding: 24px 24px 64px; }
  .detail-back-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px 4px 0;
    border: 0;
    color: var(--ink);
    background: transparent;
    cursor: pointer;
    font-size: 14px;
  }
  .detail-back-button span { font-size: 18px; line-height: 1; }
  .detail-summary { margin-top: 28px; }
  .detail-summary h1 { margin: 0; font-family: var(--serif); font-size: 34px; font-weight: 500; line-height: 1.4; }
  .detail-meta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 8px; color: var(--sub); font-size: 13px; }
  .detail-keywords { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
  .detail-keywords span { padding: 5px 13px; border-radius: 999px; background: var(--quote); font-size: 12.5px; white-space: nowrap; }
  .review-evidence { margin-top: 28px; }
  .section-kicker { margin: 0; color: var(--sub); font-size: 11.5px; letter-spacing: .12em; }
  .review-evidence h2 { margin: 6px 0 0; font-family: var(--serif); font-size: 17px; font-weight: 500; }
  .review-quote-list { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }
  .review-quote-list blockquote { margin: 0; padding: 14px 16px; border-radius: 12px; background: var(--quote); }
  .review-quote-list p { margin: 0; font-size: 14px; line-height: 1.7; }
  .review-quote-list a { display: inline-block; margin-top: 6px; color: var(--sub); font-size: 11.5px; text-decoration: none; white-space: nowrap; }
  .review-quote-list a:hover { color: var(--ink); text-decoration: underline; }
  .detail-map-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 26px; }
  .detail-map-card svg, .location-map { display: block; width: 100%; aspect-ratio: 1; overflow: hidden; border-radius: 12px; }
  .detail-map-base { fill: var(--quote); }
  .detail-map-axis { fill: none; stroke: var(--line); stroke-width: .28; stroke-dasharray: 1 1; }
  .detail-map-dot { opacity: .25; }
  .detail-map-active { filter: drop-shadow(0 0 1.4px var(--accent)); }
  .detail-map-card p { margin: 8px 0 0; color: var(--sub); font-size: 12px; text-align: center; }
  .location-map { position: relative; background: var(--quote); }
  .road { position: absolute; display: block; background: var(--card); }
  .road-horizontal { top: 42%; right: 0; left: 0; height: 11%; opacity: .8; }
  .road-vertical { top: 0; bottom: 0; left: 28%; width: 9%; opacity: .8; }
  .road-diagonal { top: -10%; bottom: -10%; left: 64%; width: 7%; opacity: .6; transform: rotate(14deg); }
  .location-pin { position: absolute; top: 38%; left: 22%; width: 12px; height: 12px; margin: -6px 0 0 -6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 6px var(--halo); }
  .detail-actions { display: flex; gap: 10px; max-width: 480px; margin-top: 32px; }
  .detail-actions button, .detail-actions a {
    flex: 1;
    padding: 12px 16px;
    border-radius: 999px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    text-decoration: none;
  }
  .detail-actions button { border: 0; color: var(--background); background: var(--ink); }
  .detail-actions a { border: 1px solid var(--line); color: var(--ink); background: transparent; }

  @media (max-width: 900px) {
    .map-layout { display: flex; flex-direction: column; }
    .map-column, .recommendation-rail { width: 100%; }
  }

  @media (max-width: 640px) {
    .landing-content { padding: 20px; }
    .landing-content h1 { font-size: 30px; }
    .landing-lede { font-size: 13px; }
    .search-examples > div { flex-direction: column; }
    .search-examples button { width: 100%; }
    .map-query-header { padding: 16px 16px 0; }
    .map-query-pill, .map-query-form input { max-width: calc(100vw - 68px); }
    .map-query-chips { padding-left: 26px; }
    .map-layout { gap: 20px; padding: 18px 16px 36px; }
    .axis-label { font-size: 22px; }
    .quadrant-label { font-size: 20px; }
    .recommendation-rail { min-width: 0; }
    .detail-container { padding: 20px 18px 48px; }
    .detail-summary h1 { font-size: 30px; }
    .detail-map-grid { gap: 8px; }
    .detail-map-card p { min-height: 38px; }
    .detail-actions { max-width: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  }
`
