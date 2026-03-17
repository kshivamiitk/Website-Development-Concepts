# The JavaScript Event Loop: How Asynchronous Code Really Works

JavaScript is **single‑threaded**, meaning it can only execute one piece of code at a time. Yet it handles asynchronous operations like timers, network requests, and user events without blocking. This magic is performed by the **event loop**, which orchestrates the **call stack**, **task queue** (macrotask queue), and **microtask queue**. Understanding the event loop is essential for writing predictable, performant asynchronous code.

---

## 1. The Call Stack

The **call stack** is a LIFO (Last In, First Out) data structure that records where in the program we are. When you call a function, it’s pushed onto the stack; when it returns, it’s popped off.

```javascript
function foo() {
  console.log('foo');
  bar();
}
function bar() {
  console.log('bar');
}
foo();
```

Execution:
1. `foo()` is pushed onto the stack.
2. Inside `foo`, `console.log('foo')` is pushed, runs, and popped.
3. `bar()` is called, pushed onto the stack.
4. Inside `bar`, `console.log('bar')` runs and is popped.
5. `bar()` returns and is popped.
6. `foo()` returns and is popped.

The stack is now empty. Simple synchronous code works exactly like this.

---

## 2. Web APIs / Browser APIs

When you call an asynchronous function like `setTimeout`, `fetch`, or `addEventListener`, JavaScript doesn't have a built‑in timer or network stack. Instead, the browser provides **Web APIs** that handle these operations. The call stack delegates the task to the browser and continues executing the rest of the code. When the Web API completes (e.g., timer expires, data arrives), it places a callback into the **task queue**.

```javascript
console.log('Start');
setTimeout(() => console.log('Timeout'), 1000);
console.log('End');
```

Step‑by‑step:
1. `console.log('Start')` runs, then is popped.
2. `setTimeout` is called; the browser starts a timer (1 second). The `setTimeout` call itself completes immediately, and is popped.
3. `console.log('End')` runs.
4. The stack is empty.
5. After 1 second, the timer callback is placed into the **task queue**.
6. The event loop picks it up and pushes it onto the call stack to execute.

---

## 3. Task Queue (Macrotask Queue)

The **task queue** (also called the **callback queue** or **macrotask queue**) holds callbacks from:
- `setTimeout` and `setInterval`
- DOM events (clicks, keypresses, etc.)
- I/O operations (in Node.js)
- `requestAnimationFrame` (technically its own queue, but often considered a macrotask)

These are sometimes called **macrotasks**. The event loop picks **one** macrotask from the queue and pushes it onto the call stack to run. After that task finishes, it checks for microtasks before picking the next macrotask.

---

## 4. Microtask Queue

The **microtask queue** holds callbacks from:
- Promise reactions (`.then()`, `.catch()`, `.finally()`)
- `queueMicrotask()`
- `MutationObserver`

Microtasks have **higher priority** than macrotasks. After every macrotask (and after each call stack becomes empty), the event loop processes **all** microtasks in the queue before moving to the next macrotask. This means microtasks can starve the task queue if they are continuously added.

```javascript
console.log('Start');
setTimeout(() => console.log('setTimeout'), 0);
Promise.resolve().then(() => console.log('Promise'));
console.log('End');
```

Output:
```
Start
End
Promise
setTimeout
```

Why? The `setTimeout` callback is a macrotask, and the promise `.then` is a microtask. After the initial synchronous code finishes, the call stack is empty. The event loop then empties the microtask queue (the promise callback) before picking the first macrotask (the timer callback).

---

## 5. The Event Loop: Putting It All Together

The event loop is an endless process that:

1. Checks if the call stack is empty.
2. If empty, processes **all** microtasks in the microtask queue.
3. If the call stack remains empty after microtasks, picks **one** macrotask from the task queue and pushes it onto the stack.
4. Repeats.

This model ensures that microtasks (like promise callbacks) run as soon as possible, before any next macrotask.

### Visualising the Loop

```
               ┌─────────────┐
               │ Call Stack  │
               └─────────────┘
                     ▲
                     │
                     │
               ┌─────┴─────┐
               │ Event Loop │
               └─────┬─────┘
                     │
         ┌───────────┴───────────┐
         │                       │
   ┌─────▼─────┐           ┌─────▼─────┐
   │ Microtask │           │  Macrotask│
   │   Queue   │           │   Queue   │
   └───────────┘           └───────────┘
```

---

## 6. `setTimeout(fn, 0)` – What Does It Do?

`setTimeout(fn, 0)` does **not** execute the callback immediately. It places the callback into the macrotask queue to be executed after the current stack is empty **and** after all microtasks have been processed. This is a common trick to defer execution until the browser has finished rendering or to yield to the event loop.

```javascript
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
// Output: A, D, C, B
```

- Synchronous: A, D
- Microtask: C (runs before next macrotask)
- Macrotask: B (runs last)

Even with a delay of 0, the timer callback is still a macrotask, so it waits for microtasks.

---

## 7. Practical Example with Nested Microtasks

Microtasks can create infinite loops if not careful. For instance, a promise that continuously schedules another microtask will prevent the event loop from ever reaching macrotasks.

```javascript
function loop() {
  Promise.resolve().then(loop);
}
loop();
// This will block the task queue indefinitely – bad!
```

However, using `setTimeout` recursively inside a microtask can still allow macrotasks to run because the microtask queue empties before the next timer callback is added.

---

## 8. Why Does This Matter?

- **Performance**: Long‑running synchronous code blocks the event loop, making the page unresponsive.
- **Order of execution**: Knowing when your code runs helps avoid bugs (e.g., expecting a timeout to run before a promise).
- **Rendering**: The browser may render after each macrotask, but before the next microtask check. Microtasks can therefore block rendering if they are heavy.

---

## 9. Summary

| Component          | Role                                                                 |
|--------------------|----------------------------------------------------------------------|
| Call stack         | Executes functions synchronously.                                    |
| Web APIs           | Handle async operations; place callbacks into queues when done.      |
| Task queue         | Holds macrotask callbacks (setTimeout, events, etc.).                |
| Microtask queue    | Holds microtask callbacks (promise `.then`, `queueMicrotask`).       |
| Event loop         | Monitors call stack, then processes microtasks, then one macrotask.  |

**Key takeaway:** Microtasks always run before the next macrotask, even if the macrotask’s delay is 0. Understanding this order is crucial for debugging and designing robust asynchronous flows.