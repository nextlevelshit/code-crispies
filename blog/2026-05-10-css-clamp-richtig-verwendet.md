---
title: "CSS clamp() richtig verwendet — Fluid Typography ohne Media Queries"
description: "clamp(min, preferred, max) ersetzt einen Stapel Media Queries durch eine Zeile. So wendet man es ohne Stolperfallen an."
date: 2026-05-10
slug: css-clamp-richtig-verwendet
tags: [css, typography, responsive]
---

Wenn du noch `font-size` über vier Breakpoints staffelst, ist `clamp()` das nächste Tool, das deinen Code halbiert. Drei Argumente, eine Zeile, fluide Skalierung zwischen Min und Max.

## Die Signatur

```css
font-size: clamp(MIN, PREFERRED, MAX);
```

- **MIN** — der Wert, unter den du nie fällst
- **PREFERRED** — wie sich der Wert zwischen Min und Max verhält
- **MAX** — die Obergrenze

Browser nimmt den `PREFERRED`, klemmt ihn aber nach unten auf `MIN` und nach oben auf `MAX`. Das ist alles.

## Standard-Anwendung: fluide Schriftgröße

```css
h1 {
  font-size: clamp(1.75rem, 1.25rem + 2.5vw, 3rem);
}
```

Bei einem 320px-Viewport: `1.25rem + 2.5 * (320/100) * 0.0625rem = 1.25 + 0.5 = 1.75rem` → die Untergrenze greift.

Bei 1920px: `1.25 + 2.5 * 1920/100 / 16 = 1.25 + 3 = 4.25rem` → die Obergrenze von `3rem` greift.

Dazwischen wächst die Schrift linear mit. **Kein Media Query, keine Sprünge.**

## Stolperfalle 1: nur `vw` als preferred

```css
/* schlecht */
font-size: clamp(1rem, 4vw, 2rem);
```

Sieht harmlos aus, bricht aber Accessibility. `vw` allein ignoriert die Browser-Schriftgrößen-Einstellung des Users. Wer im Browser auf 200% Zoom oder 24px Default eingestellt hat, sieht trotzdem die `vw`-basierte Größe.

**Fix:** mische `rem` rein. Faustregel: ein `rem`-Term + ein `vw`-Term.

```css
/* gut */
font-size: clamp(1rem, 0.5rem + 1.5vw, 2rem);
```

Jetzt skaliert die Schrift mit Viewport UND mit User-Preference.

## Stolperfalle 2: kein Linearitätscheck

Wenn du Anfangs- und Endgröße willst (z.B. 1rem bei 320px → 2rem bei 1280px), ist die `vw`-Berechnung lästig. Tool dafür: [utopia.fyi](https://utopia.fyi) oder die Formel:

```
slope    = (maxSize - minSize) / (maxViewport - minViewport)
yIntercept = minSize - slope * minViewport
preferred  = yIntercept + slope * 100vw
```

Konkret für 1rem→2rem zwischen 320px→1280px:

```
slope = (32 - 16) / (1280 - 320) = 16/960 ≈ 0.01667
yIntercept = 16 - 0.01667 * 320 = 10.67px
preferred = 10.67px + 1.667vw → in rem: 0.667rem + 1.667vw
```

```css
font-size: clamp(1rem, 0.667rem + 1.667vw, 2rem);
```

Genau die richtige Steigung, dass du bei den Endpunkten die gewünschten Werte triffst.

## Wo `clamp()` noch glänzt

Nicht nur für Schriften. Überall, wo du "min, ideal, max" willst:

```css
/* Gutter, das mitwächst aber nicht ausartet */
.container {
  padding-inline: clamp(1rem, 5vw, 4rem);
}

/* Spalten, die responsive bleiben ohne Grid-Tricks */
.sidebar {
  width: clamp(200px, 25vw, 320px);
}

/* Scroll-Margin, immer sinnvoll */
:target {
  scroll-margin-top: clamp(1rem, 10vh, 6rem);
}
```

## Wo `clamp()` *nicht* hingehört

- **Layout-Breakpoints**, die wirklich zwei verschiedene Layouts brauchen (zwei Spalten ↔ eine). Da bleibt `@media` richtig.
- **Diskrete Sprünge** wie "ab 768px erscheint diese Leiste". `clamp()` ist linear, nicht binär.
- **Alles was an `min()` / `max()` einzeln reicht** — schreib's einfacher: `min(100%, 60ch)` ist klarer als `clamp(0, 100%, 60ch)`.

## Browser-Support

[Caniuse](https://caniuse.com/css-math-functions): Chrome 79+, Safari 13.1+, Firefox 75+. Praktisch jeder Browser von 2020 oder später. Wer noch IE supporten muss: `clamp()` ignorieren, hat eh andere Probleme.

---

Hands-on üben kannst du das im [`units-variables`](/units-variables/0) Modul von [Code Crispies](/) — fluide Skalierung mit live preview.
