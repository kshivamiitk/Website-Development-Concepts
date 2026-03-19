# DOM Tree & Nodes: Understanding the Document Structure

The Document Object Model (DOM) represents an HTML document as a tree of nodes. Every part of the document – elements, text, attributes, comments – becomes a **node** in this tree. Understanding node types and their relationships is fundamental to traversing and manipulating web pages with JavaScript.

---

## 1. The DOM Tree

When a web page is loaded, the browser parses the HTML and constructs a hierarchical tree structure. Each box in that tree is a **node**. The topmost node is the `document` node, which contains the `<html>` element, and everything else branches out from there.

```
document
 └── html
      ├── head
      │    ├── title
      │    │    └── "My Page"
      │    └── ...
      └── body
           ├── h1
           │    └── "Welcome"
           ├── p
           │    ├── "Some text"
           │    └── a
           │         └── "link"
           └── ...
```

---

## 2. Types of Nodes

The DOM defines several node types. The most important for daily work are:

### Document Node
- Represents the entire document (the root).
- Accessed via `document`.
- It is the entry point to the DOM.

```javascript
console.log(document.nodeType); // 9 (Node.DOCUMENT_NODE)
```

### Element Nodes
- Represent HTML tags (e.g., `<div>`, `<p>`, `<a>`).
- Can have attributes and child nodes.
- Most of your DOM manipulation will involve elements.

```javascript
const div = document.createElement('div');
console.log(div.nodeType); // 1 (Node.ELEMENT_NODE)
```

### Text Nodes
- Represent the actual text content inside an element or between elements.
- Text nodes cannot have children.
- Whitespace (line breaks, spaces) also creates text nodes.

```javascript
const p = document.querySelector('p');
const textNode = p.firstChild;
console.log(textNode.nodeType); // 3 (Node.TEXT_NODE)
```

### Attribute Nodes
- Represent attributes of an element (e.g., `class="active"`, `id="main"`).
- In the modern DOM, attributes are not part of the tree as separate nodes; they are properties of element nodes. However, they can be accessed via `getAttributeNode()` or the legacy `attributes` property.
- For most purposes, you work with attributes directly on the element.

```javascript
const attrNode = element.getAttributeNode('id');
console.log(attrNode.nodeType); // 2 (Node.ATTRIBUTE_NODE)
```

### Other Node Types
- **Comment nodes** (`<!-- comment -->`) – type 8.
- **DocumentFragment** – type 11 (used for temporary containers).

---

## 3. Node Relationships: Parents, Children, Siblings

Nodes in the tree are connected through relationships. You can navigate using properties of the node object.

### Parent Node
- **`parentNode`** – returns the parent node (any node type).
- **`parentElement`** – returns the parent element (only if it's an element node; otherwise `null`).

```javascript
const child = document.querySelector('li');
const parent = child.parentNode;      // <ul> element
const grandParent = parent.parentNode; // maybe <body>
```

### Child Nodes
- **`childNodes`** – a **live** `NodeList` of all child nodes (including text, comments, etc.).
- **`children`** – a **live** `HTMLCollection` of only element children.
- **`firstChild`** / **`lastChild`** – first/last child node (any type).
- **`firstElementChild`** / **`lastElementChild`** – first/last child element.

```javascript
const list = document.querySelector('ul');
console.log(list.childNodes.length);   // includes text nodes (whitespace)
console.log(list.children.length);     // only <li> elements
console.log(list.firstElementChild);   // first <li>
```

### Sibling Nodes
- **`nextSibling`** / **`previousSibling`** – next/previous sibling node (any type).
- **`nextElementSibling`** / **`previousElementSibling`** – next/previous sibling element.

```javascript
const firstItem = document.querySelector('li');
const secondItem = firstItem.nextElementSibling; // the next <li>
const previous = secondItem.previousElementSibling; // back to first <li>
```

Because of whitespace text nodes, sibling navigation often involves `*ElementSibling` properties to skip text nodes.

---

## 4. Example: Exploring Node Relationships

```html
<div id="container">
  <p>Hello <strong>world</strong>!</p>
</div>
```

```javascript
const container = document.getElementById('container');

// childNodes includes text nodes (the newline after <div> and before <p>)
console.log(container.childNodes.length); // 3: text, <p>, text

// children only counts elements
console.log(container.children.length);   // 1 (<p>)

const p = container.firstElementChild;

// p's child nodes:
console.log(p.childNodes); // NodeList(3): text "Hello ", <strong>, text "!"
console.log(p.firstChild.nodeValue); // "Hello "
console.log(p.lastChild.nodeValue);  // "!"

// sibling navigation
const strong = p.querySelector('strong');
console.log(strong.parentNode === p);        // true
console.log(strong.nextSibling.nodeValue);   // "!" (text node)
console.log(strong.nextElementSibling);      // null (no element after strong inside p)
```

---

## 5. Practical Tips

- **Whitespace matters**: When you use `childNodes` or `firstChild`, be aware that indentation and line breaks create text nodes. Use element‑specific properties (`children`, `firstElementChild`, `nextElementSibling`) to avoid surprises.
- **Live collections**: Both `childNodes` and `children` are live – they automatically update when the DOM changes. This can be efficient but can also lead to unexpected results if you modify the DOM while iterating.
- **Node types**: You can check a node’s type with `node.nodeType` and compare to constants like `Node.ELEMENT_NODE` (1), `Node.TEXT_NODE` (3), etc.

---

## Summary

- The **DOM tree** is composed of nodes of different types: document, element, text, attribute, etc.
- **Element nodes** are the building blocks you manipulate most often.
- **Text nodes** contain the actual text and are often created by whitespace.
- **Relationships** (parent, child, sibling) let you traverse the tree using properties like `parentNode`, `childNodes`, `nextSibling`, etc.
- Prefer element‑specific properties (`children`, `firstElementChild`, `nextElementSibling`) when you want to ignore text nodes.

Mastering these concepts gives you the power to navigate and manipulate any part of the document programmatically.