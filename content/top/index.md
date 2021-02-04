---
title: VueCli 3.x中集成Mock Api
description: VueCli3.0，Nodejs，Express，Webpack相关配合脚手架完成Api的Mock
image: http://static.journeynes.com/ssr-blog/blog1-1.jpg
tag: Webpack,VueCli,Node,Express
time: 2020/12/23
---

## 使用场景

哎哟，好烦啊，这个需求还么结束就来下一个需求，程序员不要排期的吗？

没办法啊，XX主义的XX嘴脸啊

来吧，技术评审我俩把接口格式对一把，你先开发，我这边结束了我跟上，再联调

MMP，那又增加了我的工作量啊，每次我都要自己先把数据放在一个配置文件中，引入使用，然后对接的
时候还得删除无用代码，好气

你自己Mock接口啊，就向我们后端经常用PostMan一样模拟请求啊

Mock？？我去查查看


## Mock的概念

#### 1. Mock的描述

   Mock接口就是模拟真实接口的调用，提供一个在开发环境的模拟数据，甚至可以是真实数据。在开发时，经常出现接口不能够及时的完成，导致开发过程中添加一些额外的<span class="text-primary-500 text-lg">工作量</span>。接下来围绕着Vuecli为主体展开一下如何在开发环境去Mock接口。

#### 2. Mock解决的问题

- 减少额外工作，在没有Mock接口的时候我们模拟数据的方式很烦躁（见下方），比如list列表，需要在data中声明list，去调试内容，或者引入一个JSON，导致在联调调用接口的部分代码没有写，联调成功的时候要删除很多无用代码 <span class="font-bold">---></span> 通过Mock在联调的时候只需把Mock接口的地址换成真是地址即可

```js[list.vue]
import { listData } from 'mock/list.js'

export default {
  data() {
    return {
      list: listData
    }
  }
}
```
- 采用上述的方式去模拟数据，缺少接口所具备的状态，比如删除接口，有成功和失败的状态码，模拟删除，更新操作就很无力 <span class="font-bold">---></span> 通过Mock，实实在在的请求，修改对应的mock接口即可

#### 3. Mock的几种方式和优缺点

<div class="mt-4"></div>

Mock的方式 | 优缺点
----| ----
本地Mock接口(本文介绍的方式) | 优点：可以更加细粒度的控制接口的内容。缺点：需要增加本地的代码量，需要配置webapck
[Mock.js](http://mockjs.com/)实现ajax拦截 | 优点：数据通过mock.js会更丰富。缺点：增加一些本地配置，拦截ajax，项目的接口转发配置需要考虑清楚
后端Controller的静态JSON | 优点：接口联调不需要修改任何东西。缺点：修改Mock内容沟通成本高，跟后端扯皮
[FastMock](http://fmdocs.fastmock.site/book/)模拟接口 | 优点：可控内容以及实现动态Restful api。缺点：项目的请求转发配置需要特殊处理，项目的数据结构会暴露

#### 4. 本地Mock接口

该篇文章针对本地Mock接口进行操作，其他的方式会给出对应的链接，如果有需要，自行去查阅。

## 本地Mock所需知识

>本地Mock的思想就是利用Node + express完成Restful Api。结合webpack配置项devServer同时利用Vue-cli3.0的暴露的配置利用开发环境的express完成mock的接口

#### 1. Node+Express

用node+express写过Restful Api的就应该知道接下来Mock怎么处理了，这里我先简要介绍一下我们需要用到的技术吧（Express的路由以及一些中间件）

- Express路由相关，具体的见文档，这里不区分请求方法，直接app.use

```js[index.js]
const express = require('express');
const app = express();

// 这样一个简单的路由就完成了，请求到/ajax-get-info的请求就能拿到对应的JSON数据
app.use('/ajax-get-info', (req, res) => {
  res.send({
    "success": true,
    "code": 0,
    "data": {}
  })  
});

app.listen(3000, () => { console.log('server listen on port 3000') })
```

- 添加中间件，处理请求的query和body。利用body-parser来获取请求的payload，挂载在req.body上

  <alert type="warning">

  需要注意的是body-parser中间件不能在express全局路由使用，不然会影响到其他通过http-proxy-middleware代理的接口，这里我们需要单独的添加一个Mock路由，针对[路由级别](https://www.expressjs.com.cn/guide/using-middleware.html)的使用中间件

  </alert>

```js[index.js]
const express = require('express');
const bodyParser = require('body-parser');

// mock的路由
const mockRouter = express.Router();

// 针对路由级别使用中间件
// express middleware bodyParser for mock server
// for parsing application/json
mockRouter.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
mockRouter.use(bodyParser.urlencoded({ extended: true }));

// 使用mock路由，这里的api prefix 后续有作用
app.use('/mock', mockRouter);

// 添加路由业务逻辑
mockRouter.use('/ajax-get-info', (req, res) => {
  // req.body可以获取到post request的payload
  console.log(req.body);
  
  res.send({
    "success": true,
    "code": 0,
    "data": {
      name: req.body.name  
    }
  })
});
```

- Mock级别的路由已经有了，接下来我们就要准备对应的路由和响应的callback了，添加一个mock文件夹，专门放置一些mock接口的文件，来设置请求的路由和针对路由的处理

<code-group>
  <code-block label="index.js" active>

  ```js
  const path = require('path');
  const mockDir = path.resolve(__dirname, './mock');

  fs.readdirSync(mockDir).forEach(file => {
      const mock = require(path.resolve(mockDir, file));
      // 此处mockRouter就是上面Mock路由
      mockRouter.use(mock.api, mock.response);
  });
  ```

  </code-block>
  <code-block label="mock/test.js">

  ```ts
  // 每一个新的mock api都是一个结构类似的js文件
  interface MockApi {
    api: string,
    response: () => void
  }

  // 注意，由于是针对子路由级别的，前端业务调用的url为/mock/get-info
  module.exports = {
    api: '/get-info',
    response: (req, res) => {
      // 由于添加了body-parser中间件，所以可以解析传入的body，这里就可以用来动态的生成JSON
      const flag = req.body.flag;

      console.log(req.body);

      res.send(
        {
          success: flag,
          code: 0,
          data: [],
          message: '获取信息成功',
        },
      );
    },
  };
  ```

  </code-block>
</code-group>

#### 2. VueCli 3.x的基本知识

对比VueCli 2.x的版本，3.x把webpack的配置封装出来，抛出一个[config文件](https://cli.vuejs.org/zh/config/)去修改配置，我们需要了解的是针对开发模式[express](https://www.expressjs.com.cn/)的使用（脚手架开发环境使用[webpack-dev-serve](https://www.webpackjs.com/configuration/dev-server/)。可以在VueCli 3.x的config中针对devServer去处理express实例即可

```js[vue.config.js]
module.exports = {
  // 其他的配置
  dev: {
    before: (app) => {
      // app就是开发环境底层的express实例，那么把之前的操作针对app操作一遍即可
    }  
  }
}
```

## 整体的代码展示

- 安装依赖(body-parser)，更新package.json文件
- 项目根目录的mock文件夹，用于存放mock api
- vue.config.js配置开发环境的express实例

<alert type="info">

mock文件夹下面定义的js文件的路由为/test，在vue.config.js中app.use('/mock')作为api子路由，那么在业务开发中调用api的接口为/mock/test，为两者的拼接，可自行修改

</alert>

<code-group>
  <code-block label="vue.config.js" active>

  ```js
  const path = require('path');
  const express = require('express');
  const bodyParser = require('body-parser');
  const fs = require('fs')

  module.exports = {
    // ...其他的配置项
    dev: {
      // ...devServer的其他配置项
      before: (app) => {
        // 这里是mock文件夹所有的js文件，一个js文件就是一个mock api
        const mockDir = path.resolve(__dirname, '../mock');
        const mockRouter = express.Router();
        // express middleware bodyParser for mock server
        mockRouter.use(bodyParser.json()); // for parsing application/json
        mockRouter.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
        app.use('/mock', mockRouter);

        // node fs模块遍历文件夹，依次利用use来生成api
        fs.readdirSync(mockDir).forEach(file => {
          const mock = require(path.resolve(mockDir, file));
          mockRouter.use(mock.api, mock.response);
        });
      },
    },
  };
  ```

  </code-block>
  <code-block label="mock/test.js">

  ```js
  module.exports = {
    api: '/test',
    response: (req, res) => {
      console.log(req.body)

      res.send(
        {
          success: flag,
          code: 0,
          data: [],
          message: 'success',
        },
      );
    },
  };
  ```

  </code-block>
</code-group>

## React项目如何实现mock

拓展，create-react-app如何实现本地mock api，利用相同的思路，找到express实例即可，通过[cra官网关于请求代理](https://create-react-app.dev/docs/proxying-api-requests-in-development)的介绍，代码如下

>If the proxy option is not flexible enough for you, you can get direct access to the Express app instance and hook up your own proxy middleware.

<alert type="info">

在**src**目录下添加setupProxy.js文件

</alert>

```js[src/setupProxy.js]
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')

module.exports = function (app) {
    const mockDir = path.resolve(__dirname, './mock')
    const mockRoute = express.Router()

    mockRoute.use(bodyParser.json())
    mockRoute.use(bodyParser.urlencoded({ extended: true }))
    app.use('/mock', mockRoute)

    fs.readdirSync(mockDir).forEach((file) => {
        const mock = require(path.resolve(mockDir, file))

        mockRoute.use(mock.api, mock.response)
    })

    app.use(proxyMiddleware)
}
```

## 总结

前端工程化的出现让前端的职责范围广了很多，也可以做一些有意思的事情，接下来我尝试着把这个mock作为一个webpck插件制作出来，敬请期待