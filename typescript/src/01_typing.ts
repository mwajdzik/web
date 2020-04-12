let myStringVariable: string;

myStringVariable = 'This is a string';
// myStringVariable = 4;

let inferredTypeVariable = 'This is a string without :string';
// inferredTypeVariable = 4;

let yetAnotherString;
yetAnotherString = 'This is a string';
yetAnotherString = 5;

let aString: string;
let aNumber: number;
let aBoolean: boolean;
let anArray: string[];
let anything: any;

// array
let strings: string[] = ['a', 'b', 'c'];

// object literal
class Car {
}

let car = new Car();

// object literal
let point: { x: number; y: number; } = {x: 23, y: 81};

const logNumber: (i: number) => void = (i: number) => {
    console.log(i);
};

// destructuring with type definition
const {x}: { x: number } = point;
console.log(x);

const coordinates: { x: number, y: number } = JSON.parse('{"x": 23, "y": 32}');
console.log(coordinates.x, coordinates.y);

const add = (a: number, b: number): number => {
    return a + b;
};

// ---

console.log(add(23, 34));

const cars1: string[] = [];
const cars2 = ['ford', 'toyota'];

const cars3 = cars2.map((c: string): string => {
    return c.toUpperCase();
});

// ---

type TypeAlias = [string, number];

const tuple1: TypeAlias = ['ford', 23];
