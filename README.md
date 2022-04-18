# SuperSimpleCursor
Super Simple Cursor made to test the WebComponents feature

## CDN
[jsDelivr minified cursor](https://cdn.jsdelivr.net/gh/TobyBridle/SuperSimpleCursor@1f0eb6cedde9debc3df075746d11487263e5d64c/cursor.min.js)

# How to use?
You'll need to import the `cursor.min.js` using jsDelivr. This can be done with a script tag placed inside the `<head>`, as shown below:
```html
...
<head>
  <script src="https://cdn.jsdelivr.net/gh/TobyBridle/SuperSimpleCursor/cursor.min.js"></script>
</head>
...
```

~~This script will then import one itself - `worker.min.js`. The worker is used for handling custom styles defined
in stylesheets (either `<link>` or `<style>` will work).~~

To get the cursor to appear, just place a `<custom-cursor></custom-cursor>` element anywhere. A cool feature is
that more than one cursor can be used per page, due to the fact that the script generates a unique ID (unless specified otherwise)
for the classname of each cursor.

---

# Adding Custom Styles

## Basic Properties
There are some CSS properties which can be modified using the attributes of the cursor rather than a stylesheet. This is (as of 18/04/2022) the
current list of customisable properties.
- width (px)
- height (px)
- cursor-color (Used for the background of the cursor, any valid CSS colour)
- cursor-outline-thickness (px)
- cursor-outline-style (e.g solid, dotted)
- cursor-outline-color (any valid CSS colour)
- cursor-smoothing-position (Any value between 0 and 1 to be used in the lerp function, higher is more nimble and lower is less responsive)
~~cursor-hovers (a classname which when hovered triggers an event)~~

Example for changing the background of the cursor and removing the outline:
```html
...
<body>
  <custom-cursor cursor-color="pink" cursor-outline-style="none"></cursor>
</body>
...
```

## Advanced Customisation

You might be thinking - "How do I add custom styles to an element with a 'random' classname?".
Luckily for you, there's a property which can override the default classname for the cursor.
When adding the `<custom-cursor>` element, just define the `fixed-class` attribute and provide a valid property value.
*For Example*

```html
...
<body>
  <custom-cursor fixed-class="my-cursor"></custom-cursor>
</body>
...
```
  
This class can then be styled within a stylesheet (either internal or external) by using the classname that you defined.
Continuing on from the above example, it'd look something like this:
  
```html
<head>
...
<style>
  .my-cursor {
    background-color: pink;
  }
</style>
</head>
<body>
  <custom-cursor fixed-class="my-cursor"></custom-cursor>
</body>
...
```
  
A neat thing is that there is no wasted CSS. What do I mean by this? If you were to declare the same CSS property
repeatedly (even if in different stylesheets) then only the property at the bottom of the cascade would be used. Previously, the worker
would append **all** properties which would result in large stylesheets which were much harder to read.

---
