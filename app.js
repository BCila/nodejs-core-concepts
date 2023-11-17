const EventEmitter = require("./myeventemitter");

const myEmitter = new EventEmitter();

myEmitter.on("foo", () => {
  console.log("Foo emitter 1");
});

myEmitter.on("foo", () => {
  console.log("Foo emitter 2");
});

myEmitter.on("bar", () => {
  console.log("bar emitter 2");
});

myEmitter.emit("foo");
