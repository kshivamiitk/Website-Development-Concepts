# Event Flow, the Event Object, and Mouse/Keyboard Events

This guide covers the mechanics of how events travel through the DOM, the event object that carries details about each event, and the most common mouse and keyboard events you’ll handle in web development.

---

## 1. Event Flow: Capturing, Target, Bubbling

When an event occurs on an element (e.g., a click on a button), it doesn’t just fire on that one element. It goes through a three‑phase journey:

1. **Capturing phase** – the event travels from the root (`document`) down to the target element.
2. **Target phase** – the event reaches the target element.
3. **Bubbling phase** – the event bubbles back up from the target to the root.

By default, event listeners are attached to the **bubbling phase** (the third phase). However, you can also listen during the capturing phase by passing a third parameter to `addEventListener`.

```javascript
element.addEventListener('click', handler, true); // capturing
element.addEventListener('click', handler, false); // bubbling (default)
// or using an options object: { capture: true }
```

### Why does this matter?
- **Bubbling** allows you to implement **event delegation** – listening on a parent for events from many children.
- **Capturing** is rarely used but can be necessary for intercepting events before they reach a child.

#### Example:

```html
<div id="parent">
  <button id="child">Click me</button>
</div>
```

```javascript
document.getElementById('parent').addEventListener('click', () => {
  console.log('Parent clicked (bubbling)');
}, false);

document.getElementById('child').addEventListener('click', () => {
  console.log('Child clicked (target)');
}, false);

// If you click the button, the order is:
// 1. Child clicked (target)
// 2. Parent clicked (bubbling)
```

If you add a capturing listener on the parent:

```javascript
document.getElementById('parent').addEventListener('click', () => {
  console.log('Parent clicked (capturing)');
}, true);
```

Now clicking the button logs:
```
Parent clicked (capturing)
Child clicked (target)
Parent clicked (bubbling)
```

---

## 2. `addEventListener` vs. Inline Events

### Inline Events (e.g., `onclick`)
You can attach event handlers directly in HTML or by setting the `onclick` property.

```html
<button onclick="alert('Clicked!')">Click</button>
```

```javascript
button.onclick = function() { alert('Clicked!'); };
```

**Problems:**
- Only **one** handler per event type – assigning a new one overwrites the previous.
- Limited control over event flow (cannot specify capturing phase).
- Mixing HTML and JavaScript is generally considered bad practice.

### `addEventListener`
The modern way to attach event listeners.

```javascript
button.addEventListener('click', handler1);
button.addEventListener('click', handler2); // both run
```

**Advantages:**
- Multiple handlers for the same event.
- Control over capturing/bubbling (third parameter).
- Easy to remove with `removeEventListener`.
- Works with any event type, including custom events.

---

## 3. Removing Listeners: `removeEventListener`

To remove an event listener, you must pass the **same function reference** that was used to add it. Anonymous functions cannot be removed unless you keep a reference.

```javascript
function handler() {
  console.log('Clicked');
}

button.addEventListener('click', handler);
button.removeEventListener('click', handler); // works
```

If you used an anonymous function, you cannot remove it:

```javascript
button.addEventListener('click', function() { console.log('Hi'); });
// Cannot remove this listener!
```

**Important:** For `removeEventListener` to work, the parameters must match exactly: same event type, same function, and same `capture` flag (or options with matching `capture` value).

---

## 4. The Event Object

Every event handler receives an **event object** that contains information about the event and methods to control its behavior.

### Common Properties

- **`event.type`** – the name of the event (e.g., `'click'`, `'keydown'`).
- **`event.target`** – the element that **originally** triggered the event (the deepest element that was clicked, etc.).
- **`event.currentTarget`** – the element to which the event listener is attached (the one that is currently handling the event). During bubbling/capturing, this can be different from `target`.

```javascript
document.querySelector('#parent').addEventListener('click', (event) => {
  console.log(event.target);        // the button that was clicked
  console.log(event.currentTarget); // the #parent element
});
```

### Important Methods

- **`event.preventDefault()`** – cancels the default action of the event (e.g., preventing a form submission, following a link, or text selection). Can be called on any event that is cancelable.
- **`event.stopPropagation()`** – stops the event from traveling further in the capturing/bubbling phases. It does **not** prevent other listeners on the same element from running.
- **`event.stopImmediatePropagation()`** – stops propagation **and** prevents any other listeners on the same element from being called. If multiple listeners are attached to the same element for the same event, they will not run after this method is called.

```javascript
link.addEventListener('click', (e) => {
  e.preventDefault(); // no navigation
  e.stopPropagation(); // event won't bubble up
});
```

---

## 5. Mouse Events

Mouse events are fired when the user interacts with a pointing device (mouse, trackpad, etc.).

### Common Mouse Events

