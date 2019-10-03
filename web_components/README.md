
https://developer.mozilla.org/en-US/docs/Web/Web_Components


npm init stecil
npm run test
npm start


Stencil.js spits out native, vanilla-JS web components.
These components have (vanilla) JavaScript added to them that enhances the web component experience by:

- Loading component code lazily (i.e. source code gets only pulled into the page if it's really needed => 
    This reduces the overall bundle size)

- Loading required polyfills automatically for browsers that need it

- Re-rendering the web (component) DOM efficiently (i.e. the DOM gets updated with as minimal impact as possible, 
    to reduce the amount of work JS and the browser have to do)
    
