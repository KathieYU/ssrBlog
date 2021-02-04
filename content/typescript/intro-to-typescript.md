---
title: Typescript使用记录
description: Typescript是Javascript类型的超集，它可以编译为纯Javascript，让Js这门弱类型语言也能像Java一样做到类型安全。
image: http://static.journeynes.com/blog/blog4-1.jpeg
tag: Typescript
time: 2020/1/7
---

## 什么是typescript

>JavaScript的超集。TypeScript是JavaScript类型的超集，它可以编译成纯JavaScript。TypeScript可以在任何浏览器、任何计算机和任何操作系统上运行，并且是开源的。

Typescript通过添加类型去扩展了Javascript，帮助你在编译阶段就能发现运行时可能存在的错误，帮你节省时间去在代码层面去做try catch。同时也能让你提前体验JS新的语法。

<div class="flex justify-center"><img src="http://static.journeynes.com/blog/blog4-2.png"/></div>

<alert type="warning">

该篇文章不赘述基本语法，可以去[typescript中文网](https://www.tslang.cn/index.html)查看学习，虽然比官网的Typescript版本慢（一些TS的新特性），但是对于基本的学习完全够用了

</alert>

## Typescript相关知识点

针对TS各个部分的比较常用的点做一些介绍，并为后续的拜读Vue3 reactivity的实现（Vue3响应式的原理）做铺垫

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

  let a: unknown

  a = 1;

  // 报错，a此时没有被明确定义为数字
  a.toFixed()

  // 利用类型断言可行
  (<number>a).toFixed()
  ```

  <alert>
  
  在定义一些输入的时候，为了做到类型安全，尽量不用any，使用unknown配合类型保护和断言，做到类型安全
  
  </alert>

- 如上提到的类型断言和类型保护是什么？

  1. 类型断言，在某些情况下你别Ts更加确切的知道某个值的类型，你可以是用类型断言告诉编译器更加确切的类型

      ```ts
      let someValue:any = '字符串'

      let strLength: number = (<string>someValue).length;
      let strLength: number = (someValue as string).length;
      ```
  2. 类型保护，常见的场景是使用了联合类型，我们需要在代码中if else进入各自的逻辑执行，此时就需要知道每个分支类型情况

      ```ts
      interface Bird {
        fly();
        layEggs();
      }

      interface Fish {
        swim();
        layEggs();
      }

      // 返回的类型是两者之一
      function getSmallPet(): Fish | Bird {
        // ...
      }

      let pet = getSmallPet();

      // 这么写Ts会报错，TS值知道pet的类型是Bird和Fish的联合类型
      // 为了安全，只能使用共同的方法layEggs()
      if (pet.swim) {
        pet.swim();
      } else {
        pet.fly();
      }

      // fix one 使用类型断言
      if ((<Fish>pet).swim) {
        (<Fish>pet).swim();
      } else {
        (<Bird>pet).fly();
      }

      // fix two 自定义类型保护 pet is Fish 就可以起到这个作用
      function isFish(pet: Fish | Bird): pet is Fish {
        return (<Fish>pet).swim !== undefined
      }

      // 这样TS就能将变量在分支里具体的缩减为某个类型
      if (isFish(pet)) {
        pet.swim()
      } else {
        pet.fly()
      }
      ```

      <alert type="warning">
      
      如果我们的联合类型是字符串和数字也要一一这样判断么？答案是否定的，在TS中typeof, instanceof这样的原生语法也能起到类型保护的作用，同时用于去除null和undefined使用短路运算符即可(xxx || 'default')

      </alert>


#### 接口和类型别名

>TypeScript的核心原则之一是对值所具有的结构进行类型检查

我们利用接口来定义对象的结构，算是一种自定义的类型，类型别名顾名思义就是给类型起个别的名字，它跟接口不同的是，它不是一种新的类型，只是类型的一种引用

- 如果你写过Java，在面向对象的语言中，接口（interface）是一个很重要的概念，它是对行为的抽象。接口在Ts中更加灵活，不仅可以对类的行为进行抽象，也常用于对象结构的描述，接口自然可以被class实现（implements）和继承（extends）
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

- type会给类型起一种新的名字，作为引用这个类型使用，它无法extends和implements，在开发过程中，应该尽量使用interface代替type使用，如果无法通过接口来来描述一个类型的话，就尝试使用type

  ```ts
  // 这里我们需要把string和number生成一个联合类型无法使用interface去描述
  type NumberOrString = string | number

  // 和交叉类型一起使用可以弄出链数据结构，这里的T是泛型变量，稍后会讲到
  type LinkedList<T> = T & { next?: LinkedList<T> }

  interface Person {
    name: string
  }

  var people: LinkedList<Person>;

  var s = people.name
  var s = people.next.name;
  var s = perple.next.next.name;
  ```

- type也可以常用于映射类型，比如把一个接口描述的类型属性转成可选或者只读属性
  ```ts
  type Readonly<T> = {
    readonly [K in keyof T]: T[K]
  }

  interface Person {
    name: string
    age: number
  }

  type ReadOnlyPerson = Readonly<Person>

  // type ReadOnlyPerson = {
  //  readonly name: string
  //  readonly age: number
  // }
  ```

  <alert>
  
  TS内置了一些工具类型，快速的使用一种类型生成另外一种类型，常用于修改第三方库的类型声明，常见的Partial\<Type\>，利用Type生成一个所有属性都为可选的新类型，Pick\<Type, Key\>挑选Types中的KEY作为新的类型，ReturnType\<Type\>等，[TS工具类型大全](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)
  
  </alert>

#### 泛型

同样接触过JAVA的小伙伴们，对泛型应该很熟悉，利用它能创建可重用的组件，利用泛型和TS的类型推论，我们能定义出更通用的组件

```ts
// 那么这个函数就是用来给number类型使用的
function identity(arg: number): number {
  return arg;
}

// 如果是string类型的
function identity(arg: string): string {
  return arg;
}

// 这个时候，我们就需要一种泛型变量T来帮我们保持函数的入参和返回值类型一致
function identity<T>(arg: T): T {
  return arg
}
```

可以利用泛型变量来实现一些工具函数，比如常见的extend和getProperty

```ts
// 这里泛型变量配合着TS自己的类型推论能够很好的帮助我们获取到通用的对象混合后的Type
function extend<T, U>(first: T, second: U): T & U {
  const result = <T & U>{}

  for (let id in first) {
    result[id] = (<any>first)[id];
  }
  for (let id in second) {
    if (!(<any>result).hasOwnProperty(id)) {
      result[id] = (<any>second)[id];
    }
  }
  
  return result;
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// Error TS类型推断发现a并不存在与第一个对象中
getProperty({ id: 1 }, 'a')
// Right
getProperty({ id: 1 }, 'id')
```

泛型的内容比较多，具体的场景在后续的Vue3的reactivity的解读中再提及

#### infer操作符

infer表示在extends条件语句中待推断的变量类型，在[TS2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types)版本中可以看到相关内容

下面的例子来源于TS2.8新增的预定义条件类型RetrunType\<T\>，用于推断函数返回值类型

```ts
// 自己实现RetrunType<T>
type RetrunType<T> = T extends (..args: any[]) => infer R ? R : any;

type T0 = ReturnType<() => string> // string；
```

利用infer可行的骚操作

- tuple转union，比如[string, number] -> string | number

  ```ts
  type TupleToUnion<T> = T extends Array<infer R> ? R : never

  type Tuple = [number, string]

  type T1 = TupleToUnion<Tuple> // number | string

  // 或者直接利用索引类型
  type T2 = Tuple[number] // number | string
  ```

- union转intersection，比如string | number -> string & number
  ```ts
  type X<T> = T extends { a: (x: infer U) => void, b: (x: infer U) => void } ? U : never;
  interface One {
    name: string,
    age: number
  }
  interface Two {
    name: string
    adress: string
  }
  // 逆变位置上，同一类型变量的多个候选类型将被推断为交叉类型，也就是infer U在逆变位置，被推断为One & Two交叉类型
  type T3 = X<{ a: (x: One) => void, b: (x: Two) => void }> // One & Two

  // 接着只要让联合类型转成X类型的构造即可
  type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends ((k: infer I) => void) ? I : never
  type T4 = UnionToIntersection<One | Two>
  ```

  <alert>
  
  这里利用到了两个概念，[分布式条件类型](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types)和[逆变协变](https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html)的概念，可自行学习

  </alert>

这些奇技淫巧其实大家知道即可，不必话过多的时间在这个上面，只要知道infer操作符可以在extends条件类型中，作为一种待推断的类型变量即可，在谈到Vue3的reactivity部分也有使用到

## 总结

Typescript是Javascript的超集，通过添加类型在编译阶段可以发现程序可能出现的错误，让程序更加健壮，但同时也会增加很多学习成本，并且在团队开发能力不同的时候，反而起不到TS原本的作用，变为AnyScript。学习TS是一个持续的过程，希望大家一起进步






