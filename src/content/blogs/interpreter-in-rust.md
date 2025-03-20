---
title: Creating an Interpreter in Rust
description: A dive into creating an interpreter in Rust for the Monkey programming language while creating a playground based on the WASM build.
date: 2024-09-22
cover: ./monkey-interpreter-playground.png
coverAlt: A screenshot of the Monkey Interpreter Playground
coverLink: https://monkey-interpreter.jeaurond.dev/
tags:
  - rust
  - programming
  - interpreter
  - webassembly
  - react
  - typescript
class: bg-teal-50 dark:bg-teal-950/30
isDraft: true
---

---

## Contents

## Writing an Interpreter in ~Go~ Rust

I was inspired by some Twitch streamers to dive into the implementation of a programming language. It seems to be interesting to understand the inner workings of a programming language and how to go from a sequence of letters to a functioning program.

The [Writing An Interprerter In Go](https://interpreterbook.com/) book was one that I had seen online and strongly recommended by some of the tech influencers online I follow, so I dediced to give it a try. And oh actually, I wrote it in Rust and not in Go. 

### Why use Rust?

Throughout the book, all the examples and some concepts are related to the programming language you use to implement the interpreter, which is Go in the book. A lot of the examples were well translated to Rust and often times simpler. As for the concepts, many were unnecessary because of the following.

#### 1. Rust's core features

Due to the nature of pattern matching, traits, and sum types, some of the concepts were  in Rust! Here are a few examples that I stumbled uppon within the book:

- hashing in Rust is pretty simple if you use derive macros - no need to create a custom hashing function (although for performance improvements, creating a custom one could help since any specific implemetation is better than a generalized implementation)
- no need to have interfaces to implement for an token/expression/statement and no need for string constants representing a type. Rust's enum types are powerful to contain related data and to express exhaustiveness

#### 2. Not garbage collected

Unlike Go, Rust doesn't have a garbage collector and yet doesn't leave you in charge of managing the memory. Rust depends on [RAII](https://doc.rust-lang.org/rust-by-example/scope/raii.html) (resource acquisition is initilization) to manage the memory of the variables using within a Rust program. In turn complicates Rust with its borrow checker and ownership system, but leaves you worry free of memory mismanagement errors while not having a garbage collector.

This should result in a simpler binary output (one without a garbage collector) and allow the underlying compiler to optimize further the binary due to the strict lifetimes of the variables and explicit Rust types.

#### 3. WASM support

I knew I wanted to create an online playground to test out the features added to the interpreter. Rust can compile to [WASM](https://webassembly.org/) which makes this a great langauge as well to use, and I had compiled to WASM in the past with ease.

Thanks to [wasm-pack](https://github.com/rustwasm/wasm-pack) and [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen), I created an npm package [@benjeau/monkey-interpreter](https://www.npmjs.com/package/@benjeau/monkey-interpreter) (which is less than 200KB) which I can then use within my frontend React codebase! Not saying this isn't possible with Go, its just easy to do it in Rust.

#### 4. Test driven development

The std library of Rust has a great base for creating test cases, from verifying equality of structs (based on the [PartialEq](https://doc.rust-lang.org/std/cmp/trait.PartialEq.html) trait) to the verbosity of the test failures with optional message arguments. Adding [cargo-watch](https://github.com/watchexec/cargo-watch) on top of that, makes it as easy as possible to view in realtime as you make your changes to know if they are breaking other features you've added previously within the interpreter. Since the book did not make you depend on external libraries/crates, the compilation and the feedback loop from when you break a change to viewing it within the output of your tests is within the _couple of miliseconds_.

### The Monkey language

What's "Monkey" code? It's a language created for the purpose of learning about the inner workings of an interpreter made by the creator of the book - https://monkeylang.org/. It looks a bit like JavaScript, Python, and Rust.

#### Code examples

Here's what the language supports (as pulled from their website):

```js
// Integers & arithmetic expressions
let version = 1 + (50 / 2) - (8 * 3);

// ... and strings
let name = "The Monkey programming language";

// ... booleans
let isMonkeyFastNow = true;

// ... arrays & hash maps
let people = [{"name": "Anna", "age": 24}, {"name": "Bob", "age": 99}];
```

You can create your own functions or use the built-in ones.

```js
// User-defined functions
let getName = fn(person) { person["name"]; };
getName(people[0]); // => "Anna"
getName(people[1]); // => "Bob"

// ... built-in functions
puts(len(people));  // prints: 2
```

Everything is scoped and returning data from a function can be done multiple ways.

```js
// Conditionals, implicit, explicit returns, and recursive functions
let fibonacci = fn(x) {
  if (x == 0) {
    0
  } else {
    if (x == 1) {
      return 1;
    } else {
      fibonacci(x - 1) + fibonacci(x - 2);
    }
  }
};

// `newAdder` returns a closure that makes use of the free variables `a` and `b`:
let newAdder = fn(a, b) {
    fn(c) { a + b + c };
};
// This constructs a new `adder` function:
let adder = newAdder(1, 2);

adder(8); // => 11
```

## Development

When I started reading the book, I created a new Rust project and started implemeting the interpreter. Everything started with tests which led the implementation of the code.

### Computer setup

Since I'm one that likes to code in various spaces other than my desk, I like to make sure ... I had the following setup where I could read the book, view the output of the tests, and write code:

![Computer setup](./development-dark.png)

### Testing

## Deployment

### Github Actions

### Cloudflare Pages

### npm

## End result

### Playground

### Source code

The entire source code for the interpreter and the playground is available on my Github - [@BenJeau/monkey-interpreter](https://github.com/BenJeau/monkey-interpreter).