interface User {
    username: string;
    password: string;
    confirmPassword?: string;       // Optional property
}

let user: User;
user = {username: 'max', password: 'supersecret'};

// user = { anything: 'anything', anynumber: 5};

interface CanDrive {
    accelerate(speed: number): void;
}

let car: CanDrive = {
    accelerate: function (speed: number) {
        console.log('Accelerating by', speed);
    }
};

console.log(car.accelerate(5));
