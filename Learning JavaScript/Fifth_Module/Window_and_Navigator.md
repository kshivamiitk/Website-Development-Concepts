# Window, Location, History, and Navigator Objects

In the browser, the **`window`** object is the global object. It represents the browser window (or tab) and provides numerous properties and methods for interacting with the browser and the current document. This guide covers the most commonly used features of `window`, plus the related `location`, `history`, and `navigator` objects.

---

## 1. The `window` Object

The `window` object is the top‑level object in client‑side JavaScript. All global variables and functions are properties of `window`. You can omit `window` when calling its methods (e.g., `alert()` is the same as `window.alert()`).

### `alert()`

Displays a modal dialog with a message and an **OK** button. It halts script execution until the user clicks OK.

```javascript
alert('Hello, world!');
```

### `confirm()`

Displays a modal dialog with a message, an **OK** button, and a **Cancel** button. Returns `true` if OK is clicked, otherwise `false`.

```javascript
const userConfirmed = confirm('Are you sure you want to delete?');
if (userConfirmed) {
  // proceed with deletion
} else {
  // cancel action
}
```

### `prompt()`

Displays a modal dialog with a message, a text input field, and OK/Cancel buttons. Returns the text entered as a string, or `null` if Cancel is clicked.

```javascript
const name = prompt('Please enter your name:', 'Default name');
if (name !== null) {
  console.log(`Hello, ${name}`);
}
```

### `open()`

Opens a new browser window (or tab, depending on browser settings). Returns a reference to the new window.

```javascript
const newWindow = window.open('https://example.com', 'example', 'width=800,height=600');
```

- First parameter: URL to load.
- Second parameter: window name (can be used as target for links/forms).
- Third parameter: a comma‑separated string of window features (size, scrollbars, etc.).

**Note:** Pop‑up blockers may prevent this unless triggered by a direct user action (like a click).

### `close()`

Closes the current window or a window opened via `window.open()`. You can only close windows that were opened by your script (for security reasons).

```javascript
const myWindow = window.open('', 'myWindow', 'width=300,height=200');
myWindow.document.write('<p>A new window</p>');
// Later, close it
myWindow.close();
```

---

## 2. The `location` Object

The `location` object (available as `window.location` or `document.location`) contains information about the current URL and provides methods to navigate.

### Properties

| Property     | Description                                                  | Example                                 |
|--------------|--------------------------------------------------------------|-----------------------------------------|
| `href`       | The full URL                                                 | `"https://example.com:8080/path?q=js#section"` |
| `protocol`   | The protocol (including colon)                               | `"https:"`                              |
| `hostname`   | The domain name                                              | `"example.com"`                         |
| `port`       | The port number (empty string if default)                    | `"8080"`                                |
| `host`       | Hostname + port (if not default)                             | `"example.com:8080"`                    |
| `pathname`   | The path after the domain (starts with `/`)                  | `"/path"`                               |
| `search`     | The query string (includes `?`)                              | `"?q=js"`                               |
| `hash`       | The fragment identifier (includes `#`)                       | `"#section"`                            |

```javascript
console.log(location.href);      // current full URL
console.log(location.pathname);  // e.g., "/products"
console.log(location.search);    // e.g., "?id=123"
```

### Methods

#### `reload()`
Reloads the current page. If `true` is passed, forces a reload from the server (bypassing cache).

```javascript
location.reload();      // normal reload (may use cache)
location.reload(true);  // forced reload from server
```

#### `assign(url)`
Loads a new document at the given URL. The previous page remains in the history stack (you can go back).

```javascript
location.assign('https://google.com');
```

#### `replace(url)`
Similar to `assign()`, but **replaces** the current entry in the history stack. The user cannot go back to the original page using the back button.

```javascript
location.replace('https://google.com'); // no way back to previous page
```

**Note:** You can also change properties like `location.href = '...'`, which is equivalent to `assign()`.

---

## 3. The `history` Object

The `history` object allows you to interact with the browser’s session history (the list of pages visited in the current tab).

### Methods

| Method        | Description                                                                                   |
|---------------|-----------------------------------------------------------------------------------------------|
| `back()`      | Goes to the previous page in the history (same as clicking the browser’s back button).        |
| `forward()`   | Goes to the next page in the history (same as the forward button).                            |
| `go(delta)`   | Loads a specific page from the history. Positive delta goes forward, negative goes backward.  |

```javascript
history.back();    // go back one step
history.forward(); // go forward one step
history.go(-2);    // go back two steps
history.go(1);     // equivalent to forward()
```

**Note:** The number of steps is limited by the actual history length. You cannot navigate to pages outside the session history.

### Additional Properties

- `history.length` – the number of entries in the history stack.

```javascript
console.log(history.length); // e.g., 3
```

**Important:** For security reasons, you cannot read the actual URLs in the history.

---

## 4. The `navigator` Object

The `navigator` object contains information about the browser and the operating environment. It is read‑only.

### Common Properties

| Property       | Description                                                         |
|----------------|---------------------------------------------------------------------|
| `userAgent`    | The browser’s user‑agent string (often used for browser detection, but not recommended for feature detection). |
| `platform`     | A string representing the operating system (e.g., `"Win32"`, `"MacIntel"`, `"Linux x86_64"`). |
| `language`     | The preferred language of the user (e.g., `"en-US"`).               |
| `onLine`       | Boolean indicating whether the browser is online.                   |
| `cookieEnabled`| Boolean indicating if cookies are enabled.                          |

```javascript
console.log(navigator.userAgent); // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ..."
console.log(navigator.platform);  // "Win32"
console.log(navigator.language);  // "en-US"
```

### Geolocation API

The `navigator.geolocation` object provides methods to access the user’s geographic location (with permission).

#### `getCurrentPosition(success, error, options)`

Requests the current position.

```javascript
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log('Latitude:', position.coords.latitude);
      console.log('Longitude:', position.coords.longitude);
    },
    (error) => {
      console.error('Error getting location:', error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
} else {
  console.log('Geolocation not supported');
}
```

- `position` object contains `coords` (latitude, longitude, accuracy, etc.) and a timestamp.
- `error` object has a `code` and `message`.

#### `watchPosition(success, error, options)`

Continuously monitors the position, calling the success callback whenever the position changes. Returns a watch ID that can be used with `clearWatch()`.

```javascript
const watchId = navigator.geolocation.watchPosition(updatePosition, handleError);

// Later, to stop watching:
navigator.geolocation.clearWatch(watchId);
```

#### `clearWatch(id)`

Stops the position watching for the given ID.

**Important:** Geolocation requires the user’s permission. Always handle cases where permission is denied or unavailable.

---

## Summary

- The **`window`** object is the global object, providing methods like `alert`, `confirm`, `prompt`, `open`, and `close`.
- **`location`** gives URL information and navigation methods (`reload`, `assign`, `replace`).
- **`history`** lets you move through the browsing history (`back`, `forward`, `go`).
- **`navigator`** exposes browser and system info, including the powerful `geolocation` API for accessing the user’s location.

These objects are fundamental to creating interactive, browser‑aware web applications. Use them wisely and always consider user privacy (especially with geolocation).