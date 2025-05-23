# CSS: Extended Examples

## Selectors

### HTML Tag Type
```css
p {
  color: blue;
}

h1 {
  font-size: 24px;
}
```

### Class
```css
.btn {
  background: red;
  padding: 10px;
}

.text {
  color: green;
}
```

### ID
```css
#header {
  width: 100%;
  height: 60px;
}

#main {
  margin: 20px;
}
```

### Attribute
```css
[type="text"] {
  border: 1px solid gray;
}

[href^="https"] {
  color: blue;
}

[alt*="icon"] {
  width: 16px;
}
```

## Combinators

### Child (>)
```css
div > p {
  margin: 0;
}

ul > li {
  list-style: none;
}
```

### Descendant (space)
```css
nav a {
  text-decoration: none;
}

div p {
  font-size: 14px;
}
```

### Next-Sibling (+)
```css
h1 + p {
  margin-top: 0;
}

img + span {
  margin-left: 10px;
}
```

### Subsequent-Sibling (~)
```css
h2 ~ p {
  color: gray;
}

input ~ label {
  font-weight: bold;
}
```

### Selector List (,)
```css
h1, h2, h3 {
  font-family: Arial;
}

.btn, .link {
  cursor: pointer;
}
```

## Pseudo Classes

### :hover
```css
a:hover {
  color: red;
}

button:hover {
  background: blue;
}
```

### :active
```css
button:active {
  transform: scale(0.95);
}

a:active {
  color: purple;
}
```

### :before
```css
h1:before {
  content: "→ ";
  color: red;
}

.icon:before {
  content: "★";
}
```

### :after
```css
a:after {
  content: " ↗";
  font-size: 12px;
}

p:after {
  content: ".";
}
```

### :first-child
```css
li:first-child {
  font-weight: bold;
}

p:first-child {
  margin-top: 0;
}
```

### :last-child
```css
li:last-child {
  border-bottom: none;
}

div:last-child {
  margin-bottom: 0;
}
```

### :nth-child()
```css
tr:nth-child(odd) {
  background: #f0f0f0;
}

li:nth-child(3n) {
  color: blue;
}
```

## Shorthand Properties

### margin
```css
/* Shorthand */
.box {
  margin: 20px;
}

/* Longhand */
.box {
  margin-top: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
}
```

### padding
```css
/* Shorthand */
.container {
  padding: 8px 12px;
}

/* Longhand */
.container {
  padding-top: 8px;
  padding-right: 12px;
  padding-bottom: 8px;
  padding-left: 12px;
}
```

### border
```css
/* Shorthand */
.box {
  border: 2px solid black;
}

/* Longhand */
.box {
  border-width: 2px;
  border-style: solid;
  border-color: black;
}
```

### background
```css
/* Shorthand */
.hero {
  background: url(bg.jpg) center/cover no-repeat;
}

/* Longhand */
.hero {
  background-image: url(bg.jpg);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
```

### font
```css
/* Shorthand */
.title {
    font: bold 24px/1.2 Arial, sans-serif;
}

/* Longhand */
.title {
    font-weight: bold;
    font-size: 24px;
    line-height: 1.2;
    font-family: Arial, sans-serif;
}
```