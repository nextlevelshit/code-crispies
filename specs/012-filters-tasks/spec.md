# fix: rewrite CSS Filters tasks to describe visual outcomes instead of exact code

**Issue:** [#12](https://git.librete.ch/public/code-crispies/issues/12)
**Repository:** public/code-crispies
**Author:** libretech
**State:** open
**Labels:** none

## Problem

Pedagogy audit: the Filters module has a 100% copy-paste score. Every exercise gives the exact CSS declaration in the task text, so students can complete lessons without understanding the concepts.

## Requirements

- Rewrite ONLY the filters module (`lessons/11-filters.json`) task descriptions to describe the desired visual effect instead of the exact code
- Accept multiple valid values in validations (e.g., accept blur values between 2px and 8px instead of only 4px)
- Do NOT change any other module

## Example

- **Before:** "Add `filter: blur(4px)`"
- **After:** "Blur the background image to create a frosted-glass effect. Use a blur radius between 2px and 8px."

## Acceptance Criteria

1. All 4 filter lesson tasks describe visual outcomes, not exact CSS
2. Validations accept a range of valid values using regex patterns
3. Validation messages provide pedagogical hints without revealing answers
4. No changes to any file outside `lessons/11-filters.json`
5. Existing tests continue to pass
