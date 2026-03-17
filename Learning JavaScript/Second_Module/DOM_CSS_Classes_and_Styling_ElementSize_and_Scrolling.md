# CSS Classes & Styling, Element Size & Scrolling

In this guide, we’ll explore how to work with CSS classes and styles in JavaScript, and then dive into measuring element dimensions and controlling scrolling. These are essential skills for building responsive, interactive interfaces.

---

## Part 1: CSS Classes & Styling

### 1.1 Manipulating `classList`

The `classList` property provides a clean way to manage an element’s CSS classes. It’s a read‑only list that exposes methods to add, remove, toggle, and check classes.

#### Important Methods:

- **`add(class1, class2, ...)`** – adds one or more classes.
- **`remove(class1, class2, ...)`** – removes one or more classes.
- **`toggle(className, force)`** – if the class exists, removes it; otherwise adds it.  
  The optional `force` parameter (boolean) makes it behave like `add` (if `true`) or `remove` (if `false`).
- **`contains(className)`** – returns `true` if the class exists, otherwise `false`.
- **`replace(oldClass, newClass)`** – replaces one class with another.

```javascript
const element = document.querySelector('.box');

// Add classes
element.classList.add('highlight', 'visible');

// Remove a class
element.classList.remove('box');

// Toggle a class
element.classList.toggle('active');

// Check if a class is present
if (element.classList.contains('highlight')) {
    console.log('Element is highlighted');
}

// Replace a class
element.classList.replace('old-theme', 'new-theme');
```

`classList` is a live `DOMTokenList` that automatically reflects changes. It’s the preferred way to handle classes because it avoids string manipulation pitfalls.

---

### 1.2 Reading Computed Styles – `getComputedStyle`

While the `style` property gives you only **inline** styles, `getComputedStyle` returns the **final** styles applied to an element after all CSS sources (external stylesheets, `<style>` tags, inline styles) and inheritance are taken into account.

```javascript
const element = document.querySelector('.box');
const styles = getComputedStyle(element);

console.log(styles.backgroundColor); // "rgb(255, 0, 0)"
console.log(styles.fontSize);        // "16px"
console.log(styles.margin);           // "10px 20px" (shorthand property)
```

- It returns a live `CSSStyleDeclaration` object.
- Property names are camelCased (like `backgroundColor`).
- Values are strings, always in absolute units (pixels for lengths, etc.).
- You can also access properties using standard CSS property names with bracket notation: `styles['background-color']`.

**Use cases:** Reading the actual dimensions, colors, or any computed style for animations, drag‑and‑drop, or responsive adjustments.

---

### 1.3 Inline Styles vs. CSS Classes

Both approaches can style elements, but they serve different purposes.

| Feature                | Inline Styles (`style` property)         | CSS Classes (`classList`)                |
|------------------------|-------------------------------------------|-------------------------------------------|
| **Where defined**      | Directly on the HTML element via `style` attribute | In a separate stylesheet or `<style>` block |
| **Specificity**        | Very high (overrides most other styles)   | Depends on the selector; generally lower than inline |
| **Reusability**        | Not reusable – tied to one element        | Highly reusable across multiple elements   |
| **Maintainability**    | Hard to manage for large projects         | Clean separation of concerns               |
| **Dynamic changes**    | Directly modify individual properties     | Add/remove whole groups of styles at once  |
| **Performance**        | Slightly faster for one‑off changes       | Better for toggling complex style bundles  |

#### When to use inline styles:
- When you need to set a single, dynamic value that cannot be known ahead of time (e.g., setting a progress bar width based on a percentage).
- When you’re working with JavaScript animations that frequently update individual properties.
- In component‑based frameworks, sometimes used for dynamic props.

#### When to use CSS classes:
- For styling that is known in advance (e.g., themes, states like `active`, `disabled`).
- When you want to apply many style changes at once.
- To keep your JavaScript clean and your CSS maintainable.

**Best practice:** Prefer CSS classes for most styling; use inline styles sparingly for truly dynamic values.

```javascript
// Using inline styles for a dynamic width
progressBar.style.width = percentage + '%';

// Using classes to change theme
element.classList.add('dark-theme');
```

---

## Part 2: Element Size & Scrolling

Understanding an element’s dimensions and position is crucial for layout, animations, and detecting visibility. JavaScript provides several properties and methods for this.

### 2.1 Offset Dimensions – `offsetWidth` and `offsetHeight`

These properties give the **total** visible size of an element, including:
- Content
- Padding
- Border
- Scrollbar (if present)

They **do not** include margins.

```javascript
const element = document.querySelector('.box');
console.log(element.offsetWidth);  // width + padding + border + scrollbar
console.log(element.offsetHeight); // height + padding + border + scrollbar
```

