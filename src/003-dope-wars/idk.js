export default class idk {
  constructor() {
    console.log('idk man');
  }
  
  sayHello() {
    console.log('hello');
  }
}

class Cat extends idk {
  constructor() {
    super();
    console.log('cat');
  }
}

class Dog extends idk {
  constructor() {
    super();
    console.log('woof');
  }
}

export {
  Dog,
  Cat
}