---
title: VUE SSR初探
description: VUE SSR是什么？它和传统的SPA的区别又是什么？来一起康一康
image: http://static.journeynes.com/ssr-blog/blog2-1.jpg
tag: Webpack,Vue,SSR,Nuxt
time: 2020/12/30
disabled: true
dataFetch:
  - 客户端和服务端对数据获取的同构方案可以通过给组件添加静态asyncData方法来获取
  - 服务端在把Vue实例app交给render渲染的时候，所有需要加载组件的asyncData全部执行完毕再去渲染（初始状态渲染需要数据全部拿到）
  - 客户端需要接管服务端初始化的数据，保证hydration成功，以及后续逻辑
  - 后续客户端在切换路由跳转也要把对应组件的asyncData逻辑执行一遍去获取数据（可以理解为了SSR同构应用，数据的获取都放在asyncData中，而不是在created和beforeCreate中获取）
---

## 什么是SSR

>Vue.js 是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM。然而，也可以将同一个组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。

通俗的说，SSR就是根据路由把SPA的初始状态在服务端进行渲染，生成一份快照供浏览器使用，后续<span class="text-primary-500">所有的</span>交互和路由的控制再由原来的‘SPA’控制（即浏览器输入about路由，则服务器渲染about页面，后续用户点击about的回到首页，则完全由客户端控制，不在经过服务端）

## 真的需要SSR吗？

可能大部分人只是听过SSR的概念，并没有实质的接触过SSR，所以在使用这个技术去落地项目的时候，我们需要考虑是否有必要去使用这个技术吗？

#### SSR对比SPA的优缺点

SSR对比SPA的优势：

- SEO，由于生成的HTML代码不再是一堆JS和CSS文件，而是包含了页面的内容，可以供搜索引擎爬虫工具的查看，收录
- time-to-content，获取到的html直接包含了内容，无需等待所有js下载好之后再进行数据的拉取

SSR对比SPA的限制

- 开发环境有限，由于需要在服务端执行生成初始化状态，导致Vue部分生命周期无法执行，同时部分第三方类库无法使用（使用了window，document等在浏览器存在的环境变量）
- 构建部署复杂的要求，SPA生成的是静态文件，而SSR需要处于Node.js环境
- 服务器的负载，SPA只需部署在静态文件的服务器上即可，而SSR需要Node.js渲染，需要占用CPU资源

#### SSR和预渲染

1. 内容到达时间 (time-to-content) 要求是绝对关键的指标，在这种情况下，服务器端渲染 (SSR) 可以帮助你实现最佳的初始加载性能
2. 如果只是针对少数营销页面的SEO，可以选择预渲染

    >预渲染方式，在构建时 (build time) 简单地生成针对特定路由的静态 HTML 文件。优点是设置预渲染更简单，并可以将你的前端作为一个完全静态的站点

    <alert type="info">

    注意预渲染之后会生成index.html和针对部分路由的html文件，在部署的时候如果采用history模式，需要注意fallback的控制

    </alert>

## SSR和SPA的区别

这部分来看看SSR和SPA的区别，分析在开发和webpack配置上应该做出哪些调整

#### 运行环境的区别

SSR由于初始化的快照需要在Node.js环境生成，而SPA完全在浏览器中执行，所以

- Vue只有beforeCreate和created生命周期会在SSR中执行，其他钩子在客户端执行
- beforeCreated和created生命周期中不能执行一些全局的副作用代码，比如setTimeout定时器，下面的代码created中setInterval其实是在node环境中执行的，beforeDesotry执行的时候已经处于客户端了

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
- 注意使用的类库有没有使用特定平台的API，初始化组件和对应生命周期中不能出现浏览器环境变量相关的代码
- 客户端代码每次刷新页面都是一个新的Vue实例，但SSR的处于Node.js进程，需要利用工厂模式，保证每次请求的状态都是独立的，包括Vue，VueRouter，Vuex的实例，如下

  <code-group>
    <code-block label="app.js" active>

    ```js
    import Vue from 'vue'
    import App from './src/App.vue'
    import { createRouter } from './router'
    import { createStore } from './store'

    // 对应的工厂函数
    export function createApp () {
      const router = createRouter();
      const store = createStore();

      const app = new Vue({
        store,
        router,
        render: h => h(App)
      })

      return { app, router, store }
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

    <code-block label="store.js">

    ```js
    import Vue from 'vue'
    import Vuex from 'vuex'

    Vue.use(Vuex)

    // 假定我们有一个可以返回 Promise 的
    // 通用 API（请忽略此 API 具体实现细节）
    import { fetchItem } from './api'

    export function createStore () {
      return new Vuex.Store({
        state: {
          items: {}
        },
        actions: {
          fetchItem ({ commit }, id) {
            // `store.dispatch()` 会返回 Promise，
            // 以便我们能够知道数据在何时更新
            return fetchItem(id).then(item => {
              commit('setItem', { id, item })
            })
          }
        },
        mutations: {
          setItem (state, { id, item }) {
            Vue.set(state.items, id, item)
          }
        }
      })
    }
    ```

    </code-block>
  </code-group>

#### 构建的区别

SPA纯客户端只需构建客户端的bundle用于控制程序即可，SSR由于需要在服务端生成程序的初始化快照，所以也需要生成server bundle来生成初始化状态，这里展示一下客户端entry和服务端entry

![SSR构建流程](http://static.journeynes.com/ssr-blog/blog2-2.png)

<code-group>
  <code-block active label="entry-client.js">

  ```js
  import { createApp } from './app'

  const { app, router } = createApp();

  // 客户端直接利用createApp生成Vue实例，挂载在<div id="app"></div>上
  router.onReady(() => {
    // 目前不考虑数据的拉取
    app.$mount('#app')
  })
  ```

  </code-block>
  <code-block label="entry-server.js">

  ```js
  import { createApp } from './app'

  // 这个服务端入口bundle是一个函数，用来生成Vue实例给vue-server-renderer来render成html字符串
  export default (context) => {
    return new Promise((resolve, reject) => {
      const { app, router } = createApp();

      // context会包含用户访问的路由(后续服务会传进来)
      router.push(context.url)

      router.onReady(() => {
        // 寻找匹配的组件
        const match = router.getMatchedComponents();

        if (!match.length) {
          return reject({ code: 404 })
        }

        resolve(app)
      }, reject)
    })
  }
  ```

  </code-block>
</code-group>

#### 数据的预取和状态

SPA的DOM更新依赖于响应式的data，可以在created中异步的通过[axios](https://github.com/axios/axios)来获取数据，之后更新data即可，但SSR需要的是渲染app的快照，要保证在渲染程序之前，就已经拿到需要的数据了，所以我们需要提供一种获取数据的方式，独立于组件之外的（组件开始渲染的时候就已经有了初始化的数据）但同时又和组件相关（那个组件获取那部分数据），这里利用Vuex来作为选择，同时配合asyncData作为一种组件的静态方式去获取数据，在组件开始渲染的时候，需要保证asyncData已经拿到需要预取的数据，这就需要我们在客户端和服务端分别处理好数据的获取。[Vue Ssr数据的预获取](https://ssr.vuejs.org/zh/guide/data.html#%E5%B8%A6%E6%9C%89%E9%80%BB%E8%BE%91%E9%85%8D%E7%BD%AE%E7%9A%84%E7%BB%84%E4%BB%B6-logic-collocation-with-components)

<list type="info" :items="dataFetch"></list>

**实现上面提到的几点**

1. 组件通过添加asyncData静态方式来获取数据

    <alert type="warning">

    在执行asyncData的时候，组件并没有初始化，是无法在asyncData中访问this的，所以需要的东西后续通过调用传参进去

    </alert>

    ```js[Item.vue]
    <template>
      <div>{{ item.title }}</div>
    </template>

    <script>
    export default {
      asyncData ({ store, route }) {
        // 触发 action 后，会返回 Promise
        return store.dispatch('fetchItem', route.params.id)
      },
      computed: {
        // 从 store 的 state 对象中的获取 item。
        item () {
          return this.$store.state.items[this.$route.params.id]
        }
      }
    }
    </script>
    ```

2. 服务端在render Vue实例的时候数据已经全部拿到，修改我们的entry-server.js

    <code-group>
      <code-block active label="新的entry-server.js">
      
      ```js[entry-server.js]
      import { createApp } from './app'

      export default (context) => {
        return new Promise((resolve, reject) => {
          const { app, router } = createApp();

          router.push(context.url)

          router.onReady(() => {
            const matchComponents = router.getMatchedComponents();

            if (!matchComponents.length) {
              return reject({ code: 404 })
            }

            // 需要把该路由匹配到的所有component的asyncData方法执行完再去resolve(app)
            Promise.all(matchComponents.map(Component => {
              if (Component.asyncData) {
                // 传入asyncData需要的参数store和route
                return Component.asyncData({
                  store,
                  route: router.currentRoute
                })
              }
            })).then(() => {
              // 这里涉及到第三分部，需要把这些初始化数据以一种方式交给客户端去hydration
              // 当我们将状态附加到上下文，
              // 并且 `template` 选项用于 renderer 时，
              // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
              context.state = store.state

              // 所有组件的asyncData拿到数据之后再去resolve app去render
              resolve(app)
            }).catch(reject)

          }, reject)
        })
      }
      ```
      
      </code-block>
      <code-block label="旧的entry-server.js">
      
      ```js[entry-server.js]
      import { createApp } from './app'

      export default (context) => {
        return new Promise((resolve, reject) => {
          const { app, router } = createApp();

          router.push(context.url)

          router.onReady(() => {
            const matchComponents = router.getMatchedComponents();

            if (!matchComponents.length) {
              return reject({ code: 404 })
            }

            resolve(app)
          }, reject)
        })
      }
      ```
      
      </code-block>
    </code-group>

    context.state会被注入到window.\_\_INITIAL_STATE\_\_，查看其它[模板配置](https://ssr.vuejs.org/zh/api/#template)

3. 客户端hydration需要把初始化的Vuex的state填充，保证hydration成功

    <code-group>
      <code-block active label="新的entry-client.js">
      
      ```js[entry-client.js]
      import { createApp } from './app'

      const { app, router, store } = createApp();

      // 服务端会注入__INITIAL_STATE__，需要replaceState
      if (windw.__INITIAL_STATE__) {
        store.replaceState(window.__INITIAL_STATE__)
      }

      router.onReady(() => {
        app.$mount('#app')
      })
      ```
      
      </code-block>
      <code-block label="旧的entry-client.js">
      
      ```js[entry-client.js]
      import { createApp } from './app'

      const { app, router } = createApp();

      router.onReady(() => {
        app.$mount('#app')
      })
      ```
      
      </code-block>
    </code-group>

4. 客户端接管之后，在路由切换的时候去找到对应组件执行asyncData（获取数据的逻辑放到了这里），这里有两种方式，每种方式有各自的优缺点，看自己需求

    - 在路由切换resolve时，执行组件的asyncData，<span class="text-primary-500">好处</span>就在于一旦路由切换过去，那么所有的数据都已经加载完毕，页面不会出现部分数据还在loading，<span class="text-primary-500">缺点</span>就是需要加载所有的数据，会让路由切换显的很卡顿，需要加loading指示。这个方案需要修改entry-client.js

      <code-group>
        <code-block active label="新的entry-client.js">
        
        ```js[entry-client.js]
        import { createApp } from './app'

        const { app, router, store } = createApp();
        
        if (windw.__INITIAL_STATE__) {
          store.replaceState(window.__INITIAL_STATE__)
        }

        router.onReady(() => {
          // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
          router.beforeResolve((to, from, next) => {
            const matched = router.getMatchedComponents(to)
            const prevMatched = router.getMatchedComponents(from)

            // 我们只关心非预渲染的组件
            // 所以我们对比它们，找出两个匹配列表的差异组件
            let diffed = false
            const activated = matched.filter((c, i) => {
              return diffed || (diffed = (prevMatched[i] !== c))
            })

            if (!activated.length) {
              return next()
            }

            // 这里如果有加载指示器 (loading indicator)，就触发

            Promise.all(activated.map(c => {
              if (c.asyncData) {
                return c.asyncData({ store, route: to })
              }
            })).then(() => {

              // 停止加载指示器(loading indicator)

              next()
            }).catch(next)
          })

          app.$mount('#app')
        })
        ```
        
        </code-block>
        <code-block label="旧的entry-client.js">
        
        ```js[entry-client.js]
        import { createApp } from './app'

        const { app, router, store } = createApp();

        if (windw.__INITIAL_STATE__) {
          store.replaceState(window.__INITIAL_STATE__)
        }

        router.onReady(() => {
          app.$mount('#app')
        })
        ```

        </code-block>
      </code-group>

    - 路由切换不做限制，直接切换到对应的页面，然后在对应组件里去执行数据获取操作，优点是可以立即切换路由视图，缺点就是渲染的视图不是完整的，这种方案需要针对每个组件处理，可以统一通过mixin处理

      ```js
      Vue.mixin({
        beforeRouteUpdate (to, from, next) {
          const { asyncData } = this.$options
          if (asyncData) {
            asyncData({
              store: this.$store,
              route: to
            }).then(next).catch(next)
          } else {
            next()
          }
        }
      })
      ```

## webapck构建配置

如果你了解过纯客户端的webpack配置，那么SSR的webpack配置类似，webpack.config.base.js、webpack.config.client.js、webpack.config.server.js

<code-group>
  <code-block active label="webpack.config.base.js">
  
  ```js[webapck.config.base.js]
  // 利用vue-loader来处理Vue组件
  const VueLoaderPlugin = require('vue-loader/lib/plugin')

  module.exports = {
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]                       
    },
    plugins: [
      new VueLoaderPlugin()
    ]
  }
  ```
  
  </code-block>
  <code-block label="webpack.config.client.js">
  
  ```js[webapck.config.client.js]
  // 注意你使用的webpack-merge版本
  const { merge } = require('webpack-merge');
  const baseConfig = require('./webpack.config.base');
  const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
  const path = require('path')
  const HtmlPlugin = require('html-webpack-plugin')

  module.exports = merge(baseConfig, {
    mode: 'production',
    entry: path.resolve(__dirname, './entry-client.js'),
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].client.js'
    },
    plugins: [
      // 生成vue-ssr-client-manifest.json文件，客户端资源清单，用于服务端render正确的把资源加载进来
      new VueSSRClientPlugin(),
    ]
  })
  ```

  </code-block>
  <code-block label="webpack.config.server.js">
  
  ```js[webapck.config.server.js]
  const { merge } = require('webpack-merge')
  const baseConfig = require('./webpack.base')
  const webpackExtranl = require('webpack-node-externals')
  const path = require('path')
  const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

  module.exports = merge(baseConfig, {
    mode: 'production',

    // 这个按照自己的目录来找
    entry: path.resolve(__dirname, './entry-server.js'),

    // 输出面向node版本的代码
    target: 'node',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].server.js',
      // 使用node的导出风格
      libraryTarget: 'commonjs2'
    },
    externals: [webpackExtranl()],
    plugins: [
      new VueSSRServerPlugin()
    ]
  })
  ```

  </code-block>
</code-group>

<alert type="info">

在此关于webpack配置方面的东西不展开，自行去了解[webpack](https://www.webpackjs.com/)

</alert>


## 搭建服务器

至此，我们关于SSR在开发和构建和SPA不同的地方已经有所了解，之后就可以利用webpack去构建客户端和服务端bundle，那么构建之后如果搭建服务器去使用这些bundle？这里利用[Express](https://www.expressjs.com.cn/)去搭建本地服务器

```js
const VueRenderer = require('vue-server-renderer');
const express = require('express');
const path = require('path')
const server = express();
const fs = require('fs')
const renderer = VueRenderer.createBundleRenderer(path.resolve(__dirname, './dist/vue-ssr-server-bundle.json'), {
  clientManifest: require('./dist/vue-ssr-client-manifest.json')
});

server.use(express.static('dist'))

// 这个服务可以处理所有get请求，目前只是简单的处理了项目路由，至于favicon没有处理
server.get('*', function (req, res) {
  // 还记得服务端entry.server.js 导出的函数接受了一次context么，这里把req的url传递了进去，去渲染对应页面的初始状态
  renderer.renderToString({ url: req.url }, (err, html) => {
    if (err) {
      res.status(500).end('服务器内部错误')
      return;
    }

    // 把html交给浏览器渲染
    res.send(html)
  })
})

server.listen(8888, () => {
  console.log('server listen on port 8888')
})
```

其实，SSR，只有在首次进入项目的某个页面或者刷新浏览器才经过服务端处理，一旦返回了html文件之后，后续的操作，只要不刷新浏览器，那么逻辑都由客户端bundle处理，就跟纯客户端的SPA一样，这就是我们通常称SSR是同构应用的原因

## 总结

关于SSR的东西本文只能带大家入个门，如果需要深入学习可以查看资料[VueSSR指南](https://ssr.vuejs.org/)。如真的需要SSR，也不必自己从头搭建，考虑使用[Nuxt.js](https://nuxtjs.org/)

<span class="text-primary-500">技术多种多样，在学习和落地之前多多考虑我们到底是否需要用到它</span>
