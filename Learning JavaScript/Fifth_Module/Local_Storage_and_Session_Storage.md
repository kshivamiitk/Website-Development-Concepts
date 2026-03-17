# LocalStorage & SessionStorage: Client‑Side Storage

Modern web applications often need to store data on the user’s device – for example, user preferences, shopping cart items, or form drafts. The **Web Storage API** provides two easy‑to‑use mechanisms: **`localStorage`** and **`sessionStorage`**. Both allow you to save key‑value pairs in the browser, but they differ in lifespan and scope.

---

## 1. What Are `localStorage` and `sessionStorage`?

- **`localStorage`** – stores data with **no expiration time**. Data persists even after the browser is closed and reopened, across browser sessions.
- **`sessionStorage`** – stores data **only for the duration of the page session**. As soon as the tab or window is closed, the data is cleared. (If you open the same page in a new tab, a new session starts.)

Both are part of the `window` object and share the same simple API. They are **synchronous** and **only store strings**. To store objects or arrays, you need to convert them to JSON strings.

**Important:** Both are subject to the **same‑origin policy**. Data stored from `https://example.com` cannot be read by `https://another.com`.

---

## 2. Basic Methods

The API is identical for `localStorage` and `sessionStorage`. We'll use `localStorage` in the examples, but the same methods apply to `sessionStorage`.

| Method                           | Description                                          |
|----------------------------------|------------------------------------------------------|
| `setItem(key, value)`            | Stores a value (as a string) under the given key.    |
| `getItem(key)`                   | Retrieves the value for the key, or `null` if missing. |
| `removeItem(key)`                | Removes the key and its value.                       |
| `clear()`                        | Removes **all** key‑value pairs from that storage.   |

### Examples

```javascript
// Storing data
localStorage.setItem('username', 'Alice');
localStorage.setItem('theme', 'dark');

// Retrieving data
const user = localStorage.getItem('username');
console.log(user); // "Alice"

const nonExistent = localStorage.getItem('none');
console.log(nonExistent); // null

// Removing one item
localStorage.removeItem('theme');

// Clearing all data
localStorage.clear();
```

**Note:** All values are stored as strings. If you store a number, it will be converted to a string.

---

## 3. Storing Objects and Arrays

Because storage only accepts strings, you cannot directly store an object or array. The solution is to use `JSON.stringify()` to convert the object into a JSON string, and `JSON.parse()` to convert it back.

### Example: Storing and retrieving an object

```javascript
const user = {
  name: 'Alice',
  age: 30,
  preferences: {
    theme: 'dark',
    notifications: true
  }
};

// Store the object – convert to JSON string
localStorage.setItem('user', JSON.stringify(user));

// Later, retrieve it – parse the JSON string back to an object
const storedUser = JSON.parse(localStorage.getItem('user'));
console.log(storedUser.name); // "Alice"
console.log(storedUser.preferences.theme); // "dark"
```

### Example: Storing an array

```javascript
const colors = ['red', 'green', 'blue'];
localStorage.setItem('colors', JSON.stringify(colors));

const storedColors = JSON.parse(localStorage.getItem('colors'));
console.log(storedColors[1]); // "green"
```

**Always** check that the retrieved value is not `null` before parsing, otherwise `JSON.parse(null)` would throw an error.

```javascript
const data = localStorage.getItem('someKey');
if (data) {
  const obj = JSON.parse(data);
  // use obj
}
```

---

## 4. Differences Between `localStorage` and `sessionStorage`

| Feature                | `localStorage`                          | `sessionStorage`                         |
|------------------------|-----------------------------------------|------------------------------------------|
| **Lifetime**           | Persists until explicitly cleared       | Cleared when the tab/window is closed    |
| **Scope**              | Shared across all tabs/windows from the same origin | Separate per tab/window                  |
| **Use case**           | User preferences, cached data, login tokens (with caution) | Form drafts, temporary state, per‑session data |

### Example of `sessionStorage`

```javascript
// In a tab, store a draft
sessionStorage.setItem('draft', 'My unsaved post');

// If you open the same page in another tab, it won't have access to this draft.
```

---

## 5. Important Considerations

### Storage Limit
Most browsers allow around **5–10 MB** per origin for `localStorage`. `sessionStorage` has similar limits. This is much larger than cookies (4 KB) but still limited. Do not store large files or binary data here.

### Synchronous Nature
Both `localStorage` and `sessionStorage` are **synchronous**. Reading/writing blocks the main thread, so avoid using them in performance‑critical loops.

### Security
- Data is **not encrypted** and is accessible to any JavaScript running on the same origin. Never store sensitive information like passwords or credit card numbers.
- Be aware of **XSS attacks** – malicious scripts could read your storage. Sanitize user input and use Content Security Policy (CSP) to mitigate risks.

### Storage Event
When data in `localStorage` is changed (in another tab), a `storage` event is fired on the `window` object. This allows different tabs of the same origin to synchronise.

```javascript
window.addEventListener('storage', (event) => {
  console.log('Key changed:', event.key);
  console.log('Old value:', event.oldValue);
  console.log('New value:', event.newValue);
  console.log('Storage area:', event.storageArea); // localStorage or sessionStorage
});
```

Note: The event is **not** fired on the tab that made the change – only on other tabs/windows.

---

## 6. Practical Use Cases

- **User preferences** – theme, language, layout settings.
- **Shopping cart** – store cart items across sessions (localStorage).
- **Form auto‑save** – save form drafts to sessionStorage and restore if the user accidentally closes the tab.
- **Feature flags** – store simple configuration values.
- **Caching API responses** – for offline support or performance (but be mindful of freshness).

---

## 7. Complete Example: To‑Do List with Persistence

```html
<input id="task" placeholder="New task">
<button id="add">Add</button>
<ul id="list"></ul>
```

```javascript
const taskInput = document.getElementById('task');
const addBtn = document.getElementById('add');
const list = document.getElementById('list');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function render() {
  list.innerHTML = tasks.map(task => `<li>${task}</li>`).join('');
  // Save to localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

addBtn.addEventListener('click', () => {
  const task = taskInput.value.trim();
  if (task) {
    tasks.push(task);
    taskInput.value = '';
    render();
  }
});

// Initial render
render();
```

---

## Summary

- **`localStorage`** – persists across browser sessions.
- **`sessionStorage`** – lives only for the current tab session.
- Both use the same methods: `setItem`, `getItem`, `removeItem`, `clear`.
- To store objects/arrays, use `JSON.stringify` and `JSON.parse`.
- Respect storage limits and security concerns.

With these tools, you can create more personalised and resilient web applications. Experiment with them in your browser’s developer console to see how they work in practice.