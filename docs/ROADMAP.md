# Code Crispies Roadmap

## Current State (Updated)

**Total Active Lessons:** 101 (excluding welcome, goodbye, playground)
**Target:** 100 lessons for milestone system ✅ ACHIEVED

### Current Module Breakdown

| Module | Lessons | Category | Status |
|--------|---------|----------|--------|
| Basic Selectors | 10 | CSS | ✅ |
| Colors | 4 | CSS | ✅ |
| **Gradients** | 3 | CSS | ✅ NEW |
| Typography | 6 | CSS | ✅ +2 |
| Box Model | 8 | CSS | ✅ |
| Flexbox | 6 | CSS | ✅ |
| Grid | 6 | CSS | ✅ |
| **Positioning** | 4 | CSS | ✅ NEW |
| Units & Variables | 4 | CSS | ✅ |
| Responsive | 4 | CSS | ✅ |
| Transitions & Animations | 4 | CSS | ✅ |
| **Filters** | 4 | CSS | ✅ NEW |
| **Pseudo-elements** | 4 | CSS | ✅ NEW |
| HTML Elements | 2 | HTML | ✅ |
| **Semantic HTML** | 3 | HTML | ✅ NEW |
| Figure | 3 | HTML | ✅ |
| SVG | 3 | HTML | ✅ |
| Details/Summary | 3 | HTML | ✅ |
| Dialog | 2 | HTML | ✅ |
| Progress/Meter | 3 | HTML | ✅ |
| Forms Basic | 3 | HTML | ✅ |
| Forms Validation | 1 | HTML | ✅ |
| Fieldset | 3 | HTML | ✅ |
| Datalist | 2 | HTML | ✅ |
| Tables | 3 | HTML | ✅ +2 |
| **Total** | **101** | | ✅ |

---

## Phase 1: Milestone Progress System ✅ COMPLETED

### Design

Replace percentage-based progress with milestone markers:

```
[1] [5] [10] [20] [30] [50] [75] [100]
 ●   ●    ◐    ○    ○    ○    ○    ○
```

**Milestones:**
- 1 lesson - First Step
- 5 lessons - Getting Started
- 10 lessons - Rookie
- 20 lessons - Learner
- 30 lessons - Intermediate
- 50 lessons - Halfway Hero
- 75 lessons - Advanced
- 100 lessons - Master

### Implementation ✅

1. **Update `LessonEngine.getProgressStats()`** ✅
   - Added `currentMilestone` and `nextMilestone` fields
   - Added `milestonesReached: number[]`
   - Added `progressToNext` percentage

2. **Update Progress UI** ✅
   - Added milestone dots with visual states (reached, current, next)
   - Animate milestone completion
   - Show current milestone badge

3. **Add Milestone Celebration**
   - Confetti/animation on reaching milestones
   - Achievement unlocks in sidebar

---

## Phase 2: New Lessons (34 needed to reach 100)

### Priority 1: Expand Existing Modules (+15 lessons)

#### CSS Colors (+3)
- Gradients (linear-gradient)
- Color functions (hsl, rgb)
- Opacity and transparency

#### Typography (+3)
- Web fonts (@font-face)
- Text shadows
- Letter/word spacing

#### Responsive (+3)
- Container queries
- Aspect ratio
- Clamp() for fluid typography

#### Transitions & Animations (+3)
- Keyframe animations
- Animation timing functions
- Transform origin

#### Tables (+3)
- Table styling (borders, spacing)
- Responsive tables
- Table accessibility

### Priority 2: New CSS Modules (+12 lessons)

#### Filters & Effects (4 lessons)
- CSS filters (blur, brightness, contrast)
- Backdrop filters
- Mix-blend-mode
- Box shadows advanced

#### Positioning (4 lessons)
- Relative positioning
- Absolute positioning
- Fixed/sticky positioning
- Z-index stacking

#### Pseudo-elements (4 lessons)
- ::before and ::after
- ::first-letter and ::first-line
- ::marker for lists
- Content property

### Priority 3: New HTML Modules (+7 lessons)

#### Semantic Structure (3 lessons)
- Article vs Section
- Header/Footer/Main
- Nav and Aside

#### Media Elements (2 lessons)
- Picture element (responsive images)
- Audio/Video basics

