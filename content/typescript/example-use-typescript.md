---
title: Typescript使用记录
description: 记录一下工作中或者自己项目中，常用到的一些场景下的code
image: http://static.journeynes.com/blog/gerald-schombs-Ln3-7Rotmy0-unsplash.jpg
tag: Typescript
time: 2021/2/4
---

这里用来记录一些项目中常用的关于Typescript的用法。会持续更新


## express去除contenxt的索引属性

在使用express的时候，context上下文的接口定义中包含了一个自定义的索引属性，当我想去继承这个context，同时想去掉自定义的索引属性，怎么实现呢？

案例代码如下

```typescript
interface U1 {
  ctx?: any;
  // 自定义的一个索引属性
  [propsName: string]: any
}

interface U2 extends U1 {
  id: number
  name: string
}

const a: U2 = { id: 1, name: 'journey' }

// 不会报错，应为有一个自定义的索引属性就做不到运行时安全
a.test // any
```

接下来我们需要在继承U1的同时把索引属性给去除掉

<alert type="info">

在TS中，[never类型](https://www.typescriptlang.org/docs/handbook/basic-types.html#never)表示一个无法可到达的类型，never是任何类型的子类型，可以赋值给任何类型

</alert>

```typescript
interface U1 {
  ctx?: any
  [propsName: string]: any
}

interface U2 extends U1 {
  id: number
  name: string
}

type KnowKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K
} extends { [_ in keyof T]: infer U } ? U : never

type ExculdeCustomIndexProps<T> = Pick<U2, KnowKeys<T>>

type U3 = ExculdeCustomIndexProps<U2>

const a: U3 = { id: 1, name: 'lc' }

a.id // OK
a.test // Error
```