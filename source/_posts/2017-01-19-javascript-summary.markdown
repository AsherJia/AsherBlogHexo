---
layout:     post
title:      "Javascript Summary"
subtitle:   "Javascript"
date:       2016-05-19 09:30:00
author:     "Asher"
header-img: "home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Javascript
---

# [Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

- 意义与使用场景 > Object.defineProperty可以监听某个对象的属性的设置与取值，并且可以自定义相关函数。 > PS：对象初始化的值会被清空，定义初始值只能在函数内部定义
- 语法 javascript Object.defineProperty(objName, propName, descriptor);
- 参数
    - objName：需要定义属性的对象。
    - propName：需定义或修改的属性的名字。
    - descriptor：将被定义或修改的属性的描述符。

```javascript
{
    configurable: false, // 当且仅当configurable为true时，当前propName才能够被改变，也能够被删除。默认为 false。
    enumerable: false, // 当且仅当enumerable为true时，当前propName才能够出现在对象的枚举属性中。默认为 false。
    value: null, // 当前propName对应的值。可以是任何有效的JavaScript值（数值，对象，函数等）。默认为 undefined。这就是解释了为什么：”对象初始化的值会被清空，定义初始值只能在函数内部定义。“
    writable: false // 当且仅当writable为true时，当前propName才能被赋值运算符改变。默认为 false。
    get: function() { // getter方法。该方法返回值被用作属性值。默认为 undefined。
        // 其他的代码…
        return 'self define value'; // 也可以没有返回值，默认为 undefined
    },
    set: function(_val) { // setter方法。如果没有 setter 则为 undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。
        // 其他的代码…
    }
}
```
> PS: 数据描述符和存取描述符不能混合使用。比如get 和 value不可以共存。

* 返回值 > 返回传入函数的对象，即第一个参数obj

# 用JS求出元素的最终的background-color，不考虑元素float情况。

* [Window.getComputedStyle()](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle)
* [HTMLElement.style](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/style)
* [Element.currentStyle](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/currentStyle)


> widow.getComputedStyle (获取css中设置的样式，'准浏览器'。返回的对象中，驼峰命名和中划线命名的都有，如：background-color和backgroundColor都有。 element.style (获取的是元素行间设置的样式) element.currentStyle (ie低版本)

```javascript
// 获取指定元素的某个CSS样式，兼容IE
var getStyle = function($el, _attr) {
    if(window.getComputedStyle) {
        return window.getComputedStyle($el, null)[_attr]
    }
    if($el.currentStyle) {
        return $el.currentStyle[_attr];
    }
    return $el.style[_attr];
}

var getBG = function($el) {
    var color = getStyle($el, 'backgroundColor');
    if(color === 'rgba(0, 0, 0, 0)' || color === 'transparent') { // 判断是否透明
        return $el.tagName === 'HTML' ? 'rgb(255, 255, 255)' : arguments.callee($el.parentNode, 'backgroundColor');
    } else {
        return color;
    }
}
```
