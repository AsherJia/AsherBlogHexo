---
layout:     post
title:      "webpack"
subtitle:   "Github"
date:       2016-05-19 09:30:00
author:     "Asher"
header-img: "webpack-bg.png"
header-mask: 0.3
catalog:    true
tags:
    - WebPack
---

### Webpack
Two core philosophies of Webpack are:
* Everything is a module — Just like JS files can be “modules”, everything else (CSS, Images, HTML) can also be modules. That is, you can require(“myJSfile.js”) or require(“myCSSfile.css”). This mean we can split any artifact into smaller manageable pieces, reuse them and so on.
* Load only “what” you need and “when” you need — Typically module bundlers take all the modules and generate a large single output “bundle.js” file. But in many real-world apps, this “bundle.js” could be 10MB-15MB and could take forever to load! So Webpack has various features to split your code and generate multiple “bundle” files, and also load parts of the app asynchronously so that you just load what you need and when you need it.

### Install
```javascript
// golbal install
npm install -g webpack

// install in your local workspace
npm install --save-dev webpack

// install webpack dev server
npm install webpack-dev-server --save
```

### Devtool
> source-map: 在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的source map，但是它会减慢打包文件的构建速度

> cheap-module-source-map: 在一个单独的文件中生成一个不带列映射的map，不带列映射提高项目构建速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便

> eval-source-map: 使用eval打包源文件模块，在同一个文件中生成干净的完整的source map。这个选项可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。不过在开发阶段这是一个非常好的选项，但是在生产阶段一定不要用这个选项

> cheap-module-eval-source-map: 这是在打包文件时最快的生成source map的方法，生成的Source Map 会和打包后的JavaScript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点

### Config

```javascript
var webapck = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',

    output: {
        path: __dirname + '/public',
        publicPath: '/',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            { test: /\.json$/, loader: 'json' },
            { test: /\.jsx?$/, include: '/public/src', loader: 'babel' },
            { test: /\.css$/, loader: 'style!css?redules!postcss' }, // 感叹号的作用在于使同一文件能够使用不同类型的loader
            { test: /\.png$/, loader: 'url-loader?limit=1024' },
            { test: /\.png$/, loader: 'url-loader', query: { limit: 1024 } },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },

    //.bablerc
    // {
    //  "presets": ["react", "es2015"]
    // },

    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    postcss: {
        require('autoprefixer')
    },

    plugins: [
        new HtmlWebpackPlugin{
            template: './public/index.template.html',
            inject: true
        },
        new webpack.HotModuleReplacementPlugin(),
    ],

    devtool: 'source-map',
    devServer: {
        colors: true,
        historyApoFailback: true,
        inLine: true,
        hot: true,
        contentBase: './public'
    }


}
```
###### Loader
> test: 匹配loaders所处理文件的拓展名的正则表达式
> loader: loader名
> include/exclude: 手动添加必须处理或者屏蔽不需要处理的文件
> query: 为loaders提供额外的设置选项

###### DevServer
> contentBase: 默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到“public"目录）
> port: 设置默认监听端口，如果省略，默认为”8080“
> inline: 设置为true，当源文件改变时会自动刷新页面
> colors: 设置为true，使终端输出的文件为彩色的
> historyApiFallback: 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html


### Plugin
###### PostCSS + autoprefixer

 ```javascript
    module: {
        loaders: [{ test: /\.css$/, loader: 'style!css?modules!postcss' }]
    },
    postcss: [
        require('autoprefixer')//调用autoprefixer插件
    ],
 ```

###### webpack.BannerPlugin
> 版权声明插件

```javascript
    new webpack.BannerPlugin("Copyright Flying Unicorns inc.")//在这个数组中new一个就可以了
```

###### HtmlWebpackPlugin
```javascript
    new HtmlWebpackPlugin({
        template: __dirname + "/app/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数
    })
```

###### Hot Module Replacement
```javascript
    new webpack.HotModuleReplacementPlugin()//热加载插件
    devServer: {
        colors: true,
        historyApiFallback: true,
        inline: true,
        hot: true
    }
```

###### OccurenceOrderPlugin
> 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID

```javascript
    new webpack.optimize.OccurenceOrderPlugin()
```

###### UglifyJsPlugin
> 压缩JS代码

 ```javascript
    new webpack.optimize.UglifyJsPlugin()
 ```

###### ExtractTextPlugin
> 分离CSS和JS文件

```javascript
    new ExtractTextPlugin("style.css")
```

### Caching
> 缓存无处不在，使用缓存的最好方法是保证你的文件名和文件内容是匹配的（内容改变，名称相应改变）

```javascript
    output: {
       path: __dirname + "/build",
       filename: "[name]-[hash].js"
    },
    plugins: [
        new ExtractTextPlugin("[name]-[hash].css")
    ]
```

### Code Splitting
> It’s an opt-in feature. You can define split points in your code base. Webpack takes care of the dependencies, output files and runtime stuff.

