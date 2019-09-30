// TypeScript is modular, we can divide our code up over several files.
// In Angular 2 we then use  "import {} from ''" to access the code in these files.
"use strict";
// We export a class, interface, variable, ... by adding 'export' keyword in front of it.
var ExportedClass = (function () {
    function ExportedClass() {
    }
    return ExportedClass;
}());
exports.ExportedClass = ExportedClass;
