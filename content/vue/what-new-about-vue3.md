---
title: Vue3.x的那些事儿
description: Vue3从alpha到现在的稳定版本已经经历了1年多了，Vue3.x的配套核心类库vue-router@4和vuex@next也已经出炉，来一起了解学习一下Vue3.x的新特性吧
image: http://static.journeynes.com/blog/blog3-1.jpeg
tag: Vue3,VueRouter,Vuex,Typescript
apiList:
  - 值类型的响应式数据声明Ref
  - 引用类型的响应式数据声明Reactive
  - 计算属性Computed和监听变化Watch
  - Vue生命周期相关
  - VueRouter的一些路由守卫Hook
  - Vuex，VueRouter三方库的一些Componsition Function
---

## Vue3新特性

首先看一下下面这张关于Vue3新特性的图，我们来简单的介绍一下每一条

![Vue3新特性](http://static.journeynes.com/blog/blog3-3.png)

#### Performance先关
- 重写了VDOM的实现

  <alert type="info">
  
  传统的vdom存在一些性能方面的劣势，即使Vue能够保证最小限度的更新需要更新的组件，但依然要遍历组件整个vdom树，才能找出需要patch的节点，也就是说传动的vdom的性能跟组件模板的大小有关，跟动态节点无关，其实这些遍历都是无用的。

  新的vdom会利用模板的一些静态分析，将vdom的操作粒度变小，不在是整个组件，而是将模板依照Vue的指令切割成一个个block，每个block有对应的dynamic node数组来保证在组件更新的时候做到最小的vdom对比

  vdom的更新性能从组件整体模板大小相关 --> 跟组件动态节点数量相关

  </alert>

- 利用ES6的Proxy代替了Object.defineProperty

  - Proxy是劫持整个对象，而Object.defineProperty是劫持对象的属性，所以后者无法监听对象的属性的删除和新增操作（一旦初始化之后，需要用到Vue.$set）,同时对于数组的操作无法劫持，需要重新Array相关的方法包含<code>['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']</code>

  - Object.defineProperty需要递归遍历深层次对象，为所有属性添加对应的劫持，耗费性能

- 由于vdom只对比动态节点的diff，组件的update性能大幅度提高（只有利用模板的写法才能静态分析模板做到优化，render function则无法优化）

#### Tree-shaking support

Vue3中核心api支持tree-shaking，这些api包被分离出来通过引入的方式而不是实例化的时候就自动注入，只会对使用到的功能做打包，可以有效的减少生产的包体积

#### Composition Api

这个是对Vue使用者能感知到的改动，我们都知道Vue3之前如果要提取公共功能的逻辑，我们要么利用Scoped slot封装组件，要么利用Mixins（<span class="text-primary-500">React中逻辑提取则利用高阶组件和render props实现</span>），这些方式自然有一些劣势，就需要一种更简洁的方式去实现逻辑的提取，这就是Composition Api出现的原因（<span class="text-primary-500">React16.8出现了Hook</span>），能够好的提取公共的功能，同时也能更好的组织业务代码，让同一个业务功能的代码聚合到一起，随着组件越来越大，这种方式自然更方便后续的维护。可查阅[Composiiton Api RFC](https://composition-api.vuejs.org/#summary)

![composition api](http://static.journeynes.com/blog/blog3-4.png)

#### Fragment,Teleport,Suspense

新增了三个内部组件，分别有各种的用途

- Fragment，在Vue2.x，组件的跟节点只能有一个，很多时候我们需要无意义的去包裹一个div来满足这个条件，由于Fragment的存在，组件的根节点可以多个了<span class="text-primary-500">React中也存在Fragment</span>）

  ```html[App.vue]
  <tempalte>
    <header></header>
    <main></main>
    <footer></footer>
  </tempalte>
  ```

- Teleprot，提供了一种讲子节点渲染到父组件意外的DOM节点的一种方案，常见的需求是，组件里有一个div:over-flow:hidden，导致部分脱离文档流的内容由于定位原因导致无法显示，那么久可以利用这个方案让其脱离该div，渲染到其他DOM节点上，常见需求，Dialog弹窗（<span class="text-primary-500">React中有Protal类似实现</span>））

  <code-sand-box src="https://codesandbox.io/s/nifty-villani-wmnf0?file=/src/App.vue"></code-sand-box>

- Suspense，由于Vue中异步组件的存在（defineAsyncComponent）,导致在加载组件的时候存在空窗期，那么可以利用该组件包括展示fallback内容，提供更友好的体验

  <code-sand-box src="https://codesandbox.io/s/tender-liskov-ruf6m?file=/src/App.vue"></code-sand-box>

#### Better Typescript support

Vue3使用了Typescript重写，有更好的类型支持，对于this的类型推断更舒服了，不用在遭受Vue2.x糟糕的开发体验

#### Custom Renderer API

可以利用Virtual Dom来自定义自己的渲染器，可以针对不同的平台来开发不同的渲染器，让Vue可以适配到不同的平台上，比如WebGl，比如Weex

## Composition Api基础使用

Composition Api其实就是利用一些基础的api通过合理的组合来实现功能的封装，配合setup来实现。这个部分简单的利用Vue3的composition api来开发一个todoList，同时利用api来封装一下鼠标位置的逻辑

#### Api的使用

主要分为几大类别

<list type="success" :items="apiList"></list>

代码上直观的看一下，能把一个功能所有相关联的代码全部放在一起，方便维护，而不是在一个巨大的Vue文件中的data和methods来回找

```js
// ref相关
import { ref } from 'vue'
// reactive相关
import { reactive } from 'vue'
// watch
import { watch } from 'vue';
// Vue生命周期
import { onMounted, onUnmounted } from 'vue'

export default {
  setup () {
    <!-- 计算功能 start -->
    // 使用ref来声明值类型的响应式数据
    const count = ref(0);

    // 修改count，需要通过.value来代理实现，但是在模板中不需要，应为模板会被vue-loader转换，这个会在编译阶段搞定
    function addCount () {
      count.value++
    }

    <!-- 计算功能 end -->

    <!-- todoList功能 start -->
    const list = reactive([]);

    function addItem (text) {
      list.push(text)
    }

    // list发生改变了触发动作
    watch(list, (currentList, prevList) => {
      console.log('todoList状态发生改变')
      // 其他操作
    })
    <!-- todoList功能 end -->

    <!-- 组件初始化相关 start -->
    onMounted(() => {
      console.log('组件mounted生命周期触发')
    })
    <!-- 组件初始化相关 end -->

    return {
      count,
      addCount,
      list,
      addItem
    }
  }
}
```

#### 实现简易todoList

1. 利用[VueCli](https://cli.vuejs.org/)最新版本创建Vue3项目

    ```shell
    vue create todo-project
    ```

2. 实现todo App，[在线体验](https://codesandbox.io/s/modern-framework-ys1zz?file=/src/App.vue)

    ```html[App.vue]
    <template>
      <div>
        <input type="text" v-model="todoInput" />
        <button @click="addTodoItem">Add todo</button>
      </div>

      <ul>
        <li v-for="(item, index) in todoList" :key="index">
          <span
            style="margin-right: 10px"
            :style="{
              'text-decoration': item.isFinished ? 'line-through' : 'none',
            }"
            >{{ item.text }}</span
          >
          <button @click="finishItem(index)">finish</button>
          <button @click="deleteItem(index)">delete</button>
        </li>
      </ul>
    </template>

    <script>
    import { reactive, ref } from "vue";
    export default {
      name: "App",
      setup() {
        const todoInput = ref("");
        const todoList = reactive([]);

        function addTodoItem() {
          // push进去
          todoList.push({
            isFinished: false,
            text: todoInput.value,
          });

          // 重置为''
          todoInput.value = "";
        }

        function finishItem(index) {
          todoList[index].isFinished = true;
        }

        function deleteItem(index) {
          todoList.splice(index, 1);
        }

        return {
          todoInput,
          addTodoItem,
          todoList,
          finishItem,
          deleteItem,
        };
      },
    };
    </script>

    ```





#### 实现公共功能的封装

开发useMouse.js功能，该功能就是实时获取鼠标的位置

```js[useMouse.js]
import { onMounted, onUnmounted, reactive, toRefs } from 'vue'

export default function () {
  const position = reactive({ x: 0, y: 0 })

  function recordPosition (e) {
    position.x = e.pageX
    position.y = e.pageY
  }

  onMounted(() => {
    document.addEventListener('mousemove', recordPosition)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', recordPosition)
  })

  // 这里为什么要包括上一层toRefs，应为position是Proxy代理的对象，如果在使用这个useMouse的时候利用了结构赋值，就导致得到的属性是原有对象的属性，不具有响应性
  return toRefs(position)
}
```

使用的话，比如在某个组件中

```html[App.vue]
<template>
  <div>此时鼠标的位置：{{ x }}, {{ y }}</div>

  <!-- 在另外一个组件这样使用 -->
  <div class="follow-text" :style="{ left: `${x}px`, top: `${y}px` }">哈哈</div>
</template>

<script>
import useMouse from './useMouse.js'

export default {
  name: "App",
  setup() {
    // 这里结构赋值了，所以useMouse一定要用toRefs包裹一下，不然得到的是原始值，无法触发响应
    const { x, y } = useMouse();

    return {
      x,
      y
    };
  },
};
</script>

<style>
.follow-text {
  position: fixed;
  background: #000;
  color: #fff;
}
</style>
```

## 总结

Vue3在该文章出来的时候，部分配合的类库还未出现稳定版，比如Vuex还在RC版本，没有一些很方便的合适composition api的轮子，大家可以先学习，但不推荐在生产上大的项目上使用，可以在小项目上使用。最后，抛出[Vue3的官方文档](https://v3.vuejs.org/)，[VueRouter next](https://next.router.vuejs.org/)，[Vuex@next](https://next.router.vuejs.org/)