- These are read‑only integers (rounded).
- Useful when you need the exact space the element occupies on the page.

---

### 2.2 Client Dimensions – `clientWidth` and `clientHeight`

These properties give the size of the element’s **inner** area, including:
- Content
- Padding

They **exclude** borders, scrollbars, and margins.

```javascript
console.log(element.clientWidth);  // content width + padding
console.log(element.clientHeight); // content height + padding
```

- Also read‑only.
- Often used to get the available space inside an element (e.g., for drawing on a canvas).

---

### 2.3 `getBoundingClientRect()`

This method returns a `DOMRect` object with detailed information about the element’s size and its **position relative to the viewport**. The returned object includes:

- `x` / `left` – distance from the left edge of the viewport to the element’s left side.
- `y` / `top` – distance from the top edge of the viewport to the element’s top side.
- `right` – distance from left viewport edge to the element’s right side.
- `bottom` – distance from top viewport edge to the element’s bottom side.
- `width` – element width (same as `offsetWidth`).
- `height` – element height (same as `offsetHeight`).

```javascript
const rect = element.getBoundingClientRect();
console.log(rect.left, rect.top);      // position relative to viewport
console.log(rect.right, rect.bottom);  // edges
console.log(rect.width, rect.height);  // dimensions
```

All values are in pixels and are floating‑point numbers (so they can be fractional). This is the go‑to method for detecting if an element is visible in the viewport, positioning tooltips, or implementing drag‑and‑drop.

---

### 2.4 Scrolling Properties and Methods

#### `scrollTop` and `scrollLeft`

These properties get or set the number of pixels an element’s content is scrolled vertically (`scrollTop`) or horizontally (`scrollLeft`).

- For the whole page, you can use `document.documentElement.scrollTop` or `document.body.scrollTop` (depending on browser).
- They are read/write.

```javascript
// Get scroll amount
const scrolled = window.scrollY; // for entire window
// or
const scrolled = element.scrollTop;

// Scroll to a specific position
element.scrollTop = 200;  // scrolls the element’s content down 200px
```

#### `scrollIntoView()`

This method scrolls the element into the visible area of the browser window (or its scrollable container).

```javascript
element.scrollIntoView(); // scrolls so that the element is visible

// With options
element.scrollIntoView({
    behavior: 'smooth',   // smooth scrolling
    block: 'start',       // vertical alignment: 'start', 'center', 'end', or 'nearest'
    inline: 'nearest'     // horizontal alignment
});
```

**Options:**
- `behavior`: `'auto'` (instant) or `'smooth'`.
- `block`: vertical alignment relative to the viewport – `'start'`, `'center'`, `'end'`, `'nearest'`.
- `inline`: horizontal alignment.

This is commonly used in navigation (e.g., “back to top” buttons) or focusing on a specific section after an action.

---

## Putting It All Together – Example

```html
<div id="container" style="width: 300px; height: 200px; overflow: auto; border: 5px solid black; padding: 10px;">
    <div id="content" style="height: 600px; background: linear-gradient(blue, lightblue);">
        Scroll me!
    </div>
</div>
<button id="btn">Get Info</button>
```

```javascript
const container = document.getElementById('container');
const content = document.getElementById('content');
const btn = document.getElementById('btn');

btn.addEventListener('click', () => {
    // Dimensions
    console.log('container offset:', container.offsetWidth, container.offsetHeight); // includes border
    console.log('container client:', container.clientWidth, container.clientHeight); // inside padding

    // Position relative to viewport
    const rect = container.getBoundingClientRect();
    console.log('container rect:', rect.left, rect.top, rect.right, rect.bottom);

    // Scroll position
    console.log('container scrollTop:', container.scrollTop);

    // Scroll content to bottom smoothly
    content.scrollIntoView({ behavior: 'smooth', block: 'end' });
});
```

---

## Summary

- **`classList`** is the modern way to manage CSS classes (add, remove, toggle, check).
- **`getComputedStyle`** gives the final applied styles from all CSS sources.
- Prefer **CSS classes** over inline styles for maintainability; use inline styles only for truly dynamic values.
- **`offsetWidth/Height`** = total visible size (incl. border).
- **`clientWidth/Height`** = size inside borders (incl. padding, excl. border and scrollbar).
- **`getBoundingClientRect()`** gives precise position and dimensions relative to the viewport.
- **`scrollTop/scrollLeft`** read/write the scroll offset of an element.
- **`scrollIntoView()`** scrolls the element into view with optional smooth behavior.

Master these tools, and you’ll be able to build responsive, interactive interfaces with confidence.