# JavaScript Strings & Template Literals, Numbers & Math

In this guide, we'll explore two fundamental data types in JavaScript: **strings** for text manipulation, and **numbers** for mathematical operations. You'll learn how to work with them effectively, including modern features like template literals and the versatile Math object.

---

## Part 1: Strings & Template Literals

Strings represent textual data. JavaScript provides a rich set of methods to inspect, modify, and combine strings. Template literals (ES6) make working with strings much more convenient.

### 1.1 Creating Strings

You can create strings using single quotes, double quotes, or backticks (template literals).

```javascript
let single = 'Hello';
let double = "World";
let backtick = `Hello World`; // template literal
```

### 1.2 String Properties and Methods

#### `length` – number of characters

```javascript
let str = "JavaScript";
console.log(str.length); // 10
```

#### Accessing Characters

```javascript
console.log(str[0]);      // "J" (bracket notation)
console.log(str.charAt(4)); // "S" (charAt method)
```

#### Changing Case

```javascript
console.log(str.toUpperCase()); // "JAVASCRIPT"
console.log(str.toLowerCase()); // "javascript"
```

#### Finding Substrings

- **`indexOf(substring, fromIndex)`** – returns the first index where `substring` begins, or -1 if not found.
- **`lastIndexOf(substring)`** – searches from the end.
- **`includes(substring, position)`** – returns `true` if `substring` is found (ES6).
- **`startsWith(substring)`** / **`endsWith(substring)`** – check if string starts/ends with the given substring (ES6).

```javascript
let text = "Hello, world!";
console.log(text.indexOf("world"));     // 7
console.log(text.includes("world"));    // true
console.log(text.startsWith("Hello"));  // true
console.log(text.endsWith("!"));        // true
```

#### Extracting Substrings

- **`slice(start, end)`** – extracts from `start` (inclusive) to `end` (exclusive). Negative indices count from the end.
- **`substring(start, end)`** – similar to `slice` but treats negative indices as 0.
- **`substr(start, length)`** – (legacy) extracts `length` characters starting from `start`. Avoid using.

```javascript
let str = "JavaScript";
console.log(str.slice(0, 4));    // "Java"
console.log(str.slice(-6));       // "Script"
console.log(str.substring(4, 10)); // "Script" (order doesn't matter)
```

#### Splitting a String into an Array

- **`split(separator, limit)`** – splits the string into an array based on the separator.

```javascript
let csv = "apple,banana,orange";
let fruits = csv.split(","); // ["apple", "banana", "orange"]
let chars = "hello".split(""); // ["h","e","l","l","o"]
```

#### Replacing Substrings

- **`replace(searchValue, newValue)`** – replaces the **first** occurrence (or all if searchValue is a regex with global flag).
- **`replaceAll(searchValue, newValue)`** – replaces all occurrences (ES2021). Works with strings or regex (if global).

```javascript
let sentence = "I like cats. Cats are great.";
let newSentence = sentence.replace("cats", "dogs");    // "I like dogs. Cats are great."
let all = sentence.replaceAll(/cats/gi, "dogs");       // "I like dogs. Dogs are great."
```

#### Trimming Whitespace

- **`trim()`** – removes whitespace from both ends.
- **`trimStart()`** / **`trimEnd()`** – remove from start or end only.

```javascript
let padded = "  hello  ";
console.log(padded.trim());       // "hello"
console.log(padded.trimStart());  // "hello  "
```

#### Concatenating Strings

- **`concat(str1, str2, ...)`** – joins strings (but `+` or template literals are usually simpler).

```javascript
let str1 = "Hello";
let str2 = "World";
console.log(str1.concat(", ", str2, "!")); // "Hello, World!"
```

#### Repeating a String

- **`repeat(count)`** – returns a new string repeated `count` times.

```javascript
let star = "*";
console.log(star.repeat(5)); // "*****"
```

#### Padding

- **`padStart(targetLength, padString)`** / **`padEnd(targetLength, padString)`** – pads the current string from the start/end with another string until the target length is reached.

```javascript
let num = "7";
console.log(num.padStart(3, "0")); // "007"
console.log(num.padEnd(3, "0"));   // "700"
```

