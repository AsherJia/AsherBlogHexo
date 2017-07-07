---
layout:     post
title:      "javascript source code"
subtitle:   "Github"
date:       2016-05-19 09:30:00
author:     "Asher"
header-img: "home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - javascript
---
### Object-assign
> Object.assign({'a':1, 'b':2}, {'c':3})
> Object.assign({}, {'a':1, 'b':2}, {'c':3})

```javascript
'use strict'
// 返回一个布尔值，表明指定的属性名是否是当前对象可枚举的自身属性
var propIsEnumerable = Object.prototype.propertyIsEnumerable

function ToObject(val) {
    if (val == null) {
        throw new TypeError('Object.assign cannot be called with null or undefined')
    }

    return Object(val)
}

function ownEnumerableKeys(obj) {
    // 返回一个数组，它包含了指定对象所有的可枚举或不可枚举的属性名。
    var keys = Object.getOwnPropertyNames(obj)

    // ES6 返回一个数组，该数组包含了指定对象自身的（非继承的）所有 symbol 属性键。
    if (Object.getOwnPropertySymbols) {
        keys = keys.concat(Object.getOwnPropertySymbols(obj))
    }

    return keys.filter(function (key) {
        return propIsEnumerable.call(obj, key)
    })
}

module.exports = Object.assign || function (target, source) {
	var from
	var keys
	var to = ToObject(target)

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s]
		keys = ownEnumerableKeys(Object(from))

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]]
		}
	}

	return to
}
```

### function.bind()

```javascript
Function.prototype.bind = function(context){
  var args = Array.prototype.slice(arguments, 1),
  F = function(){},
  self = this,
  bound = function(){
      var innerArgs = Array.prototype.slice.call(arguments);
      var finalArgs = args.concat(innerArgs);
      return self.apply((this instanceof F ? this : context), finalArgs);
  };

  F.prototype = self.prototype;
  bound.prototype = new F();
  return bound;
};

Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(
              this instanceof fNOP && oThis ? this : oThis || window,
              aArgs.concat(Array.prototype.slice.call(arguments))
          );
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };

function sub_curry(fn /*, variable number of args */) {
    var args = [].slice.call(arguments, 1);
    return function () {
        return fn.apply(this, args.concat(toArray(arguments)));
    };
}

function curry(fn, length) {
    // capture fn's # of parameters
    length = length || fn.length;
    return function () {
        if (arguments.length < length) {
            // not all arguments have been specified. Curry once more.
            var combined = [fn].concat(toArray(arguments));
            return length - arguments.length > 0
                ? curry(sub_curry.apply(this, combined), length - arguments.length)
                : sub_curry.call(this, combined );
        } else {
            // all arguments have been specified, actually call function
            return fn.apply(this, arguments);
        }
    };
}
```
