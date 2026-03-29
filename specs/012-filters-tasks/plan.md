# Implementation Plan

## Objective

Rewrite the 4 CSS Filters lessons in `lessons/11-filters.json` so tasks describe visual outcomes instead of giving exact CSS code, and validations accept multiple valid answers.

## Approach

Follow the same pattern established in issue #9 (colors/box-model rewrite):
1. Rewrite each `task` field to describe the desired visual effect
2. Replace exact-match validations (`property_value`, `contains`) with `regex` validations that accept a range of values
3. Update validation `message` fields to give pedagogical hints without revealing answers
4. Keep `description`, `previewHTML`, `previewBaseCSS`, `codePrefix`, `codeSuffix`, and `solution` unchanged

## File Mapping

| File | Action | Description |
|------|--------|-------------|
| `lessons/11-filters.json` | modify | Rewrite tasks and validations for all 4 lessons |

## Lesson-by-Lesson Plan

### filters-1: Blur Filter
- **Current task:** "Blur the background image using `filter: blur(4px)`."
- **New task:** Describe frosted-glass effect, mention blur radius range (2px-8px)
- **Validation:** `regex` matching `filter:\s*blur\((2|3|4|5|6|7|8)px\)` — accepts 2px through 8px
- **Message:** Hint about the `filter` property and `blur()` function

### filters-2: Grayscale Filter
- **Current task:** "Make the image grayscale with `filter: grayscale(100%)`."
- **New task:** Describe removing all color to create a black-and-white effect
- **Validation:** `regex` matching `filter:\s*grayscale\(100%\)` — grayscale only makes sense at 100% for "fully desaturated"
- **Message:** Hint about which filter function removes color

### filters-3: Brightness Filter
- **Current task:** "Brighten the card with `filter: brightness(120%)`."
- **New task:** Describe making the card appear brighter/more vivid, accept range 110%-150%
- **Validation:** `regex` matching `filter:\s*brightness\(1[1-5]0%\)` — accepts 110% through 150%
- **Message:** Hint about the brightness function and values above 100%

### filters-4: Drop Shadow
- **Current task:** "Add a drop shadow with `filter: drop-shadow(4px 4px 8px gray)`."
- **New task:** Describe adding a soft shadow behind the star to give it depth
- **Validation:** `regex` matching `filter:\s*drop-shadow\(` with reasonable offset/blur values
- **Message:** Hint about the drop-shadow filter function

## Architecture Decisions

- Use `regex` validation type (not `property_value`) to allow multiple acceptable values, consistent with the colors/box-model rewrite
- Use `options: { "caseSensitive": false }` on all regex validations for consistency
- Keep solution fields unchanged as reference answers

## Risks

| Risk | Mitigation |
|------|------------|
| Regex too permissive | Test edge cases; only accept pedagogically reasonable values |
| Regex too restrictive | Allow generous ranges; err on the side of accepting creative answers |
| Breaking existing progress | localStorage keys are based on lesson IDs which are unchanged |

## Testing Strategy

- Run existing test suite (`npm test`) to verify no regressions
- Validate JSON file against schema
- Manual review of regex patterns for correctness
