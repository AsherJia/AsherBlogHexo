---
layout:     post
title:      "Frontend Interview Question"
subtitle:   "Frontend Interview Question"
date:       2017-03-22
author:     "Asher"
header-img: "home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Frontend
---

# Lazy Man

```javascript
function _LazyMan(name){
    this.task = [];
    var self = this;
    var fn = (function(n){
        var name = n;
        return function(){
            console.log('Hi This is ' + name + '!');
            self.next();
        }
    })(name)

    this.task.push(fn);
    setTimeout(function(){
        self.next();
    }, 0)
}

_LazyMan.prototype.next = function(){
    var fn = this.task.shift();
    fn && fn();
}

_LazyMan.prototype.eat = function(name){
    var self = this;
    var fn = (function(name){
        return function(){
            console.log('Eat ' + name + '~');
            self.next();
        }
    })(name)
    this.task.push(fn);
    return this;
}

_LazyMan.prototype.sleep = function(time){
    var self = this;
    var fn = (function(time){
        return function(){
            setTimeout(function(){
                console.log('Wake up after ' + time + 's!');
                self.next();
            }, time*1000)
        }
    })(time);
    this.task.push(fn);
    return this;
}


function LazyMan(name){
    return new _LazyMan(name);
}

LazyMan('Hank').sleep(1).eat('sss')
```

# Functional add

```javascript
var puls = (num) => {
    var adder = function() {
        var _args = []
        var _adder = function _adder() {
            [].push.apply(_args, [].slice.call(arguments))

            return _adder
        }

        _adder.toString = function() {
            return _args.reduce(function(a, b) {
                return a + b
            })
        }

        return _adder
    }

    return adder()(num)
}

puls(1)(2)

var add = (...outArguments) => {
    console.log('arguments1 ', outArguments)
    let _args = [].slice.call(outArguments)

    const adder = () => {
        const _adder = (..._innerArugments) => {
            console.log('arguments 3 ', _innerArugments);

            [].push.apply(_args, [].slice.call(_innerArugments))
            return _adder
        }

        _adder.toString = () => {
            console.log('ToString ', _args)
            return _args.reduce((a, b) => {
                return a + b
            })
        }

        return _adder
    }

    return adder.apply(null, [].slice.call(outArguments))
}

add(1)(2)(3)(4)
```

# 运算符优先级

[Mozilla](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)

|优先级|运算类型|关联性|运算符|
|-----|-------|-----|-----|
| 20 | 圆括号 | n/a | (...) |
| 19 | 成员访问 | 从左到右 | . |
| 19 | 需计算的成员访问 | 从左到右 | [] |
| 19 | new(带参数列表) | n/a | new...(...) |
| 19 | 函数调用 | 从左到右 | ...(...) |
| 18 | new（无参数列表）| new ... |

```javascript
function Foo() {
    getName = function () {
        console.log('1');
    };
    return this;
}
Foo.getName = function () {
    console.log('2');
};
Foo.`prototype`.getName = function () {
    console.log('3');
};
var getName = function () {
    console.log('4');
};
function getName() {
    console.log(5);
}

Foo.getName() 2
getName() 4
Foo().getName() 1
getName()  1

new Foo.getName() => new (Foo.getName()) => 2

new Foo().getName() => (new Foo()).getName() => 3

new new Foo().getName() => new ((new Foo()).getName)() => 3
```

```javascript
function curry(func) {
    var l = func.length

    return function curried() {
        var args = [].slice.call(arguments)

        if (args.length < l) {
            return function() {
                var argsInner = [].slice.call(arguments)
                return curried.apply(this, args.concat(argsInner))
            }
        } else {
            return func.apply(this, args)
        }
    }
}

var f = function(a,b,c) {
    return console.log([a,b,c])
}

var curried = curry(f)

curried(1)(2)(3)

function clone (value, isDeep) {
    if(value === null) return null;
    if(typeof value !== 'object') return value
    if (Array.isArray(value)) {
        if (isDeep) {
            return value.map(item => clone(item, true))
        }
        return [].concat(value)
    } else {
        if (isDeep) {
            var obj = {};
            Object.keys(value).forEach(item => {
                obj[item] = clone(value[item], true)
            })
            return obj;
        }
        return {...value}
    }
}
```

# This绑定类型

* 默认绑定: 就是什么都匹配不到的情况下，非严格模式this绑定到全局对象window或者global
* 隐式绑定: 绑定到undefined;隐式绑定就是函数作为对象的属性，通过对象属性的方式调用，这个时候this绑定到对象
* 显示绑定: 通过apply和call调用的方式
* new绑定:
