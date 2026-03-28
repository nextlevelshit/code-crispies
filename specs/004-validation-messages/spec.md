# fix: validation error messages reveal the solution instead of guiding learning

**Issue:** [#4](https://git.librete.ch/public/code-crispies/issues/4)
**Repository:** public/code-crispies
**Author:** libretech
**State:** open
**Labels:** none

## Issue Body

Pedagogy audit: 88% of exercises reveal the answer in error messages, creating a fail-then-copy loop. Change validation messages from 'Set padding: 1rem' to 'Which property adds space between content and the element edge?' This applies across all modules — start with flexbox, box-model, and colors (the 3 worst offenders).

## Scope

The three priority modules:

1. **Flexbox** (`lessons/flexbox.json`) — already uses guiding messages (0 messages need changes)
2. **Box Model** (`lessons/01-box-model.json`) — 11 validation messages reveal exact answers
3. **Colors** (`lessons/03-colors.json`) — 4 validation messages reveal exact answers

Localized versions that need corresponding updates:
- `lessons/ar/01-box-model.json`
- `lessons/de/01-box-model.json`
- `lessons/es/01-box-model.json`
- `lessons/pl/01-box-model.json`
- `lessons/uk/01-box-model.json`

No localized versions exist for colors.

## Acceptance Criteria

- [ ] All validation messages in box-model module guide the learner instead of revealing the answer
- [ ] All validation messages in colors module guide the learner instead of revealing the answer
- [ ] Messages use question or hint phrasing (e.g., "Which property..." or "Try the property that...")
- [ ] Messages never include the exact property-value pair that solves the exercise
- [ ] All 5 localized box-model files receive equivalent translated guiding messages
- [ ] Existing tests continue to pass (message content is not tested, only validation logic)
- [ ] Lesson JSON files remain valid against the module schema

## Current vs Desired Pattern

**Current (answer-revealing):**
```
"message": "Set <kbd>padding: 1rem</kbd>"
```

**Desired (guiding):**
```
"message": "Which property adds space between the content and the element's edge?"
```

## Prior Art

The flexbox module already follows the desired pattern. Its messages serve as the style reference:
- "Try changing the display mode to create a flex container"
- "Use the property that adds spacing between flex items"
- "Use the property that distributes items along the main axis"
