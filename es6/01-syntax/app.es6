'use strict';


// -------------------------------

// noinspection JSUnusedAssignment
console.log(hoisting);

// noinspection ES6ConvertVarToLetConst
var hoisting = 12;


let noHoisting = 21;
{
    // block scoping
    let noHoisting = 22;
    console.log(noHoisting)
}
console.log(noHoisting);

// no problem like with 'var'
let updateFunctions = [];

for (let i = 0; i < 4; i++) {
    updateFunctions.push(() => i);
}

console.log(updateFunctions[0]());


// -------------------------------


const MARKUP_PCT = 1000;
console.log(MARKUP_PCT);


// -------------------------------


// arrow function (this set to the context of the function we run!)
let getPrice = () => 5.99;
console.log(getPrice());


// 'this' would be window (!!!), not document (like with a normal function)
// document.addEventListener('click', () => console.log(this));

let invoice = {
    number: 123,
    process1: () => console.log(this),
    process2: function () {
        console.log(this)
    },
    process3: function () {
        return () => console.log(this.number);
    }
};


invoice.process1();     // window
invoice.process2();     // invoice object
invoice.process3()();   // 123 - function is a new context

// with arrow functions we CANNOT change this with .bind
// the same is true for .apply, .call
// arrow function have NO prototype field


// -------------------------------


function defParamValue(price, tax = price * 0.07) {
    console.log(price + tax);
}

defParamValue(1000);


// -------------------------------


// rest operator
function show(productId, ...categories) {
    console.log(categories);
    console.log(categories instanceof Array);    // true
    console.log(arguments.length);               // 3
}

show(123, 'search', 'advertising');

// spread operator
console.log(Math.max(...[12, 20, 18]));
console.log([...[12, 20, 18]]);
console.log([...'139', 81]);

let arr = [12, 20, 18];
console.log([...arr, 15, 19]);

let obj = {
    a: 1
};

console.log({
    ...obj,
    b: 2
});


// -------------------------------


const field = 'quality';
const price = 3.99;
const quantity = 2;

const product = {
    price,
    quantity,
    [field + '_new']: 10,

    calculateValue() {
        console.log(this.price, this.quantity);
        return this.price * this.quantity;
    }
};

console.log(product);
console.log(product.calculateValue());


// -------------------------------


const categories = ['hardware', 'software'];
for (let category of categories) {
    console.log(category);
}


// -------------------------------


const octal1 = 0o10;
const octal2 = 0O10;
const binary = 0b10;
const hex = 0x10;

console.log(octal1, octal2, binary, hex);


// -------------------------------


const invoiceNum = '1350';
console.log(`Invoice number: ${invoiceNum}`);

console.log(`
A
B
C
`);


// -------------------------------


// destructuring
let [a, b, c, d = 4] = [1, 2, 3];
let [x, ...y] = [1, 2, 3];
console.log(a, b, c, d);
console.log(x, y);

let s = {a: 12, b: 13, c: 14};
let {a: newA, c: newC} = s;
console.log(newA, newC);

const objs = [{a: 1, b: 2}, {a: 11, b: 12}];
for (let {a: m, b: n} of objs) {
    console.log(`m=${m}, n=${n}`);
}


// -------------------------------

