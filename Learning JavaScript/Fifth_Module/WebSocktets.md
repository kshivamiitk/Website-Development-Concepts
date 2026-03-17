# WebSockets: Real‑Time Communication in JavaScript

WebSockets provide a **full‑duplex** communication channel over a single TCP connection, enabling real‑time data exchange between a client and a server. Unlike HTTP (where the client always initiates requests), WebSockets allow the server to push data to the client at any time. This makes them ideal for chat applications, live feeds, online games, collaborative editing, and any feature requiring low‑latency updates.

---

## 1. Creating a WebSocket Connection

To connect to a WebSocket server, create a new `WebSocket` object with the server’s URL.

```javascript
const socket = new WebSocket('ws://example.com/socket');
// For secure connections (like HTTPS), use wss://
const secureSocket = new WebSocket('wss://example.com/socket');
```

- The URL scheme must be `ws://` (unencrypted) or `wss://` (encrypted, like HTTPS).
- You can optionally pass an array of sub‑protocols as a second argument if the server supports multiple protocols.

```javascript
const socket = new WebSocket('wss://example.com/chat', ['protocol1', 'protocol2']);
```

---

## 2. Handling Connection Events

The `WebSocket` object fires several events during its lifecycle.

### `open` – Connection Established

Fired when the connection is successfully opened. You can now start sending messages.

```javascript
socket.addEventListener('open', (event) => {
  console.log('Connected to the server');
  socket.send('Hello Server!');
});
```

### `message` – Data Received

Fired whenever a message is received from the server. The message data is available in `event.data`.

```javascript
socket.addEventListener('message', (event) => {
  console.log('Message from server:', event.data);
  // If the server sends JSON, parse it
  const data = JSON.parse(event.data);
});
```

The data can be a string, a Blob, or an ArrayBuffer, depending on the server and the `binaryType` property of the socket.

### `error` – Error Occurred

Fired when an error occurs (e.g., connection failure). The event object usually contains limited information.

```javascript
socket.addEventListener('error', (event) => {
  console.error('WebSocket error:', event);
});
```

### `close` – Connection Closed

Fired when the connection is closed (either by the client, the server, or due to a network issue). The event provides `code` and `reason` properties.

```javascript
socket.addEventListener('close', (event) => {
  console.log('Connection closed:', event.code, event.reason);
  // You might attempt to reconnect here
});
```

---

## 3. Sending Messages

Use the `send()` method to transmit data to the server. You can send a string, a Blob, or an ArrayBuffer.

```javascript
// Send a plain text message
socket.send('Hello again!');

// Send JSON
socket.send(JSON.stringify({ type: 'chat', message: 'Hi' }));

// Send binary data (e.g., from a file)
const blob = new Blob([data], { type: 'application/octet-stream' });
socket.send(blob);
```

**Important:** You can only send messages after the `open` event has fired. If you try to send before the connection is established, the data may be queued or lost (depending on the browser). It’s safe to send inside the `open` handler or after ensuring `socket.readyState === WebSocket.OPEN`.

---

## 4. Closing the Connection

When you no longer need the connection, close it using the `close()` method. You can optionally pass a status code and a reason.

```javascript
socket.close(1000, 'Normal closure');
```

The `close()` method initiates the closing handshake. After that, the `close` event will fire on both sides.

---

## 5. Checking Connection State

The `readyState` property indicates the current state of the connection:

- `WebSocket.CONNECTING` = 0 – connection in progress.
- `WebSocket.OPEN` = 1 – connection established, ready to send/receive.
- `WebSocket.CLOSING` = 2 – closing handshake in progress.
- `WebSocket.CLOSED` = 3 – connection closed or could not be opened.

```javascript
if (socket.readyState === WebSocket.OPEN) {
  socket.send('Hello');
}
```

---

## 6. Complete Example: A Simple Chat Client

```html
<!DOCTYPE html>
<html>
<head>
  <title>WebSocket Chat</title>
</head>
<body>
  <input id="messageInput" type="text" placeholder="Type a message">
  <button id="sendBtn">Send</button>
  <ul id="messages"></ul>

  <script>
    const socket = new WebSocket('wss://example.com/chat'); // Use your server URL

    const messages = document.getElementById('messages');
    const input = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');

    // Connection opened
    socket.addEventListener('open', () => {
      console.log('Connected to chat');
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
      const li = document.createElement('li');
      li.textContent = event.data;
      messages.appendChild(li);
    });

    // Send message on button click
    sendBtn.addEventListener('click', () => {
      const msg = input.value.trim();
      if (msg && socket.readyState === WebSocket.OPEN) {
        socket.send(msg);
        input.value = '';
      }
    });

    // Handle errors
    socket.addEventListener('error', (err) => {
      console.error('WebSocket error:', err);
    });

    // Handle close
    socket.addEventListener('close', (event) => {
      console.log('Disconnected:', event.reason);
    });
  </script>
</body>
</html>
```

---

## 7. Important Considerations

- **Use `wss://` in production** – Always prefer secure WebSockets (`wss://`) over `ws://` to encrypt data and avoid man‑in‑the‑middle attacks.
- **Reconnection logic** – Because connections can drop, implement reconnection with exponential backoff.
- **Heartbeats / ping‑pong** – Some servers send periodic ping messages; you can respond or just listen for any message to keep the connection alive.
- **Binary data** – Set `socket.binaryType = 'arraybuffer'` or `'blob'` to control how binary messages are delivered.
- **Browser support** – All modern browsers support WebSockets. For very old browsers, fallback techniques like long‑polling exist, but libraries like Socket.IO provide that automatically.

---

## 8. Fallbacks and Libraries

While raw WebSockets are powerful, libraries like **Socket.IO** (which uses WebSockets with fallbacks) can simplify development by providing rooms, namespaces, automatic reconnection, and event‑based messaging.

---

## Summary

- **Create** a WebSocket with `new WebSocket(url)`.
- **Listen** for `open`, `message`, `error`, and `close` events.
- **Send** data with `socket.send(data)` after the connection is open.
- **Close** with `socket.close()` when done.
- Always handle errors and implement reconnection for robust real‑time apps.

WebSockets open the door to truly interactive web experiences. Experiment with a local WebSocket server (e.g., using Node.js with the `ws` library) to see them in action.