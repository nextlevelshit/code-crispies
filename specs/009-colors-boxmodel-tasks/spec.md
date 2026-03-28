# fix: rewrite colors and box-model task descriptions to remove copy-paste answers

**Issue**: [public/code-crispies#9](https://git.librete.ch/public/code-crispies/issues/9)
**State**: open
**Author**: libretech
**Labels**: none
**Complexity**: medium

## Issue Body

Pedagogy audit Runde 3: Colors (copy-paste 90%) and Box Model (copy-paste 85%) are the next worst modules after flexbox was fixed. Same pattern — task says 'Add background-color: coral' and student just types it. Rewrite to describe desired outcome: 'The card background should be a warm color.' Accept multiple valid solutions.

## Current State

### Colors Module (`lessons/03-colors.json`) — English only, 4 lessons

| Lesson | Current Task (gives away answer) |
|--------|----------------------------------|
| colors-1 | "Add `background-color: seashell`" |
| colors-2 | "Add `color: coral`" |
| colors-3 | "Add `border-color: coral`" |
| colors-4 | "Add `background-color: #ffd700`" |

All 4 validations use `property_value` with exact expected values — only one answer accepted.

### Box Model Module (`lessons/01-box-model.json`) — 6 locales (en, ar, de, es, pl, uk), 8 lessons

| Lesson | Current Task (gives away answer) |
|--------|----------------------------------|
| box-model-1 | "Add `padding: 1rem`" |
| box-model-2 | "Add `border-left: 4px solid steelblue`" |
| box-model-3 | "Add `margin-bottom: 1rem`" |
| box-model-4 | "Fix with `box-sizing: border-box`" |
| box-model-5 | "Set `padding: 8px 1rem`" |
| box-model-6 | "Set `margin: 0 auto`" |
| box-model-7 | "Make with `border-radius: 50%`" |
| box-model-8 | Lists all 3 properties verbatim |

Box model validation messages are already well-written (hint without revealing). The `task` fields contain `<kbd>` tags with exact answers.

## Acceptance Criteria

1. All 4 colors task descriptions rewritten to describe desired visual outcomes
2. All 8 box-model task descriptions rewritten to describe desired visual outcomes
3. Students cannot copy-paste from the task into the editor to pass
4. Colors validations accept multiple valid CSS color values where appropriate
5. Box-model validation messages remain as-is (already hint without revealing)
6. All 5 localized box-model files updated to match the English rewrite pattern
7. Existing tests continue to pass
8. Lesson descriptions (which teach the concepts) remain unchanged
