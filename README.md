# SuperSimpleCursor
Super Simple Cursor made to test the WebComponents feature

## CDN
[jsDelivr minified cursor](https://cdn.jsdelivr.net/gh/TobyBridle/SuperSimpleCursor/cursor.min.js)

# How to use?
You'll need to import the `cursor.min.js` using jsDelivr. This can be done with a script tag placed inside the `<head>`, as shown below:
```html
...
<head>
  <script src="https://cdn.jsdelivr.net/gh/TobyBridle/SuperSimpleCursor/cursor.min.js"></script>
</head>
...```

This script will then import one itself - `worker.min.js`. The worker is used for handling custom styles defined in stylesheets (either `<link>` or
`<style>` will work).

To get the cursor to appear, just place a `<custom-cursor></custom-cursor>` element anywhere. A cool feature is that more than one cursor can be used per
page, due to the fact that the script generates a unique ID (unless specified otherwise) for the classname of each cursor.
  
# Adding Custom Styles
You might be thinking - "How do I add custom styles to an element with a 'random' classname?". Luckily for you, there's a property which can override the 
default classname for the cursor. When adding the `<custom-cursor>` element, just define the `fixed-class` attribute and provide a valid property value.
*For Example*
```html
...
<body>
  <custom-cursor fixed-class="my-cursor"></custom-cursor>
</body>
...```
  
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
...```
  
A neat thing is that there is no wasted CSS. What do I mean by this? If you were to declare the same CSS property repeatedly (even if in different
stylesheets) then only the property at the bottom of the cascade would be used. Previously, the worker would append **all** properties which would
result in large stylesheets which were much harder to read.