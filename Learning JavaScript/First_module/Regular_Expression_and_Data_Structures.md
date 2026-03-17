# Regular Expressions & ES6+ Data Structures (Map, Set, WeakMap, WeakSet)

This guide covers two important topics: **Regular Expressions** for pattern matching in strings, and the **ES6+ data structures** (`Map`, `Set`, `WeakMap`, `WeakSet`) that extend JavaScript's capabilities beyond plain objects and arrays.

---

## Part 1: Regular Expressions (RegEx)

Regular expressions are patterns used to match character combinations in strings. They are incredibly useful for validation, searching, replacing, and extracting data from text.

### 1.1 Creating a Regular Expression

You can create a regex in two ways:

#### a) Literal notation (using slashes)

```javascript
let pattern = /hello/;
let withFlags = /hello/gi; // g = global, i = case-insensitive
```

#### b) Constructor with `new RegExp()`

```javascript
let pattern = new RegExp('hello');
let withFlags = new RegExp('hello', 'gi');
```

The literal notation is preferred when the pattern is static; the constructor is useful when the pattern is dynamic (e.g., built from a variable).

### 1.2 Flags

Flags modify how the pattern is applied:

- `g` – **global**: find all matches rather than stopping after the first.
- `i` – **case‑insensitive**: ignore case.
- `m` – **multiline**: treat beginning (`^`) and end (`$`) characters as working across multiple lines.
- `s` – **dotall**: allows `.` to match newline characters.
- `u` – **unicode**: treat pattern as a sequence of Unicode code points.
- `y` – **sticky**: matches only from the index indicated by the `lastIndex` property.

### 1.3 Methods Using Regular Expressions

There are several methods that work with regex – both on the regex object itself and on strings.

#### `regex.test(string)` – Returns `true` or `false`

Checks if there is at least one match in the string.

```javascript
let pattern = /world/;
console.log(pattern.test('hello world')); // true
console.log(pattern.test('hello there')); // false
```

#### `regex.exec(string)` – Returns detailed match information

Returns an array containing the matched text and any captured groups, plus properties `index` (match position) and `input` (original string). If the regex has the `g` flag, each call to `exec` returns the next match.

```javascript
let regex = /l+/g;
let str = 'hello world';
let match;
while ((match = regex.exec(str)) !== null) {
    console.log(`Found "${match[0]}" at index ${match.index}`);
}
// Found "ll" at index 2
// Found "l" at index 9
```

#### `string.match(regex)` – Returns array of matches

- Without `g` flag: returns the first match with groups (like `exec` result).
- With `g` flag: returns an array of all matched substrings.

```javascript
let str = 'The rain in Spain stays mainly in the plain';
console.log(str.match(/ain/g)); // ["ain", "ain", "ain"]
console.log(str.match(/ain/));   // ["ain", index: 5, input: "...", groups: undefined]
```

#### `string.search(regex)` – Returns index of first match (or -1)

```javascript
let str = 'hello world';
console.log(str.search(/world/)); // 6
console.log(str.search(/xyz/));   // -1
```

#### `string.replace(regex, replacement)` – Replace matches

Replaces matched substrings. Replacement can be a string or a function.

```javascript
let str = 'Hello, World!';
console.log(str.replace(/world/i, 'JavaScript')); // "Hello, JavaScript!"

// Using a function
let hyphenated = '2024-03-17'.replace(/(\d{4})-(\d{2})-(\d{2})/, (match, year, month, day) => {
    return `${day}/${month}/${year}`;
});
console.log(hyphenated); // "17/03/2024"
```

#### `string.split(regex)` – Split string by regex

```javascript
let str = 'apple, banana; orange';
let parts = str.split(/[,;]\s*/); // ["apple", "banana", "orange"]
```

### 1.4 Common Patterns and Examples

Here are some frequently used regex patterns:

#### Email Validation (simple)

```javascript
let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log(emailPattern.test('user@example.com')); // true
console.log(emailPattern.test('invalid-email'));    // false
```

