# SuperSimpleCursor

Super Simple Cursor made to test the WebComponents feature

## CDN

[jsDelivr minified cursor](https://cdn.jsdelivr.net/gh/TobyBridle/SuperSimpleCursor@302cdebbfc68197108202fea6e2e0e51d13d0f42/cursor.min.js)

# How to use?

You'll need to import the `cursor.min.js` using jsDelivr. This can be done with a script tag placed inside the `<head>`, as shown below:

```html
...
<head>
  <script src="https://cdn.jsdelivr.net/gh/TobyBridle/SuperSimpleCursor@302cdebbfc68197108202fea6e2e0e51d13d0f42/cursor.min.js"></script>
</head>
...
```

To get the cursor to appear, just place a `<custom-cursor></custom-cursor>` element at the top of your `<body>` tag. A cool feature is
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
- cursor-hovers (a string of space-seperated classnames that trigger the hover event)
- cursor-scroll-snap (Boolean value dictating whether or not scrolling lerps the cursor)

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
_For Example_

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

# Handling Hovers

## Basic Hover Customisation

With the new addition of hover control on 20/04/2022, the cursor's hover state can now be controlled. Changing transform properties is very limited, with only the attribute `data-cursor-scale` working to change the scale. However, using CSS for other properties works fine. To customise the hover, there are a few things that need to be done.

1. Define the classname for hover elements
2. Define the `cursor-hover-active` rule in CSS

For example, to change the colour of the cursor to red whilst hovering on a button, we could do the following:

```html
...
<head>
  <style>
    .cursor-hover-active {
      background: red;
    }
  </style>
</head>
<body>
  <custom-cursor cursor-hovers="cursor-button-hover"></custom-cursor>
  <button class="cursor-button-hover">Click Me!</button>
</body>
...
```

~~Changing the state of the cursor differently depending on the targetted element has not yet been implemented; however, it will be implemented
within the next version or two at most.~~

## Advanced Hover Customisation

To change the cursor class depending on the element that it is hovering, the element will need to specify a hover class. This is done
using the `data-cursor-hover-class` attribute on the element. The class that it uses must be declared within a stylesheet that is
declared cursor only (add `data-cursor-only` to the corresponding `<style>` or `<link>` tag). **Warning: **All** of the styles within
this stylesheet will be appended to the CSS within the Shadow DOM. Try to minimise the extra CSS by having a single file for all of the hover
classes (for example).**

Example of Advanced Hover Customisation:

```html
...
<head>
  <style data-cursor-only>
    .cursor-button-red {
      background: red;
    }

    .cursor-button-green {
      background: green;
    }
  </style>
</head>
<body>
  <!-- You must have a fixed class for this to work, even if the class does not exist -->
  <custom-cursor
    fixed-class="_"
    cursor-hovers="cursor-button-hover"
    cursor-color="yellow"
  ></custom-cursor>

  <button
    class="cursor-button-hover"
    data-cursor-hover-class="cursor-button-red"
  >
    I turn the cursor red!
  </button>
  <button
    class="cursor-button-hover"
    data-cursor-hover-class="cursor-button-green"
  >
    I turn the cursor green!
  </button>
</body>
...
```
