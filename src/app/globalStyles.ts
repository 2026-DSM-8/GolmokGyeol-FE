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
  @keyframes gk-pulse {
    0%, 100% { opacity: .35; }
    50% { opacity: .7; }
  }
  @keyframes loading-line {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
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
    min-height: 740px;
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
  .landing-search {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: min(620px, 90vw);
    margin-top: 34px;
  }
  .location-filter {
    display: grid;
    grid-template-columns: 1fr auto 1fr auto 1fr;
    align-items: end;
    gap: 10px;
    width: 100%;
    padding: 14px 18px;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: rgba(33, 31, 27, .88);
    backdrop-filter: blur(12px);
  }
  .location-filter label { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
  .location-filter label > span { color: var(--sub); font-size: 11px; letter-spacing: .08em; }
  .location-filter select {
    width: 100%;
    min-width: 0;
    padding: 9px 30px 9px 11px;
    border: 1px solid var(--line);
    border-radius: 10px;
    outline: 0;
    color: var(--ink);
    background: var(--quote);
    cursor: pointer;
    font: inherit;
    font-size: 13px;
  }
  .location-filter select:focus { border-color: var(--sub); box-shadow: 0 0 0 3px var(--halo); }
  .location-filter select:disabled { color: var(--sub); cursor: not-allowed; opacity: .5; }
  .location-filter select[aria-invalid='true'] { border-color: var(--orange); }
  .location-divider { align-self: center; margin-top: 16px; color: var(--sub); font-size: 18px; }
  .search-form {
    display: flex;
    align-items: center;
    gap: 6px;
    width: min(560px, 100%);
    margin-top: 12px;
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
  .search-error { align-self: stretch; margin: 9px 2px 0; color: #df7b58; font-size: 12.5px; text-align: center; }
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

  .prototype-flow { position: relative; min-height: 100dvh; overflow: hidden; background: var(--background); }
  .prototype-flow > .taste-backdrop { position: fixed; z-index: 0; filter: blur(14px); opacity: .18; }
  .prototype-flow > :not(.taste-backdrop) { position: relative; z-index: 1; }
  .prototype-enter { opacity: 0; animation: fade-up 460ms cubic-bezier(.4, 0, .2, 1) forwards; }
  .delay-0 { animation-delay: 0ms; }
  .delay-1 { animation-delay: 80ms; }
  .delay-2 { animation-delay: 160ms; }
  .delay-3 { animation-delay: 240ms; }
  .delay-4 { animation-delay: 320ms; }
  .delay-5 { animation-delay: 520ms; }
  .prototype-brand, .prototype-wordmark {
    margin: 0;
    color: var(--muted);
    font-size: 14px;
    font-weight: 400;
    letter-spacing: .18em;
  }
  .neighborhood-page {
    min-height: 100dvh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    color: var(--ink);
  }
  .neighborhood-content { width: 100%; max-width: 680px; padding: 88px 24px; display: flex; flex-direction: column; }
  .neighborhood-content .prototype-brand { text-align: center; }
  .neighborhood-content h1 { margin: 48px 0 0; font-size: 40px; font-weight: 500; line-height: 1.3; letter-spacing: -.02em; text-align: center; }
  .neighborhood-lede { margin: 14px 0 0; color: var(--sub); font-size: 18px; line-height: 1.7; letter-spacing: -.01em; text-align: center; }
  .neighborhood-search-wrap { margin-top: 52px; }
  .prototype-search-field {
    display: flex;
    align-items: center;
    gap: 14px;
    height: 64px;
    padding: 0 24px;
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--muted);
    background: var(--card);
    transition: border-color 150ms cubic-bezier(.4, 0, .2, 1);
  }
  .prototype-search-field.is-focused { border-color: var(--accent); }
  .prototype-search-field > svg { flex: none; width: 24px; height: 24px; }
  .prototype-search-field input { flex: 1; min-width: 0; height: 100%; padding: 0; border: 0; outline: 0; color: var(--ink); background: transparent; font-size: 18px; letter-spacing: -.01em; }
  .prototype-search-field input::placeholder { color: var(--muted); opacity: 1; }
  .frequent-neighborhoods { margin-top: 28px; }
  .frequent-neighborhoods h2 { margin: 0; color: var(--sub); font-size: 15px; font-weight: 400; line-height: 1.5; }
  .neighborhood-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 14px; }
  .neighborhood-grid button {
    position: relative;
    height: 88px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 4px;
    min-width: 0;
    padding: 0 20px;
    border: 1px solid var(--line);
    border-radius: 12px;
    color: var(--muted);
    background: var(--card);
    cursor: pointer;
    text-align: left;
    transition: all 150ms cubic-bezier(.4, 0, .2, 1);
  }
  .neighborhood-grid button:hover { border-color: #3a3733; background: var(--quote); transform: translateY(-1px); }
  .neighborhood-grid button:active { transform: scale(.98); }
  .neighborhood-name { max-width: 100%; overflow: hidden; color: var(--ink); font-size: 18px; font-weight: 500; letter-spacing: -.01em; text-overflow: ellipsis; white-space: nowrap; }
  .neighborhood-grid button > span:not(.neighborhood-name) { color: var(--muted); font-size: 14px; }
  .neighborhood-grid small { position: absolute; right: 11px; bottom: 8px; max-width: calc(100% - 22px); overflow: hidden; color: var(--muted); font-size: 11px; font-weight: 400; text-overflow: ellipsis; white-space: nowrap; opacity: .8; }
  .neighborhood-empty { margin: 16px 0 0; color: var(--muted); font-size: 13px; text-align: center; }
  .nearby-button {
    width: 100%; height: 60px; margin-top: 36px; display: flex; align-items: center; justify-content: center; gap: 10px;
    border: 1px solid var(--line); border-radius: 10px; color: var(--sub); background: transparent; cursor: pointer; font-size: 17px; letter-spacing: -.01em;
    transition: all 150ms cubic-bezier(.4, 0, .2, 1);
  }
  .nearby-button:hover { border-color: #3a3733; color: var(--ink); background: var(--quote); }
  .nearby-button:active { transform: scale(.98); }

  .prototype-search-page { min-height: 100dvh; color: var(--ink); background: transparent; }
  .prototype-search-page.is-sharp ~ .taste-backdrop, .prototype-search-page.is-sharp + .taste-backdrop { filter: blur(5px); }
  .prototype-topbar {
    position: relative;
    z-index: 2;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    border-bottom: 1px solid var(--line);
    background: rgba(13, 12, 11, .72);
    backdrop-filter: blur(8px);
  }
  .prototype-topbar > div { display: flex; align-items: center; gap: 16px; }
  .prototype-topbar > div > span { color: var(--sub); font-size: 13px; letter-spacing: -.01em; }
  .prototype-topbar button { height: 28px; padding: 0 12px; border: 1px solid var(--line); border-radius: 8px; color: var(--sub); background: transparent; cursor: pointer; font-size: 13px; }
  .prototype-topbar button:hover { border-color: #3a3733; color: var(--ink); background: var(--quote); }
  .prototype-search-stage { display: flex; justify-content: center; }
  .search-view, .reask-view { width: 100%; max-width: 720px; display: flex; flex-direction: column; }
  .search-view { padding: 108px 24px 96px; }
  .search-view h1, .reask-view h1 { margin: 0; color: var(--ink); font-size: 40px; font-weight: 500; line-height: 1.3; letter-spacing: -.02em; }
  .search-view-lede { margin: 22px 0 0; color: var(--sub); font-size: 18px; line-height: 1.7; letter-spacing: -.01em; }
  .prototype-query-form { margin-top: 46px; }
  .prototype-query-form .prototype-search-field { height: 68px; padding: 0 12px 0 24px; }
  .prototype-query-form .prototype-search-field > button {
    flex: none; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; padding: 0;
    border: 0; border-radius: 50%; color: var(--muted); background: var(--quote); cursor: pointer; transition: all 150ms cubic-bezier(.4, 0, .2, 1);
  }
  .prototype-query-form .prototype-search-field > button.is-ready { color: var(--background); background: var(--accent); }
  .prototype-example-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 20px; }
  .prototype-example-grid button {
    height: 58px; display: flex; align-items: center; padding: 0 20px; border: 1px solid var(--line); border-radius: 10px;
    color: var(--sub); background: var(--card); cursor: pointer; font-size: 16px; letter-spacing: -.01em; text-align: left; transition: all 150ms cubic-bezier(.4, 0, .2, 1);
  }
  .prototype-example-grid button:hover { border-color: #3a3733; color: var(--ink); background: var(--quote); }
  .reask-view { padding: 96px 24px; }
  .reask-query { display: flex; align-items: center; gap: 10px; padding: 0; border: 0; color: var(--sub); background: transparent; cursor: pointer; font-size: 20px; font-weight: 500; letter-spacing: -.01em; text-align: left; }
  .reask-divider { height: 1px; margin-top: 24px; background: var(--line); }
  .reask-view h1 { margin-top: 32px; font-size: 28px; line-height: 1.35; white-space: pre-line; }
  .reask-view > p { margin: 20px 0 0; color: var(--sub); font-size: 15px; line-height: 1.7; letter-spacing: -.01em; white-space: pre-line; }
  .reask-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 40px; }
  .reask-option { height: 96px; padding: 0 16px; border: 1px solid var(--line); border-radius: 12px; color: var(--ink); background: var(--card); cursor: pointer; font-size: 15px; font-weight: 500; letter-spacing: -.01em; transition: all 150ms cubic-bezier(.4, 0, .2, 1); }
  .reask-option:hover { background: var(--quote); }
  .reask-option.option-0:hover { border-color: var(--violet); color: var(--violet); }
  .reask-option.option-1:hover { border-color: var(--orange); color: var(--orange); }
  .reask-option.option-2:hover { border-color: var(--green); color: var(--green); }
  .reask-option.option-3:hover { border-color: var(--pink); color: var(--pink); }
  .reask-direct-label { margin-top: 32px; color: var(--muted); font-size: 13px; }
  .reask-input { height: 52px; margin-top: 12px; padding: 0 20px; border: 1px solid var(--line); border-radius: 999px; background: var(--card); }
  .reask-input.is-focused { border-color: var(--accent); }
  .reask-input input { width: 100%; height: 100%; padding: 0; border: 0; outline: 0; color: var(--ink); background: transparent; font-size: 15px; }
  .show-all-button { width: 100%; height: 48px; margin-top: 32px; border: 0; border-top: 1px solid var(--line); color: var(--muted); background: transparent; cursor: pointer; font-size: 14px; }
  .show-all-button:hover { color: var(--sub); }

  .map-page { display: flex; flex-direction: column; height: 100dvh; min-height: 640px; overflow: hidden; color: var(--ink); background: var(--background); }
  .map-query-header {
    flex: none;
    display: flex;
    align-items: center;
    gap: 16px;
    height: 56px;
    padding: 0 20px;
    border-bottom: 1px solid var(--line);
  }
  .map-back-button {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0 0 2px;
    border: 1px solid var(--line);
    border-radius: 8px;
    color: var(--sub);
    background: transparent;
    cursor: pointer;
    font-size: 25px;
    line-height: 1;
  }
  .map-back-button:hover, .map-edit-button:hover { color: var(--ink); border-color: #3a3733; background: var(--quote); }
  .map-location-name { flex: none; color: var(--sub); font-size: 13px; letter-spacing: .14em; }
  .map-current-query {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--ink);
    font-size: 15px;
    letter-spacing: -.01em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .map-query-form { display: flex; flex: 1; min-width: 0; }
  .map-query-form input { width: 100%; padding: 7px 12px; outline: 0; border: 1px solid var(--accent); border-radius: 8px; background: var(--card); }
  .map-edit-button {
    flex: none;
    height: 32px;
    padding: 0 14px;
    border: 1px solid var(--line);
    border-radius: 8px;
    color: var(--sub);
    background: transparent;
    cursor: pointer;
    font-size: 13px;
  }
  .map-result-summary {
    flex: none;
    display: flex;
    align-items: center;
    min-height: 48px;
    padding: 12px 20px;
    border-bottom: 1px solid var(--line);
    background: var(--card);
  }
  .map-result-summary p { margin: 0; color: var(--sub); font-size: 15px; line-height: 1.5; letter-spacing: -.01em; }
  .map-result-summary strong, .map-result-summary span { color: var(--ink); font-weight: 400; }
  .map-layout {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: auto minmax(440px, 1fr);
    align-items: stretch;
    width: 100%;
  }
  .map-column {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: min(calc(100dvh - 104px), calc(100vw - 440px));
    min-width: 0;
    min-height: 0;
    background: var(--background);
  }
  .taste-map-shell {
    position: relative;
    flex: none;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 1;
    border: 0;
    border-radius: 0;
    background: var(--background);
    touch-action: none;
  }
  .taste-map { display: block; width: 100%; height: 100%; user-select: none; }
  .map-base { fill: var(--background); }
  .axis-line { fill: none; stroke: var(--line); stroke-width: 1.4; stroke-dasharray: 6 6; }
  .axis-label {
    fill: #d2cec5;
    font-size: 24px;
    font-weight: 650;
    letter-spacing: .04em;
    paint-order: stroke;
    stroke: var(--background);
    stroke-width: 8px;
    stroke-linejoin: round;
  }
  .quadrant-label {
    font-size: 23px;
    font-weight: 700;
    letter-spacing: .05em;
    opacity: 1;
    paint-order: stroke;
    stroke: var(--background);
    stroke-width: 8px;
    stroke-linejoin: round;
  }
  .restaurant-point { cursor: pointer; opacity: .3; transition: opacity 150ms ease, r 150ms ease; }
  .restaurant-point.recommended { opacity: 1; }
  .restaurant-point:hover { opacity: 1; }
  .restaurant-label {
    pointer-events: none;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: .02em;
    paint-order: stroke;
    stroke: var(--background);
    stroke-width: 6px;
    stroke-linejoin: round;
  }
  .taste-point { cursor: grab; outline: none; }
  .is-dragging .taste-point { cursor: grabbing; }
  .taste-halo { fill: var(--accent); transform-box: fill-box; transform-origin: center; animation: halo-breathe 3.2s ease-in-out infinite; }
  .taste-core { fill: var(--accent); }
  .recommendation-rail {
    min-width: 0;
    min-height: 0;
    height: 100%;
    overflow-y: auto;
    border-left: 1px solid var(--line);
    background: var(--background);
    scrollbar-width: thin;
    scrollbar-color: var(--line) transparent;
  }
  .recommendation-overview { min-height: 100%; padding: 32px 28px; }
  .recommendation-overview h2 { margin: 0; font-size: 22px; font-weight: 500; letter-spacing: -.01em; }
  .recommendation-help { margin: 8px 0 0; color: var(--muted); font-size: 13px; line-height: 1.5; }
  .recommendation-list { display: flex; flex-direction: column; gap: 10px; margin-top: 24px; }
  .recommendation-card {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    width: 100%;
    padding: 18px;
    border: 1px solid var(--line);
    border-radius: 12px;
    color: var(--ink);
    background: var(--card);
    cursor: pointer;
    text-align: left;
    animation: card-in 240ms cubic-bezier(.4, 0, .2, 1) var(--card-delay) both;
    transition: border-color 150ms ease;
  }
  .recommendation-card:hover { border-color: #3a3733; background: var(--quote); }
  .card-order { display: flex; flex: none; align-items: center; justify-content: center; width: 26px; height: 26px; border: 1px solid currentColor; border-radius: 50%; background: transparent; font-size: 12px; }
  .card-content { flex: 1; min-width: 0; }
  .card-title-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .card-title-row h3 { margin: 0; font-size: 17px; font-weight: 500; letter-spacing: -.01em; }
  .card-meta { display: block; margin-top: 4px; color: var(--muted); font-size: 12px; white-space: nowrap; }
  .hidden-badge { padding: 2px 8px; border-radius: 999px; color: var(--accent); background: var(--halo); font-size: 11px; white-space: nowrap; }
  .recommendation-card blockquote { margin: 10px 0 0; overflow: hidden; color: var(--sub); font-size: 14px; line-height: 1.65; text-overflow: ellipsis; white-space: nowrap; }
  .card-chevron { align-self: center; flex: none; color: var(--muted); font-size: 18px; }
  .recommendation-note { margin: 28px 0 0; padding-top: 20px; border-top: 1px solid var(--line); color: var(--muted); font-size: 12px; line-height: 1.6; }
  .restaurant-sidebar { min-height: 100%; padding: 28px 28px 36px; animation: fade-up 240ms cubic-bezier(.2, .6, .3, 1) both; }
  .restaurant-sidebar .detail-back-button { color: var(--muted); font-size: 13px; }
  .restaurant-sidebar .detail-summary { margin-top: 24px; }
  .restaurant-sidebar .detail-summary h1 { font-family: inherit; font-size: 28px; }
  .restaurant-sidebar .detail-meta-row { font-size: 14px; }
  .restaurant-sidebar .detail-keywords span { padding: 7px 15px; font-size: 13.5px; }
  .restaurant-sidebar .review-evidence { margin-top: 30px; }
  .restaurant-sidebar .review-evidence h2 { font-size: 20px; }
  .restaurant-sidebar .review-quote-list { gap: 12px; }
  .restaurant-sidebar .review-quote-list blockquote { padding: 16px 18px; }
  .restaurant-sidebar .review-quote-list p { font-size: 14px; }
  .restaurant-sidebar .detail-map-grid { margin-top: 26px; }
  .restaurant-sidebar .detail-map-card p { font-size: 13px; }
  .restaurant-sidebar .detail-actions { margin-top: 28px; max-width: none; }
  .restaurant-sidebar .detail-actions button,
  .restaurant-sidebar .detail-actions a { padding: 14px 18px; font-size: 15px; }

  .map-column { overflow: hidden; }
  .taste-map-shell { cursor: default; }
  .taste-map-shell.is-pan { cursor: grabbing; }
  .map-wash { opacity: .035; }
  .prototype-node {
    cursor: pointer;
    transition: transform 520ms cubic-bezier(.4, 0, .2, 1), opacity 420ms cubic-bezier(.4, 0, .2, 1);
  }
  .prototype-node:hover { opacity: 1 !important; }
  .prototype-node:focus-visible { outline: none; }
  .node-ring { fill: none; stroke: currentColor; stroke-width: 1.2; opacity: .35; }
  .node-shape { stroke: none; }
  .node-diamond { fill: var(--background); stroke: currentColor; stroke-width: 1.5; }
  .node-star { fill: none; stroke: currentColor; stroke-width: 1.2; stroke-dasharray: 1.8 1.8; animation: gk-pulse 3s ease-in-out infinite; }
  .prototype-node-name { fill: var(--ink); font-size: 12px; font-weight: 400; letter-spacing: -.01em; paint-order: stroke; stroke: var(--background); stroke-width: 5px; stroke-linejoin: round; }
  .prototype-node-category { fill: var(--muted); font-size: 11px; paint-order: stroke; stroke: var(--background); stroke-width: 4px; }
  .taste-bubble { fill: var(--quote); stroke: #3a3733; stroke-width: 1; }
  .taste-bubble-label { fill: var(--ink); font-size: 12px; font-weight: 400; letter-spacing: -.01em; }
  .map-label-layer { position: absolute; inset: 0; pointer-events: none; color: #b8b3a9; font-size: 13px; font-weight: 500; letter-spacing: -.01em; }
  .map-axis-left, .map-axis-right, .map-axis-top, .map-axis-bottom, .map-quad { position: absolute; }
  .map-axis-left { top: 50%; left: 16px; transform: translateY(-50%); }
  .map-axis-right { top: 50%; right: 16px; transform: translateY(-50%); }
  .map-axis-top { top: 14px; left: 50%; transform: translateX(-50%); }
  .map-axis-bottom { bottom: 14px; left: 50%; transform: translateX(-50%); }
  .map-quad { font-size: 13px; }
  .map-quad-violet { top: 24px; left: 24px; color: var(--violet); }
  .map-quad-orange { top: 24px; right: 24px; color: var(--orange); }
  .map-quad-green { bottom: 24px; left: 24px; color: var(--green); }
  .map-quad-pink { right: 24px; bottom: 24px; color: var(--pink); }
  .map-confidence-legend {
    position: absolute; bottom: 52px; left: 20px; display: flex; align-items: center; gap: 14px; padding: 8px 12px;
    border: 1px solid var(--line); border-radius: 8px; color: var(--muted); background: var(--card); font-size: 12px; pointer-events: none;
  }
  .map-confidence-legend span { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
  .map-confidence-legend i { display: inline-block; flex: none; width: 9px; height: 9px; }
  .legend-circle { border-radius: 50%; background: var(--sub); }
  .legend-diamond { border: 1.5px solid var(--sub); background: var(--background); transform: rotate(45deg) scale(.72); }
  .legend-star { width: 14px !important; height: 14px !important; color: var(--sub); font-size: 15px; line-height: 14px; }
  .map-zoom-controls { position: absolute; right: 20px; bottom: 78px; display: flex; flex-direction: column; gap: 8px; }
  .map-zoom-controls button {
    width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; padding: 0; border: 1px solid var(--line); border-radius: 8px;
    color: var(--sub); background: var(--card); cursor: pointer; font-size: 20px; line-height: 1; transition: all 150ms cubic-bezier(.4, 0, .2, 1);
  }
  .map-zoom-controls button:hover { border-color: #3a3733; color: var(--ink); background: var(--quote); }
  .map-loading { position: absolute; inset: 0; z-index: 30; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px; background: var(--background); }
  .map-loading > span { color: var(--sub); font-size: 15px; line-height: 1.6; letter-spacing: -.01em; text-align: center; }
  .map-loading > div { width: 160px; height: 1px; overflow: hidden; background: var(--line); }
  .map-loading > div i { display: block; width: 100%; height: 100%; background: var(--accent); transform-origin: left; animation: loading-line 1200ms linear both; }

  .recommendation-overview { padding: 32px 28px; }
  .recommendation-overview h2 { font-size: 20px; line-height: 1.4; }
  .recommendation-card { align-items: center; gap: 14px; padding: 16px; }
  .card-order { width: 24px; height: 24px; font-weight: 500; }
  .card-title-row h3 { font-size: 15px; }
  .card-meta { margin-top: 2px; }
  .card-summary { display: -webkit-box; margin: 9px 0 0; overflow: hidden; color: var(--sub); font-size: 13px; line-height: 1.55; letter-spacing: -.01em; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  .card-keywords { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
  .card-keywords span { padding: 4px 8px; border-radius: 6px; color: var(--muted); background: var(--quote); font-size: 11px; }
  .card-chevron { width: 16px; height: 16px; }

  .node-magnet { transition: transform 200ms cubic-bezier(.4, 0, .2, 1); }
  .map-coach { position: absolute; inset: 0; z-index: 40; }
  .map-coach > svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .coach-caption { position: absolute; width: 260px; display: flex; flex-direction: column; align-items: center; transform: translateX(-50%); text-align: center; }
  .coach-caption strong { color: var(--ink); font-size: 20px; font-weight: 500; line-height: 1.4; letter-spacing: -.01em; }
  .coach-caption button { height: 40px; margin-top: 20px; padding: 0 20px; border: 0; border-radius: 8px; color: var(--background); background: var(--accent); cursor: pointer; font-size: 14px; font-weight: 500; }
  .coach-skip { position: absolute; top: 20px; right: 20px; padding: 0; border: 0; color: var(--sub); background: transparent; cursor: pointer; font-size: 13px; }

  .restaurant-sidebar { height: 100%; min-height: 0; display: flex; flex-direction: column; padding: 0; animation: fade-up 420ms cubic-bezier(.4, 0, .2, 1) both; }
  .sidebar-scroll { flex: 1; min-height: 0; overflow-y: auto; padding: 32px 28px; scrollbar-width: thin; scrollbar-color: var(--line) transparent; }
  .sidebar-back { display: flex; align-items: center; gap: 7px; margin: 0 0 28px; padding: 0; border: 0; color: var(--muted); background: transparent; cursor: pointer; font-size: 15px; }
  .sidebar-back:hover { color: var(--sub); }
  .sidebar-heading > div { display: flex; align-items: center; gap: 8px; }
  .sidebar-color-dot { flex: none; width: 8px; height: 8px; border-radius: 50%; }
  .sidebar-heading h2 { margin: 0; font-size: 26px; font-weight: 500; line-height: 1.35; letter-spacing: -.01em; }
  .sidebar-heading p { margin: 8px 0 0; color: var(--muted); font-size: 15px; }
  .sidebar-caution, .sidebar-unrecorded { margin-top: 18px; display: flex; gap: 10px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 8px; color: var(--sub); background: var(--quote); font-size: 14px; line-height: 1.55; }
  .sidebar-unrecorded { align-items: center; padding: 16px 18px; color: var(--ink); font-size: 16px; }
  .sidebar-section { margin-top: 36px; padding-top: 36px; border-top: 1px solid var(--line); }
  .sidebar-section h3 { margin: 0 0 18px; color: var(--sub); font-size: 15px; font-weight: 400; letter-spacing: -.01em; }
  .sidebar-position h3 { margin-bottom: 14px; }
  .sidebar-map-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: start; }
  .sidebar-map-panel { min-width: 0; }
  .sidebar-position .detail-map-card { width: 100%; overflow: hidden; border: 1px solid var(--line); border-radius: 10px; background: var(--background); }
  .sidebar-position .detail-map-card svg { width: 100%; height: auto; margin: 0; aspect-ratio: 7 / 4; border-radius: 0; }
  .sidebar-position .detail-map-card > p { display: none; }
  .quadrant-caption { margin: 12px 0 0; font-size: 14px; line-height: 1.5; }
  .sidebar-estimate { margin: 14px 0 0; color: var(--muted); font-size: 14px; line-height: 1.65; }
  .mention-list { display: flex; flex-direction: column; gap: 16px; }
  .mention-item > p { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin: 0; font-size: 17px; }
  .mention-item > p span:last-child { color: var(--muted); font-size: 14px; }
  .mention-item > div { height: 5px; margin-top: 9px; overflow: hidden; border-radius: 3px; background: var(--quote); }
  .mention-item > div i { display: block; height: 100%; border-radius: 2px; }
  .sidebar-snippets { display: flex; flex-direction: column; gap: 10px; }
  .sidebar-snippets blockquote { margin: 0; padding: 16px 18px; border-left: 3px solid var(--accent); border-radius: 10px; color: var(--ink); background: var(--quote); font-size: 17px; line-height: 1.7; letter-spacing: -.01em; }
  .snippet-source { margin: 14px 0 0; color: var(--muted); font-size: 13px; text-align: right; }
  .sidebar-facts { display: flex; flex-direction: column; gap: 12px; margin: 0; }
  .sidebar-facts > div { display: flex; gap: 16px; }
  .sidebar-facts dt { flex: none; width: 52px; color: var(--muted); font-size: 14px; }
  .sidebar-facts dd { margin: 0; color: var(--ink); font-size: 17px; }
  .sidebar-first-guest { margin-top: 24px; padding: 20px; border: 1px solid #7a4e1f; border-radius: 10px; background: var(--quote); }
  .sidebar-first-guest p { margin: 0; color: var(--sub); font-size: 15px; line-height: 1.7; }
  .sidebar-first-guest strong { display: block; margin-top: 12px; color: var(--accent); font-size: 17px; font-weight: 500; line-height: 1.6; }
  .sidebar-location-panel .detail-map-card .location-map { width: 100%; height: auto; aspect-ratio: 7 / 4; border: 0; border-radius: 0; background: var(--background); }
  .sidebar-address { margin: 12px 0 0; font-size: 15px; line-height: 1.45; }
  .sidebar-location-note { margin: 5px 0 0; color: var(--muted); font-size: 13px; line-height: 1.5; }
  .sidebar-actions { flex: none; display: flex; gap: 12px; padding: 18px 22px; border-top: 1px solid var(--line); background: var(--background); }
  .sidebar-actions button, .sidebar-actions a { flex: 1; height: 50px; display: flex; align-items: center; justify-content: center; padding: 0; border: 1px solid var(--line); border-radius: 9px; color: var(--ink); background: var(--card); cursor: pointer; font-size: 15px; font-weight: 400; text-decoration: none; }
  .sidebar-actions button:hover, .sidebar-actions a:hover { border-color: #3a3733; background: var(--quote); }

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
  .detail-map-wash { opacity: .05; }
  .detail-map-ring { opacity: .35; stroke-width: 1; }
  .detail-map-low { stroke-width: 1.5; }
  .detail-map-unrecorded { stroke-width: 1; stroke-dasharray: 1.2 1.2; }
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
    .neighborhood-content { padding-top: 72px; }
    .search-view { padding-top: 88px; }
    .map-page { height: auto; min-height: 100vh; overflow: visible; }
    .map-layout { display: flex; flex-direction: column; }
    .map-column, .recommendation-rail { width: 100%; }
    .taste-map-shell { width: 100%; }
    .recommendation-rail { height: auto; overflow: visible; border-top: 1px solid var(--line); border-left: 0; }
  }

  @media (max-width: 640px) {
    .neighborhood-content { padding: 56px 18px 40px; }
    .neighborhood-content h1 { margin-top: 36px; font-size: 34px; }
    .neighborhood-search-wrap { margin-top: 36px; }
    .neighborhood-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .prototype-topbar { padding: 0 16px; }
    .prototype-topbar > div { gap: 9px; }
    .prototype-topbar > div > span { max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .search-view, .reask-view { padding: 64px 18px 48px; }
    .search-view h1 { font-size: 34px; }
    .prototype-example-grid, .reask-grid { grid-template-columns: 1fr; }
    .coach-caption { width: 210px; }
    .coach-caption strong { font-size: 17px; }
    .landing-content { padding: 20px; }
    .landing-content h1 { font-size: 30px; }
    .landing-lede { font-size: 13px; }
    .landing-search { width: 100%; }
    .location-filter { grid-template-columns: 1fr; gap: 10px; padding: 14px; }
    .location-divider { display: none; }
    .search-examples > div { flex-direction: column; }
    .search-examples button { width: 100%; }
    .map-query-header { gap: 9px; padding: 0 12px; }
    .map-location-name { display: none; }
    .map-result-summary { padding: 10px 14px; }
    .map-result-summary p { font-size: 13px; }
    .map-layout { gap: 0; padding: 0; }
    .recommendation-overview { padding: 24px 18px 32px; }
    .restaurant-sidebar { padding: 0; }
    .sidebar-scroll { padding: 24px 18px 32px; }
    .sidebar-map-pair { grid-template-columns: 1fr; gap: 24px; }
    .axis-label { font-size: 28px; }
    .quadrant-label { font-size: 26px; }
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
