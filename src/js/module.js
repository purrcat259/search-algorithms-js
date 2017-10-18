export default class Module {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(`This module's name is: ${this.name}`);
    }
}
