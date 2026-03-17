# Form Events, Document/Window Events, Event Delegation, and Custom Events

This guide covers four important aspects of event handling in JavaScript: events specific to forms, events on the document and window, the powerful pattern of event delegation, and how to create your own custom events.

---

## 1. Form Events

Forms are central to user input on the web. JavaScript provides several events to react to form interactions.

### Common Form Events

| Event    | Description                                                                                             |
|----------|---------------------------------------------------------------------------------------------------------|
| `submit` | Fires when a form is submitted. Typically used to validate or intercept submission (e.g., via AJAX).    |
| `reset`  | Fires when a form is reset (via a reset button). Can be used to clear custom state.                     |
| `focus`  | Fires when an element (like an input) receives focus.                                                   |
| `blur`   | Fires when an element loses focus.                                                                      |
| `change` | Fires when the value of an input, select, or textarea changes and the element loses focus (for text inputs) or immediately for checkboxes/radio/select. |
| `input`  | Fires immediately when the value of an `<input>`, `<textarea>`, or `<select>` changes (for text inputs, on every keystroke). |

#### Example: Form Validation with `submit`

```html
<form id="myForm">
  <input type="text" id="name" required>
  <input type="email" id="email" required>
  <button type="submit">Submit</button>
</form>
```

```javascript
const form = document.getElementById('myForm');
form.addEventListener('submit', (event) => {
  // Prevent the default form submission (page reload)
  event.preventDefault();

  // Perform custom validation
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!name || !email) {
    alert('Please fill in all fields');
    return;
  }

  // If validation passes, you could send data via fetch
  console.log('Form submitted', { name, email });
});
```

#### Example: Real‑time validation with `input` and `change`

```javascript
const emailInput = document.getElementById('email');

emailInput.addEventListener('input', (event) => {
  console.log('Current value:', event.target.value);
  // You could show a hint or live validation
});

emailInput.addEventListener('blur', (event) => {
  if (!event.target.value.includes('@')) {
    alert('Please enter a valid email address');
  }
});
```

- `change` vs `input`: `change` fires after the value is committed (usually when the element loses focus), while `input` fires on every keystroke or paste. For checkboxes, `change` fires immediately when toggled.

---

## 2. Document/Window Events

These events are fired on the `document` or `window` objects and are often related to page lifecycle, resizing, or scrolling.

### Page Lifecycle Events

| Event              | Target   | Description                                                                                   |
|--------------------|----------|-----------------------------------------------------------------------------------------------|
| `DOMContentLoaded` | document | Fires when the HTML is fully parsed and the DOM tree is built, without waiting for images, stylesheets, etc. |
| `load`             | window   | Fires when the entire page (including all resources like images, styles) has loaded.         |
| `beforeunload`     | window   | Fires just before the page is unloaded (e.g., user closes tab or navigates away). Can be used to warn the user about unsaved changes. |
| `unload`           | window   | Fires when the page is being unloaded. Rarely used because many things are already gone.     |

```javascript
// DOM is ready – manipulate the DOM safely
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully parsed and loaded');
  // Initialize UI, attach event listeners, etc.
});

// Full page loaded (including images, styles)
window.addEventListener('load', () => {
  console.log('All resources loaded');
  // Perform actions that depend on images dimensions, etc.
});

// Warn before leaving
window.addEventListener('beforeunload', (event) => {
  if (formHasUnsavedChanges) {
    event.preventDefault(); // Some browsers require this
    event.returnValue = ''; // Standard way to show confirmation
  }
});
```

### Viewport Events

| Event    | Target | Description                                                           |
|----------|--------|-----------------------------------------------------------------------|
| `resize` | window | Fires when the browser window is resized.                             |
| `scroll` | window / document / elements | Fires when the user scrolls the page or a scrollable element. |

```javascript
// Debounce resize events to avoid performance issues
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    console.log('Resize finished', window.innerWidth, window.innerHeight);
    // Adjust layout or recalculate positions
  }, 200);
});

// Infinite scroll example
window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    console.log('Near bottom – load more content');
  }
});
```

