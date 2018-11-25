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

