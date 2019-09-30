// TypeScripts - well - strong typing allows us to define types for
// our variables and class members. The compiler is going to yell at us
// if we assign a value of a wrong type to such a variable or member.
// Declaring a variable with a type
// Using the 'let' keyword to create a variable
// ('const' would define an immutable constant)
var myString;
myString = 'This is a string';
// myStringVariable = 4;
// TypeScript can also infer types
var anotherString = 'This is a string without :string'; // => Type 'string' was inferred from the assigned value
// inferredTypeVariable = 4;
// TypeScript may only infer values when those values are assignedat the declaration
// This does not work (it's any):
var yetAnotherString;
yetAnotherString = 'This is a string';
yetAnotherString = 5;
// Other basic types
var aString;
var aNumber;
var aBoolean;
var anArray;
var anything;
