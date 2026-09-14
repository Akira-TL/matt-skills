# HTML Report Format

The architectural review is rendered as a single **actually self-contained** HTML file in the OS temp directory. It must render without network access: no CDN, remote font, remote script, image hotlink or other external runtime dependency. Use inline CSS plus inline SVG/HTML for diagrams and layout.

## Scaffold

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review — {{repo name}}</title>
    <style>
      :root {
        color-scheme: light;
        font-family: ui-sans-serif, system-ui, sans-serif;
        background: #fafaf9;
        color: #0f172a;
      }
      body { margin: 0; }
      main { max-width: 72rem; margin: 0 auto; padding: 3rem 1.5rem; }
      .candidate { margin: 2.5rem 0; padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: .75rem; background: white; }
      .before-after { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
      .module { fill: white; stroke: #334155; stroke-width: 2; }
      .deep-module { fill: #1e293b; stroke: #0f172a; stroke-width: 3; }
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; stroke-width: 2; }
      .warning { border-left: 4px solid #d97706; padding-left: .75rem; }
      code, .files { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
      @media (max-width: 760px) { .before-after { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <main>
      <header>...</header>
      <section id="candidates">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

## Header

Repo name, date, and a compact legend: solid box = module, dashed line = seam, red arrow = leakage, thick dark box = deep module. No introduction paragraph — straight into the candidates.

## Candidate card

The diagrams carry the weight. Prose is sparse, plain, and uses the glossary terms (from the `/codebase-design` skill) without ceremony.

Each candidate is one `<article>`:

- **Title** — short, names the deepening (e.g. "Collapse the Order intake pipeline").
- **Badge row** — recommendation strength (`Strong` = emerald, `Worth exploring` = amber, `Speculative` = slate), plus a tag for the dependency category (`in-process`, `local-substitutable`, `ports & adapters`, `mock`).
- **Files** — compact monospaced list using the local `.files` / `code` CSS.
- **Before / After diagram** — the centrepiece. Two columns, side by side. See patterns below.
- **Problem** — one sentence. What hurts.
- **Solution** — one sentence. What changes.
- **Wins** — bullets, ≤6 words each. e.g. "Tests hit one interface", "Pricing logic stops leaking", "Delete 4 shallow wrappers".
- **ADR callout** (if applicable) — one line in an amber-tinted box.

No paragraphs of explanation. If the diagram needs a paragraph to be understood, redraw the diagram.

## Diagram patterns

Pick the pattern that fits the candidate. Mix them. Don't make every diagram look the same — variety is part of the point.

### Inline SVG graph (the workhorse for dependencies / call flow)

Use one inline `<svg>` when the point is "X calls Y calls Z" or when the before/after comparison depends on explicit edge geometry. Define arrow markers inside `<defs>`, draw modules as labelled rectangles, and use `.leak` / `.seam` classes for semantic styling. Keep the SVG's `viewBox` stable so it scales without external JavaScript.

```html
<svg viewBox="0 0 720 240" role="img" aria-label="Order intake dependency graph">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
    </marker>
  </defs>
  <rect class="module" x="20" y="70" width="150" height="60" rx="8" />
  <text x="95" y="105" text-anchor="middle">OrderHandler</text>
  <rect class="module" x="285" y="70" width="150" height="60" rx="8" />
  <text x="360" y="105" text-anchor="middle">OrderValidator</text>
  <path d="M170 100 H285" stroke="#334155" marker-end="url(#arrow)" />
</svg>
```

### HTML boxes-and-arrows

Modules may also be ordinary `<div>`s with borders and labels, with an inline SVG overlay for arrows. Reach for this when you want the "after" diagram to feel like one thick-bordered deep module with faded internals.

### Cross-section (good for layered shallowness)

Stack horizontal bands (`h-12 border-l-4`) to show layers a call passes through. Before: 6 thin layers each doing nothing. After: 1 thick band labelled with the consolidated responsibility.

### Mass diagram (good for "interface as wide as implementation")

Two rectangles per module — one for interface surface area, one for implementation. Before: interface rectangle is nearly as tall as the implementation rectangle (shallow). After: interface rectangle is short, implementation rectangle is tall (deep).

### Call-graph collapse

Before: a tree of function calls rendered as nested boxes. After: the same tree collapsed into one box, with the now-internal calls shown faded inside it.

## Style guidance

- Lean editorial, not corporate-dashboard. Generous whitespace. Use system fonts so the report remains portable and offline.
- Colour sparingly: one accent (emerald or indigo) plus red for leakage and amber for warnings.
- Keep diagrams ~320px tall so before/after sits comfortably side by side without scrolling.
- Use compact uppercase labels with letter spacing for module labels inside diagrams; they should read as schematic, not as UI.
- Prefer **no JavaScript at all**. If a tiny inline script is genuinely necessary for a local interaction, it must be embedded in the file and the report must still preserve all substantive information when scripts are disabled.

## Top recommendation section

One larger card. Candidate name, one sentence on why, anchor link to its card. That's it.

## Tone

Plain English, concise — but the architectural nouns and verbs come straight from the `/codebase-design` skill. Concision is not an excuse to drift.

**Use exactly:** module, interface, implementation, depth, deep, shallow, seam, adapter, leverage, locality.

**Never substitute:** component, service, unit (for module) · API, signature (for interface) · boundary (for seam) · layer, wrapper (for module, when you mean module).

**Phrasings that fit the style:**

- "Order intake module is shallow — interface nearly matches the implementation."
- "Pricing leaks across the seam."
- "Deepen: one interface, one place to test."
- "Two adapters justify the seam: HTTP in prod, in-memory in tests."

**Wins bullets** name the gain in glossary terms: *"locality: bugs concentrate in one module"*, *"leverage: one interface, N call sites"*, *"interface shrinks; implementation absorbs the wrappers"*. Don't write *"easier to maintain"* or *"cleaner code"* — those terms aren't in the glossary and don't earn their place.

No hedging, no throat-clearing, no "it's worth noting that…". If a sentence could be a bullet, make it a bullet. If a bullet could be cut, cut it. If a term isn't in the `/codebase-design` glossary, reach for one that is before inventing a new one.
