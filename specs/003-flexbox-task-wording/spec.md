# fix: remove answers from flexbox task descriptions (copy-paste score 95%)

**Issue**: [public/code-crispies#3](https://git.librete.ch/public/code-crispies/issues/3)
**State**: open
**Author**: libretech
**Labels**: none
**Complexity**: simple

## Issue Body

Pedagogy audit: All 6 flexbox exercises give the exact CSS declaration in the task text. Students type without understanding. Rewrite tasks to describe the DESIRED OUTCOME instead of the exact code. Example: 'Add display: flex' → 'The navigation links stack vertically. Make them display side by side.' Accept multiple valid solutions in validations.

## Current State

All 6 lessons in `lessons/flexbox.json` have task descriptions that include the exact CSS declaration students need to type:

| Lesson | Current Task (gives away answer) |
|--------|----------------------------------|
| flexbox-1 | "Add `display: flex` to `.nav`" |
| flexbox-2 | "Add `gap: 1rem` to space out..." |
| flexbox-3 | "setting `justify-content: space-between` on the nav" |
| flexbox-4 | "Center them vertically with `align-items: center`" |
| flexbox-5 | "Add `flex-wrap: wrap` to allow them to wrap" |
| flexbox-6 | "setting `flex: 1` on `.search`" |

Validation error messages also give away answers (e.g., "Set `display: flex`").

## Acceptance Criteria

1. All 6 flexbox task descriptions rewritten to describe the desired visual outcome, not the exact CSS code
2. Students cannot copy-paste from the task into the editor to pass
3. Validation error messages updated to provide hints without revealing the exact declaration
4. Where applicable, validations accept multiple valid CSS solutions (e.g., `flex: 1` and `flex-grow: 1`)
5. Existing tests continue to pass
6. Lesson descriptions (which teach the concepts) remain unchanged
