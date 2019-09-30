import {ExportedClass} from './05_modules';

class Car {
    engineName: string;
    gears: number;

    private speed: number;

    constructor(speed: number) {
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

const car2 = new Car(5);
car2.accelerate();

console.log(car2.getSpeed());
console.log(Car.numberOfWheels());

const exported = new ExportedClass();
console.log(exported.x);
