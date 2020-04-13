// -----

class Task {

    id = 23;

    constructor() {
        console.log('Constructing Task');
        this.location = 'Mazatlan';
    }

    getId() {
        return this.id;
    }

    static getDefaultId() {
        return 99;
    }
}

let task = new Task();
console.log(task.getId());                            // 23
console.log(task.location);                           // Mazatlan
console.log(Task.getDefaultId());                     // 99
console.log(typeof task);                             // object
console.log(typeof Task);                             // function
console.log(task.getId === Task.prototype.getId);     // true
console.log(task instanceof Task);                    // true

// -----

class Project extends Task {
    constructor() {
        super();
        console.log('Constructing Project');          // 55
        this.location = this.location + ' Beach';     // Mazatlan Beach
    }

    getId() {
        return 32 + super.getId();
    }
}

let project = new Project();
console.log(project.getId());
console.log(project.location);

// -----
