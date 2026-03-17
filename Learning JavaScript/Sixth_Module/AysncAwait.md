# Async/Await: Writing Asynchronous Code Like a Pro

Async/await is a modern syntax that makes working with promises much easier and more readable. Instead of chaining `.then()` and `.catch()`, you write asynchronous code that looks almost like synchronous code. Under the hood, it's built entirely on promises, so understanding promises first is essential.

---

## 1. What is `async/await`?

- **`async`** – a keyword used to declare a function that always returns a promise.
- **`await`** – a keyword that can only be used inside an `async` function. It pauses the execution of the function until a promise settles (fulfills or rejects), and then resumes with the resolved value (or throws the rejection error).

Together, they allow you to write asynchronous operations in a linear, synchronous‑like style.

---

## 2. `async` Functions

Any function marked with the `async` keyword automatically returns a promise. Whatever you return from the function becomes the fulfilled value of that promise. If you throw an error, the promise rejects.

```javascript
// This returns a promise that resolves to 42
async function getNumber() {
  return 42;
}

getNumber().then(value => console.log(value)); // 42

// This returns a promise that rejects with an error
async function fail() {
  throw new Error('Oops!');
}

fail().catch(err => console.log(err.message)); // "Oops!"
```

**Important:** Even if you return a non‑promise value, it is automatically wrapped in a resolved promise.

---

## 3. The `await` Keyword

`await` can only be used inside an `async` function (or in the top level of a module in modern environments). It expects a promise (or any value, which is treated as a resolved promise) and pauses the function execution until that promise settles.

```javascript
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  console.log(data);
  return data;
}
```

- The line `const response = await fetch(...)` pauses the function until the `fetch` promise resolves. Then it assigns the resolved value (the Response object) to `response`.
- Similarly, `await response.json()` waits for the JSON parsing to complete.

**Note:** While `await` pauses the function, it does **not** block the main thread. Other tasks (like event handlers) can still run.

---

## 4. Error Handling with `try/catch`

Since `await` can throw a rejection as an exception, you can handle errors using standard `try/catch` blocks.