---

## 3. Event Delegation

Event delegation is a pattern where you attach a **single event listener to a parent element** to handle events for multiple current or future child elements. It leverages **event bubbling**: events from children bubble up to the parent, where you can check `event.target` to decide how to respond.

### Benefits
- **Performance**: Fewer event listeners, especially for many elements.
- **Dynamic content**: Automatically works for elements added later.

#### Example: Handling clicks on a dynamic list

```html
<ul id="todo-list">
  <li>Task 1 <button class="delete">X</button></li>
  <li>Task 2 <button class="delete">X</button></li>
</ul>
<button id="add">Add Task</button>
```

```javascript
const list = document.getElementById('todo-list');
const addBtn = document.getElementById('add');

// Single event listener on the <ul> for all delete buttons
list.addEventListener('click', (event) => {
  // Check if the clicked element (or its ancestor) is a delete button
  const deleteBtn = event.target.closest('.delete');
  if (deleteBtn) {
    deleteBtn.closest('li').remove();
  }
});

// Add new items dynamically – they automatically have the delete functionality
addBtn.addEventListener('click', () => {
  const newItem = document.createElement('li');
  newItem.innerHTML = `Task ${list.children.length + 1} <button class="delete">X</button>`;
  list.appendChild(newItem);
});
```

**How it works:**  
The click on any `button` bubbles up to the `<ul>`. The listener checks if the target (or a parent) has the class `delete`. If yes, it removes the entire `<li>`.

- Use `event.target` to get the exact element clicked.
- Use `closest()` to find the nearest ancestor matching a selector (handy when the click might be on a child of the button, like an `<svg>` inside).

---

## 4. Custom Events

Sometimes you need events that aren’t built into the browser. Custom events allow you to define and dispatch your own events, making your code more modular and decoupled.

### Creating and Dispatching

You can create a custom event using the `CustomEvent` constructor (or the generic `Event` constructor). `CustomEvent` accepts a `detail` property to pass custom data.

```javascript
// Create a custom event
const myEvent = new CustomEvent('userLoggedIn', {
  detail: { username: 'Alice' },
  bubbles: true,   // if you want it to bubble up the DOM
  cancelable: true // if you want to allow preventDefault()
});

// Dispatch it on an element (e.g., document, window, or any DOM node)
document.dispatchEvent(myEvent);
```

### Listening to Custom Events

You listen exactly like built‑in events, using `addEventListener`.

```javascript
document.addEventListener('userLoggedIn', (event) => {
  console.log('User logged in:', event.detail.username);
  // Update UI, show welcome message, etc.
});
```

### Example: A component communication scenario

Imagine a shopping cart that should update when a product is added:

```javascript
// In the "add to cart" button handler
function addToCart(product) {
  // … update cart logic …
  // Then notify other parts of the app
  const event = new CustomEvent('cartUpdated', {
    detail: { product, cartSize: getCartSize() }
  });
  window.dispatchEvent(event);
}

// In a header component that displays cart count
window.addEventListener('cartUpdated', (event) => {
  document.getElementById('cart-count').textContent = event.detail.cartSize;
});
```

### Using `new Event()` vs `new CustomEvent()`

- `new Event(eventType, options)` creates a simple event; you cannot pass custom data except by setting properties on the event object after creation (not recommended).
- `new CustomEvent(eventType, options)` allows a `detail` property in the options, which becomes `event.detail`. This is the standard way to include data.

Both can be dispatched with `dispatchEvent()`.

---

## Summary

- **Form events** (`submit`, `input`, `change`, etc.) let you interact with user input and validate forms.
- **Document/Window events** help you react to page lifecycle (`DOMContentLoaded`, `load`), viewport changes (`resize`), and scrolling (`scroll`).
- **Event delegation** uses a single parent listener to handle events from many children, ideal for dynamic content and performance.
- **Custom events** allow you to create your own event types, promoting loose coupling between components.

Mastering these concepts will make your JavaScript applications more interactive, efficient, and maintainable.