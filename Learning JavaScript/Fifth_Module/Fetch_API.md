# Fetch API & AJAX: Making HTTP Requests in JavaScript

The **Fetch API** is the modern, promise‑based way to make HTTP requests (AJAX) from the browser. It replaces the older `XMLHttpRequest` and provides a cleaner, more powerful interface for interacting with servers. This guide covers everything you need to know to use `fetch` effectively, including handling responses, different HTTP methods, headers, authentication, and proper error handling.

---

## 1. What is Fetch?

`fetch()` is a built‑in browser function that sends an HTTP request and returns a **Promise** that resolves to the **Response** object representing the server’s response.

Basic syntax:

```javascript
fetch(url, options)
  .then(response => {
    // handle response
  })
  .catch(error => {
    // handle network errors
  });
```

- `url` – the request URL.
- `options` – an optional object containing method, headers, body, etc.

---

## 2. Making a Simple GET Request

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // parse JSON response
  })
  .then(data => {
    console.log('Data received:', data);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
```

**Explanation:**
- `response.ok` is `true` for status codes 200–299.
- `response.json()` returns a promise that resolves to the parsed JSON.
- The `catch` block only runs for network failures (e.g., no internet) – **not** for HTTP errors like 404 or 500. That’s why we check `response.ok` manually.

---

## 3. Handling Different Response Types

Depending on what the server returns, you can use different methods on the `Response` object:

| Method           | Use Case                                   |
|------------------|--------------------------------------------|
| `response.json()`| Parse response as JSON                     |
| `response.text()`| Get response as plain text                  |
| `response.blob()`| Get binary data (images, files)             |
| `response.formData()` | Parse response as FormData (rare)      |
| `response.arrayBuffer()` | For low‑level binary access         |

### Example: Fetching an Image as Blob

```javascript
fetch('https://example.com/image.jpg')
  .then(response => response.blob())
  .then(blob => {
    const imgUrl = URL.createObjectURL(blob);
    document.getElementById('myImage').src = imgUrl;
  });
```

---

## 4. HTTP Methods: GET, POST, PUT, DELETE

By default, `fetch` uses the **GET** method. To use others, set the `method` option.

### POST – Sending Data

```javascript
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Alice',
    email: 'alice@example.com'
  })
})
.then(response => response.json())
.then(data => console.log('User created:', data))
.catch(error => console.error('Error:', error));
```

- `body` must be a string (for JSON) or a `FormData`, `Blob`, etc.
- Set the `Content-Type` header appropriately.

### PUT – Updating Data

```javascript
fetch('https://api.example.com/users/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Alice Updated',
    email: 'alice.new@example.com'
  })
});
```

### DELETE – Removing Data

```javascript
fetch('https://api.example.com/users/123', {
  method: 'DELETE'
})
.then(response => {
  if (response.ok) {
    console.log('User deleted');
  }
});
```

---

## 5. Setting Headers

Headers can be provided as an object literal or a `Headers` instance.

### Using an object literal

```javascript
fetch(url, {
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'abc123'
  }
});
```

### Using the `Headers` constructor

```javascript
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('X-API-Key', 'abc123');

fetch(url, { headers });
```

---

## 6. Authentication

### Basic Authentication

```javascript
const username = 'user';
const password = 'pass';
const encoded = btoa(`${username}:${password}`);