###### CommonJS: require.ensure
> The require.ensure method ensures that every dependency in dependencies can be synchronously required when calling the callback. callback has no parameter.
```javascript
    // require.ensure only loads the modules, it doesn’t evaluate them
    require.ensure(["module-a", "module-b"], function() {
      var a = require("module-a");
      // ...
    });
```

###### AMD: require
> The AMD spec defines an asynchronous require method with this definition
```javascript
    require(["module-a", "module-b"], function(a, b) {
      // ...
    });
    // Note: AMD require loads and evaluate the modules. In webpack modules are evaluated left to right.
    // Note: It’s allowed to omit the callback.
```

###### ES6 Modules
> Webpack doesn’t support ES6 modules; use require.ensure or require directly depending on which module format your transpiler creates.
> Luckily, there is a JavaScript API “loader” specification being written to handle the dynamic use case: System.load (or System.import). This API will be the native equivalent to the above require variations. However, most transpilers do not support converting System.load calls to require.ensure so you have to do that directly if you want to make use of dynamic code splitting.

```javascript
    //static imports
    import _ from 'lodash'

    // dynamic imports
    require.ensure([], function() {
        let contacts = require('./contacts')
    })
```

###### Chunk content
> All dependencies at a split point go into a new chunk. Dependencies are also recursively added.
> If you pass a function expression (or bound function expression) as callback to the split point, webpack automatically puts all dependencies required in this function expression into the chunk too.

###### Chunk optimization
> If two chunks contain the same modules, they are merged into one. This can cause chunks to have multiple parents.
> If a module is available in all parents of a chunk, it’s removed from that chunk.
> If a chunk contains all modules of another chunk, this is stored. It fulfills multiple chunks.

###### Chunk loading
> Depending on the configuration option target a runtime logic for chunk loading is added to the bundle. I. e. for the web target chunks are loaded via jsonp. A chunk is only loaded once and parallel requests are merged into one. The runtime checks for loaded chunks whether they fulfill multiple chunks.


###### Chunk types
######### Entry chunk
> An entry chunk contains the runtime plus a bunch of modules. If the chunk contains the module 0 the runtime executes it. If not, it waits for chunks that contains the module 0 and executes it (every time when there is a chunk with a module 0)

######### Normal chunk
> A normal chunk contains no runtime. It only contains a bunch of modules. The structure depends on the chunk loading algorithm. I. e. for jsonp the modules are wrapped in a jsonp callback function. The chunk also contains a list of chunk id that it fulfills.

######### Initial chunk (non-entry)
> An initial chunk is a normal chunk. The only difference is that optimization treats it as more important because it counts toward the initial loading time (like entry chunks). That chunk type can occur in combination with the CommonsChunkPlugin.

```javascript
var webpack = require("webpack");

module.exports = {
  entry: {
    app: "./app.js",
    vendor: ["jquery", "underscore", ...],
  },
  output: {
    filename: "bundle.js"
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
  ]
};
// This will remove all modules in the vendor chunk from the app chunk. The bundle.js will now contain just your app code, without any of its dependencies. These are in vendor.bundle.js.
// In your HTML page load vendor.bundle.js before bundle.js.
<script src="vendor.bundle.js"></script>
<script src="bundle.js"></script>


var webpack = require("webpack");
module.exports = {
  entry: { a: "./a", b: "./b" },
  output: { filename: "[name].js" },
  plugins: [ new webpack.optimize.CommonsChunkPlugin("init.js") ]
}

<script src="init.js"></script>
<script src="a.js"></script>
<script src="b.js"></script>
```
###### Optimization
    * LimitChunkCountPlugin
    * MinChunkSizePlugin
    * AggressiveMergingPlugin
    [Config Plugin List](https://webpack.github.io/docs/list-of-plugins.html){:target="_blank"}


http://www.pro-react.com/materials/appendixA/
https://github.com/eyasliu/blog/issues/8
http://www.alloyteam.com/2016/02/code-split-by-routes/
http://www.jianshu.com/p/42e11515c10f

https://medium.com/@rajaraodv/webpack-the-confusing-parts-58712f8fcad9#.m1an35go2
https://medium.com/@rajaraodv/why-redux-needs-reducers-to-be-pure-functions-d438c58ae468#.xcb5p2yux
https://medium.com/@rajaraodv/webpacks-hmr-react-hot-loader-the-missing-manual-232336dc0d96#.mxeblxujo
https://medium.com/@rajaraodv/webpack-hot-module-replacement-hmr-e756a726a07#.bsm92y6nd
https://medium.freecodecamp.com/5-javascript-bad-parts-that-are-fixed-in-es6-c7c45d44fd81#.jtdaohm3n


https://gold.xitu.io/post/5842ea76128fe10058a3b4f0




https://github.com/gwuhaolin/blog/issues/2
