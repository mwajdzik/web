import {ExportedClass} from './05_modules';

class Vehicle {
    protected speed: number;

    drive(): void {
        console.log('driving...')
    }
}

class Car extends Vehicle {
    private engineName: string;
    private gears: number;

    constructor(public doors: number = 4,
                speed: number = 100) {
        super();
        this.speed = speed || 0;
    }

    static numberOfWheels(): number {
        return 4;
    }

    accelerate(): void {
        this.speed++;
    }

    throttle(): void {
        this.speed--;
    }

    getSpeed(): number {
        return this.speed;
    }
}

const car1 = new Car(4, 120);
car1.drive();
car1.accelerate();

console.log(car1.getSpeed());
console.log(car1.doors);
console.log(Car.numberOfWheels());

const car2 = new Car();
console.log(car2.getSpeed());
console.log(car2.doors);

const exported = new ExportedClass();
console.log(exported.x);
