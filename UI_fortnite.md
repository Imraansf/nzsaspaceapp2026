```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ORBITAL ARCHIVE // Space Debris Mission Lobby</title>

  <style>
    /* =====================================================================
       LIGHT, PLAYFUL WARM COLOR PALETTE & CEL-SHADED DESIGN TOKENS
       Strictly warm colors: sunlit peach, apricot, cream, buttercream,
       coral, tangerine, and friendly cocoa-brown outlines (#5C3A21).
       100% self-contained with zero external network dependencies.
       ===================================================================== */
    :root {
      --bg-peach-deep: #ff9a62;
      --bg-apricot: #ffb870;
      --bg-sunlit: #ffe0a3;
      --card-cream: #fff9eb;
      --card-peach: #ffebd2;
      --coral-bright: #ff6b57;
      --tangerine: #ff8c38;
      --buttercream: #ffd447;
      --cream-light: #ffffff;
      --text-cocoa: #4a2311;
      --text-caramel: #7a3e20;
      --outline-cocoa: #5C3A21;
    }

    * {
      box-sizing: border-box;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: var(--bg-apricot);
      color: var(--text-cocoa);
      font-family: "Trebuchet MS", "Segoe UI", system-ui, -apple-system, sans-serif;
    }

    .font-display {
      font-family: "Arial Black", "Impact", "Trebuchet MS", system-ui, sans-serif;
      font-weight: 900;
      letter-spacing: 0.04em;
    }

    /* Fullscreen moving space background canvas */
    #space-canvas {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      display: block;
    }

    /* Cel-shaded Manga/Fortnite UI Card & Button Styling */
    .cel-box {
      background: linear-gradient(160deg, var(--card-cream) 0%, var(--card-peach) 100%);
      border: 3.5px solid var(--outline-cocoa);
      box-shadow: 6px 6px 0px var(--outline-cocoa), inset 0 3px 0 rgba(255, 255, 255, 0.8);
      color: var(--text-cocoa);
    }

    .cel-badge {
      display: inline-block;
      background: var(--buttercream);
      color: var(--outline-cocoa);
      border: 3px solid var(--outline-cocoa);
      box-shadow: 3px 3px 0px var(--outline-cocoa);
      transform: skewX(-10deg);
    }

    .cel-badge > * {
      display: inline-block;
      transform: skewX(10deg);
    }

    .fortnite-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(180deg, var(--buttercream) 0%, var(--tangerine) 100%);
      color: var(--outline-cocoa);
      border: 3.5px solid var(--outline-cocoa);
      box-shadow: 5px 5px 0px var(--outline-cocoa);
      transform: skewX(-10deg);
      transition: transform 0.15s cubic-bezier(0.2, 0.9, 0.3, 1.3), box-shadow 0.15s ease, filter 0.15s ease;
      cursor: pointer;
    }

    .fortnite-btn:hover {
      transform: skewX(-10deg) translateY(-3px) scale(1.03);
      box-shadow: 8px 8px 0px var(--outline-cocoa);
      filter: brightness(1.05);
    }

    .fortnite-btn:active {
      transform: skewX(-10deg) translateY(2px) scale(0.98);
      box-shadow: 2px 2px 0px var(--outline-cocoa);
    }

    .fortnite-btn-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transform: skewX(10deg);
    }

    .fortnite-btn-secondary {
      background: linear-gradient(180deg, #ff8573 0%, var(--coral-bright) 100%);
      color: var(--cream-light);
    }

    /* =====================================================================
       PHASE 1: MISSION BRIEFING OVERLAY
       ===================================================================== */
    #briefing-overlay {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
      background: radial-gradient(circle at center, rgba(255, 224, 163, 0.78) 0%, rgba(255, 138, 84, 0.92) 100%);
      transition: opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1), transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #briefing-overlay.hidden-wipe {
      opacity: 0;
      transform: scale(1.06);
      pointer-events: none;
    }

    .briefing-card {
      max-width: 680px;
      width: 100%;
      border-radius: 22px;
      padding: 1.5rem 1.75rem;
      position: relative;
      overflow: hidden;
      animation: cardPopIn 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
    }

    @keyframes cardPopIn {
      0% { opacity: 0; transform: translateY(24px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    .briefing-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .status-pill {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: #ffebd2;
      border: 2.5px solid var(--outline-cocoa);
      padding: 0.25rem 0.65rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--outline-cocoa);
    }

    .pulse-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--coral-bright);
      animation: pulseDot 1.2s infinite alternate;
    }

    @keyframes pulseDot {
      0% { transform: scale(0.85); opacity: 0.75; }
      100% { transform: scale(1.2); opacity: 1; }
    }

    .briefing-title {
      font-size: clamp(1.5rem, 4vw, 2.25rem);
      color: var(--text-cocoa);
      line-height: 1.15;
      margin: 0 0 1rem 0;
    }

    .briefing-title span {
      color: var(--coral-bright);
      text-shadow: 2px 2px 0px var(--outline-cocoa);
    }

    .objectives-box {
      background: rgba(255, 255, 255, 0.92);
      border: 3px solid var(--outline-cocoa);
      border-radius: 18px;
      padding: 1.15rem;
      margin-bottom: 1.25rem;
      box-shadow: 4px 4px 0 var(--outline-cocoa);
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }

    .objective-row {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
    }

    .objective-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 2.5px solid var(--outline-cocoa);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 2px 2px 0 var(--outline-cocoa);
    }

    .objective-heading {
      margin: 0;
      font-size: 0.95rem;
      text-transform: uppercase;
    }

    .objective-desc {
      margin: 0.25rem 0 0 0;
      font-size: 0.92rem;
      line-height: 1.45;
      color: var(--text-cocoa);
    }

    .briefing-footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }

    /* =====================================================================
       PHASE 2: LOBBY & HORIZONTAL 2D CEL-SHADED FLYING ROCKET
       ===================================================================== */
    #lobby-ui {
      position: relative;
      z-index: 10;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.5s ease 0.1s;
    }

    #lobby-ui.active {
      opacity: 1;
    }

    .interactive-el {
      pointer-events: auto;
    }

    .top-bar {
      width: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      z-index: 20;
    }

    .hud-left {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .hud-card {
      padding: 0.5rem 0.9rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .replay-btn {
      align-self: flex-start;
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-cocoa);
      background: var(--card-cream);
      border: 2.5px solid var(--outline-cocoa);
      padding: 0.3rem 0.7rem;
      border-radius: 12px;
      box-shadow: 3px 3px 0 var(--outline-cocoa);
      cursor: pointer;
      transition: background 0.15s ease, transform 0.15s ease;
    }

    .replay-btn:hover {
      background: var(--buttercream);
      transform: translateY(-2px);
    }

    /* Horizontal Rocket container anchored in middle-top with gentle flight bob */
    #rocket-stage {
      position: absolute;
      top: 16%;
      left: 50%;
      transform: translateX(-50%);
      width: clamp(220px, 34vw, 350px);
      z-index: 5;
      pointer-events: none;
      animation: rocketHorizontalHover 2.6s ease-in-out infinite;
    }

    @keyframes rocketHorizontalHover {
      0%, 100% { transform: translate(-50%, 0px) rotate(-1.2deg); }
      50% { transform: translate(-50%, -11px) rotate(1.2deg); }
    }

    .flame-outer {
      transform-origin: 76px 100px;
      animation: flameFlickerOuter 0.13s infinite alternate ease-in-out;
    }

    .flame-inner {
      transform-origin: 76px 100px;
      animation: flameFlickerInner 0.09s infinite alternate ease-in-out;
    }

    @keyframes flameFlickerOuter {
      0% { transform: scaleX(0.90) scaleY(0.95); }
      100% { transform: scaleX(1.14) scaleY(1.05); }
    }

    @keyframes flameFlickerInner {
      0% { transform: scaleX(1.10) scaleY(0.92); }
      100% { transform: scaleX(0.86) scaleY(1.06); }
    }

    /* =====================================================================
       BOTTOM 3D DESTINATION PEDESTALS (FORTNITE STYLE - PURE 2D CANVAS 3D)
       ===================================================================== */
    .bottom-dock {
      width: 100%;
      padding: 0.5rem 0.75rem 1.35rem 0.75rem;
      z-index: 20;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .pedestals-grid {
      width: 100%;
      max-width: 880px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      align-items: end;
      justify-items: center;
      margin-top: 0.5rem;
    }

    .pedestal-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1.3);
      outline: none;
    }

    .pedestal-card:hover,
    .pedestal-card:focus-visible {
      transform: translateY(-8px);
    }

    .canvas-3d-wrap {
      width: clamp(104px, 23vw, 188px);
      height: clamp(104px, 23vw, 188px);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas-3d-wrap canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* Glowing bright sunlit pedestal ring beneath each 3D icon */
    .pedestal-ring {
      width: 78%;
      height: 18px;
      margin-top: -10px;
      border-radius: 999px;
      background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.92) 0%, rgba(255, 212, 71, 0.6) 60%, transparent 78%);
      border: 2.5px solid var(--outline-cocoa);
      transform: perspective(180px) rotateX(58deg);
      transition: all 0.25s ease;
    }

    .pedestal-card:hover .pedestal-ring,
    .pedestal-card:focus-visible .pedestal-ring {
      background: radial-gradient(ellipse at center, rgba(255, 255, 255, 1) 0%, rgba(255, 140, 56, 0.82) 65%, transparent 82%);
      box-shadow: 0 0 18px #ffffff;
    }

    .pedestal-label {
      margin-top: 8px;
      padding: 0.42rem 0.95rem;
      background: var(--card-cream);
      color: var(--text-cocoa);
      border: 3.5px solid var(--outline-cocoa);
      border-radius: 12px;
      box-shadow: 4px 4px 0px var(--outline-cocoa);
      transform: skewX(-12deg);
      transition: all 0.2s ease;
      text-align: center;
    }

    .pedestal-label-inner {
      transform: skewX(12deg);
    }

    .pedestal-title {
      font-size: clamp(0.75rem, 2.2vw, 1rem);
    }

    .pedestal-sub {
      color: var(--coral-bright);
      font-size: clamp(0.6rem, 1.5vw, 0.72rem);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .pedestal-card:hover .pedestal-label,
    .pedestal-card:focus-visible .pedestal-label {
      background: var(--buttercream);
      color: var(--outline-cocoa);
      box-shadow: 6px 6px 0px var(--outline-cocoa);
    }

    .pedestal-card:hover .pedestal-sub,
    .pedestal-card:focus-visible .pedestal-sub {
      color: var(--text-cocoa);
    }

    /* =====================================================================
       TOP-RIGHT CHECKLIST DRAWER
       ===================================================================== */
    #checklist-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(92, 58, 33, 0.45);
      z-index: 35;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    #checklist-backdrop.open {
      opacity: 1;
      pointer-events: auto;
    }

    #checklist-drawer {
      position: fixed;
      top: 0;
      right: 0;
      height: 100%;
      width: min(420px, 92vw);
      z-index: 40;
      transform: translateX(105%);
      transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
      display: flex;
      flex-direction: column;
      border-left: 4px solid var(--outline-cocoa);
      background: linear-gradient(175deg, var(--card-cream) 0%, var(--card-peach) 100%);
      box-shadow: -8px 0 28px rgba(92, 58, 33, 0.35);
      color: var(--text-cocoa);
    }

    #checklist-drawer.open {
      transform: translateX(0);
    }

    .drawer-header {
      padding: 1.15rem 1.25rem;
      border-bottom: 3px solid var(--outline-cocoa);
      background: var(--card-peach);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .progress-section {
      padding: 0.9rem 1.25rem;
      background: var(--card-cream);
      border-bottom: 2px solid #ffd7ab;
    }

    .progress-track {
      width: 100%;
      height: 16px;
      background: var(--card-peach);
      border: 2.5px solid var(--outline-cocoa);
      border-radius: 999px;
      overflow: hidden;
      padding: 2px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--coral-bright), var(--tangerine), var(--buttercream));
      border-radius: 999px;
      transition: width 0.3s ease;
    }

    #checklist-items-container {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }

    .checklist-row {
      display: flex;
      align-items: flex-start;
      gap: 0.8rem;
      padding: 0.8rem;
      border-radius: 16px;
      border: 2.5px solid var(--outline-cocoa);
      background: #ffffff;
      box-shadow: 3px 3px 0 var(--outline-cocoa);
      cursor: pointer;
      transition: background 0.15s ease, opacity 0.15s ease;
    }

    .checklist-row:hover {
      background: var(--card-cream);
    }

    .checklist-row.checked {
      background: var(--card-peach);
      opacity: 0.88;
      box-shadow: 1px 1px 0 var(--outline-cocoa);
    }

    .warm-checkbox {
      appearance: none;
      width: 25px;
      height: 25px;
      min-width: 25px;
      margin-top: 2px;
      border: 3px solid var(--outline-cocoa);
      border-radius: 8px;
      background-color: #ffffff;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .warm-checkbox:checked {
      background-color: var(--buttercream);
    }

    .warm-checkbox:checked::after {
      content: "✔";
      color: var(--outline-cocoa);
      font-weight: 900;
      font-size: 14px;
      line-height: 1;
    }

    .sector-tag {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 2px 7px;
      border-radius: 6px;
      background: var(--buttercream);
      color: var(--outline-cocoa);
      border: 1.5px solid var(--outline-cocoa);
      margin-bottom: 4px;
    }

    .drawer-footer {
      padding: 0.9rem 1.25rem;
      border-top: 2px solid #ffd7ab;
      background: var(--card-peach);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .reset-btn {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.45rem 0.75rem;
      border-radius: 12px;
      background: var(--coral-bright);
      color: #ffffff;
      border: 2.5px solid var(--outline-cocoa);
      box-shadow: 2px 2px 0 var(--outline-cocoa);
      cursor: pointer;
    }

    .reset-btn:hover {
      background: #e84c35;
    }

    /* Toast notification for placeholder links or feedback */
    #toast-banner {
      position: fixed;
      top: 82px;
      left: 50%;
      transform: translateX(-50%) translateY(-18px);
      z-index: 60;
      opacity: 0;
      pointer-events: none;
      border-radius: 16px;
      padding: 0.75rem 1.2rem;
      text-align: center;
      max-width: 440px;
      width: 90%;
      transition: all 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.3);
    }

    #toast-banner.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    /* =====================================================================
       PHASE 3: GIANT INTERACTIVE 3D EXPLORATION WORLD VIEW
       ===================================================================== */
    #world-view {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      opacity: 0;
      pointer-events: none;
      transform: scale(0.96);
      transition: opacity 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2), transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2);
    }

    #world-view.active {
      opacity: 1;
      pointer-events: auto;
      transform: scale(1);
    }

    #world-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      cursor: grab;
      touch-action: none;
    }

    #world-canvas:active {
      cursor: grabbing;
    }

    .world-top-bar {
      position: relative;
      z-index: 35;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      pointer-events: none;
    }

    .world-top-left {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: auto;
    }

    .world-title-pill {
      padding: 0.55rem 1rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 0.7rem;
    }

    .world-controls-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
      pointer-events: auto;
      margin-right: clamp(135px, 24vw, 185px);
    }

    @media (max-width: 640px) {
      .world-controls-right {
        margin-right: 0;
        margin-top: 54px;
      }
      .world-top-bar {
        flex-wrap: wrap;
      }
    }

    .zoom-controls {
      display: flex;
      gap: 0.4rem;
    }

    .zoom-btn {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: var(--card-cream);
      border: 3px solid var(--outline-cocoa);
      box-shadow: 3px 3px 0 var(--outline-cocoa);
      color: var(--text-cocoa);
      font-weight: 900;
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.12s ease, background 0.12s ease;
    }

    .zoom-btn:hover {
      background: var(--buttercream);
      transform: translateY(-2px);
    }

    .zoom-btn:active {
      transform: translateY(1px);
    }

    .orbit-hint {
      font-size: 0.72rem;
      font-weight: 800;
      background: rgba(255, 249, 235, 0.92);
      border: 2.5px solid var(--outline-cocoa);
      padding: 0.3rem 0.75rem;
      border-radius: 999px;
      box-shadow: 2px 2px 0 var(--outline-cocoa);
      color: var(--text-cocoa);
    }

    /* Bottom quick-jump bar of all artifacts in the current zone */
    .world-bottom-bar {
      position: relative;
      z-index: 35;
      padding: 0.65rem 1rem 1.15rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.45rem;
      pointer-events: none;
    }

    .artifact-pills-strip {
      pointer-events: auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
      max-width: 960px;
    }

    .artifact-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.48rem 0.85rem;
      border-radius: 14px;
      background: var(--card-cream);
      border: 3px solid var(--outline-cocoa);
      box-shadow: 4px 4px 0 var(--outline-cocoa);
      color: var(--text-cocoa);
      font-size: 0.78rem;
      font-weight: 800;
      cursor: pointer;
      transition: transform 0.15s ease, background 0.15s ease;
    }

    .artifact-chip:hover {
      background: var(--buttercream);
      transform: translateY(-3px);
    }

    .artifact-chip.discovered {
      background: #ffebd2;
    }

    .chip-status-dot {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      border: 2px solid var(--outline-cocoa);
      background: #ffffff;
      flex-shrink: 0;
    }

    .artifact-chip.discovered .chip-status-dot {
      background: #ff6b57;
    }

    /* =====================================================================
       DISCOVERY STORY MODAL CARD (FORTNITE / MANGA STYLE)
       ===================================================================== */
    #story-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 55;
      background: rgba(92, 58, 33, 0.52);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.28s ease;
    }

    #story-modal-backdrop.open {
      opacity: 1;
      pointer-events: auto;
    }

    .story-card {
      max-width: 560px;
      width: 100%;
      border-radius: 24px;
      padding: 1.35rem 1.5rem;
      position: relative;
      transform: translateY(20px) scale(0.95);
      transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
      max-height: 90vh;
      overflow-y: auto;
    }

    #story-modal-backdrop.open .story-card {
      transform: translateY(0) scale(1);
    }

    .story-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.85rem;
    }

    .story-badges {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.45rem;
    }

    .era-badge {
      background: var(--coral-bright);
      color: #ffffff;
      border: 2.5px solid var(--outline-cocoa);
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 800;
    }

    .state-badge {
      background: var(--buttercream);
      color: var(--outline-cocoa);
      border: 2.5px solid var(--outline-cocoa);
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 800;
    }

    .story-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: radial-gradient(circle at center, #ffffff 0%, #ffe6be 100%);
      border: 3px solid var(--outline-cocoa);
      border-radius: 18px;
      padding: 0.85rem;
      margin-bottom: 1rem;
      box-shadow: inset 0 2px 6px rgba(92, 58, 33, 0.12);
    }

    #story-art-canvas {
      width: 170px;
      height: 130px;
      display: block;
    }

    .story-title {
      font-size: clamp(1.25rem, 3.5vw, 1.65rem);
      margin: 0 0 0.25rem 0;
      color: var(--text-cocoa);
      line-height: 1.2;
    }

    .story-subtitle {
      font-size: 0.8rem;
      font-weight: 800;
      color: var(--coral-bright);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
    }

    .story-body {
      background: #ffffff;
      border: 2.5px solid var(--outline-cocoa);
      border-radius: 16px;
      padding: 0.95rem 1.05rem;
      font-size: 0.92rem;
      line-height: 1.52;
      color: var(--text-cocoa);
      margin-bottom: 1rem;
    }

    .story-fact-box {
      background: #ffebd2;
      border: 2.5px dashed var(--outline-cocoa);
      border-radius: 14px;
      padding: 0.7rem 0.9rem;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-cocoa);
      margin-bottom: 1.1rem;
    }

    .story-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .discovered-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: #ffd447;
      border: 2.5px solid var(--outline-cocoa);
      padding: 0.35rem 0.8rem;
      border-radius: 12px;
      font-size: 0.78rem;
      font-weight: 900;
      color: var(--outline-cocoa);
    }
  </style>
</head>
<body>

  <!-- =======================================================================
       BACKGROUND CANVAS: LIGHT SUNLIT WARM SPACE WITH RIGHT-TO-LEFT MOTION
       ======================================================================= -->
  <canvas id="space-canvas"></canvas>

  <!-- =======================================================================
       TOAST NOTIFICATION (Used when clicking placeholder links or resetting)
       ======================================================================= -->
  <div id="toast-banner" class="cel-box" role="status" aria-live="polite">
    <div id="toast-title" class="font-display" style="font-size: 0.85rem; color: #ff6b57;"></div>
    <div id="toast-msg" style="font-size: 0.78rem; font-weight: 700; color: #4a2311; margin-top: 3px;"></div>
  </div>

  <!-- =======================================================================
       PHASE 1: GAME-STYLE MISSION BRIEFING INTRO SCREEN
       ======================================================================= -->
  <section id="briefing-overlay" aria-label="Mission Briefing">
    <div class="briefing-card cel-box">
      <div class="briefing-header">
        <div class="cel-badge" style="padding: 0.25rem 0.75rem;">
          <span class="font-display" style="font-size: 0.75rem;">SPACE CADET BRIEFING // SEC-01</span>
        </div>
        <div class="status-pill">
          <span class="pulse-dot"></span>
          <span>READY</span>
        </div>
      </div>

      <h1 class="briefing-title font-display">
        SPACE DEBRIS <span>ADVENTURE!</span>
      </h1>

      <div class="objectives-box">
        <div class="objective-row">
          <div class="objective-icon" style="background: #ff6b57;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46Z"/>
            </svg>
          </div>
          <div>
            <h2 class="objective-heading font-display" style="color: #ff6b57;">Your Mission</h2>
            <p class="objective-desc">
              Blast off to explore <strong>the Moon</strong>, <strong>Mars</strong>, and <strong>Deep Space</strong> to discover the real-world rockets, rovers, and space hardware humans have left behind!
            </p>
          </div>
        </div>

        <div style="height: 2px; background: #ffebd2;"></div>

        <div class="objective-row">
          <div class="objective-icon" style="background: #ffd447;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C3A21" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <div>
            <h2 class="objective-heading font-display" style="color: #e06319;">Explorer Checklist</h2>
            <p class="objective-desc">
              A <strong>Discovery Checklist</strong> is waiting in the <strong>top-right corner</strong> of your screen. Open it anytime to tick off each space artifact you uncover!
            </p>
          </div>
        </div>
      </div>

      <div class="briefing-footer">
        <span style="font-size: 0.75rem; font-weight: 800; color: #7a3e20; letter-spacing: 0.05em;">
          SYSTEMS: <span style="color: #ff6b57;">ALL CLEAR FOR LAUNCH!</span>
        </span>
        <button id="launch-btn" class="fortnite-btn" style="padding: 0.75rem 1.75rem; border-radius: 14px;">
          <span class="fortnite-btn-inner font-display" style="font-size: 1rem;">
            LAUNCH MISSION
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
  </section>

  <!-- =======================================================================
       PHASE 2: FORTNITE-STYLE MAIN LOBBY UI
       ======================================================================= -->
  <main id="lobby-ui">
    
    <!-- TOP BAR: Mission Status (Top-Left) & Checklist Button (Top-Right) -->
    <header class="top-bar">
      <div class="interactive-el hud-left">
        <div class="cel-box hud-card">
          <div style="width: 13px; height: 13px; border-radius: 50%; background: #ff6b57; border: 2px solid #5C3A21;"></div>
          <div>
            <div style="font-size: 0.62rem; font-weight: 800; letter-spacing: 0.08em; color: #e06319;">FLIGHT DECK // LOBBY</div>
            <div class="font-display" style="font-size: 0.85rem; color: #4a2311;">SOLAR EXPLORER</div>
          </div>
        </div>
        <button id="replay-briefing-btn" class="replay-btn">
          ↺ MISSION BRIEFING
        </button>
      </div>

      <!-- Top-Right Mission Checklist Toggle Icon -->
      <button id="open-checklist-btn" class="interactive-el fortnite-btn" style="padding: 0.6rem 1.05rem; border-radius: 14px;" aria-label="Open Mission Checklist">
        <span class="fortnite-btn-inner">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C3A21" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
          </svg>
          <span class="font-display" style="font-size: 0.82rem;">CHECKLIST</span>
          <span id="checklist-badge" class="font-display" style="background: #5C3A21; color: #ffd447; font-size: 0.72rem; padding: 2px 7px; border-radius: 6px;">
            0/13
          </span>
        </span>
      </button>
    </header>

    <!-- CENTER-TOP: HORIZONTAL 2D CEL-SHADED FLYING ROCKET (POINTING RIGHT) -->
    <div id="rocket-stage" aria-hidden="true">
      <svg viewBox="0 0 295 200" style="width: 100%; height: auto; overflow: visible; filter: drop-shadow(0 10px 12px rgba(92, 58, 33, 0.28));">
        <defs>
          <linearGradient id="hullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="62%" stop-color="#fff4db"/>
            <stop offset="63%" stop-color="#ffe1b0"/>
            <stop offset="100%" stop-color="#ffca85"/>
          </linearGradient>
          <linearGradient id="finGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff7b61"/>
            <stop offset="100%" stop-color="#e84c35"/>
          </linearGradient>
          <linearGradient id="flameOuterGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#ffd447"/>
            <stop offset="55%" stop-color="#ff8c38"/>
            <stop offset="100%" stop-color="#ff6b57" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="flameInnerGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="75%" stop-color="#ffd447"/>
            <stop offset="100%" stop-color="#ff8c38" stop-opacity="0"/>
          </linearGradient>
        </defs>

        <!-- Animated Horizontal Rocket Exhaust Flame (Pointing Left) -->
        <g class="flame-outer">
          <path d="M78,76 Q-10,100 78,124 Z" fill="url(#flameOuterGrad)"/>
        </g>
        <g class="flame-inner">
          <path d="M78,85 Q22,100 78,115 Z" fill="url(#flameInnerGrad)"/>
        </g>

        <!-- Top & Bottom Stabilizer Fins -->
        <path d="M138,66 L90,28 L76,32 L95,68 Z" fill="url(#finGrad)" stroke="#5C3A21" stroke-width="5" stroke-linejoin="round"/>
        <path d="M138,134 L90,172 L76,168 L95,132 Z" fill="url(#finGrad)" stroke="#5C3A21" stroke-width="5" stroke-linejoin="round"/>

        <!-- Rear Engine Thruster Nozzle -->
        <path d="M95,78 L76,72 L76,128 L95,122 Z" fill="#a84323" stroke="#5C3A21" stroke-width="5" stroke-linejoin="round"/>

        <!-- Main Horizontal Rocket Fuselage (Pointing Right) -->
        <path d="M276,100 C236,66 172,60 95,66 L95,134 C172,140 236,134 276,100 Z" fill="url(#hullGrad)" stroke="#5C3A21" stroke-width="5.5" stroke-linejoin="round"/>

        <!-- Coral-Red Nose Cone Tip (Right side) -->
        <path d="M276,100 C258,85 240,76 222,71 L222,129 C240,124 258,115 276,100 Z" fill="url(#finGrad)" stroke="#5C3A21" stroke-width="5" stroke-linejoin="round"/>

        <!-- Buttercream Racing Stripe -->
        <path d="M110,65 L110,135 L125,134 L125,66 Z" fill="#ffd447" stroke="#5C3A21" stroke-width="4"/>

        <!-- Center Horizontal Fin -->
        <path d="M136,100 L78,100" stroke="#5C3A21" stroke-width="6.5" stroke-linecap="round"/>
        <path d="M134,100 L80,100" stroke="#ffd447" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Bright Sunlit Porthole Window -->
        <circle cx="176" cy="100" r="22" fill="#ff6b57" stroke="#5C3A21" stroke-width="5"/>
        <circle cx="176" cy="100" r="15" fill="#ffd447" stroke="#5C3A21" stroke-width="3.5"/>
        <path d="M169,92 A10,10 0 0,1 183,92" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
      </svg>
    </div>

    <!-- BOTTOM SECTION: 3 ROTATING 3D-SHADED DESTINATION ICONS (FORTNITE PEDESTALS) -->
    <section class="bottom-dock">
      <div class="cel-badge" style="padding: 0.25rem 0.9rem; margin-bottom: 0.35rem;">
        <span class="font-display" style="font-size: 0.72rem; letter-spacing: 0.08em;">CHOOSE YOUR DESTINATION!</span>
      </div>

      <div class="interactive-el pedestals-grid">
        
        <!-- DESTINATION 1: THE MOON -->
        <div id="dest-moon" class="pedestal-card" role="button" tabindex="0" aria-label="Explore The Moon">
          <div class="canvas-3d-wrap">
            <canvas id="canvas-moon" width="240" height="240"></canvas>
          </div>
          <div class="pedestal-ring"></div>
          <div class="pedestal-label">
            <div class="pedestal-label-inner">
              <div class="pedestal-title font-display">THE MOON</div>
              <div class="pedestal-sub">LUNAR DEBRIS</div>
            </div>
          </div>
        </div>

        <!-- DESTINATION 2: MARS -->
        <div id="dest-mars" class="pedestal-card" role="button" tabindex="0" aria-label="Explore Mars">
          <div class="canvas-3d-wrap">
            <canvas id="canvas-mars" width="240" height="240"></canvas>
          </div>
          <div class="pedestal-ring"></div>
          <div class="pedestal-label">
            <div class="pedestal-label-inner">
              <div class="pedestal-title font-display">MARS</div>
              <div class="pedestal-sub">ROVER RELICS</div>
            </div>
          </div>
        </div>

        <!-- DESTINATION 3: DEEP SPACE (MINI SOLAR SYSTEM) -->
        <div id="dest-deepspace" class="pedestal-card" role="button" tabindex="0" aria-label="Explore Deep Space">
          <div class="canvas-3d-wrap">
            <canvas id="canvas-deepspace" width="240" height="240"></canvas>
          </div>
          <div class="pedestal-ring"></div>
          <div class="pedestal-label">
            <div class="pedestal-label-inner">
              <div class="pedestal-title font-display">DEEP SPACE</div>
              <div class="pedestal-sub">OUTER PROBES</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </main>

  <!-- =======================================================================
       PHASE 3: GIANT INTERACTIVE 3D EXPLORATION WORLD VIEW
       ======================================================================= -->
  <section id="world-view" aria-label="3D Destination Exploration View">
    <canvas id="world-canvas"></canvas>

    <!-- Top Navigation & Controls -->
    <div class="world-top-bar">
      <div class="world-top-left">
        <button id="back-to-lobby-btn" class="fortnite-btn" style="padding: 0.55rem 1.05rem; border-radius: 14px;">
          <span class="fortnite-btn-inner font-display" style="font-size: 0.82rem;">
            ← BACK TO LOBBY
          </span>
        </button>

        <div class="cel-box world-title-pill">
          <div id="world-badge-dot" style="width: 14px; height: 14px; border-radius: 50%; background: #ffd447; border: 2.5px solid #5C3A21;"></div>
          <div>
            <div id="world-sector-sub" style="font-size: 0.65rem; font-weight: 800; letter-spacing: 0.08em; color: #ff6b57;">SECTOR SCANNER</div>
            <div id="world-sector-title" class="font-display" style="font-size: 1.05rem; color: #4a2311;">THE MOON</div>
          </div>
        </div>
      </div>

      <div class="world-controls-right">
        <div class="zoom-controls">
          <button id="zoom-out-btn" class="zoom-btn" aria-label="Zoom Out">−</button>
          <button id="zoom-reset-btn" class="zoom-btn" style="font-size: 0.75rem; width: auto; padding: 0 0.65rem;" aria-label="Reset Camera">RESET</button>
          <button id="zoom-in-btn" class="zoom-btn" aria-label="Zoom In">+</button>
        </div>
        <div class="orbit-hint">👆 Drag to Spin 3D • Tap Markers to Inspect!</div>
      </div>
    </div>

    <!-- Bottom Quick-Jump Bar of Artifacts in Current World -->
    <div class="world-bottom-bar">
      <div class="cel-badge" style="padding: 0.2rem 0.8rem;">
        <span id="world-count-label" class="font-display" style="font-size: 0.7rem;">DISCOVERED IN THIS ZONE: 0 / 4</span>
      </div>
      <div id="artifact-pills-strip" class="artifact-pills-strip">
        <!-- Populated dynamically when entering Moon, Mars, or Deep Space -->
      </div>
    </div>
  </section>

  <!-- =======================================================================
       DISCOVERY STORY CARD MODAL
       ======================================================================= -->
  <div id="story-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="story-title">
    <div class="story-card cel-box">
      <div class="story-top-row">
        <div class="story-badges">
          <span id="story-era-badge" class="era-badge">1969–1972</span>
          <span id="story-state-badge" class="state-badge">Resting on Surface</span>
        </div>
        <button id="close-story-btn" class="fortnite-btn fortnite-btn-secondary" style="width: 38px; height: 38px; border-radius: 12px;" aria-label="Close Story Card">
          <span class="fortnite-btn-inner font-display" style="font-size: 1rem;">✕</span>
        </button>
      </div>

      <div class="story-hero">
        <canvas id="story-art-canvas" width="240" height="180"></canvas>
      </div>

      <div id="story-subtitle" class="story-subtitle">THE MOON // APOLLO PROGRAM</div>
      <h2 id="story-title" class="story-title font-display">Apollo Lunar Modules (Descent Stages)</h2>

      <div id="story-body" class="story-body">
        Story text loads here...
      </div>

      <div id="story-fact-box" class="story-fact-box">
        ⭐ Why It Was Left Behind: Fact text loads here...
      </div>

      <div class="story-footer">
        <div class="discovered-pill">
          <span>✔</span>
          <span>LOGGED IN MISSION CHECKLIST!</span>
        </div>
        <button id="next-artifact-btn" class="fortnite-btn" style="padding: 0.55rem 1.15rem; border-radius: 12px;">
          <span class="fortnite-btn-inner font-display" style="font-size: 0.8rem;">NEXT ARTIFACT →</span>
        </button>
      </div>
    </div>
  </div>

  <!-- =======================================================================
       SLIDE-OUT MISSION CHECKLIST DRAWER
       ======================================================================= -->
  <div id="checklist-backdrop"></div>
  <aside id="checklist-drawer" aria-label="Mission Discovery Checklist">
    <div class="drawer-header">
      <div>
        <div style="font-size: 0.7rem; font-weight: 800; letter-spacing: 0.08em; color: #ff6b57;">EXPLORER LOG</div>
        <h2 class="font-display" style="font-size: 1.25rem; margin: 2px 0 0 0; color: #4a2311;">MISSION CHECKLIST</h2>
      </div>
      <button id="close-checklist-btn" class="fortnite-btn fortnite-btn-secondary" style="width: 40px; height: 40px; border-radius: 12px;" aria-label="Close Checklist">
        <span class="fortnite-btn-inner font-display" style="font-size: 1.1rem;">✕</span>
      </button>
    </div>

    <div class="progress-section">
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; font-weight: 800; margin-bottom: 6px;">
        <span style="color: #7a3e20;">DISCOVERY PROGRESS</span>
        <span id="checklist-percent" class="font-display" style="color: #ff6b57;">0%</span>
      </div>
      <div class="progress-track">
        <div id="checklist-progress-bar" class="progress-fill" style="width: 0%;"></div>
      </div>
    </div>

    <div id="checklist-items-container">
      <!-- Populated dynamically from CHECKLIST_ITEMS array -->
    </div>

    <div class="drawer-footer">
      <span style="font-size: 0.74rem; font-weight: 700; color: #7a3e20;">Progress auto-saves!</span>
      <button id="reset-checklist-btn" class="reset-btn">RESET LOG</button>
    </div>
  </aside>

  <!-- =======================================================================
       100% SELF-CONTAINED APPLICATION SCRIPT (ZERO EXTERNAL DEPENDENCIES)
       ======================================================================= -->
  <script>
    /**
     * =========================================================================
     * 1. OFFICIAL 2026 NASA SPACE APPS CHALLENGE ARTIFACT DATABASE
     *    All 13 major discarded hardware groups across Moon, Mars & Deep Space
     * =========================================================================
     */
    const ARTIFACT_DATABASE = {
      moon: [
        {
          id: "moon-apollo-lm",
          world: "moon",
          sector: "THE MOON",
          artType: "apollo-lm",
          title: "Apollo Lunar Modules (Descent Stages)",
          shortName: "Apollo Descent Stages",
          era: "1969 – 1972",
          status: "Resting Artifact",
          location: "6 Apollo Landing Sites (Sea of Tranquility to Taurus-Littrow)",
          lon: 0.35,
          lat: -0.15,
          story: "Six golden, four-legged Lunar Module descent stages—including Apollo 11's famous 'Eagle'—sit peacefully on the Moon today! Each stage carried two astronauts down to the lunar surface and protected them with shiny gold Kapton foil insulation.",
          whyLeftBehind: "When astronauts finished their moonwalks, the upper ascent stage fired its rocket and used the lower descent stage as a launch pad—leaving the heavy legs and fuel tanks behind so they had enough fuel to fly home!"
        },
        {
          id: "moon-lrv",
          world: "moon",
          sector: "THE MOON",
          artType: "lrv",
          title: "Lunar Roving Vehicles (LRVs)",
          shortName: "Lunar Roving Vehicles",
          era: "1971 – 1972",
          status: "Parked Monument",
          location: "Hadley Rille, Descartes Highlands & Taurus-Littrow",
          lon: 1.85,
          lat: 0.25,
          story: "Three electric 'Moon Buggies' were driven by astronauts on Apollo 15, 16, and 17! With woven wire-mesh wheels and gold-colored umbrellas for antennas, these foldable rovers let explorers drive miles away from their landers to collect ancient Moon rocks.",
          whyLeftBehind: "There was no room to pack a car back inside the tiny ascent capsule! Astronauts parked each rover facing their lander so its TV camera could film their final liftoff from the Moon."
        },
        {
          id: "moon-alsep",
          world: "moon",
          sector: "THE MOON",
          artType: "alsep",
          title: "ALSEP Scientific Packages",
          shortName: "ALSEP Science Stations",
          era: "1969 – 1977",
          status: "Resting Artifact",
          location: "Apollo 11, 12, 14, 15, 16 & 17 Sites",
          lon: 3.45,
          lat: -0.32,
          story: "The Apollo Lunar Surface Experiments Packages (ALSEP) were mini science labs set up by astronauts. They included moonquake detectors (seismometers), solar wind collectors, and special mirror panels called laser retroreflectors.",
          whyLeftBehind: "ALSEP stations were designed to stay behind and radio scientific data back to Earth for years—and scientists still bounce laser beams off the Apollo mirror panels today to measure the Moon's distance!"
        },
        {
          id: "moon-surveyor",
          world: "moon",
          sector: "THE MOON",
          artType: "surveyor",
          title: "Surveyor Landers (1, 3, 5, 6 & 7)",
          shortName: "Surveyor Landers",
          era: "1966 – 1968",
          status: "Resting Artifact",
          location: "Ocean of Storms, Sea of Tranquility & Tycho Crater",
          lon: 4.95,
          lat: 0.18,
          story: "Before humans could land on the Moon, NASA sent robotic Surveyor scouts to make sure the lunar dust wouldn't swallow a spaceship! Surveyor 3 was even visited in person by Apollo 12 astronauts two years after it landed.",
          whyLeftBehind: "Surveyor spacecraft were one-way robotic scouts without return rockets. Once their solar-powered cameras and soil-digging scoops completed their missions, they remained as quiet trailblazers."
        }
      ],
      mars: [
        {
          id: "mars-sojourner",
          world: "mars",
          sector: "MARS",
          artType: "sojourner",
          title: "Sojourner Rover & Pathfinder",
          shortName: "Sojourner & Pathfinder",
          era: "1997",
          status: "Resting Artifact",
          location: "Ares Vallis (Carl Sagan Memorial Station)",
          lon: 0.25,
          lat: 0.15,
          story: "In July 1997, Pathfinder bounced onto Mars inside giant airbags and opened like a flower petal to release Sojourner—the very first wheeled rover to explore another planet! About the size of a microwave oven, Sojourner analyzed Martian rocks named 'Barnacle Bill' and 'Yogi.'",
          whyLeftBehind: "Built to last just 7 days, Sojourner kept exploring for 83 Martian days until Pathfinder's battery finally wore out in the freezing Martian nights."
        },
        {
          id: "mars-mer",
          world: "mars",
          sector: "MARS",
          artType: "mer",
          title: "Spirit & Opportunity Rovers",
          shortName: "Spirit & Opportunity",
          era: "2004 – 2018",
          status: "Inactive Monument",
          location: "Gusev Crater & Meridiani Planum",
          lon: 1.55,
          lat: -0.22,
          story: "Twin robotic geologists Spirit and Opportunity were only supposed to last 90 days—instead, Spirit roved for over 6 years and Opportunity rolled a marathon 28 miles over 14 years! Together they proved liquid water once flowed across ancient Mars.",
          whyLeftBehind: "Both solar-powered rovers eventually succumbed to Martian elements: Spirit became stuck in soft sand in 2009, and Opportunity went silent after a planet-wide dust storm blocked sunlight in 2018."
        },
        {
          id: "mars-viking",
          world: "mars",
          sector: "MARS",
          artType: "viking",
          title: "Viking 1 & 2 Landers",
          shortName: "Viking 1 & 2 Landers",
          era: "1976 – 1982",
          status: "Resting Artifact",
          location: "Chryse Planitia & Utopia Planitia",
          lon: 2.85,
          lat: 0.28,
          story: "Viking 1 and Viking 2 were the very first U.S. spacecraft to land safely on Mars in 1976! They beamed back the first clear color pictures of the rusty red Martian rocks and pink sky while testing soil samples for signs of life.",
          whyLeftBehind: "Powered by nuclear batteries, Viking 1 operated for over 6 years on the surface until an accidental command update cut off radio contact in 1982."
        },
        {
          id: "mars-phoenix-insight",
          world: "mars",
          sector: "MARS",
          artType: "insight",
          title: "Phoenix & InSight Landers",
          shortName: "Phoenix & InSight",
          era: "2008 & 2018–2022",
          status: "Resting Artifact",
          location: "Vastitas Borealis & Elysium Planitia",
          lon: 4.15,
          lat: -0.15,
          story: "Phoenix landed near Mars's north pole in 2008 and scooped up bright white water ice just beneath the soil! Ten years later, InSight placed an ultra-sensitive dome seismometer on Mars and listened to over 1,300 'marsquakes' to map the planet's deep interior.",
          whyLeftBehind: "Phoenix's solar panels were damaged by heavy winter dry-ice snow, while InSight's panels gradually became coated in thick red Martian dust until it ran out of power in December 2022."
        },
        {
          id: "mars-ingenuity",
          world: "mars",
          sector: "MARS",
          artType: "ingenuity",
          title: "Ingenuity Mars Helicopter",
          shortName: "Ingenuity Helicopter",
          era: "2021 – 2024",
          status: "Stationary Monument",
          location: "Jezero Crater ('Valinor Hills')",
          lon: 5.35,
          lat: 0.12,
          story: "Originally planned as a 5-flight test, this lightweight 4-pound helicopter stunned the world by completing 72 flights in Mars's super-thin air—acting as an aerial scout for the Perseverance rover!",
          whyLeftBehind: "During its 72nd landing over featureless sand dunes in January 2024, Ingenuity's carbon-fiber rotor blades struck the ground and were damaged, turning it into a stationary weather and telemetry monument."
        }
      ],
      deepSpace: [
        {
          id: "deep-pioneer",
          world: "deepSpace",
          sector: "DEEP SPACE",
          artType: "pioneer",
          title: "Pioneer 10 & 11",
          shortName: "Pioneer 10 & 11",
          era: "1972 – 2003",
          status: "Drifting Interstellar",
          location: "Beyond the Solar System (Heading toward Aldebaran & Aquila)",
          orbitRx: 115,
          orbitRy: 44,
          orbitSpeed: 0.42,
          orbitAngle: 0.6,
          story: "Pioneer 10 and 11 were humanity's first brave scouts to cross the asteroid belt and fly past giant gas planets Jupiter and Saturn! Each spacecraft carries a famous gold-anodized plaque showing a message from Earth.",
          whyLeftBehind: "Traveling fast enough to escape the Sun's gravity forever, both probes ran out of electrical power to send signals in 1995 and 2003—and now drift silently toward distant stars!"
        },
        {
          id: "deep-dawn",
          world: "deepSpace",
          sector: "DEEP SPACE",
          artType: "dawn",
          title: "Dawn Spacecraft",
          shortName: "Dawn Spacecraft",
          era: "2007 – 2018",
          status: "Orbiting Ceres",
          orbitRx: 165,
          orbitRy: 64,
          orbitSpeed: 0.34,
          orbitAngle: 2.2,
          story: "Powered by futuristic blue-glowing ion thrusters, Dawn became the only spacecraft ever to orbit two extraterrestrial worlds: giant asteroid Vesta and icy dwarf planet Ceres, discovering bright salt deposits and ancient ocean clues.",
          whyLeftBehind: "When Dawn used the very last drop of its hydrazine thruster fuel in October 2018, NASA placed it in a stable, high planetary-protection orbit where it will circle Ceres silently for decades."
        },
        {
          id: "deep-near",
          world: "deepSpace",
          sector: "DEEP SPACE",
          artType: "near",
          title: "NEAR Shoemaker",
          shortName: "NEAR Shoemaker",
          era: "1996 – 2001",
          status: "Resting on 433 Eros",
          orbitRx: 215,
          orbitRy: 84,
          orbitSpeed: 0.28,
          orbitAngle: 3.9,
          story: "NEAR Shoemaker was the first spacecraft to orbit an asteroid—peanut-shaped near-Earth asteroid 433 Eros! Even though it wasn't built with landing legs, engineers guided it down for a gentle, historic touchdown on Eros in February 2001.",
          whyLeftBehind: "After transmitting valuable gamma-ray readings right from the asteroid's rocky surface, NEAR Shoemaker went to sleep permanently on Eros as it orbits the Sun."
        },
        {
          id: "deep-kepler",
          world: "deepSpace",
          sector: "DEEP SPACE",
          artType: "kepler",
          title: "Kepler Space Telescope",
          shortName: "Kepler Telescope",
          era: "2009 – 2018",
          status: "Drifting Solar Orbit",
          orbitRx: 265,
          orbitRy: 104,
          orbitSpeed: 0.22,
          orbitAngle: 5.3,
          story: "Staring steadily at over 150,000 stars, the Kepler Space Telescope watched for tiny dips in starlight caused by orbiting worlds—discovering more than 2,700 confirmed exoplanets and showing that planets outnumber stars in our galaxy!",
          whyLeftBehind: "After 9.5 years of planet hunting, Kepler depleted its thruster fuel in October 2018. NASA commanded it to power down safely in a peaceful solar orbit trailing millions of miles behind Earth."
        }
      ]
    };

    // Flatten all 13 artifacts into the CHECKLIST_ITEMS array automatically
    const CHECKLIST_ITEMS = [
      ...ARTIFACT_DATABASE.moon,
      ...ARTIFACT_DATABASE.mars,
      ...ARTIFACT_DATABASE.deepSpace
    ];

    /**
     * =========================================================================
     * 2. PHASE 1 -> PHASE 2 BRIEFING TRANSITION & WARP BOOST
     * =========================================================================
     */
    let warpSpeedMultiplier = 1.0;
    const briefingOverlay = document.getElementById("briefing-overlay");
    const lobbyUI = document.getElementById("lobby-ui");
    const launchBtn = document.getElementById("launch-btn");
    const replayBriefingBtn = document.getElementById("replay-briefing-btn");

    function enterLobby() {
      briefingOverlay.classList.add("hidden-wipe");
      lobbyUI.classList.add("active");
      warpSpeedMultiplier = 3.6;
      setTimeout(() => {
        warpSpeedMultiplier = 1.0;
      }, 950);
    }

    function showBriefing() {
      closeWorldView();
      briefingOverlay.classList.remove("hidden-wipe");
      lobbyUI.classList.remove("active");
    }

    launchBtn.addEventListener("click", enterLobby);
    replayBriefingBtn.addEventListener("click", showBriefing);

    /**
     * =========================================================================
     * 3. MOVING LIGHT, SUNLIT WARM SPACE BACKGROUND (HTML5 2D CANVAS)
     * =========================================================================
     */
    const spaceCanvas = document.getElementById("space-canvas");
    const ctx = spaceCanvas.getContext("2d");

    let width = (spaceCanvas.width = window.innerWidth);
    let height = (spaceCanvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = spaceCanvas.width = window.innerWidth;
      height = spaceCanvas.height = window.innerHeight;
      if (worldCanvas) {
        worldCanvas.width = window.innerWidth;
        worldCanvas.height = window.innerHeight;
      }
    });

    const STAR_COLORS = ["#ffffff", "#fff9eb", "#ffd447", "#ffebd2", "#ff8573"];

    const stars = Array.from({ length: 125 }, () => {
      const layer = Math.random();
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: layer < 0.6 ? Math.random() * 1.8 + 1.1 : Math.random() * 2.8 + 1.6,
        speed: layer < 0.6 ? Math.random() * 1.8 + 1.1 : Math.random() * 4.0 + 2.5,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        alpha: Math.random() * 0.35 + 0.65,
        isStreak: layer > 0.78,
        isSparkle: layer > 0.90
      };
    });

    const nebulae = [
      { xRatio: 0.25, yRatio: 0.28, radiusRatio: 0.45, color: "rgba(255, 243, 214, 0.45)" },
      { xRatio: 0.75, yRatio: 0.22, radiusRatio: 0.42, color: "rgba(255, 212, 71, 0.32)" },
      { xRatio: 0.52, yRatio: 0.75, radiusRatio: 0.55, color: "rgba(255, 107, 87, 0.28)" }
    ];

    const bgPlanets = [
      { x: width * 0.82, y: height * 0.22, r: 22, color: "#ffd447", ring: true, speed: 0.45 },
      { x: width * 0.32, y: height * 0.48, r: 14, color: "#ff6b57", ring: false, speed: 0.30 }
    ];

    let bgTime = 0;

    function animateSpaceBackground() {
      bgTime += 0.008;

      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#ff995e");
      bgGrad.addColorStop(0.5, "#ffb66e");
      bgGrad.addColorStop(1, "#ffd384");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      nebulae.forEach((neb, idx) => {
        const nx = width * neb.xRatio + Math.sin(bgTime + idx) * 25;
        const ny = height * neb.yRatio + Math.cos(bgTime * 0.8 + idx) * 20;
        const nr = Math.max(width, height) * neb.radiusRatio;
        const radGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
        radGrad.addColorStop(0, neb.color);
        radGrad.addColorStop(1, "rgba(255, 182, 110, 0)");
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);
      });

      bgPlanets.forEach((p) => {
        p.x -= p.speed * warpSpeedMultiplier;
        if (p.x < -60) {
          p.x = width + 60;
          p.y = height * (0.15 + Math.random() * 0.45);
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.strokeStyle = "#5C3A21";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (p.ring) {
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.r * 1.75, p.r * 0.45, -0.25, 0, Math.PI * 2);
          ctx.strokeStyle = "#fff9eb";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        ctx.restore();
      });

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x -= s.speed * warpSpeedMultiplier;

        if (s.x < -30) {
          s.x = width + 25;
          s.y = Math.random() * height;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.strokeStyle = s.color;

        if (s.isStreak || warpSpeedMultiplier > 1.5) {
          const streakLen = s.speed * (warpSpeedMultiplier > 1.5 ? 9 : 4.2);
          ctx.lineWidth = s.radius;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + streakLen, s.y);
          ctx.stroke();
        } else if (s.isSparkle) {
          const r = s.radius * 1.6;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y - r);
          ctx.lineTo(s.x + r * 0.3, s.y - r * 0.3);
          ctx.lineTo(s.x + r, s.y);
          ctx.lineTo(s.x + r * 0.3, s.y + r * 0.3);
          ctx.lineTo(s.x, s.y + r);
          ctx.lineTo(s.x - r * 0.3, s.y + r * 0.3);
          ctx.lineTo(s.x - r, s.y);
          ctx.lineTo(s.x - r * 0.3, s.y - r * 0.3);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      requestAnimationFrame(animateSpaceBackground);
    }
    animateSpaceBackground();

    /**
     * =========================================================================
     * 4. CEL-SHADED 3D SPHERE & CUSTOM HARDWARE ILLUSTRATION RENDERERS
     * =========================================================================
     */
    const OUTLINE_COLOR = "#5C3A21";

    const hoverStates = {
      moon: { hovered: false, scale: 1 },
      mars: { hovered: false, scale: 1 },
      deepSpace: { hovered: false, scale: 1 }
    };

    function drawCelSphere(c, cx, cy, radius, colors, features, rotAngle, outlineWidth = 4.5) {
      c.save();
      c.translate(cx, cy);

      c.beginPath();
      c.arc(0, 0, radius, 0, Math.PI * 2);
      c.fillStyle = colors.base;
      c.fill();

      c.save();
      c.clip();

      // Cel-shaded warm shadow crescent on bottom-right
      c.beginPath();
      c.arc(0, 0, radius, 0, Math.PI * 2);
      c.arc(-radius * 0.34, -radius * 0.28, radius * 1.03, 0, Math.PI * 2, true);
      c.fillStyle = colors.shadow;
      c.fill();

      // Top-left sunlit cartoon highlight crescent
      c.beginPath();
      c.arc(-radius * 0.28, -radius * 0.28, radius * 0.68, Math.PI * 0.85, Math.PI * 1.65);
      c.strokeStyle = colors.highlight;
      c.lineWidth = radius * 0.12;
      c.lineCap = "round";
      c.stroke();

      // Project 3D spherical coordinates (lon, lat) onto 2D front hemisphere
      features.forEach(feat => {
        const lon = feat.lon + rotAngle;
        const lat = feat.lat;
        const cosLat = Math.cos(lat);
        const x3d = Math.sin(lon) * cosLat;
        const y3d = Math.sin(lat);
        const z3d = Math.cos(lon) * cosLat;

        if (z3d > -0.15) {
          const px = x3d * radius * 0.88;
          const py = y3d * radius * 0.88;
          const foreshorten = Math.max(0.15, z3d);
          const rx = feat.r * radius * foreshorten;
          const ry = feat.r * radius * (0.75 + 0.25 * foreshorten);
          const tilt = Math.atan2(py, px);

          c.save();
          c.translate(px, py);
          c.rotate(tilt);
          c.beginPath();
          c.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
          c.fillStyle = feat.color || colors.feature;
          c.fill();
          if (feat.outline) {
            c.strokeStyle = OUTLINE_COLOR;
            c.lineWidth = Math.max(1.8, radius * 0.025);
            c.stroke();
          }
          c.restore();
        }
      });

      c.restore();

      c.beginPath();
      c.arc(0, 0, radius, 0, Math.PI * 2);
      c.strokeStyle = OUTLINE_COLOR;
      c.lineWidth = outlineWidth;
      c.stroke();

      c.restore();
    }

    /**
     * Custom Cel-Shaded Mini Hardware Illustrations (Used on 3D Pins & Story Card)
     */
    function drawHardwareIllustration(c, type, cx, cy, scale = 1) {
      c.save();
      c.translate(cx, cy);
      c.scale(scale, scale);
      c.strokeStyle = OUTLINE_COLOR;
      c.lineCap = "round";
      c.lineJoin = "round";
      c.lineWidth = 3;

      switch (type) {
        case "apollo-lm": {
          // 4 landing legs
          c.beginPath();
          c.moveTo(-18, 8); c.lineTo(-30, 24);
          c.moveTo(18, 8); c.lineTo(30, 24);
          c.moveTo(-8, 10); c.lineTo(-14, 26);
          c.moveTo(8, 10); c.lineTo(14, 26);
          c.stroke();
          // Gold footpads
          [-30, -14, 14, 30].forEach((fx, idx) => {
            c.fillStyle = "#ffd447";
            c.beginPath();
            c.ellipse(fx, idx === 1 || idx === 2 ? 26 : 24, 6, 2.5, 0, 0, Math.PI * 2);
            c.fill(); c.stroke();
          });
          // Octagonal gold foil descent stage body
          c.fillStyle = "#ffd447";
          c.beginPath();
          c.rect(-20, -12, 40, 22);
          c.fill(); c.stroke();
          // Foil paneling & dark nozzle
          c.fillStyle = "#ff8c38";
          c.fillRect(-10, -12, 20, 22);
          c.strokeRect(-10, -12, 20, 22);
          c.fillStyle = "#7a3e20";
          c.beginPath();
          c.moveTo(-7, 10); c.lineTo(7, 10); c.lineTo(10, 17); c.lineTo(-10, 17); c.closePath();
          c.fill(); c.stroke();
          break;
        }
        case "lrv": {
          // Rover chassis
          c.fillStyle = "#fff9eb";
          c.fillRect(-24, -2, 48, 10);
          c.strokeRect(-24, -2, 48, 10);
          // Gold seats & high-gain dish antenna
          c.fillStyle = "#ff6b57";
          c.fillRect(-10, -12, 8, 10);
          c.strokeRect(-10, -12, 8, 10);
          c.beginPath();
          c.moveTo(14, -2); c.lineTo(18, -18);
          c.stroke();
          c.fillStyle = "#ffd447";
          c.beginPath();
          c.arc(18, -18, 9, Math.PI * 0.8, Math.PI * 1.9);
          c.fill(); c.stroke();
          // Wire-mesh wheels
          [-16, 16].forEach(wx => {
            c.fillStyle = "#ff8c38";
            c.beginPath();
            c.arc(wx, 12, 9, 0, Math.PI * 2);
            c.fill(); c.stroke();
            c.fillStyle = "#fff9eb";
            c.beginPath();
            c.arc(wx, 12, 4, 0, Math.PI * 2);
            c.fill(); c.stroke();
          });
          break;
        }
        case "alsep": {
          // Central station & RTG power finned cylinder
          c.fillStyle = "#fff9eb";
          c.fillRect(-22, -4, 18, 16);
          c.strokeRect(-22, -4, 18, 16);
          c.beginPath();
          c.moveTo(-13, -4); c.lineTo(-13, -22);
          c.stroke();
          c.fillStyle = "#ffd447";
          c.beginPath();
          c.arc(-13, -22, 4, 0, Math.PI * 2);
          c.fill(); c.stroke();
          // Laser retroreflector panel
          c.fillStyle = "#ff8c38";
          c.beginPath();
          c.moveTo(4, 12); c.lineTo(10, -6); c.lineTo(26, -2); c.lineTo(20, 14); c.closePath();
          c.fill(); c.stroke();
          break;
        }
        case "surveyor": {
          // Tripod legs
          c.beginPath();
          c.moveTo(0, -4); c.lineTo(-24, 22);
          c.moveTo(0, -4); c.lineTo(24, 22);
          c.moveTo(0, -4); c.lineTo(0, 24);
          c.stroke();
          // Mast & solar panel
          c.beginPath();
          c.moveTo(0, -4); c.lineTo(0, -24);
          c.stroke();
          c.fillStyle = "#ff6b57";
          c.fillRect(-14, -26, 28, 8);
          c.strokeRect(-14, -26, 28, 8);
          c.fillStyle = "#ffd447";
          c.beginPath();
          c.arc(0, -2, 9, 0, Math.PI * 2);
          c.fill(); c.stroke();
          break;
        }
        case "sojourner": {
          // Pathfinder base petal + mini 6-wheel Sojourner
          c.fillStyle = "#ffd447";
          c.beginPath();
          c.moveTo(-28, 18); c.lineTo(28, 18); c.lineTo(20, 10); c.lineTo(-20, 10); c.closePath();
          c.fill(); c.stroke();
          // Sojourner solar top
          c.fillStyle = "#ff6b57";
          c.fillRect(-15, -6, 30, 8);
          c.strokeRect(-15, -6, 30, 8);
          [-12, 0, 12].forEach(wx => {
            c.fillStyle = "#fff9eb";
            c.beginPath();
            c.arc(wx, 6, 4.5, 0, Math.PI * 2);
            c.fill(); c.stroke();
          });
          break;
        }
        case "mer": {
          // Spirit & Opportunity solar wings & Pancam mast
          c.fillStyle = "#ff6b57";
          c.beginPath();
          c.moveTo(-26, -2); c.lineTo(26, -2); c.lineTo(20, 6); c.lineTo(-20, 6); c.closePath();
          c.fill(); c.stroke();
          // Mast & camera head
          c.beginPath();
          c.moveTo(8, -2); c.lineTo(8, -20);
          c.stroke();
          c.fillStyle = "#fff9eb";
          c.fillRect(1, -24, 14, 7);
          c.strokeRect(1, -24, 14, 7);
          [-16, 0, 16].forEach(wx => {
            c.fillStyle = "#ffd447";
            c.beginPath();
            c.arc(wx, 14, 6, 0, Math.PI * 2);
            c.fill(); c.stroke();
          });
          break;
        }
        case "viking": {
          // Viking Lander body, 3 legs & dish
          c.beginPath();
          c.moveTo(-16, 4); c.lineTo(-24, 20);
          c.moveTo(16, 4); c.lineTo(24, 20);
          c.moveTo(0, 4); c.lineTo(0, 22);
          c.stroke();
          c.fillStyle = "#fff9eb";
          c.fillRect(-20, -6, 40, 12);
          c.strokeRect(-20, -6, 40, 12);
          // Dish antenna
          c.beginPath();
          c.moveTo(-8, -6); c.lineTo(-10, -18);
          c.stroke();
          c.fillStyle = "#ffd447";
          c.beginPath();
          c.ellipse(-10, -19, 10, 4, -0.25, 0, Math.PI * 2);
          c.fill(); c.stroke();
          break;
        }
        case "insight": {
          // Circular solar panels + dome seismometer on surface
          c.fillStyle = "#ff8c38";
          c.beginPath();
          c.arc(-22, -4, 10, 0, Math.PI * 2);
          c.arc(22, -4, 10, 0, Math.PI * 2);
          c.fill(); c.stroke();
          c.fillStyle = "#fff9eb";
          c.fillRect(-14, -6, 28, 10);
          c.strokeRect(-14, -6, 28, 10);
          c.beginPath();
          c.moveTo(-10, 4); c.lineTo(-16, 18);
          c.moveTo(10, 4); c.lineTo(16, 18);
          c.stroke();
          // Copper dome seismometer
          c.fillStyle = "#ffd447";
          c.beginPath();
          c.arc(0, 18, 7, Math.PI, 0);
          c.closePath();
          c.fill(); c.stroke();
          break;
        }
        case "ingenuity": {
          // Counter-rotating rotor blades
          c.fillStyle = "#ffd447";
          c.fillRect(-28, -18, 56, 4);
          c.strokeRect(-28, -18, 56, 4);
          c.fillStyle = "#ff8c38";
          c.fillRect(-24, -11, 48, 4);
          c.strokeRect(-24, -11, 48, 4);
          // Solar top cap & tissue-box fuselage
          c.fillStyle = "#ff6b57";
          c.fillRect(-12, -23, 24, 4);
          c.strokeRect(-12, -23, 24, 4);
          c.fillStyle = "#fff9eb";
          c.fillRect(-8, -6, 16, 13);
          c.strokeRect(-8, -6, 16, 13);
          // 4 landing legs
          c.beginPath();
          c.moveTo(-8, 7); c.lineTo(-18, 22);
          c.moveTo(8, 7); c.lineTo(18, 22);
          c.stroke();
          break;
        }
        case "pioneer": {
          // Large iconic dish + RTG booms
          c.beginPath();
          c.moveTo(-12, 0); c.lineTo(-28, -14);
          c.moveTo(-12, 0); c.lineTo(-28, 14);
          c.moveTo(4, 0); c.lineTo(28, 0);
          c.stroke();
          c.fillStyle = "#fff9eb";
          c.beginPath();
          c.ellipse(4, 0, 9, 22, 0, 0, Math.PI * 2);
          c.fill(); c.stroke();
          c.fillStyle = "#ffd447";
          c.fillRect(-14, -8, 12, 16);
          c.strokeRect(-14, -8, 12, 16);
          break;
        }
        case "dawn": {
          // Wide solar wings + central spacecraft bus
          c.fillStyle = "#ff6b57";
          c.fillRect(-32, -6, 22, 12);
          c.strokeRect(-32, -6, 22, 12);
          c.fillRect(10, -6, 22, 12);
          c.strokeRect(10, -6, 22, 12);
          c.fillStyle = "#ffd447";
          c.fillRect(-10, -11, 20, 22);
          c.strokeRect(-10, -11, 20, 22);
          // Blue-warm ion glow
          c.fillStyle = "#fff9eb";
          c.beginPath();
          c.arc(0, 15, 4, 0, Math.PI * 2);
          c.fill(); c.stroke();
          break;
        }
        case "near": {
          // 4 solar panels arranged like windmill + dish
          c.fillStyle = "#ff8c38";
          c.fillRect(-26, -4, 52, 8);
          c.strokeRect(-26, -4, 52, 8);
          c.fillRect(-4, -26, 8, 52);
          c.strokeRect(-4, -26, 8, 52);
          c.fillStyle = "#ffd447";
          c.beginPath();
          c.arc(0, 0, 11, 0, Math.PI * 2);
          c.fill(); c.stroke();
          break;
        }
        case "kepler": {
          // Barrel-shaped space telescope + angled solar array
          c.save();
          c.rotate(-0.35);
          c.fillStyle = "#ffd447";
          c.fillRect(-22, 8, 44, 9);
          c.strokeRect(-22, 8, 44, 9);
          c.fillStyle = "#fff9eb";
          c.fillRect(-13, -18, 26, 28);
          c.strokeRect(-13, -18, 26, 28);
          c.fillStyle = "#ff6b57";
          c.beginPath();
          c.ellipse(0, -18, 13, 5, 0, 0, Math.PI * 2);
          c.fill(); c.stroke();
          c.restore();
          break;
        }
      }

      c.restore();
    }

    // Surface features for Moon & Mars spheres
    const moonCraters = [
      { lon: 0.2, lat: -0.25, r: 0.20, outline: true },
      { lon: 1.3, lat: 0.20, r: 0.16, outline: true },
      { lon: 2.4, lat: -0.15, r: 0.22, outline: true },
      { lon: 3.5, lat: 0.32, r: 0.17, outline: true },
      { lon: 4.6, lat: -0.35, r: 0.19, outline: true },
      { lon: 5.5, lat: 0.12, r: 0.15, outline: true },
      { lon: 0.8, lat: 0.45, r: 0.14, outline: true },
      { lon: 2.9, lat: -0.45, r: 0.15, outline: true }
    ];

    const marsFeatures = [
      { lon: 0.0, lat: -0.82, r: 0.38, color: "#fff9eb", outline: false },
      { lon: 3.14, lat: -0.82, r: 0.38, color: "#fff9eb", outline: false },
      { lon: 0.4, lat: 0.08, r: 0.26, color: "#d94832", outline: false },
      { lon: 1.9, lat: -0.18, r: 0.22, color: "#ff8c38", outline: false },
      { lon: 3.4, lat: 0.15, r: 0.28, color: "#d94832", outline: false },
      { lon: 4.9, lat: -0.12, r: 0.21, color: "#ff8c38", outline: false },
      { lon: 2.5, lat: 0.38, r: 0.20, color: "#d94832", outline: false }
    ];

    // --- Lobby Mini 3D Canvases ---
    const moonCanvas = document.getElementById("canvas-moon");
    const moonCtx = moonCanvas.getContext("2d");
    const marsCanvas = document.getElementById("canvas-mars");
    const marsCtx = marsCanvas.getContext("2d");
    const deepCanvas = document.getElementById("canvas-deepspace");
    const deepCtx = deepCanvas.getContext("2d");

    const lobbySolarPlanets = [
      { orbitRx: 52, orbitRy: 19, size: 7.5, color: "#fff9eb", speed: 1.9, angle: 0.4 },
      { orbitRx: 74, orbitRy: 27, size: 10.5, color: "#ff6b57", speed: 1.25, angle: 2.5 },
      { orbitRx: 96, orbitRy: 35, size: 9.0, color: "#ff8c38", speed: 0.85, angle: 4.6 }
    ];

    function renderMiniSolarSystem(c, timeSec, scale) {
      const w = deepCanvas.width;
      const h = deepCanvas.height;
      c.clearRect(0, 0, w, h);

      c.save();
      c.translate(w / 2, h / 2);
      c.scale(scale, scale);
      c.rotate(-0.22);

      lobbySolarPlanets.forEach(p => {
        c.beginPath();
        c.ellipse(0, 0, p.orbitRx, p.orbitRy, 0, 0, Math.PI * 2);
        c.strokeStyle = "rgba(255, 249, 235, 0.85)";
        c.lineWidth = 2.4;
        c.stroke();
      });

      const renderables = [{ type: "sun", depth: 0 }];
      lobbySolarPlanets.forEach(p => {
        const theta = p.angle + timeSec * p.speed;
        const x = Math.cos(theta) * p.orbitRx;
        const y = Math.sin(theta) * p.orbitRy;
        renderables.push({
          type: "planet",
          depth: y,
          x,
          y,
          size: p.size * (1 + (y / p.orbitRy) * 0.16),
          color: p.color
        });
      });

      renderables.sort((a, b) => a.depth - b.depth);

      renderables.forEach(obj => {
        if (obj.type === "sun") {
          c.beginPath();
          c.arc(0, 0, 32, 0, Math.PI * 2);
          c.fillStyle = "rgba(255, 255, 255, 0.42)";
          c.fill();

          c.beginPath();
          c.arc(0, 0, 23, 0, Math.PI * 2);
          c.fillStyle = "#ffd447";
          c.fill();
          c.strokeStyle = OUTLINE_COLOR;
          c.lineWidth = 4;
          c.stroke();

          c.beginPath();
          c.arc(-7, -7, 5, 0, Math.PI * 2);
          c.fillStyle = "#ffffff";
          c.fill();
        } else {
          c.beginPath();
          c.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
          c.fillStyle = obj.color;
          c.fill();
          c.strokeStyle = OUTLINE_COLOR;
          c.lineWidth = 3;
          c.stroke();
        }
      });

      c.restore();
    }

    let animLastTime = performance.now();
    let total3DTime = 0;

    function animateLobbyCanvases(now) {
      const dt = Math.min((now - animLastTime) / 1000, 0.1);
      animLastTime = now;
      total3DTime += dt;

      ["moon", "mars", "deepSpace"].forEach(key => {
        const target = hoverStates[key].hovered ? 1.1 : 1.0;
        hoverStates[key].scale += (target - hoverStates[key].scale) * 0.16;
      });

      moonCtx.clearRect(0, 0, 240, 240);
      drawCelSphere(
        moonCtx, 120, 120, 74 * hoverStates.moon.scale,
        { base: "#fff5d6", shadow: "#f5cf8e", highlight: "#ffffff", feature: "#e8b66b" },
        moonCraters,
        total3DTime * (hoverStates.moon.hovered ? 1.35 : 0.55)
      );

      marsCtx.clearRect(0, 0, 240, 240);
      drawCelSphere(
        marsCtx, 120, 120, 74 * hoverStates.mars.scale,
        { base: "#ff6b57", shadow: "#e04a36", highlight: "#ffb29e", feature: "#d94832" },
        marsFeatures,
        total3DTime * (hoverStates.mars.hovered ? 1.35 : 0.55)
      );

      renderMiniSolarSystem(
        deepCtx,
        total3DTime * (hoverStates.deepSpace.hovered ? 1.65 : 1.0),
        hoverStates.deepSpace.scale
      );

      requestAnimationFrame(animateLobbyCanvases);
    }
    requestAnimationFrame(animateLobbyCanvases);

    /**
     * =========================================================================
     * 5. GIANT INTERACTIVE 3D EXPLORATION WORLDS (MOON, MARS, DEEP SPACE)
     * =========================================================================
     */
    const worldView = document.getElementById("world-view");
    const worldCanvas = document.getElementById("world-canvas");
    const wCtx = worldCanvas.getContext("2d");
    worldCanvas.width = window.innerWidth;
    worldCanvas.height = window.innerHeight;

    const backToLobbyBtn = document.getElementById("back-to-lobby-btn");
    const worldSectorSub = document.getElementById("world-sector-sub");
    const worldSectorTitle = document.getElementById("world-sector-title");
    const worldBadgeDot = document.getElementById("world-badge-dot");
    const worldCountLabel = document.getElementById("world-count-label");
    const artifactPillsStrip = document.getElementById("artifact-pills-strip");

    let activeWorld = null; // 'moon' | 'mars' | 'deepSpace' | null
    let worldRotY = 0;
    let worldRotX = 0.15;
    let worldZoom = 1.0;
    let isDraggingWorld = false;
    let dragMoved = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let hoveredPin = null;
    let renderedPins = []; // Stores { artifact, x, y, radius, visible } for hit testing

    const WORLD_META = {
      moon: {
        title: "THE MOON",
        sub: "LUNAR SURFACE // 4 ARTIFACT SITES",
        dotColor: "#fff5d6"
      },
      mars: {
        title: "MARS",
        sub: "RED PLANET // 5 ROVER & LANDER SITES",
        dotColor: "#ff6b57"
      },
      deepSpace: {
        title: "DEEP SPACE",
        sub: "SOLAR & INTERSTELLAR // 4 PROBE ORBITS",
        dotColor: "#ffd447"
      }
    };

    function openWorldView(worldKey) {
      activeWorld = worldKey;
      worldRotY = 0;
      worldRotX = 0.12;
      worldZoom = 1.0;

      const meta = WORLD_META[worldKey];
      worldSectorTitle.textContent = meta.title;
      worldSectorSub.textContent = meta.sub;
      worldBadgeDot.style.background = meta.dotColor;

      lobbyUI.style.opacity = "0";
      lobbyUI.style.pointerEvents = "none";
      worldView.classList.add("active");

      renderWorldBottomStrip();
    }

    function closeWorldView() {
      activeWorld = null;
      worldView.classList.remove("active");
      if (briefingOverlay.classList.contains("hidden-wipe")) {
        lobbyUI.style.opacity = "1";
        lobbyUI.style.pointerEvents = "";
      }
    }

    backToLobbyBtn.addEventListener("click", closeWorldView);

    document.getElementById("zoom-in-btn").addEventListener("click", () => {
      worldZoom = Math.min(1.65, worldZoom + 0.18);
    });
    document.getElementById("zoom-out-btn").addEventListener("click", () => {
      worldZoom = Math.max(0.68, worldZoom - 0.18);
    });
    document.getElementById("zoom-reset-btn").addEventListener("click", () => {
      worldZoom = 1.0;
      worldRotY = 0;
      worldRotX = 0.12;
    });

    // Mouse & Touch Drag to Rotate Giant 3D World
    worldCanvas.addEventListener("pointerdown", (e) => {
      isDraggingWorld = true;
      dragMoved = false;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
    });

    window.addEventListener("pointermove", (e) => {
      if (!activeWorld) return;

      if (isDraggingWorld) {
        const dx = e.clientX - lastPointerX;
        const dy = e.clientY - lastPointerY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved = true;

        worldRotY += dx * 0.0085;
        worldRotX = Math.max(-0.55, Math.min(0.55, worldRotX + dy * 0.006));
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
      } else {
        // Check hover over 3D pins
        hoveredPin = null;
        for (let i = renderedPins.length - 1; i >= 0; i--) {
          const pin = renderedPins[i];
          if (!pin.visible) continue;
          const dist = Math.hypot(e.clientX - pin.x, e.clientY - pin.y);
          if (dist <= pin.radius) {
            hoveredPin = pin.artifact;
            break;
          }
        }
        worldCanvas.style.cursor = hoveredPin ? "pointer" : "grab";
      }
    });

    window.addEventListener("pointerup", (e) => {
      if (!isDraggingWorld) return;
      isDraggingWorld = false;

      if (!dragMoved && activeWorld) {
        for (let i = renderedPins.length - 1; i >= 0; i--) {
          const pin = renderedPins[i];
          if (!pin.visible) continue;
          const dist = Math.hypot(e.clientX - pin.x, e.clientY - pin.y);
          if (dist <= pin.radius) {
            openDiscoveryStory(pin.artifact);
            break;
          }
        }
      }
    });

    worldCanvas.addEventListener("wheel", (e) => {
      if (!activeWorld) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      worldZoom = Math.max(0.68, Math.min(1.65, worldZoom + delta));
    }, { passive: false });

    function renderWorldBottomStrip() {
      if (!activeWorld) return;
      const list = ARTIFACT_DATABASE[activeWorld] || [];
      const foundCount = list.filter(a => !!checkedState[a.id]).length;
      worldCountLabel.textContent = `DISCOVERED IN THIS ZONE: ${foundCount} / ${list.length}`;

      artifactPillsStrip.innerHTML = "";
      list.forEach((art) => {
        const isDone = !!checkedState[art.id];
        const btn = document.createElement("button");
        btn.className = isDone ? "artifact-chip discovered" : "artifact-chip";
        btn.innerHTML = `<span class="chip-status-dot"></span><span>${art.shortName}</span>`;
        btn.addEventListener("click", () => {
          // Smoothly rotate globe to face the selected artifact if on Moon/Mars
          if (art.lon !== undefined) {
            worldRotY = -art.lon;
          }
          openDiscoveryStory(art);
        });
        artifactPillsStrip.appendChild(btn);
      });
    }

    // Draw an interactive 3D-pinned cel-shaded hardware badge on the giant planet/orbit
    function draw3DArtifactMarker(c, x, y, artifact, isFront, isHovered, isDiscovered, pulsePhase) {
      c.save();
      c.globalAlpha = isFront ? 1.0 : 0.35;
      const scale = (isHovered ? 1.16 : 1.0) * (isFront ? 1.0 : 0.78);
      c.translate(x, y);
      c.scale(scale, scale);

      // Pulsing outer discovery beacon ring
      if (isFront) {
        const pulseR = 36 + Math.sin(pulsePhase) * 5;
        c.beginPath();
        c.arc(0, 0, pulseR, 0, Math.PI * 2);
        c.strokeStyle = isDiscovered ? "rgba(255, 212, 71, 0.85)" : "rgba(255, 255, 255, 0.92)";
        c.lineWidth = 3;
        c.stroke();
      }

      // Circular cel-shaded badge frame
      c.beginPath();
      c.arc(0, 0, 31, 0, Math.PI * 2);
      c.fillStyle = isDiscovered ? "#ffebd2" : "#fff9eb";
      c.fill();
      c.strokeStyle = OUTLINE_COLOR;
      c.lineWidth = 4;
      c.stroke();

      // Custom cel-shaded hardware drawing inside the pin
      drawHardwareIllustration(c, artifact.artType, 0, 1, 0.62);

      // Checkmark badge if already discovered
      if (isDiscovered) {
        c.beginPath();
        c.arc(22, -22, 10, 0, Math.PI * 2);
        c.fillStyle = "#ffd447";
        c.fill();
        c.strokeStyle = OUTLINE_COLOR;
        c.lineWidth = 2.5;
        c.stroke();
        c.fillStyle = OUTLINE_COLOR;
        c.font = "900 12px sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("✔", 22, -21);
      }

      // Label tag underneath the pin when facing front
      if (isFront) {
        const label = artifact.shortName;
        c.font = "900 12px 'Trebuchet MS', sans-serif";
        const textW = c.measureText(label).width;
        const boxW = textW + 18;
        const boxH = 24;

        c.fillStyle = isHovered ? "#ffd447" : "#fff9eb";
        c.strokeStyle = OUTLINE_COLOR;
        c.lineWidth = 3;
        c.beginPath();
        c.roundRect(-boxW / 2, 35, boxW, boxH, 8);
        c.fill();
        c.stroke();

        c.fillStyle = OUTLINE_COLOR;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(label, 0, 47);
      }

      c.restore();
    }

    function animateWorldView(now) {
      if (activeWorld) {
        const w = worldCanvas.width;
        const h = worldCanvas.height;
        wCtx.clearRect(0, 0, w, h);

        // Auto-rotate gently when not dragging
        if (!isDraggingWorld) {
          worldRotY += 0.0022;
        }

        const cx = w / 2;
        const cy = h * 0.48;
        const baseRadius = Math.min(w, h) * 0.28 * worldZoom;
        const pulsePhase = now * 0.005;
        renderedPins = [];

        if (activeWorld === "moon" || activeWorld === "mars") {
          // Soft sunlit halo behind the giant planet
          const haloGrad = wCtx.createRadialGradient(cx, cy, baseRadius * 0.85, cx, cy, baseRadius * 1.45);
          haloGrad.addColorStop(0, "rgba(255, 249, 235, 0.55)");
          haloGrad.addColorStop(1, "rgba(255, 249, 235, 0)");
          wCtx.fillStyle = haloGrad;
          wCtx.beginPath();
          wCtx.arc(cx, cy, baseRadius * 1.45, 0, Math.PI * 2);
          wCtx.fill();

          // Render giant 3D cel-shaded Moon or Mars
          if (activeWorld === "moon") {
            drawCelSphere(
              wCtx, cx, cy, baseRadius,
              { base: "#fff5d6", shadow: "#f5cf8e", highlight: "#ffffff", feature: "#e8b66b" },
              moonCraters,
              worldRotY,
              6
            );
          } else {
            drawCelSphere(
              wCtx, cx, cy, baseRadius,
              { base: "#ff6b57", shadow: "#e04a36", highlight: "#ffb29e", feature: "#d94832" },
              marsFeatures,
              worldRotY,
              6
            );
          }

          // Project surface artifacts in 3D spherical space
          const artifacts = ARTIFACT_DATABASE[activeWorld];
          const projected = artifacts.map(art => {
            const lon = art.lon + worldRotY;
            const lat = art.lat + worldRotX * 0.45;
            const cosLat = Math.cos(lat);
            const x3d = Math.sin(lon) * cosLat;
            const y3d = Math.sin(lat);
            const z3d = Math.cos(lon) * cosLat;
            return {
              artifact: art,
              x: cx + x3d * baseRadius * 0.82,
              y: cy + y3d * baseRadius * 0.82,
              z: z3d
            };
          });

          // Sort back-to-front
          projected.sort((a, b) => a.z - b.z);

          projected.forEach(item => {
            const isFront = item.z > -0.12;
            const isHov = hoveredPin && hoveredPin.id === item.artifact.id;
            const isDone = !!checkedState[item.artifact.id];
            draw3DArtifactMarker(wCtx, item.x, item.y, item.artifact, isFront, isHov, isDone, pulsePhase);
            renderedPins.push({
              artifact: item.artifact,
              x: item.x,
              y: item.y,
              radius: 42,
              visible: isFront
            });
          });
        } else if (activeWorld === "deepSpace") {
          // Giant 3D Miniature Solar System & Outer Probes
          const scaleFactor = (Math.min(w, h) / 680) * worldZoom;
          const artifacts = ARTIFACT_DATABASE.deepSpace;

          wCtx.save();
          wCtx.translate(cx, cy);
          wCtx.rotate(-0.18 + worldRotX * 0.35);

          // Draw 4 warm orbital rings
          artifacts.forEach(art => {
            wCtx.beginPath();
            wCtx.ellipse(0, 0, art.orbitRx * scaleFactor, art.orbitRy * scaleFactor, 0, 0, Math.PI * 2);
            wCtx.strokeStyle = "rgba(255, 249, 235, 0.85)";
            wCtx.lineWidth = 3;
            wCtx.setLineDash([8, 6]);
            wCtx.stroke();
            wCtx.setLineDash([]);
          });

          // Build depth-sorted list of Sun + 4 Deep Space Probes
          const sceneObjects = [{ type: "sun", depth: 0 }];

          artifacts.forEach(art => {
            const theta = art.orbitAngle + worldRotY * 1.15 + total3DTime * art.orbitSpeed * 0.35;
            const ox = Math.cos(theta) * art.orbitRx * scaleFactor;
            const oy = Math.sin(theta) * art.orbitRy * scaleFactor;

            // Convert rotated local coordinates back to screen coordinates for hit testing
            const angle = -0.18 + worldRotX * 0.35;
            const screenX = cx + (ox * Math.cos(angle) - oy * Math.sin(angle));
            const screenY = cy + (ox * Math.sin(angle) + oy * Math.cos(angle));

            sceneObjects.push({
              type: "probe",
              depth: oy,
              ox,
              oy,
              screenX,
              screenY,
              artifact: art
            });
          });

          sceneObjects.sort((a, b) => a.depth - b.depth);

          sceneObjects.forEach(obj => {
            if (obj.type === "sun") {
              const sunR = 46 * scaleFactor;
              wCtx.beginPath();
              wCtx.arc(0, 0, sunR * 1.45, 0, Math.PI * 2);
              wCtx.fillStyle = "rgba(255, 255, 255, 0.42)";
              wCtx.fill();

              wCtx.beginPath();
              wCtx.arc(0, 0, sunR, 0, Math.PI * 2);
              wCtx.fillStyle = "#ffd447";
              wCtx.fill();
              wCtx.strokeStyle = OUTLINE_COLOR;
              wCtx.lineWidth = 5;
              wCtx.stroke();

              wCtx.beginPath();
              wCtx.arc(-sunR * 0.32, -sunR * 0.32, sunR * 0.22, 0, Math.PI * 2);
              wCtx.fillStyle = "#ffffff";
              wCtx.fill();
            } else {
              wCtx.save();
              wCtx.translate(obj.ox, obj.oy);
              wCtx.rotate(-(-0.18 + worldRotX * 0.35)); // Keep badge upright
              const isHov = hoveredPin && hoveredPin.id === obj.artifact.id;
              const isDone = !!checkedState[obj.artifact.id];
              draw3DArtifactMarker(wCtx, 0, 0, obj.artifact, true, isHov, isDone, pulsePhase);
              wCtx.restore();

              renderedPins.push({
                artifact: obj.artifact,
                x: obj.screenX,
                y: obj.screenY,
                radius: 42,
                visible: true
              });
            }
          });

          wCtx.restore();
        }
      }

      requestAnimationFrame(animateWorldView);
    }
    requestAnimationFrame(animateWorldView);

    /**
     * =========================================================================
     * 6. DISCOVERY STORY CARD MODAL & AUTOMATIC CHECKLIST SYNC
     * =========================================================================
     */
    const storyBackdrop = document.getElementById("story-modal-backdrop");
    const closeStoryBtn = document.getElementById("close-story-btn");
    const nextArtifactBtn = document.getElementById("next-artifact-btn");
    const storyArtCanvas = document.getElementById("story-art-canvas");
    const storyArtCtx = storyArtCanvas.getContext("2d");

    const storyEraBadge = document.getElementById("story-era-badge");
    const storyStateBadge = document.getElementById("story-state-badge");
    const storySubtitle = document.getElementById("story-subtitle");
    const storyTitle = document.getElementById("story-title");
    const storyBody = document.getElementById("story-body");
    const storyFactBox = document.getElementById("story-fact-box");

    let currentStoryArtifact = null;

    function openDiscoveryStory(artifact) {
      currentStoryArtifact = artifact;

      // Populate Story Card content
      storyEraBadge.textContent = artifact.era;
      storyStateBadge.textContent = artifact.status;
      storySubtitle.textContent = `${artifact.sector} // ${artifact.location}`;
      storyTitle.textContent = artifact.title;
      storyBody.textContent = artifact.story;
      storyFactBox.innerHTML = `<strong>⭐ Why It Was Left Behind:</strong> ${artifact.whyLeftBehind}`;

      // Draw large custom cel-shaded hardware illustration
      storyArtCtx.clearRect(0, 0, storyArtCanvas.width, storyArtCanvas.height);
      drawHardwareIllustration(storyArtCtx, artifact.artType, 120, 90, 2.35);

      storyBackdrop.classList.add("open");

      // Automatically mark as discovered in the Mission Checklist!
      const wasAlreadyChecked = !!checkedState[artifact.id];
      checkedState[artifact.id] = true;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedState));
      } catch (e) {}

      renderChecklist();
      renderWorldBottomStrip();

      if (!wasAlreadyChecked) {
        showToast(
          "NEW DISCOVERY UNLOCKED!",
          `"${artifact.shortName}" has been ticked off in your Mission Checklist!`
        );
      }
    }

    function closeDiscoveryStory() {
      storyBackdrop.classList.remove("open");
    }

    closeStoryBtn.addEventListener("click", closeDiscoveryStory);
    storyBackdrop.addEventListener("click", (e) => {
      if (e.target === storyBackdrop) closeDiscoveryStory();
    });

    nextArtifactBtn.addEventListener("click", () => {
      if (!currentStoryArtifact) return;
      const zoneList = ARTIFACT_DATABASE[currentStoryArtifact.world];
      const idx = zoneList.findIndex(a => a.id === currentStoryArtifact.id);
      const nextArt = zoneList[(idx + 1) % zoneList.length];
      if (nextArt.lon !== undefined) {
        worldRotY = -nextArt.lon;
      }
      openDiscoveryStory(nextArt);
    });

    /**
     * =========================================================================
     * 7. LOBBY PEDESTAL BINDING (OPENS GIANT 3D EXPLORATION WORLDS)
     * =========================================================================
     */
    const toastBanner = document.getElementById("toast-banner");
    const toastTitle = document.getElementById("toast-title");
    const toastMsg = document.getElementById("toast-msg");
    let toastTimer = null;

    function showToast(title, message) {
      toastTitle.textContent = title;
      toastMsg.textContent = message;
      toastBanner.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toastBanner.classList.remove("show");
      }, 3600);
    }

    function bindDestinationCard(elementId, stateKey, worldKey) {
      const el = document.getElementById(elementId);

      el.addEventListener("mouseenter", () => { hoverStates[stateKey].hovered = true; });
      el.addEventListener("mouseleave", () => { hoverStates[stateKey].hovered = false; });
      el.addEventListener("touchstart", () => { hoverStates[stateKey].hovered = true; }, { passive: true });
      el.addEventListener("touchend", () => { hoverStates[stateKey].hovered = false; });

      const activateDestination = () => {
        openWorldView(worldKey);
      };

      el.addEventListener("click", activateDestination);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activateDestination();
        }
      });
    }

    bindDestinationCard("dest-moon", "moon", "moon");
    bindDestinationCard("dest-mars", "mars", "mars");
    bindDestinationCard("dest-deepspace", "deepSpace", "deepSpace");

    /**
     * =========================================================================
     * 8. TOP-RIGHT MISSION CHECKLIST DRAWER & SAFE STORAGE PERSISTENCE
     * =========================================================================
     */
    const STORAGE_KEY = "orbital_archive_checklist_v2";
    let checkedState = {};

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) checkedState = JSON.parse(saved);
    } catch (err) {
      checkedState = {};
    }

    const checklistDrawer = document.getElementById("checklist-drawer");
    const checklistBackdrop = document.getElementById("checklist-backdrop");
    const openChecklistBtn = document.getElementById("open-checklist-btn");
    const closeChecklistBtn = document.getElementById("close-checklist-btn");
    const resetChecklistBtn = document.getElementById("reset-checklist-btn");
    const checklistContainer = document.getElementById("checklist-items-container");
    const checklistBadge = document.getElementById("checklist-badge");
    const checklistPercent = document.getElementById("checklist-percent");
    const checklistProgressBar = document.getElementById("checklist-progress-bar");

    function openChecklist() {
      checklistDrawer.classList.add("open");
      checklistBackdrop.classList.add("open");
    }

    function closeChecklist() {
      checklistDrawer.classList.remove("open");
      checklistBackdrop.classList.remove("open");
    }

    openChecklistBtn.addEventListener("click", openChecklist);
    closeChecklistBtn.addEventListener("click", closeChecklist);
    checklistBackdrop.addEventListener("click", closeChecklist);

    function updateProgressUI() {
      const total = CHECKLIST_ITEMS.length;
      const completed = CHECKLIST_ITEMS.filter(item => !!checkedState[item.id]).length;
      const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

      checklistBadge.textContent = `${completed}/${total}`;
      checklistPercent.textContent = `${pct}%`;
      checklistProgressBar.style.width = `${pct}%`;
    }

    function renderChecklist() {
      checklistContainer.innerHTML = "";

      CHECKLIST_ITEMS.forEach((item) => {
        const isChecked = !!checkedState[item.id];

        const row = document.createElement("label");
        row.className = isChecked ? "checklist-row checked" : "checklist-row";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "warm-checkbox";
        checkbox.checked = isChecked;

        checkbox.addEventListener("change", () => {
          checkedState[item.id] = checkbox.checked;
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedState));
          } catch (e) {}
          renderChecklist();
          renderWorldBottomStrip();
          updateProgressUI();
        });

        const textWrap = document.createElement("div");
        textWrap.style.flex = "1";

        const sectorTag = document.createElement("span");
        sectorTag.className = "sector-tag";
        sectorTag.textContent = `${item.sector} • ${item.era}`;

        const titleEl = document.createElement("div");
        titleEl.style.fontSize = "0.88rem";
        titleEl.style.fontWeight = "700";
        titleEl.style.lineHeight = "1.35";
        titleEl.style.textDecoration = isChecked ? "line-through" : "none";
        titleEl.style.color = isChecked ? "#7a3e20" : "#4a2311";
        titleEl.textContent = item.title;

        textWrap.appendChild(sectorTag);
        textWrap.appendChild(titleEl);
        row.appendChild(checkbox);
        row.appendChild(textWrap);
        checklistContainer.appendChild(row);
      });

      updateProgressUI();
    }

    resetChecklistBtn.addEventListener("click", () => {
      checkedState = {};
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      renderChecklist();
      renderWorldBottomStrip();
      showToast("LOG RESET", "All 13 checklist discoveries have been cleared.");
    });

    renderChecklist();
  </script>
</body>
</html>
```
