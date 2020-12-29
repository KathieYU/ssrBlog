---
title: VUE SSR初探
description: VUE SSR是什么？它和传统的SPA的区别又是什么？来一起康一康
image: http://static.journeynes.com/ssr-blog/blog2-1.jpg
tag: Webpack,Vue,SSR,Nuxt
disabled: true
---

<!-- 1. SSR概念
2. 我们到底需不需要使用SSR
3. SSR和传统的SPA有什么不同
4. 改造项目
5. Nuxt.js以及配合nuxt-content来搭建一个简单的博客 -->

## 什么是SSR

>Vue.js 是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM。然而，也可以将同一个组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。

通俗的说，SSR就是根据路由把SPA的初始状态在服务端进行渲染，生成一份快照供浏览器使用，后续<span class="text-primary-500">所有的</span>交互和路由的控制再由原来的‘SPA’控制（即浏览器输入about路由，则服务器渲染about页面，后续用户点击about的回到首页，则完全由客户端控制，不在经过服务端）

## 真的需要SSR吗？

可能大部分人只是听过SSR的概念，并没有实质的接触过SSR，所以在使用这个技术去落地项目的时候，我们需要考虑真的需要去使用这个技术吗？

#### SSR对比SPA的优缺点

SSR对比SPA的优势：

- SEO，由于生成的HTML代码不再是一堆JS和CSS文件，而是包含了页面的内容，可以供搜索引擎爬虫工具的查看，收录
- time-to-content，获取到的html直接包含了内容，无需等待所有js下载好之后再进行数据的拉取

SSR对比SPA的限制

- 开发环境有限，由于需要在服务端执行生成初始化状态，那么在Vue相关的生命周期无法执行，同时部分第三方类库无法使用（使用了window，document等在浏览器中才存在的内容）
- 构建部署复的要求，SPA生成的是静态文件，而SSR需要处于Node.js环境
- 服务器的负载，SPA只需部署在静态文件的服务器上即可，而SSR需要Node.js渲染，需要占用CPU资源

#### SSR和预渲染

1. 内容到达时间 (time-to-content) 要求是绝对关键的指标，在这种情况下，服务器端渲染 (SSR) 可以帮助你实现最佳的初始加载性能
2. 如果只是针对少数营销页面的SEO，可以选择预渲染

    >预渲染方式，在构建时 (build time) 简单地生成针对特定路由的静态 HTML 文件。优点是设置预渲染更简单，并可以将你的前端作为一个完全静态的站点

    <alert type="info">

    注意预渲染之后会生成index和针对部分路由的html文件，在部署的时候如果采用history模式，需要主要fallback的控制

    </alert>

## SSR和SPA的区别

这部分来看看SSR和SPA的区别，从而分析在日常开发和webpack配置上应该做出哪些调整

#### 运行环境的区别

SSR由于初始化的快照需要在Node.js环境生成，而SPA完全在浏览器中执行

- Vue只有beforeCreate和created生命周期会在SSR中执行，其他钩子在客户端执行
- beforeCreated和created生命周期中不能执行一些全局的副作用代码，下面的代码created中setInterval其实是在node环境中执行的，beforeDesotry执行的时候处于客户端了

  ```js[demo.vue]
  export default {
    data() {
      return {
        timer: null
      }
    },
    created () {
      this.timer = setInterval(() => {}, 1000)
    },
    beforeDestory() {
      clearInterval(this.timer);
      this.timer = null
    },
  }
  ```
- 注意使用的类库有没有使用特定平台的API
- 客户端代码每次刷新页面都是一个新的Vue实例，但SSR的处于Node.js进程，需要利用工厂模式，保证每次请求的状态都是独立的

  <code-group>
    <code-block label="app.js" active>

    ```js
    import Vue from 'vue'
    import App from './src/App.vue'
    import { createRouter } from './router'

    export function createApp () {
      const router = createRouter();

      const app = new Vue({
        router,
        render: h => h(App)
      })

      return { app }
    }
    ```

    </code-block>

    <code-block label="router.js">

    ```js
    import Vue from 'vue'
    import VueRouter from 'vue-router'

    Vue.use(VueRouter)

    export function createRouter () {
      return new VueRouter({
        mode: 'history',
        routes: [
          {
            path: '/',
            component: () => import('./src/Home.vue')
          },
          {
            path: '/about',
            component: () => import('./src/About.vue')
          }
        ]
      })
    }
    ```

    </code-block>
  </code-group>

#### 构建的区别

SPA纯客户端只需构建客户端的bundle用于控制程序即可，SSR由于需要在服务端生成程序的初始化快照，所以也要配合生成server bundle来生成初始化状态

![SSR构建流程](https://cloud.githubusercontent.com/assets/499550/17607895/786a415a-5fee-11e6-9c11-45a2cfdf085c.png)

#### 数据的预取和状态

SPA的DOM更新依赖于响应式的data，可以在created中异步的通过[axios](https://github.com/axios/axios)来获取数据，之后更新data即可，但SSR需要渲染app的快照，要保证在渲染程序之前，就已经拿到需要的数据了，所以我们需要提供一种获取数据的方式，独立于组件之外的（组件开始渲染的时候就已经有了初始化的数据），这里利用Vuex来作为选择，同时配合asyncData作为一种组件的静态方式去获取数据，在组件开始渲染的时候，需要保证asyncData已经拿到需要预取的数据。[官方文档](https://ssr.vuejs.org/zh/guide/data.html#%E5%B8%A6%E6%9C%89%E9%80%BB%E8%BE%91%E9%85%8D%E7%BD%AE%E7%9A%84%E7%BB%84%E4%BB%B6-logic-collocation-with-components)

## 从0搭建一个完整的SSR项目

该部分还没开始
