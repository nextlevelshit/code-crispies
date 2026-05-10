---
title: "Container Queries — Dein erstes @container Layout in 5 Minuten"
description: "Media Queries reagieren auf den Viewport. Container Queries reagieren auf den Container. Der Unterschied ändert wie du responsive Komponenten baust."
date: 2026-05-10
slug: container-queries-erstes-layout
tags: [css, responsive, layout]
lang: de
---

Eine Card-Komponente sieht im Sidebar-Bereich anders aus als im Hauptinhalt. Bisher war das ein Schmerz: gleiche Komponente, je nach Viewport-Breite andere Styles, obwohl die Sidebar längst eng ist und der Hauptinhalt breit. Container Queries lösen das endlich.

## Setup: Container deklarieren

Du sagst dem Eltern-Element, dass es ein Query-Container ist:

```css
.card-container {
  container-type: inline-size;
  /* optional: name vergeben für gezielte queries */
  container-name: card;
}
```

`inline-size` heißt: messe die Inline-Achse (in LTR = horizontal). `size` würde beide Achsen messen, aber das ist teurer und selten nötig.

## Query schreiben

```css
.card {
  display: grid;
  gap: 0.75rem;
}

@container card (min-width: 400px) {
  .card {
    grid-template-columns: 120px 1fr;
  }
  .card img {
    grid-row: 1 / -1;
  }
}
```

Die Card wird zweispaltig sobald **ihr Container** mindestens 400px breit ist — egal wie breit der Viewport gerade ist.

Das Markup:

```html
<aside class="sidebar">
  <div class="card-container">
    <article class="card">
      <img src="/cereal.jpg" alt="">
      <h3>Crispy Cereal</h3>
      <p>Stays crunchy in milk for 3 minutes.</p>
    </article>
  </div>
</aside>

<main>
  <div class="card-container">
    <article class="card">
      <img src="/cereal.jpg" alt="">
      <h3>Crispy Cereal</h3>
      <p>Stays crunchy in milk for 3 minutes.</p>
    </article>
  </div>
</main>
```

Selber Markup, selbe CSS, zwei Layouts — automatisch je nach verfügbarem Platz im Container.

## Container-relative Einheiten

Bonus: `cqw`, `cqh`, `cqi`, `cqb` — wie `vw`/`vh` aber relativ zum Container.

```css
.card h3 {
  font-size: clamp(1rem, 4cqi, 1.5rem);
}
```

Schriftgröße skaliert jetzt mit der Card-Breite, nicht mit dem Viewport. Genau was du für eine echte Komponente willst.

## Stolperfallen

**1. Container muss nicht der direkte Parent sein.** Query sucht nach oben den nächsten Container.

**2. `container-type` kann Layout brechen.** Der Container wird zu `contain: layout` plus inline-size containment. Heißt: `display: contents` Kinder funktionieren weiterhin, aber `block-size` wird intrinsisch berechnet — was z.B. mit `100vh`-Children Probleme macht.

**3. Anonyme Container ohne `container-name` matchen alle `@container` queries.** Wenn du explicit benennst, scoping bleibt sauber.

## Browser support (2026-05)

[Caniuse](https://caniuse.com/css-container-queries): alle major browser ab Q1 2023. Safari 16, Chrome/Edge 105, Firefox 110. Praktisch jeder, außer corporate-IE-relikte.

## Wann nutzen

- **Card/Tile-Komponenten** die in verschiedenen Bereichen leben
- **Sidebars** die sich vom Hauptinhalt unterscheiden müssen
- **Embedded widgets** (Newsletter-Box, Social-Share) die in jedem Layout funktionieren sollen

Nicht für globale Layout-Wechsel (Header, Footer) — da bleibt `@media` richtiger.

---

Hands-on üben: das [`responsive`](/responsive/0) Modul auf [Code Crispies](/) — live preview, instant validation.