#### Phone Number (US format: 123-456-7890)

```javascript
let phonePattern = /^\d{3}-\d{3}-\d{4}$/;
console.log(phonePattern.test('555-123-4567')); // true
```

#### URL

```javascript
let urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
```

#### Extracting Numbers from a String

```javascript
let text = 'Order 123, price 45.67';
let numbers = text.match(/\d+(\.\d+)?/g); // ["123", "45.67"]
```

#### Password Strength (at least 8 chars, one uppercase, one lowercase, one digit)

```javascript
let strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
```

### 1.5 Regex Cheat Sheet

- **Character classes**: `\d` (digit), `\w` (word char), `\s` (whitespace), `.` (any char except newline)
- **Quantifiers**: `*` (0+), `+` (1+), `?` (0 or 1), `{n}` (exactly n), `{n,}` (n or more), `{n,m}` (between n and m)
- **Anchors**: `^` (start), `$` (end), `\b` (word boundary)
- **Groups**: `(abc)` – capturing group, `(?:abc)` – non‑capturing group
- **Alternation**: `a|b` – match a or b
- **Escape character**: `\` to escape special characters like `\.`, `\*`, etc.

---

## Part 2: ES6+ Data Structures – Map, Set, WeakMap, WeakSet

JavaScript traditionally used plain objects for key‑value pairs and arrays for ordered collections. ES6 introduced new built‑in data structures that solve specific limitations.

### 2.1 Map

A `Map` holds key‑value pairs where **keys can be any type** (including objects, functions, or primitives). It remembers the original insertion order.

#### Creating and Using a Map

```javascript
let map = new Map();

// Adding entries
map.set('name', 'Alice');
map.set(42, 'The answer');
map.set({ id: 1 }, 'Some object');

// Getting values
console.log(map.get('name')); // "Alice"
console.log(map.get(42));     // "The answer"

// Checking existence
console.log(map.has(42));     // true

// Size
console.log(map.size);        // 3

// Deleting
map.delete(42);
console.log(map.size);        // 2

// Iterating
for (let [key, value] of map) {
    console.log(key, value);
}

// Using forEach
map.forEach((value, key) => {
    console.log(key, value);
});

// Getting keys, values, entries
console.log([...map.keys()]);   // ["name", { id: 1 }]
console.log([...map.values()]); // ["Alice", "Some object"]
```

#### Differences from Plain Objects

| Feature                | Object                                | Map                                    |
|------------------------|---------------------------------------|----------------------------------------|
| Key types              | Strings or Symbols                    | Any (including objects, functions)     |
| Order                  | Not guaranteed (own properties)       | Insertion order is preserved           |
| Size                   | Manual (`Object.keys(obj).length`)    | Built‑in `size` property               |
| Iteration              | `for...in` or `Object.keys` etc.      | Directly iterable (entries, keys, values) |
| Performance            | Optimized for string keys              | Better for frequent additions/removals of arbitrary keys |
| Prototype inheritance  | Inherits properties from prototype     | No prototype chain by default          |

**When to use Map:**
- When keys are not strings or are unknown until runtime.
- When you need to frequently add/remove key‑value pairs.
- When insertion order matters.

### 2.2 Set

A `Set` is a collection of **unique values** (no duplicates). Values can be any type.

#### Creating and Using a Set

```javascript
let set = new Set();

// Adding values
set.add(1);
set.add(2);
set.add(2); // ignored – already present
set.add('hello');
set.add({ name: 'Bob' });

// Checking existence
console.log(set.has(1));      // true
console.log(set.has(3));      // false

// Size
console.log(set.size);        // 4 (1,2,'hello', object)

// Deleting
set.delete(2);
console.log(set.size);        // 3

// Iterating
for (let value of set) {
    console.log(value);
}

set.forEach(value => console.log(value));

