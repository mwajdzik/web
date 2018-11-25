### Selectors
* div
* .blog-post
* #main-title
* [disabled]

### Combinators:

* Adjacent Sibling (all p that are directly after h2)
    h2 + p {color: red;}

* General Sibling  (all p that are after h2)
    h2 ~ p {color: red;}

* Child (all p that are directly inside of div)
    div > p {color: red;}

* Descendant (all p that are inside of div - directly or not)
    div p {color: red;}

### Box model

* margin
* border
* padding
* content

* Margin collapsing - bigger margin wins if two elements are next to each other

* width and height do not include padding/border/margin with box-sizing: content-box (border-box is the other option)