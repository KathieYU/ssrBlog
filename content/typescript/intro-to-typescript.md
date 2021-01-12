---
title: Typescript
description: Typescript是Javascript类型的超集，它可以编译为纯Javascript，让Js这门弱类型语言也能像Java一样做到类型安全。
image: http://static.journeynes.com/blog/blog4-1.jpeg
tag: Typescript
---

## 什么是typescript

>JavaScript的超集。TypeScript是JavaScript类型的超集，它可以编译成纯JavaScript。TypeScript可以在任何浏览器、任何计算机和任何操作系统上运行，并且是开源的。

Typescript通过添加类型去扩展了Javascript，帮助你在编译阶段就能发现运行时可能存在的错误，帮你节省时间去在代码层面去做try catch。同时也能让你提前体验JS新的语法。

<div class="flex justify-center"><img src="http://static.journeynes.com/blog/blog4-2.png"/></div>

<alert type="warning">

该篇文章不赘述基本语法，可以去[typescript中文网](https://www.tslang.cn/index.html)查看学习，虽然比官网的Typescript版本慢（一些TS的新特性），但是对于基本的学习完全够用了

</alert>

## Typescript相关知识点

该部分会针对TS各个部分的比较常用的点做一些介绍，并为后续的拜读Vue3 reactivity的实现（Vue3响应式的原理）做铺垫

#### 基础类型

- string, number, boolean, enum, any, null, undefined,  Array\<\>, Tuple元组（个数有限的数组）, object类型，还有TS3.0的 unknown类型
- 很多时候在我们谈到Ts的时候，常常调侃为Any script，这是应为很多初学者开发的时候，不去做类型的定义和使用，而是直接利用any类型来定义一切，方便通过编译
  ```ts
  function sayHello (str: any): void {
    // 定义为any类型的str调用任务内容都可以通过变异
    console.log(str.xxx);
  }

  // 虽然通过了编译，但是运行时还是会报错
  sayHello()
  ```
- any和unknown类型的区别，unknown是类型安全的，任何值都可以赋值给unknown，但是unknown类型在没有类型断言或者类型细化的时候，是不能像any一样有任何操作的，这就是它类型安全的原因
  ```ts
  declare function isFunction(x: unknown): x is Function;

  function typeUnknown(x: unknown) {
    if (typeof x === "string" || typeof x === "number") {
      // 这类x的类型被细化成为了string或者number，那么可以做操作了
      x;  // string | number
    }
    if (x instanceof Error) {
      x;  // Error
    }
    if (isFunction(x)) {
      x;  // Function
    }
  }
  ```

#### 接口和类型别名的区别

interface接口和类型别名type的常用使用场景和区别

- 如果你写过Java，在面向对象的语言中，接口（interface）是一个很重要的概念，它是对行为的抽象。接口在Ts中更加灵活，不仅可以对类的行为进行抽象，也常用语对象结构的描述
  ```ts
  interface Person {
    name: string
    age: number
    // 可选属性
    address?: string
    // 只读，不允许后续修改
    readonly sex: number
  }

  const person: Person = {
    name: '张三',
    age: 18,
    sex: 0
  }
  // 报错，只读属性不予许修改
  person.sex = 1;
  ```

- type会给类型起一种新的名字，作为引用这个类型命名使用，它无法extends和implements，在开发过程中，应该尽量使用interface代替type使用，如果无法通过接口来来描述一个类型的话，就尝试使用type

  ```ts
  // 这里我们需要把string和number生成一个联合类型无法使用interface去描述
  type NumberOrString = string | number

  // 和交叉类型一起使用可以弄出链数据结构
  type LinkedList<T> = T & { next?: LinkedList<T> }

  interface Person {
    name: string
  }

  var people: LinkedList<Person>;

  var s = people.name
  var s = people.next.name;
  var s = perple.next.next.name;
  ```

- type也可以常用语映射类型，比如把一个接口描述的类型属性转成可选或者属性
  ```ts
  type Readonly<T> = {
    readonly [K in keyof T]: T[K]
  }

  interface Person {
    name: string
    age: number
  }

  type ReadOnlyPerson = Readonly<Person>

  //type ReadOnlyPerson = {
  //  readonly name: string
  //  readonly age: number
  //}
  ```

#### 泛型