// Convert to array
let arr = [...set]; // or Array.from(set)
```

#### Differences from Arrays

| Feature           | Array                          | Set                                |
|-------------------|--------------------------------|------------------------------------|
| Uniqueness        | Allows duplicates              | Automatically ensures uniqueness   |
| Access by index   | Yes (`arr[0]`)                 | No direct index access             |
| Performance for existence | `indexOf` or `includes` is O(n) | `has()` is O(1) on average         |
| Order             | Insertion order preserved      | Insertion order preserved          |

**When to use Set:**
- When you need to store unique values (e.g., user IDs, tags).
- For fast membership testing.
- To remove duplicates from an array: `[...new Set(array)]`.

### 2.3 WeakMap

`WeakMap` is similar to `Map`, but with important differences:
- **Keys must be objects** (not primitives).
- **Weak references**: if there are no other references to a key object, it can be garbage‑collected, and the entry is automatically removed from the WeakMap.
- **Not iterable** – you cannot loop over keys or values, and there is no `size` property or `clear()` method.
- Methods: `set(key, value)`, `get(key)`, `has(key)`, `delete(key)`.

#### Use Cases for WeakMap

- **Private data**: store private data associated with an object without preventing garbage collection.
- **Caching**: cache results of expensive operations on objects without keeping them alive.
- **DOM metadata**: store data for DOM elements without causing memory leaks when elements are removed.

```javascript
let weakMap = new WeakMap();

let obj = {};
weakMap.set(obj, 'secret data');

console.log(weakMap.get(obj)); // 'secret data'

obj = null; // now the object is eligible for garbage collection
// The entry will be removed automatically later
```

### 2.4 WeakSet

`WeakSet` is analogous to `Set` but with weak references:
- **Values must be objects**.
- **Weak references** – if no other references exist, the object can be garbage‑collected and removed from the WeakSet.
- **Not iterable**, no `size`, no `clear()`.
- Methods: `add(value)`, `has(value)`, `delete(value)`.

#### Use Cases for WeakSet

- **Marking objects** without affecting garbage collection (e.g., to indicate that an object has been processed).
- **Avoiding memory leaks** when storing object references temporarily.

```javascript
let weakSet = new WeakSet();
let obj1 = { id: 1 };
let obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

obj1 = null; // obj1 can be garbage‑collected, and it will disappear from weakSet
```

### 2.5 Summary Comparison

| Feature                | Object       | Map          | WeakMap      | Array        | Set          | WeakSet      |
|------------------------|--------------|--------------|--------------|--------------|--------------|--------------|
| Key types              | String/Symbol| Any          | Object       | N/A (indexes)| N/A (values) | Object       |
| Value types            | Any          | Any          | Any          | Any          | Any          | Object       |
| Order                  | Own props order | Insertion   | Not observable| Insertion   | Insertion    | Not observable|
| Iterable               | No (but can get keys) | Yes    | No           | Yes          | Yes          | No           |
| Size                   | Manual       | `size`       | No           | `length`     | `size`       | No           |
| Garbage collection of keys/values | No   | No           | Yes          | N/A          | No           | Yes          |
| Use case               | General key‑value | Arbitrary keys, frequent changes | Private data, caching | Ordered list, duplicates allowed | Unique values, fast lookup | Marking objects, memory‑safe |

---

## Conclusion

- **Regular expressions** are a powerful tool for string manipulation. Master the syntax and the methods (`test`, `exec`, `match`, `replace`, `search`, `split`). Practice with real‑world patterns.
- **Maps and Sets** offer cleaner and more efficient alternatives to objects and arrays in many scenarios. Use `Map` for dynamic key‑value storage, and `Set` for collections of unique values.
- **WeakMap and WeakSet** are specialized for cases where you need to associate data with objects without preventing garbage collection – ideal for caches, private data, and DOM element metadata.

Experiment with these concepts in your projects – for instance, use a `Set` to manage unique tags, a `Map` to cache API responses by request object, and regex to validate form inputs. Happy coding!