---

### 1.3 Template Literals (ES6)

Template literals are string literals enclosed by backticks (\` \`) instead of quotes. They offer three main features:

#### a) String Interpolation

You can embed expressions using `${expression}`. The expression can be any valid JavaScript code.

```javascript
let name = "Alice";
let age = 30;
let message = `My name is ${name} and I am ${age} years old.`;
console.log(message); // "My name is Alice and I am 30 years old."

// You can even call functions inside ${}
let price = 19.99;
let tax = 0.08;
console.log(`Total: $${(price * (1 + tax)).toFixed(2)}`); // "Total: $21.59"
```

#### b) Multi‑line Strings

Template literals preserve line breaks without needing escape characters.

```javascript
let multiLine = `This is line one.
This is line two.
And this is line three.`;
console.log(multiLine);
/* Output:
This is line one.
This is line two.
And this is line three.
*/
```

#### c) Tagged Templates (Advanced)

A **tag** is a function that processes a template literal. The tag receives the literal strings and the interpolated values, allowing you to modify the output.

```javascript
function highlight(strings, ...values) {
    // strings: array of literal parts
    // values: array of interpolated expressions
    let result = "";
    strings.forEach((str, i) => {
        result += str;
        if (i < values.length) {
            result += `<strong>${values[i]}</strong>`;
        }
    });
    return result;
}

let name = "Bob";
let age = 25;
let html = highlight`Hello, my name is ${name} and I am ${age} years old.`;
console.log(html);
// "Hello, my name is <strong>Bob</strong> and I am <strong>25</strong> years old."
```

Tagged templates are used in libraries like `styled-components` (CSS-in-JS) and for internationalization (i18n) where you need to transform interpolated values.

---

## Part 2: Numbers & Math

JavaScript has a single number type: **IEEE 754 double‑precision floating point** (64‑bit). This section covers methods available on numbers and the built‑in `Math` object.

### 2.1 Number Methods

#### `toFixed(digits)` – Format with Fixed Decimal Places

Returns a string representing the number with `digits` digits after the decimal point. Rounds when necessary.

```javascript
let num = 123.456;
console.log(num.toFixed(2)); // "123.46"
console.log(num.toFixed(0)); // "123"
```

#### `toPrecision(precision)` – Format to a Specified Length

Returns a string representing the number to a specified total number of significant digits.

```javascript
let num = 123.456;
console.log(num.toPrecision(4)); // "123.5"
console.log(num.toPrecision(2)); // "1.2e+2" (scientific notation)
```

#### `toString(radix)` – Convert to a String in a Given Base

```javascript
let num = 255;
console.log(num.toString(16)); // "ff" (hexadecimal)
console.log(num.toString(2));  // "11111111" (binary)
```

#### Parsing Numbers from Strings

- **`parseInt(string, radix)`** – parses an integer from the start of the string. Ignores leading whitespace and stops at the first non‑digit (unless radix is specified). Returns `NaN` if no digits are found.
- **`parseFloat(string)`** – parses a floating‑point number.

```javascript
console.log(parseInt("42px"));      // 42
console.log(parseInt("1010", 2));   // 10 (binary)
console.log(parseFloat("3.14 meters")); // 3.14
console.log(parseInt("abc"));       // NaN
```

**Important:** `parseInt` and `parseFloat` are global functions, not methods of Number, but are closely related.

#### Checking for Numbers

- **`isNaN(value)`** – returns `true` if the value is `NaN` (after coercing to a number). Avoid because it coerces non‑numbers. Use `Number.isNaN` (ES6) instead.
- **`Number.isNaN(value)`** – returns `true` only if the value is exactly `NaN`.
- **`isFinite(value)`** – returns `true` if the value is a finite number (after coercion). Use `Number.isFinite` for strict check.

```javascript
console.log(Number.isNaN(NaN));     // true
console.log(Number.isNaN("hello")); // false (doesn't coerce)
console.log(Number.isFinite(42));   // true
console.log(Number.isFinite(Infinity)); // false
```

- **`Number.isInteger(value)`** – returns `true` if the value is an integer.

```javascript
console.log(Number.isInteger(42));   // true
console.log(Number.isInteger(42.0)); // true
console.log(Number.isInteger(42.5)); // false
```

### 2.2 The Math Object

`Math` is a built‑in object that provides mathematical constants and functions. All its properties and methods are static.

#### Constants

```javascript
Math.PI   // 3.141592653589793
Math.E    // Euler's number: 2.718281828459045
Math.LN2  // natural log of 2: 0.6931471805599453
Math.LN10 // natural log of 10: 2.302585092994046
Math.SQRT2 // square root of 2: 1.4142135623730951
// ... and others
```

#### Rounding Methods

- **`Math.round(x)`** – rounds to the nearest integer (0.5 goes up).
- **`Math.floor(x)`** – rounds **down** to the nearest integer.
- **`Math.ceil(x)`** – rounds **up** to the nearest integer.
- **`Math.trunc(x)`** – removes the fractional part (ES6), effectively truncates towards zero.

```javascript
console.log(Math.round(4.7)); // 5
console.log(Math.round(4.4)); // 4
console.log(Math.floor(4.9)); // 4
console.log(Math.ceil(4.1));  // 5
console.log(Math.trunc(4.9)); // 4
console.log(Math.trunc(-4.9)); // -4 (different from floor: floor(-4.9) = -5)
```

#### Random Numbers

- **`Math.random()`** – returns a pseudo‑random number between **0 (inclusive) and 1 (exclusive)**.

```javascript
let rand = Math.random(); // e.g., 0.234567
```

**Common patterns:**
- Random integer between `min` (inclusive) and `max` (exclusive):
  ```javascript
  function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
  }
  ```
- Random integer between `min` and `max` **inclusive**:
  ```javascript
  function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  ```

#### Min / Max

- **`Math.max(a, b, c, ...)`** – returns the largest of the given numbers.
- **`Math.min(a, b, c, ...)`** – returns the smallest.

```javascript
console.log(Math.max(10, 5, 20, 8)); // 20
console.log(Math.min(10, 5, 20, 8)); // 5

