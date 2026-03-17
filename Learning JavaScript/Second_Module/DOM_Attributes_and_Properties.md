# DOM Attributes & Properties: A Complete Guide

When you work with HTML elements in JavaScript, you have two ways to read and modify their characteristics: **attributes** and **properties**. Understanding the difference is crucial for avoiding bugs and writing effective code.

- **Attributes** are defined in the HTML markup (e.g., `<div id="main" class="box" data-info="123">`). They are always strings.
- **Properties** are live properties of the DOM object that represents the element. They can be of any type (boolean, number, object, etc.) and often reflect the current state.

In most cases, you'll work with properties because they are more convenient and type‑appropriate. However, attributes are still useful for custom data or when you need the exact HTML‑defined value.

---

## 1. Working with Attributes

These methods operate directly on the HTML attributes of an element.

### `getAttribute(attrName)`
Returns the value of the specified attribute as a string. If the attribute does not exist, it returns `null`.

```javascript
let link = document.querySelector('a');
console.log(link.getAttribute('href')); // e.g., "https://example.com"
```

### `setAttribute(attrName, value)`
Sets or updates the value of an attribute. If the attribute already exists, it is replaced.

```javascript
let image = document.querySelector('img');
image.setAttribute('src', 'new-image.jpg');
image.setAttribute('alt', 'A beautiful landscape');
```

### `removeAttribute(attrName)`
Removes the specified attribute from the element.

```javascript
let input = document.querySelector('input');
input.removeAttribute('disabled'); // enables the input
```

### `hasAttribute(attrName)`
Checks whether the element has the given attribute. Returns `true` or `false`.

```javascript
if (button.hasAttribute('disabled')) {
    console.log('Button is disabled');
}
```

---

## 2. Direct Property Access

Every DOM element object has properties that correspond to its HTML attributes (with some name variations). You can read and write them directly.

```javascript
let div = document.querySelector('div');
div.id = 'new-id';                    // sets the id attribute
console.log(div.id);                   // "new-id"
console.log(div.className);             // "box" (class attribute is mapped to className)

let anchor = document.querySelector('a');
anchor.href = 'https://google.com';     // sets the href property
anchor.target = '_blank';                // sets the target property
```

**Important differences between properties and attributes:**

- **`id`** – both property and attribute behave the same.
- **`class`** – attribute name is `class`, property name is `className`. Use `className` or `classList` for classes.
- **`href`** – the property returns the fully resolved URL (e.g., `https://example.com/page`), while `getAttribute('href')` returns exactly what's in the HTML (e.g., `/page`).
- **`value`** – for form inputs, the `value` property reflects the current typed value, while `getAttribute('value')` returns the initial HTML value.
- **Boolean attributes** (e.g., `disabled`, `checked`, `readonly`) – the property is a boolean (`true`/`false`), while the attribute value is a string (or the attribute presence itself indicates `true`). Setting the property to `true` adds the attribute; setting it to `false` removes it.

```javascript
let checkbox = document.querySelector('input[type="checkbox"]');
checkbox.checked = true;                // checks the box (adds checked attribute)
console.log(checkbox.getAttribute('checked')); // "checked" (the attribute value)
```

**Recommendation:** Use properties for most cases (e.g., `element.id`, `element.src`, `element.value`). Use attribute methods only when you need the exact HTML string or when dealing with custom attributes.

---

## 3. `classList` – The Modern Way to Handle Classes

Manipulating classes via `className` (a string) is error‑prone. `classList` provides convenient methods:

- **`add(class1, class2, ...)`** – adds one or more classes.
- **`remove(class1, class2, ...)`** – removes one or more classes.
- **`toggle(className, force)`** – toggles a class (adds if absent, removes if present). The optional `force` parameter makes it behave like `add` (if `true`) or `remove` (if `false`).
- **`contains(className)`** – checks if the element has the class.

