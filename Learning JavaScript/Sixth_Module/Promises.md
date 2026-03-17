# JavaScript Promises: A Comprehensive Guide

Promises are a modern way to handle asynchronous operations in JavaScript. They provide a cleaner, more robust alternative to callbacks, especially when dealing with multiple asynchronous steps. This guide explains how to create, consume, and combine promises, including all the important static methods.

---

## 1. What is a Promise?

A **Promise** is an object representing the eventual completion (or failure) of an asynchronous operation. It acts as a placeholder for a value that may not be available yet.

A promise can be in one of three states:

- **pending** – initial state, neither fulfilled nor rejected.
- **fulfilled** – the operation completed successfully, and the promise has a resulting value.
- **rejected** – the operation failed, and the promise has an error reason.

Once a promise is settled (fulfilled or rejected), it cannot change state again.

---

## 2. Creating a Promise

You create a promise using the `new Promise` constructor, which takes an **executor function** with two parameters: `resolve` and `reject`. You call `resolve(value)` when the operation succeeds, or `reject(error)` when it fails.

```javascript
const myPromise = new Promise((resolve, reject) => {
  // Asynchronous operation (e.g., setTimeout, fetch, file read)
  setTimeout(() => {
    const success = true; // change to false to test rejection
    if (success) {
      resolve('Operation succeeded!');
    } else {
      reject(new Error('Operation failed!'));
    }
  }, 1000);
});
```

- The executor runs immediately when the promise is created.
- You typically perform an async task inside it and call `resolve` or `reject` when done.

---

## 3. Consuming a Promise: `.then()`, `.catch()`, `.finally()`

Once you have a promise, you attach handlers using:

- **`.then(onFulfilled, onRejected)`** – handles fulfillment and optionally rejection.
- **`.catch(onRejected)`** – handles rejection (syntactic sugar for `.then(null, onRejected)`).
- **`.finally(onFinally)`** – runs regardless of fulfillment or rejection, useful for cleanup.

```javascript
myPromise
  .then(result => {
    console.log('Fulfilled:', result);
  })
  .catch(error => {
    console.error('Rejected:', error.message);
  })
  .finally(() => {
    console.log('Cleanup (always runs)');
  });
```

**Note:** `.then()` and `.catch()` each return a **new promise**, allowing chaining.

---

## 4. Chaining Promises

One of the most powerful features of promises is the ability to chain asynchronous operations. Each `.then()` returns a new promise, and you can return a value or another promise from the handler.

```javascript
function asyncTask1() {
  return new Promise(resolve => {
    setTimeout(() => resolve(10), 1000);
  });
}

function asyncTask2(num) {
  return new Promise(resolve => {
    setTimeout(() => resolve(num * 2), 1000);
  });
}

asyncTask1()
  .then(result1 => {
    console.log('Result1:', result1); // 10
    return asyncTask2(result1);
  })
  .then(result2 => {
    console.log('Result2:', result2); // 20
    return result2 + 5;
  })
  .then(result3 => {
    console.log('Result3:', result3); // 25
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

- If you return a value from a `.then()` handler, it becomes the fulfillment value of the promise returned by that `.then()`.
- If you return a promise, the next `.then()` waits for it to settle.

---

## 5. Error Handling in Chains

Errors (and rejections) propagate down the chain until they are caught by a `.catch()`. You can place a `.catch()` at the end to handle any error from any step, or you can insert multiple catches for more granular handling.

```javascript
doSomething()
  .then(result => doSomethingElse(result))
  .then(newResult => doThirdThing(newResult))
  .catch(error => {
    // Catches errors from any of the above steps
    console.error('Something went wrong:', error);
  });
```

If you want to recover from an error, you can return a value or a promise from a `.catch()`:

```javascript
asyncTask1()
  .then(result => {
    throw new Error('Oops!');
  })
  .catch(error => {
    console.log('Recovering...');
    return 'default value';
  })
  .then(value => {
    console.log(value); // 'default value'
  });
```

---

## 6. Static Methods for Combining Promises

JavaScript provides several utility methods to work with multiple promises.

### `Promise.all(iterable)`

- Takes an iterable (usually an array) of promises.
- Returns a promise that:
  - **Fulfills** with an array of fulfillment values **when all** input promises have fulfilled, in the same order.
  - **Rejects** immediately with the reason of the **first** promise that rejects (ignoring the others).

```javascript
const p1 = Promise.resolve(3);
const p2 = 42; // non‑promise values are treated as already fulfilled
const p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([p1, p2, p3]).then(values => {
  console.log(values); // [3, 42, "foo"]
}).catch(error => {
  console.error('One rejected:', error);
});
```

**Use case:** Waiting for multiple independent async operations that depend on each other (e.g., fetch several API endpoints and then combine data).

### `Promise.race(iterable)`

- Returns a promise that settles (fulfills or rejects) as soon as **one** of the input promises settles, with its value or reason.

```javascript
const slow = new Promise(resolve => setTimeout(() => resolve('slow'), 2000));
const fast = new Promise(resolve => setTimeout(() => resolve('fast'), 1000));

Promise.race([slow, fast]).then(result => {
  console.log(result); // "fast" (after 1 second)
});
```

**Use case:** Timeouts – race an async operation with a promise that rejects after a timeout.

### `Promise.allSettled(iterable)` (ES2020)

- Returns a promise that fulfills **after all** input promises have settled (either fulfilled or rejected).
- The fulfillment value is an array of objects, each with a `status` (`"fulfilled"` or `"rejected"`) and either `value` or `reason`.

```javascript
const p1 = Promise.resolve('success');
const p2 = Promise.reject('error');
const p3 = Promise.resolve('another success');

Promise.allSettled([p1, p2, p3]).then(results => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 'success' },
  //   { status: 'rejected', reason: 'error' },
  //   { status: 'fulfilled', value: 'another success' }
  // ]
});
```

**Use case:** When you need to know the outcome of all promises, regardless of failures (e.g., batch operations where you want to report partial success).

### `Promise.any(iterable)` (ES2021)

- Returns a promise that fulfills with the value of the **first** fulfilled promise.
- If **all** promises reject, it rejects with an `AggregateError` (an array of rejection reasons).

```javascript
const p1 = Promise.reject('Error 1');
const p2 = new Promise(resolve => setTimeout(() => resolve('fast success'), 100));
const p3 = Promise.reject('Error 3');

Promise.any([p1, p2, p3]).then(result => {
  console.log(result); // "fast success" (after 100 ms)
}).catch(err => {
  console.error(err.errors); // if all reject, you get an AggregateError
});
```

**Use case:** You want the first successful result, and you don’t care if some fail (e.g., trying multiple mirrors of a resource).

---

## 7. Summary

| Method               | Waits for ...                                  | Fulfills when ...                             | Rejects when ...                         |
|----------------------|------------------------------------------------|-----------------------------------------------|------------------------------------------|
| `Promise.all`        | All promises                                    | All fulfill → array of values                 | Any rejects → first rejection reason     |
| `Promise.race`       | The first settled promise                       | The first promise fulfills                    | The first promise rejects                |
| `Promise.allSettled` | All promises                                    | All settle → array of result objects          | Never rejects (always fulfills)          |
| `Promise.any`        | The first fulfilled promise                     | First fulfillment value                        | All reject → `AggregateError`            |

Promises are the foundation for modern asynchronous JavaScript. Mastering them will make you comfortable with `async/await` (which is syntactic sugar over promises) and enable you to write clean, maintainable async code.