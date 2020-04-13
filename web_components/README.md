
https://developer.mozilla.org/en-US/docs/Web/Web_Components

## Web components

- custom HTML element - registering own HTML tags
- Shadow DOM - separate DOM node tree
- templates and slots 


## Why?

- encapsulate logic 
- easy to maintain and understand
- reused across a page and apps or projects


## Solutions

- vanilla JS
- StencilJS
- Angular Elements


## vanilla-js-tooltip
- define a new element: ```customElements.define('uc-tooltip', Tooltip);```
- add a class extends HTMLElement or a specific element like HTMLAnchorElement ```<a is="component>``` 
- the lifecycle of an element:
    - constructor - basic initialization 
    - connectedElement - DOM initialization
    - disconnectedElement - clean up
    - attributeChangeCallback - update data and DOM based on attribute changes
- add an attribute 
    - ``` getAttribute('name') ```
    - ``` static get observedAttributes()  -  attributeChangedCallback```
- use the shadow DOM if desired ``` this.attachShadow({mode: "open"}) ```
- use templates ``` <slot>Some default</slot> ```


## vanilla-js-modal


## StencilJS

```
npm init stencil
npm run test
npm start
npm run build
```

Stencil.js spits out native, vanilla-JS web components.

These components have (vanilla) JavaScript added to them that enhances the web component experience by:

- Loading component code lazily (i.e. source code gets only pulled into the page if it's really needed => 
    This reduces the overall bundle size)

- Loading required polyfills automatically for browsers that need it

- Re-rendering the web (component) DOM efficiently (i.e. the DOM gets updated with as minimal impact as possible, 
    to reduce the amount of work JS and the browser have to do)
    

## stencil-side-drawer


## stencil-stocks