```javascript
let element = document.querySelector('.box');

element.classList.add('highlight', 'visible');   // add multiple
element.classList.remove('box');                  // remove a class
element.classList.toggle('active');               // toggle
if (element.classList.contains('highlight')) {
    console.log('Element is highlighted');
}
```

`classList` is a live `DOMTokenList` that reflects the current class set. It's the preferred method for class manipulation.

---

## 4. `style` Property – Inline Styles

The `style` property gives you access to the **inline** styles of an element (those written in the `style` attribute). It is a `CSSStyleDeclaration` object, and you can set individual CSS properties using camelCase names.

```javascript
let box = document.querySelector('.box');
box.style.backgroundColor = 'red';
box.style.fontSize = '20px';
box.style.marginTop = '10px';
```

- Property names are camelCased (e.g., `background-color` → `backgroundColor`).
- Values must be strings, and you usually include units (e.g., `'20px'`, `'2em'`).
- Reading `element.style.property` only returns values **set inline**, not from stylesheets. To get the computed style, use `getComputedStyle(element).propertyName`.

```javascript
let computedColor = getComputedStyle(box).backgroundColor;
console.log(computedColor); // e.g., "rgb(255, 0, 0)"
```

---

## 5. `data-*` Attributes and the `dataset` Property

Custom `data-*` attributes allow you to store extra information on HTML elements. They are accessed via the `dataset` property, which returns a `DOMStringMap` object with all `data-*` attributes.

- In HTML: `data-user-id="123"`, `data-role="admin"`.
- In JavaScript: `element.dataset.userId` and `element.dataset.role` (note the camelCase conversion: `data-user-id` becomes `userId`).

```html
<div id="user" data-user-id="42" data-role="editor"></div>
```

```javascript
let userDiv = document.getElementById('user');

// Reading
console.log(userDiv.dataset.userId); // "42"
console.log(userDiv.dataset.role);   // "editor"

// Writing
userDiv.dataset.status = 'active';   // adds a data-status="active" attribute

// Removing
delete userDiv.dataset.role;         // removes data-role attribute
```

**Benefits:**
- Clean way to embed custom data without polluting with non‑standard attributes.
- Dataset automatically handles the naming conversion.
- Data is stored as strings; if you need numbers, parse them.

---

## Putting It All Together – Example

```html
<button id="myBtn" class="btn" data-action="save" disabled>Save</button>
```

```javascript
const btn = document.getElementById('myBtn');

// Attributes
console.log(btn.getAttribute('disabled')); // "disabled" (string)
btn.removeAttribute('disabled');           // enables the button

// Properties
btn.id = 'saveBtn';                         // changes id
console.log(btn.className);                  // "btn"
btn.className += ' primary';                  // add class via string (but classList is better)

// classList
btn.classList.add('rounded');
btn.classList.toggle('active');

// style
btn.style.padding = '10px 20px';
btn.style.border = 'none';

// dataset
console.log(btn.dataset.action); // "save"
btn.dataset.action = 'delete';    // updates data-action
```

---

## Summary

| Operation                     | Attribute Methods                         | Property Access                  |
|-------------------------------|-------------------------------------------|----------------------------------|
| Get value                     | `getAttribute('name')`                   | `element.name`                   |
| Set value                     | `setAttribute('name', 'value')`          | `element.name = 'value'`         |
| Remove attribute              | `removeAttribute('name')`                 | `element.name = null` (depends)  |
| Check existence               | `hasAttribute('name')`                    | Check if property is truthy      |
| Class manipulation            | –                                         | `classList` methods              |
| Inline styles                 | –                                         | `style` property                 |
| Custom data attributes        | `getAttribute('data-xyz')`                | `dataset.xyz`                    |

**General rule:** Use properties when possible (they are faster and type‑aware). Use attribute methods when you specifically need the HTML string (e.g., original `href`), for custom data attributes (though `dataset` is nicer), or when working with boolean attributes programmatically.

Now go ahead and experiment with these methods in your browser console – they are the foundation of dynamic web development!