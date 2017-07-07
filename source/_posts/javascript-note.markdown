---
layout:     post
title:      "Javascript"
subtitle:   "Javascript"
date:       2016-05-23 15:08
author:     "Asher"
header-img: "post-bg-gulp.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Javascript
---

# 数据类型：

- 6种原始值（不可变。“除非重置当前变量，否则不能改变元素值。”）
    1. Null(只有一个值： null)
    1. Undefined(一个没有被赋值的变量会有个默认值 undefined)
    1. Number
    1. Boolean(两个值：true 和 false)
    1. String
    1. [Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- 和Object(对象指内存中的可以被标识符引用的一块区域)

- 数据类型检测
    - typeof(对变量或值调用 typeof 运算符将返回(字符串)下列值之一)
        1. undefined - Undefined类型
        1. number - Number类型
        1. boolean - Boolean类型
        1. string - String类型
        1. symbol - Symbol类型(ECMAScript6新增)
        1. function - 函数对象([[Call]]在ECMA-262条款中实现了)
        1. object - 引用类型 或 Null类型
    ```javascript
    typeof(Function) // function (Function是函数对象)
    typeof(new Function) // function (new Function也是是函数对象，同等：var func = function(){})
    typeof(Array) // function (Array是函数对象)
    typeof(new Array) // object（实例化的Array就是object）
    ```

- 变量赋值时候的返回值：
    ```javascript
    var name = 123; // 返回undefined
    name = 456; // 返回456
    ```
    > 结语：定义变量的时候赋值返回:undefined
    > 给已声明变量赋值时候返回当前赋值。

- 获取元素距离页面的top、left
    ```javascript
    function getRec(ele) {
        var _t = document.documentElement.clientTop,
            _l = document.documentElement.clientLeft,
            rect = ele.getBoundingClientRect();
        return {
            top: rect.top - _t,
            right: rect.right - _l,
            bottom: rect.bottom - _t,
            left: rect.left - _l
        }
    }
    ```
    > 注意：IE、Firefox3+、Opera9.5、Chrome、Safari支持，在IE中，默认坐标从(2,2)开始计算，导致最终距离比其他浏览器多出两个像素，我们需要做个兼容。

- 数字的固定小数位数
    ```javascript
    var a=8.88888,
        b=8;
    console.log(a.toFixed(2)); // 8.89 或者 8.88
    console.log(b.toFixed(2)); // 8.00
    ```

- js是编译语言，数组长度是随时程序变化而变化的
    ```javascript
    var arr = [0, 1];
    arr[3] = 3;
    console.log(arr[2]); // undefined
    console.log(arr.length); // 4
    ```

- 矩阵的转置
    ```javascript
    var arr = [ // 定义一个矩阵（二维数据）
        [1, 2, 3, 4],
        [5, 6, 6, 6],
        [7, 6, 7, 8],
        [8, 5, 3, 3]
    ];

    function changeArr(arr) { // 矩阵转置函数
        var c;
        for (var i = 1; i < arr.length; i++) {
            for (var j = 0; j < i; j++) {
                c = arr[i][j];
                arr[i][j] = arr[j][i];
                arr[j][i] = c;
            }
        }
    }
    changeArr(arr);
    console.table(arr);
    ```

- 冒泡排序方法
    ```javascript
    // 第一轮是对n-1的位置定位
    // 第二轮是 每一个位置的数的 确定
    var arr = [1, 100, 4, 5, 6, 99, 111, 112, 113, 133],
        temp = 0,
        flag = false;
    for (var i = 0; i < arr.length - 1; i++) {
        document.writeln('come');
        for (var j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                flag = true;
            }
        }
        if (flag) {
            flag = false;
        } else {
            console.log('brak')
            break;
        }
    }
    for (var i = 0; i < arr.length; i++) {
        document.writeln(arr[i]);
    };
    ```

- 二分查找
    ```javascript
    var arr = [41, 55, 76, 87, 88, 99, 123, 432, 546, 577, 688, 786];

    function binarySearch(arr, wantVal, leftIndex, rightIndex) {
        console.log('leftIndex: ' + leftIndex + ' rightIndex: ' + rightIndex)
        if (leftIndex > rightIndex) {
            document.writeln('SORRY: 找不到 ' + wantVal + ' ！');
            return;
        }
        var minIndex = Math.floor((leftIndex + rightIndex) / 2);
        if (arr[minIndex] > wantVal) {
            binarySearch(arr, wantVal, leftIndex, minIndex - 1);
        } else if (arr[minIndex] < wantVal) {
            binarySearch(arr, wantVal, minIndex + 1, rightIndex);
        } else {
            document.writeln('找到了 ' + wantVal + ' ,下标为' + minIndex);
        }
    }
    binarySearch(arr, 99, 0, arr.length - 1);
    ```

- js 对象访问属性的二种方式
    ```javascript
    function Person () {};
    var new1 = new Person ();
    new1.name='冯杰';
    new1.age=21;
    window.alert(new1.name);
    window.alert(new1["age"]);
    ```

- js delete 只能 删除对象的属性
    ```javascript
    function Person () {};
    var me = new Person();
    me.name='冯杰';
    console.log(me.name);
    delete me.name;
    console.log(me.name);
    ```

- 在js 中 对象的方法不是通用的 如果生成n个对象 那么就有n个内存堆栈
    ```javascript
    // js 中 一切类 继承自 Object 而Object 有propotype
    // 下面是解决办法 prototype 获得类的static性质
    function God() {}
    God.prototype.shout = function() {
        window.alert('小狗叫');
    }
    var dog1 = new God();
    var dog2 = new God();
    dog1.shout();
    dog2.shout();
    ```

- 对象
    ```javascript
    // js里要想创建对象 除了一般的创建方式 还有 通过Object 方式创建类
    // Object 类是所有js类的基类 Object 就表示对象（一切的对象）
    var p1 = new Object();
    p1.name = 'fj';
    window.alert(p1.name);
    window.alert(p1.constructor);

    // 原型链上新增默认对象方法
    var num = new Number(1);
    var num2 = 10;
    window.alert(num.constructor);
    window.alert(num2.constructor);
    // 上面2个弹出是一样的
    Number.prototype.add = function(a) { //prototype是属于类的
        return this + a;
    }
    window.alert(num.add(1).add(2));

    // 小实验 为Array 添加 find(val) 方法
    Array.prototype.find = function(a) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == a) {
                return i;
            }
        }
        return 'find fail.';
    }
    var arr = [0, 1, 2, 77, 4, 5];
    window.alert(arr.find(77));
    ```

- 当需要输出字符串的时候默认调用toString

    ```javascript
    function Dog(name,breed,color,sex) {
       this.name=name;
       this.breed=breed;
       this.color=color;
       this.sex=sex;
    }
    Dog.prototype.toString = function dogToString() {
      var ret = "Dog " + this.name + " is a " + this.sex + " " + this.color + " " + this.breed;
      return ret;
    }

    var theDog = new Dog("Gabby","Lab","chocolate","female");

    console.log(theDog+'')
    ```

- prototype 的方法不能访问私有属性和方法
    ```javascript
    function Person() {
        var name = 'fj'; //私有
        this.age = 21;
    }
    Person.prototype.showName = function() {
        window.alert(this.name);
    }
    Person.prototype.showAge = function() {
        window.alert(this.age);
    }
    var p1 = new Person();
    p1.showName();
    p1.showAge();
    ```

- 继承
    ```javascript
    // js 里面是对象冒充来继承的 不算是真正的继承 通过对象冒充 js可以实现多重继承和继承的效果 但是没有Extends关键字
    function Father(name, age) {
        this.name = name;
        this.age = age;
        this.show = function() {
            window.alert(this.name + '---' + this.age);
        }
    }

    function Son(name, age) {
        this.Father = Father;
        this.Father(name, age); //通过对象冒充 实现继承 这一句非常重要 js是动态语言 不是编译语言 要执行才会分配空间
    }
    var me = new Son('fj', 21);
    window.alert(me.name);
    me.show();
    ```


- 重载
    ```javascript
    // js从常理来说是不支持重载的 但是又可以说是天然支持重载 因为js天然支持可变参数 而且我们可以通过arguments[]数组的长度判断 而做出相应的处理
    ```

- 闭包
    ```javascript
    // 闭包实际上设计一个对象的属性，何时被gc处理的问题 闭包和gc是相关联的
    ```


- 数组长度
    ```javascript
    // 数组的长度是根据下标的最大而确定的
    var arr = new Array();
    arr['a'] = 1;
    arr['b'] = 2;
    window.alert(arr.length); // 打出0
    ```


* 如果函数用来初始化一个新建的对象(new), 称之为构造函数constructor.

* 采用64位浮点格式表示数字，　整数范围是-9007199254570992 ~ 9007199054570992,  -2^53 ~ 2^53

var s1 = 0010; 8

var s2 = 0x0010; 16

浮点数
3.14
.2222
6.02e23
12.3E-32

* javascript 非数字　not-a-number　NaN　跟任何值都不相等，包括自身。
* x!=x 当且仅当x为NaN的时候返回true.
* isNaN 如果参数是NaN或者非数字的时候返回true.
* isFinite 用来检测数字是不是有限的。

string 由16位值组成的不可变的有序序列。

boolean:

> undefined null 0 -0 NaN ""  会转化为false

type of null  -> object
type of '' -> string
type of undefined -> undefined
null == undefined -> true
null === undefined -> false


全局属性：　undefined, Infinity, NaN
全局函数：　isNaN(), parseInt(), eval()
构造函数：　Date(), RegExp(), String(), Object(), Array()
全局对象：　Math, JSON

Math.floor 返回小于或等于x，并且与之最接近的整数。 如果x是正数，则把小数“舍”；如果x是负数，则把小数“入”。
Math.round 1=>1 1.5=>2 1.6=>2 -1.5=>1 -1.6=>2
Math.ceil 返回返回大于或等于x，并且与之最接近的整数。 如果x是正数，则把小数“入”；如果x是负数，则把小数“舍”。

in运算符
希望左侧为字符串或者可以转换为字符串。
右侧是一个对象。
右侧对象是否包含一个名为左操作数的属性值。

instanceof
左侧为对象，右侧为标识对象的类


原型

> It is for example fairly trivial to build a classic model on top of it, while the other
> is more difficult task.

hasOwnProperty 判断一个对象是否包含自定义属性而不是原型链上的属性。

hasOwnProperty 是 JavaScript 中唯一一个处理属性但是不查找原型链的函数。


JavaScript 中原始值（undefined, null, 布尔值，数字和字符串）和对象（包括数组和函数）有着根本的区别，原始值是不可更改的，比如字符串的所有方法都是新返回一个值。

对象和原始值不同，首先，它他是 可变的 —— 值可以修改。

JavaScript 中的某些运算符会做隐式的类型转换。如果「+」运算符的一个操作数是字符串，它将会把另外一个操作数转换为字符串。一元「!」运算符将其操作数转换为布尔值并取反

```javascript
x + ""      // 等价于 String(x)
+x          // 等价于 Number(x)
!!x         // 等价于 Boolean(x)
```

```javascript
Number("3")     // => 3
String(false)   // => "false"
Boolean([])     // => true
Object(3)       // => new Number(3)

x + ""      // 等价于 String(x)
+x          // 等价于 Number(x)
!!x         // 等价于 Boolean(x)

var n = 17
binary_sting = n.toString(2)        // 转换为 "10001"
octal_string = "0" + n.toString(8)  // 转换为 "021"
hex_string = "0x" + n.toString(16)  // 转换为 "0x11"

parseInt("3 blind mice")        // => 3
parseFloat(" 3.14 meters")      // => 3.14
parseInt(0xFF)                  // => 255
parseInt("0.1")                 // => 0
parseInt(".1")                  // => NaN
parseFloat("$72.47")            // => NaN
```

###对象转换为原始值
> 所有对象继承了两个转换方法 toString(), valueOf()
> toString() 的作用是返回一个反映这个对象的字符串
> valueOf() 这个方法的作答并未详细定义：如果存在任意原始值，它就默认将对象转换为表示它的
> 原始值。复合值默认返回对象本身

JavaScript 中对象到字符串的转换经过了如下这些步骤：

如果对象具有 toString() 方法，调用后，如果返回一个原始值，JavaScript 将这个值转换为字符串，并返回
如果没有 toString() 方法，或者这个方法并不返回一个原始值，那么 JavaScript 会调用 valueOf() 方法，如果存在这个方法，则调用它。如果返回值是原始值，就将这个值值的为字符串并返回
否则，无法从 toString() 和 valueOf() 获得一个原始值，这些将抛出一个类型错误异常


```javascript
var now = new Date();
typeof (now +1)             // => "string" 「+」将日期转换为字符串
typeof (now -1)             // => "number" 「-」使用对象到数字的转换
now == now.toString()       // => true
now > (now - 1)             // => true
```

##in 运算符

希望左操作数是一个字符串或者可转换为字符串。右操作数是一个对象。如果右侧的对象拥有一个名为右操作数值的属性名，那么表达式返回 true。

##instanceof 运算符

instanceof 运算符希望左侧操作数是一个对象，右操作数标识对象的类。如果左侧的对象是右侧类的实例，则表达式返回 true，否则返回 false。

##‘use strict’

‘use strict’ 是 ECMAScript 5 引入的一条指定。非常类似语句但不是，区别在于：
- 它 不包含任何语言的关键字，指令仅仅是一个包含一个特殊字符串直接量的表达式，它是一条没有副作用的表达式语句，什么也没做
- 它只能出现在脚本代码的开始或者函数体的开始、任何实体语句之前。但不必一定出现在脚本或者函数休内的首行

使用 ‘use strict’ 指令的目的是说明（脚本或函数中）后续的代码将会解析为严格代码

- 严格代码以 严格模式 执行，严格模式悠了语言的重要缺陷，并提供健壮的查氏功能和增强的安全机制，和非严格模式的区别如下

- 严格模式中 禁止 使用 width 语句
- 严格模式中，所有的变量都要先声明，如果给一个未声明的变量、函数、函数参数、catch 从句参数或全局对象的属性赋值，将会抛出一个引用错误异常
- 严格模式中，调用的函数（不是方法）中的一个 this 值是 undefined（非严格模式下 this 值总是全局对象），可以利用这个特性来判断当前的 JavaScript 是否支持严格模式 var hasStrictMode = (function() { "use strict"; return this === undefined }())
- 严格模式中，给只读属性赋值和给不可扩展的对象创建新成员都将抛出一个类型错误异常（非严格模式中不会报错）
- 严格模式中，传入 eval() 的代码不能在调用程序所在的上下文中声明变量或定义函数，非严格模式中可以
- 严格模式中，函数里的 arguments 对象拥有传入函数值的 静态副本。非严格模式下，arguments 里的数组元素和函数参数都指向同一个值的引用
- 严格模式中，当 delete 运算符后跟随非法的标识符（变量、函数、当函数参数）时，将会抛出一个语法错误异常
- 严格模式中试图删除一个 不可配置 的属性将抛出一个类型错误异常（非严格模式中，返回 false）
- 严格模式中，一个对象直接量中定义两个或多个 同名属性 将产生一个语法错误
- 严格模式中，函数声明中存在两个或多个同名参数将产生一个语法错误
- 严格模式中，不允许使用八进制 整数直接量（以 0 为前缀）
- 严格模式中，标识符 eval 和 arguments 当做关键字，它们的值是不能更改的，不能给它们赋值，也不能把它们声明为变量、函数名
- 严格模式中，限制了对调用栈的检测能力，在严格模式的函数中，arguments.caller 和 arguments.callee 都会抛出一个类型错误异常
http://bonsaiden.github.io/JavaScript-Garden/zh/
