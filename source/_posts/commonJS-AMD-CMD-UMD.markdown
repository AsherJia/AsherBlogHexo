---
layout:     post
title:      "Loade Model"
subtitle:   "Model"
date:       2017-04-06
author:     "Asher"
header-img: "home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Model
---

# CommonJS

CommonJS是服务器端模块加载规范， NodeJS采用此规范。
一个单独的文件就是一个模块，加载模块使用require方式，该方法读取一个文件并执行，最后返回文件内部的exports对象。

```javascript
// foobar.js
var test = 123;

function foobar () {
    this.foo = function() {

    }

    this.bar = function() {

    }
}

var foobar = new foobar();

exports.foobar = foobar;

```

```javascript
// require方式默认读取js文件，所以可以省略js后缀
var test = require('./foobar).foobar;

test.bar();
```

CommonJS加载模块是同步的，所以只有加载完成后才能执行后面的操作。像NodeJS主要用户服务器的变成，加载模块一般都已经存在本地硬盘，所以加载起来比较快，不用考虑一部加载的方式，所以CommonJS规范比较适用。但如果是浏览器环境，要从服务器加载模块，这时就必须采用异步加载（AMD, CMD）。

# AMD (Asynchromous Module Definition)

AMD 是 RequireJS 在推广过程中对模块定义的规范化产出
AMD一部加载模块。它的模块支持对象、函数、构造器、字符串、JSON等各种类型的模块

使用AMD规范使用define方法定义模块

```javascript
// 通过数组引入依赖，回调函数通过形参传入依赖
define(['someModule1', 'someModule2'], function(someModule1, someModule2) {
    function foo () {
        // something
        someModule1.test()
    }

    return { foo }
})
```

AMD规范允许输出模块兼容CommonJS规范，这时define方法如下：

```javascript
define(function(require, exports, module) {
    var reqModule = require('./someModule')
    requModule.test()

    exports.asplode = function() {
        // something
    }
})
```

# CMD

> CMD是SeaJS在推广过程中对模块定义的规范化产出

CMD和AMD的区别有一下几点：
- 对于依赖的模块AMD是提前执行，CMD是延迟执行。不过RequireJS从2.0开始，也可以改成延迟执行（根据写法不同，处理方式不同）。
- CMD推崇依赖就近，AMD推崇依赖前置。

```javascript
// AMD
define(['./a', './b'], functino() {
    // 依赖一开始就写好
    a.test()
    b.test()
})

// CMD
define(function(require, esportsm, module) {
    // 依赖可以就近书写
    var a = require('./a')
    a.test()

    // 软依赖
    if (status) {
        var b = require('./b')
        b.test()
    }
})
```

虽然AMD也支持CMD写法，但依赖前置是官方文档的默认模块定义写法。


# UMD

UMD是AMD和CommonJS的糅合

AMD 浏览器第一的原则发展 异步加载模块。

CommonJS 模块以服务器第一原则发展，选择同步加载，它的模块无需包装(unwrapped modules)。

这迫使人们又想出另一个更通用的模式UMD （Universal Module Definition）。希望解决跨平台的解决方案。

UMD先判断是否支持Node.js的模块（exports）是否存在，存在则使用Node.js模块模式。

再判断是否支持AMD（define是否存在），存在则使用AMD方式加载模块。


```javascript
(function (window, factory) {
    if (typeof exports === 'object') {
        module.exports = factory()
    } else if (typeof define === 'function' && define.amd) {
        define(factory)
    } else {
        window.eventUtil = factory()
    }
})(this, function () {
    //module ...
})
```

