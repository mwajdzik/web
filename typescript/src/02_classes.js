// Classes allow us to create 'blueprints' for objects
// In Angular 2 we use classes a lot.
// For example to create Components, Services, Directives, Pipes, ...
var Car = (function () {
    function Car(speed) {
        this.speed = speed || 0;
    }
    Car.prototype.accelerate = function () {
        this.speed++;
    };
    Car.prototype.throttle = function () {
        this.speed--;
    };
    Car.prototype.getSpeed = function () {
        return this.speed;
    };
    Car.numberOfWheels = function () {
        return 4;
    };
    return Car;
}());
var car = new Car(5);
car.accelerate();
console.log(car.getSpeed());
console.log(Car.numberOfWheels());
