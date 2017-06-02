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
Foo.prototype.getName = function () {
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

new Foo().getName() => (new Foo()).getName() => new Foo()

new new Foo().getName() => new ((new Foo()).getName)()

```

# This绑定类型

* 默认绑定: 就是什么都匹配不到的情况下，非严格模式this绑定到全局对象window或者global
* 隐式绑定: 绑定到undefined;隐式绑定就是函数作为对象的属性，通过对象属性的方式调用，这个时候this绑定到对象
* 显示绑定: 通过apply和call调用的方式
* new绑定:
