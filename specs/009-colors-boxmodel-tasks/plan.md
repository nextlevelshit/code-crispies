# Implementation Plan

## Objective

Rewrite task descriptions in the Colors (4 lessons) and Box Model (8 lessons x 6 locales) modules so they describe desired visual outcomes rather than giving exact CSS declarations. For colors, also update validations to accept multiple valid color values.

## Approach

This follows the same pattern as the flexbox fix (PR #5). Two types of changes:

1. **Colors module**: Rewrite tasks AND update validations from `property_value` (single answer) to `regex` (multiple valid colors). This is because the issue explicitly says "accept multiple valid solutions" and colors naturally have many equivalent options.
2. **Box Model module**: Rewrite tasks only. Validation messages already use pedagogical hints. Box model properties have specific correct answers (e.g., `box-sizing: border-box` has no alternative), so validations stay as-is.

## File Mapping

| File | Action | Description |
|------|--------|-------------|
| `lessons/03-colors.json` | modify | Rewrite 4 tasks + change 4 validations from `property_value` to `regex` |
| `lessons/01-box-model.json` | modify | Rewrite 8 task fields |
| `lessons/ar/01-box-model.json` | modify | Rewrite 8 task fields (Arabic) |
| `lessons/de/01-box-model.json` | modify | Rewrite 8 task fields (German) |
| `lessons/es/01-box-model.json` | modify | Rewrite 8 task fields (Spanish) |
| `lessons/pl/01-box-model.json` | modify | Rewrite 8 task fields (Polish) |
| `lessons/uk/01-box-model.json` | modify | Rewrite 8 task fields (Ukrainian) |

No validator code changes needed — existing `regex` type already supports multi-value patterns.

## Detailed Changes

### Colors Module

#### colors-1 (Background Color)
- **Task**: Describe that notification card looks bare, needs a soft warm background
- **Validation**: Change from `property_value` (seashell only) to `regex` accepting warm named colors (seashell, linen, mistyrose, lavenderblush, cornsilk, oldlace, papayawhip, antiquewhite, bisque, peachpuff)
- **Message**: Hint at background-color property

#### colors-2 (Text Color)
- **Task**: Describe that title needs to pop with a warm accent color
- **Validation**: Change from `property_value` (coral only) to `regex` accepting warm accent colors (coral, tomato, orangered, indianred, salmon, darksalmon)
- **Message**: Hint at color property

#### colors-3 (Border Color)
- **Task**: Describe that card border needs a warm accent color
- **Validation**: Change from `property_value` (coral only) to `regex` accepting warm accent colors (coral, tomato, orangered, indianred, salmon, darksalmon, crimson)
- **Message**: Hint at border-color property

#### colors-4 (Hex Colors)
- **Task**: Describe wanting a gold/yellow badge background, mentioning hex format since that's the lesson's teaching point
- **Validation**: Change from `property_value` (#ffd700 only) to `regex` accepting gold hex variants (#ffd700, #ffcc00, #ffc107, #f0c000) and also the named color `gold`
- **Message**: Hint at using a hex code for background-color

### Box Model Module (per-lesson, applied across all 6 locales)

#### box-model-1 (Padding)
- **Current**: "Add `padding: 1rem`..."
- **New**: Describe that text is pressed against the edges and needs inner breathing room

#### box-model-2 (Borders)
- **Current**: "Add `border-left: 4px solid steelblue`"
- **New**: Describe wanting a colored accent line on the left side of the card

#### box-model-3 (Margins)
- **Current**: "Add `margin-bottom: 1rem`"
- **New**: Describe that the two cards are touching and need space between them

#### box-model-4 (Box Sizing)
- **Current**: "Fix with `box-sizing: border-box`"
- **New**: Describe the visual problem (right card overflows) and ask to fix its sizing model

#### box-model-5 (Padding Shorthand)
- **Current**: "Set `padding: 8px 1rem`"
- **New**: Describe the button needing more horizontal than vertical space, mention the two-value shorthand concept

#### box-model-6 (Margin Shorthand)
- **Current**: "Set `margin: 0 auto`"
- **New**: Describe the card being left-aligned and needing to be horizontally centered

#### box-model-7 (Border Radius)
- **Current**: "Make with `border-radius: 50%`"
- **New**: Describe the square avatar needing to appear as a circle

#### box-model-8 (Complete Card)
- **Current**: Lists all 3 exact property declarations
- **New**: Describe three visual goals: inner spacing, left accent line, softened corners

## Architecture Decisions

1. **No validator code changes**: The existing `regex` validation type handles multi-value matching.
2. **Colors get multi-value validations**: Colors naturally have equivalents (coral vs tomato). Accept a curated set of named colors per lesson.
3. **Box model keeps exact validations**: Properties like `padding: 1rem` or `box-sizing: border-box` have only one correct answer. The task text changes are sufficient.
4. **Solution fields unchanged**: The `solution` field shows the canonical answer and is unrelated to copy-paste behavior.
5. **codePrefix unchanged**: Already shows the selector context.

## Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Color regex too permissive/restrictive | Medium | Curate a small set of 6-10 named colors per lesson that visually work in the preview |
| Locale translations lose nuance | Low | Follow the same structure: describe the visual outcome in each language |
| Box model tasks become too vague | Low | Keep mentioning the visual problem — students have the description for concept reference |

## Testing Strategy

1. Run `npm run test` — all existing tests should pass
2. Run `npm run format.lessons` — ensure JSON files are properly formatted
3. Verify JSON schema conformance for all modified files
