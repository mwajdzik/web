// Symbols:

// a symbol is a unique and immutable data type and may be used
// as an identifier for object properties (we cannot access the id)

let eventSymbol = Symbol('event');
console.log(typeof eventSymbol);             // symbol
console.log(eventSymbol.toString());         // Symbol(resize event)

let symbol1 = Symbol.for('event');
let symbol2 = Symbol.for('event');
console.log(symbol1 === symbol2);            // true
console.log(symbol1 === eventSymbol);        // false

let article = {
    title: 'Whiteface Mountain',
    [Symbol.for('event')]: 'My Article'       // we define a property without knowing its name (!)
};

let value = article[Symbol.for('event')];
console.log(value);
console.log(Object.getOwnPropertyNames(article));
console.log(Object.getOwnPropertySymbols(article));


// --- Object extensions:

let a = {x: 1}, b = {y: 2};
Object.setPrototypeOf(a, b);
console.log(a.x);


let target = {};
Object.assign(target, a, b);
console.log(target);


Object.defineProperty(target, 'c', {
    value: 3,
    enumerable: true
});


console.log(target);

console.log(Object.is(a, a));
console.log(Object.is(a, b));