| Event         | Description                                                                 |
|---------------|-----------------------------------------------------------------------------|
| `click`       | Fires after a `mousedown` and `mouseup` on the same element.               |
| `dblclick`    | Fires after two clicks in quick succession.                                 |
| `mousedown`   | Fires when a mouse button is pressed down on an element.                    |
| `mouseup`     | Fires when a mouse button is released over an element.                      |
| `mousemove`   | Fires repeatedly while the mouse moves inside the element.                  |
| `mouseover`   | Fires when the mouse enters the element or any of its children. (Bubbles)   |
| `mouseout`    | Fires when the mouse leaves the element or any of its children. (Bubbles)   |
| `mouseenter`  | Fires when the mouse enters the element. Does **not** bubble.               |
| `mouseleave`  | Fires when the mouse leaves the element. Does **not** bubble.               |
| `contextmenu` | Fires when the right button is clicked (opening the context menu).          |

### `mouseenter` vs. `mouseover`

- `mouseenter` and `mouseleave` do **not** bubble and are not triggered when moving to a child element – they only care about entering/leaving the element itself.
- `mouseover` and `mouseout` **do** bubble, and they fire when moving into or out of any descendant.

```html
<div id="parent" style="padding: 20px; background: lightgray;">
  <div id="child" style="padding: 20px; background: white;">Child</div>
</div>
```

```javascript
parent.addEventListener('mouseenter', () => console.log('enter parent'));
parent.addEventListener('mouseleave', () => console.log('leave parent'));
parent.addEventListener('mouseover', () => console.log('over parent'));
parent.addEventListener('mouseout', () => console.log('out parent'));

// Moving mouse from outside into the child:
// mouseover parent (when entering the parent)
// mouseenter parent
// mouseout parent (when moving from parent into child)
// mouseover parent (again? because child is inside parent)
// ... Actually, mouseover/mouseout will fire many times due to bubbling.
```

In practice, `mouseenter`/`mouseleave` are often easier for hover effects because they don’t flicker when moving over children.

---

## 6. Keyboard Events

Keyboard events fire when the user presses keys.

| Event     | Description                                                                 |
|-----------|-----------------------------------------------------------------------------|
| `keydown` | Fires when a key is pressed down. Repeats while held.                       |
| `keyup`   | Fires when a key is released.                                               |
| `keypress`| **Deprecated.** Fired for character keys only (not modifiers). Use `keydown`. |

### Key Properties on the Event Object

- **`event.key`** – returns the character or identifier of the key (e.g., `'a'`, `'Enter'`, `'ArrowUp'`).
- **`event.code`** – returns the physical key code (e.g., `'KeyA'`, `'Digit1'`, `'Space'`). Useful for ignoring keyboard layout differences.
- **`event.repeat`** – `true` if the key is being held down (auto‑repeat).

### Modifier Keys

You can check if modifier keys were pressed during the event using boolean properties:

- `event.ctrlKey` – `true` if Ctrl key was pressed.
- `event.shiftKey` – `true` if Shift key was pressed.
- `event.altKey` – `true` if Alt key was pressed.
- `event.metaKey` – `true` if Meta key (Windows key or Command on Mac) was pressed.

```javascript
document.addEventListener('keydown', (event) => {
  if (event.key === 's' && event.ctrlKey) {
    event.preventDefault(); // prevent browser save dialog
    console.log('Ctrl+S pressed – save your work!');
  }
});
```

### `keydown` vs. `keyup`
- `keydown` fires repeatedly while holding the key, giving you many events.
- `keyup` fires once when the key is released.

**Tip:** For detecting key combinations (like shortcuts), `keydown` is usually preferred because it fires immediately.

---

## Putting It All Together – Example

```html
<div id="container">
  <button id="btn">Click me</button>
  <a href="https://example.com" id="link">Go to example</a>
</div>
<p>Press Ctrl+C to copy (prevented).</p>
```

```javascript
// Event phases example
const container = document.getElementById('container');
const btn = document.getElementById('btn');
const link = document.getElementById('link');

container.addEventListener('click', (e) => {
  console.log('Container (bubbling) – target:', e.target.id, 'currentTarget:', e.currentTarget.id);
});

container.addEventListener('click', (e) => {
  console.log('Container (capturing)');
}, true);

btn.addEventListener('click', (e) => {
  console.log('Button clicked');
  e.stopPropagation(); // prevents bubbling to container (but capturing already happened)
});

// Prevent default on link
link.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Link click prevented');
});

// Keyboard shortcut prevention
document.addEventListener('keydown', (e) => {
  if (e.key === 'c' && e.ctrlKey) {
    e.preventDefault();
    console.log('Ctrl+C intercepted');
  }
});
```

---

## Summary

- **Event flow** has three phases: capturing (down), target, bubbling (up). Most handlers work in the bubbling phase.
- **`addEventListener`** is the modern, flexible way to attach events; avoid inline `onclick`.
- **`removeEventListener`** requires the exact same function reference.
- The **event object** provides properties like `type`, `target`, `currentTarget` and methods `preventDefault()`, `stopPropagation()`, `stopImmediatePropagation()`.
- **Mouse events** include clicks, movements, enters/leaves. `mouseenter`/`mouseleave` do not bubble; `mouseover`/`mouseout` do.
- **Keyboard events** include `keydown` and `keyup`. Use `event.key` and modifier flags (`ctrlKey`, etc.) for shortcuts.

Mastering these concepts allows you to build rich, interactive web applications with precise control over user input.