#### Accessibility (2 lessons)
- ARIA labels
- Skip links
- Focus management

---

## MDN Topics Reference

### CSS Topics from MDN (prioritized for interactive lessons)

**Layout Systems:**
- [x] Flexbox (covered)
- [x] Grid (covered)
- [ ] Multi-column layout
- [ ] Positioned layout (z-index, stacking)

**Visual Effects:**
- [x] Colors (partially covered)
- [ ] Filters (blur, brightness, contrast, drop-shadow)
- [ ] Blend modes (mix-blend-mode, background-blend-mode)
- [ ] Masking and clipping
- [ ] Shapes (shape-outside)

**Typography:**
- [x] Basic text (covered)
- [ ] Web fonts (@font-face)
- [ ] Variable fonts
- [ ] Text decoration advanced

**Animations:**
- [x] Transitions (covered)
- [ ] Keyframe animations
- [ ] Scroll-driven animations (experimental)
- [ ] View transitions

**Advanced:**
- [x] Custom properties (covered in units-variables)
- [ ] Container queries
- [ ] Anchor positioning (new)
- [ ] Logical properties (for RTL support)

### HTML Topics from MDN

**Structural:**
- [x] Basic elements (covered)
- [x] Figure/figcaption (covered)
- [ ] Article vs section semantics
- [ ] Template element

**Interactive:**
- [x] Details/Summary (covered)
- [x] Dialog (have JSON, not active)
- [ ] Datalist (have JSON, not active)
- [ ] Progress/Meter (have JSON, not active)

**Forms:**
- [x] Basic forms (covered)
- [x] Validation (covered)
- [x] Fieldset (have JSON, not active)
- [ ] Input types exploration

**Media:**
- [x] SVG basics (covered)
- [ ] Picture element
- [ ] srcset and sizes
- [ ] Audio/Video

---

## Inactive Lesson Files (Ready to Activate)

These lesson files exist but aren't in the active module list:

| File | Lessons | Topic |
|------|---------|-------|
| 24-html-progress-meter.json | 3 | Progress/Meter elements |
| 25-html-datalist.json | 2 | Datalist for autocomplete |
| 27-html-dialog.json | 2 | Native dialog element |
| 28-html-forms-fieldset.json | 3 | Fieldset/legend grouping |
| 31-html-marquee.json | 3 | Marquee (deprecated but fun) |
| **Total** | **13** | |

**Quick Win:** Activating these adds 13 lessons immediately → 79 total

---

## Implementation Order

### Week 1: Foundation
1. Design milestone UI component
2. Implement milestone progress system
3. Add milestone celebrations

### Week 2: Quick Wins
4. Activate 5 inactive HTML modules (+13 lessons)
5. Test and fix translations

### Week 3-4: New Content
6. Create Filters & Effects module (+4)
7. Create Positioning module (+4)
8. Expand existing modules (+7)

### Final Polish
9. Reach 100 lessons milestone
10. Add milestone achievements to sidebar
11. Update landing page messaging

---

## Technical Notes

### Milestone Data Structure

```js
const MILESTONES = [1, 5, 10, 20, 30, 50, 75, 100];

function getMilestoneProgress(completed) {
  const reached = MILESTONES.filter(m => completed >= m);
  const current = reached[reached.length - 1] || 0;
  const next = MILESTONES.find(m => m > completed) || 100;

  return {
    current,
    next,
    reached,
    percentToNext: ((completed - current) / (next - current)) * 100
  };
}
```

### Progress Display Update

```html
<div class="milestone-progress">
  <div class="milestones">
    <span class="milestone reached" data-value="1">1</span>
    <span class="milestone reached" data-value="5">5</span>
    <span class="milestone current" data-value="10">10</span>
    <span class="milestone" data-value="20">20</span>
    <!-- ... -->
  </div>
  <div class="progress-bar">
    <div class="progress-fill" style="width: 35%"></div>
  </div>
  <span class="progress-label">12 of 100 lessons</span>
</div>
```

---

## Success Metrics

- [ ] 100 total lessons
- [ ] Milestone system implemented
- [ ] All 6 languages have translations
- [ ] Achievement celebrations working
- [ ] Mobile responsive milestone UI
