# Implementation Plan

## Objective

Rewrite all 6 flexbox lesson task descriptions to describe the desired visual outcome instead of giving the exact CSS declaration. Update validation messages to hint without revealing answers, and accept alternative valid solutions where applicable.

## Approach

This is a content-only change to a single JSON file (`lessons/flexbox.json`). Each lesson needs three edits:

1. **Task text**: Replace copy-pasteable CSS declarations with outcome-oriented descriptions
2. **Validation messages**: Replace answer-revealing messages with pedagogical hints
3. **Validations array**: Add alternative accepted solutions where multiple CSS approaches achieve the same visual result

The lesson `description` fields (which teach concepts with code examples) remain unchanged — they are the learning material, not the exercise prompt.

## File Mapping

| File | Action | Description |
|------|--------|-------------|
| `lessons/flexbox.json` | modify | Rewrite `task` and validation `message` fields for all 6 lessons; add alternative validations for flexbox-6 |

No new files need to be created. No validator code changes needed — the existing `property_value` and `regex` validation types already support everything required.

## Detailed Changes Per Lesson

### flexbox-1 (Container)
- **Task**: Describe that nav links stack vertically and should display side by side
- **Validation msg**: Hint at display property for flex layout
- **Alt solutions**: None — `display: flex` is the only correct answer (inline-flex changes block behavior)

### flexbox-2 (Gap)
- **Task**: Describe that links are crammed together and need 1rem of spacing between them
- **Validation msg**: Hint at the gap property
- **Alt solutions**: None — `gap: 1rem` is the specific expected value

### flexbox-3 (Justify Content)
- **Task**: Describe that Login button should be pushed to the far right, with nav links on the left
- **Validation msg**: Hint at main-axis distribution property
- **Alt solutions**: None — `justify-content: space-between` is the only property that works when targeting `.nav`

### flexbox-4 (Align Items)
- **Task**: Describe the visual misalignment and ask for vertical centering
- **Validation msg**: Hint at cross-axis alignment property
- **Alt solutions**: None — `align-items: center` is the correct answer

### flexbox-5 (Flex Wrap)
- **Task**: Describe cards overflowing and needing to flow onto new rows
- **Validation msg**: Hint at wrapping property
- **Alt solutions**: None — `flex-wrap: wrap` is the only answer

### flexbox-6 (Flex Grow)
- **Task**: Describe that the search input should stretch to fill remaining space
- **Validation msg**: Hint at flex growth property
- **Alt solutions**: Accept both `flex: 1` and `flex-grow: 1` via regex validation

## Architecture Decisions

1. **No validator code changes**: The existing `regex` validation type can handle alternative solutions for flexbox-6. No need to add a new validation type.
2. **Keep values in tasks where needed**: Some tasks mention target values like "1rem" since the validator checks exact values and students need to know the amount. The key change is removing the *property name* from the task.
3. **Solution field unchanged**: The `solution` field is used for the "show solution" feature and should remain as the canonical answer.
4. **codePrefix unchanged**: The existing codePrefix already shows the selector context (e.g., `.nav {`), which is enough guidance for students.

## Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Tasks become too vague for beginners | Low | Descriptions still teach the property; tasks describe specific visual outcomes |
| Alternative regex validation too permissive | Low | Regex will be specific to `flex:\s*1` and `flex-grow:\s*1` patterns |
| Validation messages too cryptic | Low | Messages will hint at the property category without giving the exact declaration |

## Testing Strategy

1. **Run existing test suite**: `npm run test` — all tests should pass since no code or module structure changes
2. **Manual verification**: Validate that each rewritten task accurately describes the visual outcome shown in the preview
3. **JSON schema validation**: Ensure `lessons/flexbox.json` still conforms to the module schema