fetch(url, {
  headers: {
    'Authorization': `Basic ${encoded}`
  }
});
```

### Bearer Token (JWT, OAuth)

```javascript
fetch(url, {
  headers: {
    'Authorization': `Bearer your_token_here`
  }
});
```

---

## 7. Error Handling: Why `catch` Is Not Enough

`fetch()` only rejects the promise on **network errors** (e.g., no internet, DNS failure). **HTTP error statuses (like 404, 500) do NOT cause rejection.** The promise resolves normally, with `response.ok` set to `false`.

Therefore, you must always check `response.ok` or `response.status`:

```javascript
fetch(url)
  .then(response => {
    if (!response.ok) {
      // Optionally, get error details from response body
      return response.json().then(err => { throw new Error(err.message); });
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Network or custom error:', error));
```

You can also check the status code:

```javascript
if (response.status === 404) {
  // handle not found
}
```

---

## 8. Advanced Fetch Options

The `options` object can include many settings:

```javascript
fetch(url, {
  method: 'POST',
  headers: { ... },
  body: ...,
  mode: 'cors',          // cors, no-cors, same-origin
  credentials: 'include', // include cookies in cross-origin requests
  cache: 'no-cache',      // default, reload, force-cache, etc.
  redirect: 'follow',     // follow, error, manual
  referrer: 'about:client',
  integrity: ''           // subresource integrity
});
```

- **`credentials: 'include'`** – sends cookies even for cross‑origin requests (useful for sessions).
- **`mode: 'cors'`** – the default for cross‑origin requests; the server must support CORS.

---

## 9. Sending Form Data (Multipart/Form-Data)

You can use the `FormData` object to send files or form fields.

```javascript
const formData = new FormData();
formData.append('username', 'Alice');
formData.append('avatar', fileInput.files[0]);

fetch('/upload', {
  method: 'POST',
  body: formData  // do NOT set Content-Type – browser sets it with boundary
});
```

---

## 10. XMLHttpRequest (Legacy)

Before `fetch`, `XMLHttpRequest` (XHR) was the standard. It’s more verbose and uses event listeners or callbacks, but it offers features like **upload progress** that `fetch` still lacks natively (though you can use `axios` or the `fetch` + `ReadableStream` for progress).

### Basic XHR Example

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data');
xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    const data = JSON.parse(xhr.responseText);
    console.log(data);
  } else {
    console.error('Request failed:', xhr.status);
  }
};
xhr.onerror = function() {
  console.error('Network error');
};
xhr.send();
```

### Tracking Upload Progress

```javascript
const xhr = new XMLHttpRequest();
xhr.open('POST', '/upload');
xhr.upload.onprogress = (event) => {
  if (event.lengthComputable) {
    const percent = (event.loaded / event.total) * 100;
    console.log(`Upload: ${percent}%`);
  }
};
xhr.send(formData);
```

**When to use XHR today?**  
- When you need upload progress events (though you can use `axios` or libraries that wrap XHR).
- Supporting very old browsers (though most modern browsers support `fetch`).

For new projects, prefer `fetch` with appropriate error handling, and if you need progress, consider using `axios` (which provides a simple API and progress events) or the newer `fetch` + `ReadableStream` (more complex).

---

## 11. CORS (Cross-Origin Resource Sharing)

When you make a request to a different origin (domain, protocol, or port), the browser enforces CORS. The server must include specific headers (like `Access-Control-Allow-Origin`) to allow the request. If CORS fails, you’ll get a network error in the console, and the `fetch` promise will reject.

To include cookies in cross‑origin requests, you must set `credentials: 'include'` **and** the server must respond with `Access-Control-Allow-Credentials: true` and a specific origin (not `*`).

---

## 12. Putting It All Together – Complete Example

```javascript
async function createUser(userData) {
  try {
    const response = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      // Try to get error message from response body
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('User created:', result);
    return result;
  } catch (error) {
    console.error('Create user failed:', error.message);
    throw error; // rethrow if needed
  }
}
```

---

## Summary

- **`fetch`** is the modern, promise‑based API for HTTP requests.
- Always check `response.ok` because `fetch` doesn’t reject on HTTP errors.
- Use `response.json()`, `response.text()`, or `response.blob()` to read the body.
- Set method, headers, and body via the options object.
- Handle authentication via the `Authorization` header.
- For file uploads, use `FormData` and let the browser set the `Content-Type`.
- **`XMLHttpRequest`** is the legacy alternative, still useful for progress events.
- Be aware of CORS when making cross‑origin requests.

With these tools, you can interact with any REST API, submit forms, and build dynamic web applications.