// With arrays, use spread:
let numbers = [3, 7, 2, 9];
console.log(Math.max(...numbers)); // 9
```

#### Power, Square Root, Absolute

- **`Math.pow(base, exponent)`** – returns base raised to exponent.
- **`Math.sqrt(x)`** – returns the square root.
- **`Math.cbrt(x)`** – cube root (ES6).
- **`Math.abs(x)`** – absolute value.

```javascript
console.log(Math.pow(2, 3));   // 8
console.log(Math.sqrt(16));    // 4
console.log(Math.abs(-5));     // 5
```

#### Trigonometric Functions

- `Math.sin(x)`, `Math.cos(x)`, `Math.tan(x)` – argument in radians.
- `Math.asin(x)`, `Math.acos(x)`, `Math.atan(x)` – inverse.
- `Math.atan2(y, x)` – returns the angle in radians from the x‑axis to the point (x, y).

```javascript
let angle = Math.PI / 2; // 90°
console.log(Math.sin(angle)); // 1
```

#### Logarithms and Exponentials

- `Math.log(x)` – natural logarithm (base e).
- `Math.log10(x)` – base 10 logarithm (ES6).
- `Math.log2(x)` – base 2 logarithm (ES6).
- `Math.exp(x)` – e^x.

#### Other Useful Methods

- `Math.sign(x)` – returns 1, -1, 0, or NaN indicating the sign (ES6).
- `Math.clz32(x)` – counts leading zero bits in a 32‑bit integer (rarely used).

---

## Summary

- **Strings** can be created with quotes or backticks. Master methods like `slice`, `split`, `replace`, `trim`, and the new `replaceAll`.
- **Template literals** make string interpolation and multi‑line strings effortless. **Tagged templates** allow custom processing of template strings.
- **Numbers** have methods like `toFixed`, `toPrecision`, and `toString`. Use `parseInt` and `parseFloat` to convert strings.
- The **Math** object provides constants and functions for rounding, random numbers, min/max, powers, roots, trigonometry, and more.

Practice by combining these concepts: build a random quote generator, format currency, or parse user input. Understanding strings and numbers thoroughly is essential for any web developer.