```javascript
async function getUser(id) {
  try {
    const response = await fetch(`/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    // You could rethrow or return a fallback value
  }
}
```

If you don't use `try/catch`, any rejection will cause the promise returned by the async function to reject, and you can handle it with `.catch()` when calling the function.

```javascript
getUser(123).catch(err => console.error('Unhandled:', err));
```

---

## 5. Sequential vs. Parallel Execution

Because `await` pauses the function, if you use `await` on each asynchronous operation in sequence, they will run one after another. That may be necessary when each step depends on the previous one.

```javascript
async function processSequentially() {
  const a = await asyncTask1(); // waits for task1
  const b = await asyncTask2(); // waits for task2 (after task1)
  const c = await asyncTask3(); // waits for task3 (after task2)
  return a + b + c;
}
```

However, if the tasks are independent and can run concurrently, you should **not** await them one by one. Instead, start all the promises at once and then `await` them together using `Promise.all` (or `Promise.allSettled`).

### Running in Parallel with `Promise.all`

```javascript
async function processInParallel() {
  // Start both tasks immediately (they run concurrently)
  const promise1 = asyncTask1();
  const promise2 = asyncTask2();

  // Now wait for both to finish
  const [result1, result2] = await Promise.all([promise1, promise2]);

  return result1 + result2;
}
```

**Why is this faster?**  
Because `asyncTask1` and `asyncTask2` start at the same time. The total time is roughly the time of the slowest task, not the sum of both.

**Important:** Do not `await` each promise before creating the next one if you want parallelism. For example, this is sequential:

```javascript
// BAD – sequential
const result1 = await asyncTask1();
const result2 = await asyncTask2(); // starts only after task1 finishes
```

But this is parallel:

```javascript
// GOOD – parallel
const p1 = asyncTask1();
const p2 = asyncTask2();
const r1 = await p1;
const r2 = await p2;
```

Even better, use `Promise.all` to collect results and handle errors cleanly.

### Example: Fetching Multiple URLs Concurrently

```javascript
async function fetchAll(urls) {
  try {
    const promises = urls.map(url => fetch(url).then(res => res.json()));
    const results = await Promise.all(promises);
    console.log('All data:', results);
    return results;
  } catch (error) {
    console.error('One of the fetches failed:', error);
  }
}
```

If any promise in `Promise.all` rejects, the whole `Promise.all` rejects immediately. If you want to wait for all to settle (fulfilled or rejected) and then inspect results, use `Promise.allSettled` instead.

```javascript
async function fetchAllSettled(urls) {
  const promises = urls.map(url => fetch(url).then(res => res.json()));
  const results = await Promise.allSettled(promises);
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      console.log('Success:', result.value);
    } else {
      console.log('Failure:', result.reason);
    }
  });
}
```

---

## 6. Top‑Level `await` (Modules)

In modern JavaScript modules (e.g., using `<script type="module">` or ES modules in Node.js), you can use `await` at the top level without wrapping it in an async function. This is called **top‑level await**.

```javascript
// In a module
const response = await fetch('https://api.example.com/data');
const data = await response.json();
console.log(data);
```

This can simplify code but note that it blocks the module’s execution – other modules importing this one will wait.

---

## 7. Common Pitfalls and Best Practices

- **Forgetting `await`** – If you forget `await`, you get a promise, not the resolved value. This can lead to subtle bugs.
  ```javascript
  const data = fetchData(); // data is a Promise, not the actual data
  ```

- **Using `await` inside loops** – If you need to run async operations in sequence (e.g., each depending on previous), a `for` loop with `await` works fine. But for concurrent operations, use `Promise.all` with `map`.

- **Not handling errors** – Always wrap `await` in `try/catch` or attach a `.catch()` to the returned promise. Unhandled rejections can crash your app (or at least log warnings).

- **Mixing `.then()` and `await`** – It's possible, but try to stick to one style for readability.

---

## 8. Complete Example: Combining All Concepts

```javascript
// Simulated async tasks
function asyncTask(name, delay, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(`${name} failed`));
      } else {
        resolve(`${name} result`);
      }
    }, delay);
  });
}

async function runTasks() {
  try {
    // Sequential execution
    console.log('Starting sequential...');
    const seq1 = await asyncTask('Seq1', 1000);
    console.log(seq1);
    const seq2 = await asyncTask('Seq2', 500);
    console.log(seq2);

    // Parallel execution
    console.log('Starting parallel...');
    const p1 = asyncTask('Parallel1', 800);
    const p2 = asyncTask('Parallel2', 300);
    const [par1, par2] = await Promise.all([p1, p2]);
    console.log(par1, par2);

    // Parallel with error handling (one fails)
    const p3 = asyncTask('FailTask', 600, true); // this will reject
    const p4 = asyncTask('SafeTask', 400);
    try {
      const results = await Promise.all([p3, p4]);
      console.log(results);
    } catch (error) {
      console.error('Caught parallel error:', error.message);
    }

    // Using allSettled to handle failures gracefully
    const outcomes = await Promise.allSettled([p3, p4]);
    outcomes.forEach(out => {
      if (out.status === 'fulfilled') {
        console.log('Fulfilled:', out.value);
      } else {
        console.log('Rejected:', out.reason.message);
      }
    });

  } catch (error) {
    console.error('General error:', error);
  }
}

runTasks();
```

---

## Summary

- **`async` functions** always return a promise.
- **`await`** pauses execution until a promise settles, then gives its resolved value or throws the rejection.
- Use **`try/catch`** to handle errors from `await`.
- For independent async operations, start them concurrently and use **`Promise.all`** (or `Promise.allSettled`) with `await` to wait for all.
- Avoid sequential `await` when tasks don’t depend on each other – that slows down your code.

Async/await is the modern standard for writing asynchronous JavaScript. Once you grasp it, you’ll find your code cleaner and easier to reason about.