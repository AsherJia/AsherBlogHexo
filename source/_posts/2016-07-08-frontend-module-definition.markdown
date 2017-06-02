---
layout:     post
title:      "AMD CDM COMMONJS"
subtitle:   "前端模块化"
date:       2016-07-04 15:23
author:     "Asher"
header-img: "home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Frontend
---

### CMD
CMD推崇依赖就近，可以把依赖写进你的代码中的任意一行。
```javascript
define(function(require, exports, module) {
    var a = require('./a');
    a.doSomething();
    var b = require('./b');
    b.doSomething();
})；
```

### AMD
AMD是依赖前置的，换句话说，在解析和执行当前模块之前，模块作者必须指明当前模块所依赖的模块。
```javascript
define(['./a','./b'],function(a,b) {
     a.doSomething()
     b.doSomething()
});
```

### COMMONJS
CommonJS是服务端模块的规范，Node.js采用了这个规范。
根据CommonJS规范，一个单独的文件就是一个模块。加载模块使用require方法，该方法读取一个文件并执行，最后返回文件内部的exports对象。
```javascript
console.log("evaluating example.js");

var invisible = function () {
    console.log("invisible");
};

exports.message = "hi";

exports.say = function () {
    console.log(message);
};

var example = require('./example.js');

{
    message: "hi",
    say: [Function]
}

var example = require('./example');
```

CommonJS 最初只专注于 Server-side 而非浏览器环境，因此它采用了同步加载的机制，这对服务器环境（硬盘 I/O 速度）不是问题，而对浏览器环境（网速）来说并不合适。

因此，各种适用于浏览器环境的模块框架与标准逐个诞生，他们的共同点是：
- 采用异步加载（预先加载所有依赖的模块后回调执行，符合浏览器的网络环境）
- 虽然代码风格不同，但其实都可以看作 CommonJS Modules 语法的变体。
- 都在向着 COMMON 的方向进化：兼容不同风格，兼容浏览器和服务器两种环境

### AMD规范与CommonJS规范的兼容性
CommonJS规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。AMD规范则是非同步加载模块，允许指定回调函数。

由于Node.js主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以CommonJS规范比较适用。但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用AMD规范。


### UMD
因为AMD，CommonJS规范是两种不一致的规范，虽然他们应用的场景也不太一致，但是人们仍然是期望有一种统一的规范来支持这两种规范。于是，UMD（Universal Module Definition，称之为通用模块规范）规范诞生了。

客观来说，这个UMD规范看起来的确没有AMD和CommonJS规范简约。但是它支持AMD和CommonJS规范，同时还支持古老的全局模块模式。

```javascript
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.jQuery);
    }
}(this, function ($) {
    //    methods
    function myFunc(){};

    //    exposed public method
    return myFunc;
}));
```

> 人觉得UMD规范更像一个语法糖。应用UMD规范的js文件其实就是一个立即执行函数。函数有两个参数，第一个参数是当前
> 运行时环境，第二个参数是模块的定义体。在执行UMD规范时，会优先判断是当前环境是否支持AMD环境，然后再检验是否支
> 持CommonJS环境，否则认为当前环境为浏览器环境（window）。当然具体的判断顺序其实是可以调换的。

```javascript
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'underscore'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('jquery'), require('underscore'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.jQuery, root._);
    }
}(this, function ($, _) {
    //    methods
    function a(){};    //    private because it's not returned (see below)
    function b(){};    //    public because it's returned
    function c(){};    //    public because it's returned

    //    exposed public methods
    return {
        b: b,
        c: c
    }
}));
```
