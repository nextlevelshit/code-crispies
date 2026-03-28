# Implementation Plan

## Objective

Rewrite validation error messages in the box-model and colors lesson modules (and their localizations) so they guide learners toward the answer instead of revealing it. This breaks the "fail-then-copy" loop identified in the pedagogy audit.

## Approach

1. Rewrite each validation `message` field in the English box-model and colors JSON files using question/hint phrasing that describes the *concept* without stating the exact property-value pair
2. Use the flexbox module's existing messages as the style guide
3. Apply equivalent translations to all 5 localized box-model files (ar, de, es, pl, uk)
4. Run the format-lessons script and tests to verify nothing breaks
5. Commit as a docs/content fix (`fix:` conventional commit)

## File Mapping

### Files to Modify

| File | Action | Changes |
|------|--------|---------|
| `lessons/01-box-model.json` | modify | Rewrite 11 validation messages |
| `lessons/03-colors.json` | modify | Rewrite 4 validation messages |
| `lessons/ar/01-box-model.json` | modify | Translate 11 new guiding messages to Arabic |
| `lessons/de/01-box-model.json` | modify | Translate 11 new guiding messages to German |
| `lessons/es/01-box-model.json` | modify | Translate 11 new guiding messages to Spanish |
| `lessons/pl/01-box-model.json` | modify | Translate 11 new guiding messages to Polish |
| `lessons/uk/01-box-model.json` | modify | Translate 11 new guiding messages to Ukrainian |

### Files NOT Changed

- `lessons/flexbox.json` — already uses guiding messages
- All localized flexbox files — already correct
- No colors localizations exist

## Architecture Decisions

1. **Message style**: Use the same imperative hint style as flexbox ("Use the property that...", "Try the property that...") rather than pure questions. This is consistent with the existing codebase and gives just enough direction without revealing the answer.

2. **No `<kbd>` tags in new messages**: The current answer-revealing messages use `<kbd>` to format exact code. The new guiding messages should avoid `<kbd>` since they won't contain code literals — they describe concepts.

3. **Preserve validation logic**: Only the `message` field changes. The `type`, `value`, `options`, and all other fields remain untouched.

4. **Localization approach**: Translate the English guiding messages into each target language, maintaining the same hint/question style. Keep CSS property names untranslated (they are code).

## Message Mapping (English)

| Lesson | Current Message | New Message |
|--------|----------------|-------------|
| box-model-1 | Set `padding: 1rem` | Which property adds space between content and the element's edge? |
| box-model-2 | Set `border-left: 4px solid steelblue` | Use the shorthand that sets a border on just one side |
| box-model-3 | Set `margin-bottom: 1rem` | Which property pushes neighboring elements away from the bottom? |
| box-model-4 | Set `box-sizing: border-box` | Which sizing mode includes padding and border in the element's width? |
| box-model-5 | Set `padding: 8px 1rem` | Use the two-value shorthand: vertical first, then horizontal |
| box-model-6 | Set `margin: 0 auto` | Use the shorthand that auto-calculates equal horizontal margins |
| box-model-7 | Set `border-radius: 50%` | Which property rounds corners? Think about what percentage makes a circle |
| box-model-8 v1 | Set `padding: 1rem` | Add inner spacing to the notification |
| box-model-8 v2 | Set `border-left: 4px solid coral` | Add a colored accent on the left edge |
| box-model-8 v3 | Set `border-radius: 4px` | Soften the corners of the notification |
| colors-1 | Set `background-color: seashell` | Which property fills the area behind the content? |
| colors-2 | Set `color: coral` | Which property changes the text color? |
| colors-3 | Set `border-color: coral` | Which property changes just the border's color without redefining the whole border? |
| colors-4 | Set `background-color: #ffd700` | Use the same background property, but with a hex code this time |

## Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Translation quality for 5 languages | Medium | Use consistent patterns; CSS property names stay in English; keep messages short |
| Messages too vague, frustrating learners | Low | Each message still hints at the concept/direction; task descriptions already contain the answer for early lessons |
| Schema validation failure | Very Low | Only `message` string changes; no structural changes |

## Testing Strategy

1. **Automated**: Run `npm run test` — existing unit tests validate the validator logic, not message content, so they should pass unchanged
2. **Automated**: Run `npm run format.lessons` — ensures JSON formatting is correct
3. **Manual verification**: Spot-check that each new message conceptually matches its lesson without revealing the answer
4. **Schema validation**: JSON files reference the schema; any structural errors would be caught by the editor/tooling
