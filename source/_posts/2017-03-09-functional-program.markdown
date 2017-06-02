---
layout:     post
title:      "Functional Program"
subtitle:   "Functional"
date:       2017-03-09 15:03
author:     "Asher"
header-img: "home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Functional
---
// https://github.com/shfshanyue/fp-jargon-zh#arity

# Arity

函数参数的个数。来自于单词 unary, binary, ternary 等等。这个单词是由 -ary 与 -ity 两个后缀拼接而成。例如，一个带有两个参数的函数被称为二元函数或者它的 arity 是2。它也被那些更喜欢希腊词根而非拉丁词根的人称为 dyadic。同样地，带有可变数量参数的函数被称为 variadic，而二元函数只能带两个参数。

```javascript
    const sum = (a, b) => a + b
    const arity = sum.length

    console.log('arity: ', arity)
```

# 高阶函数 (Higher-Order Function/HOF)

以函数为参数或/和返回值

```javascript

    const filter = (predicate, xs) => xs.filter(predicte)
    const is = (type) => (x) => Object(x) instanceof type
    filter(is(Number), [0, '1', 2, null])

```

# 偏函数 (Partial Function)

对原始函数预设参数作为一个新的函数

```javascript

    const partical = (f, ...args) => (...moreArgs) => f(...args, ...moreArgs)

    const add3 = (a, b, c) => a + b + c

    const fivePlus = partical(add3, 2, 3)

    fivePlus(4)

    // 也可以使用Function.prototype.bind实现偏函数
    const add1More = add3.bind(null, 2, 3)

```

# 柯里化 (Currying)

讲一个多元函数转变为一元函数的过程。每当函数被调用时，它仅仅接收一个 参数并且返回带有一个参数的函数，直接传递完所有的参数。

```javascript

    const sum = (a, b) => a + b
    const curriedSum = (a) => (b) => a + b

    curriedSum(3)(4)

    const add2 = curriedSum(2)
    add2(10)

```

# 自动柯里化 (Auto Currying)

`lodash`, `understore`和`ramda`有`curry`函数可以自动完成柯里化

```javascript

    const add = (x, y) => x + y
    const curriedAdd = _.curry(add)

    curriedAdd(1, 2)
    curriedAdd(1)(2)
    curriedAdd(1)

```

### 进一步阅读

- [Favoring Curry](http://fr.umio.us/favoring-curry/)
- [Hey Underscore, You're Doing It Wrong!](https://www.youtube.com/watch?v=m3svKOdZijA)

# 函数组合 (Function Composing)

接收多个函数作为参数，从右到左，一个函数的输入为另一个函数的输出

```javascript

    const compose = (f, g) => (a) => f(g(a))
    const floorAndToString = compose((val) => val.toString(), Math.floor)
    floorAndToString(12.12)

```

Continuation

在一个程序执行的任意时刻, 尚未执行的代码成为Continuation.

```javascript

    const printAsString = (num) => console.log(`Given ${num}`)

    const addOneAndContinue = (num, cc) => {
        const result = num + 1
        cc(result)
    }

    andOneAndContinue(2, printAsString)

```

Continuation 在异步编程中很常见, 比如当程序需要接收到数据才能继续执行。请求的相应同城作为代码的剩余执行部分，一旦接收到数据，对数据的处理被作为Continuation.

```javascript

    const continueProgramWith = (data) => {}
    readFileAsync('path/to/file', (response, error) => {
        if (error) {
            return
        }

        continueProgramWith(response)
    })

```

# 纯函数 (Purity)
输出仅由输入决定，且不产生副作用。

```javascript

    const greet = (name) => `hello, ${name}`
    greet('world')

```

以一下代码不是纯函数：

```javascript

    window.name = 'Brianne'
    const greet = () => `Hi, ${window.name}` //函数依赖外部状态。

```

```javascript

    let greeting

    const greet = (name) => {
        greeting = `Hi, ${name}`
    }

    greet('Brianne')
    greeting

```

# 副作用(Side effects)
如果函数与外部可变状态进行交互，则它是有副作用的。

```javascript

    const differentEveryTime = new Date()
    console.log('IO is a side effect!')

```

# 幂等行(Idempotent)
如果一个函数执行多次皆返回相同的结果，则它是幂等性的。

```javascript

    f(f(x)) = f(x)
    Math.abs(Math.abs(10))
    sort(sort(sort([2, 1])))

```

# Point-Free 风格(Point-Free Style)
定义函数时，不显式的支出函数所带参数。这种风格通常需要柯里化或者高阶函数。也叫Tacit programming。

```javascript

    const map = (fn) => (list) => list.map(fn)
    const add = (a) => (b) => a + b

    const incrementAll = (numbers) => map(add(1))(numbers)
    const incrementAll2 = map(add(1))

```

# 谓词 (Predicate)

根据输入返回true或false. 通常用在Array.prototype.filter的回调函数中。

```javascript

    const predicate = (a) => a > 2
    [1, 2, 3, 4].filter(predicate)

```

# 契约 (Contracts)

契约保证了函数或者表达式在运行时的行为。当违反了契约时，将跑出一个错误。

```javascript

    const contract  = (input) => {
        if (typeof input === 'number') return true

        throw new Error('Contract Violated: expected int -> int')
    }

    const addOne = (num) => contract(num) && num + 1

    addOne(2)
    addOne('hello')

```

# 范畴 (Category)

在范畴论中，范畴是指对象集合及它们之间的态射 (morphism)。在编程中，数据类型作为对象，函数作为态射。

一个有效的范畴遵从以下三个原则：

- 必有一个 identity 态射，使得 map 一个对象是它自身。a 是范畴里的一个对象时，必有一个函数使 a -> a。
- 态射必是可组合的。a，b，c 是范畴里的对象，f 是态射 a -> b，g 是 b -> c 态射。g(f(x)) 一定与 (g ● f)(x)
- 组合满足结合律。f ● (g ● h) 与 (f ● g) ● h 是等价的。

这些准则是非常抽象的，范畴论对与发现组合的新方法是伟大的。

进一步阅读

[Category Theory for Programmers](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/)

# 值 (Value)

赋值给变量的值称作Value

```javascript

    5
    Object.freeze({name: 'John', age: 30})
    ;(a) => a
    ;[1]
    undefined

```

# 常量 (Constant)

一旦定义不可重新赋值。

```javascript

    const five = 5
    const john = Object.freeze({name: 'John', age: 30})

```

常量是[引用透明](https://github.com/shfshanyue/fp-jargon-zh#referential-transparency)的，因此它们可以被它们所代表的值替代而不影响结果。

对于以上两个常量，以下语句总会返回 true。

```javascript

    john.age + five === ({name: 'John', age: 30}).age + (5)

```

# 函子 (Functor)

一个实现了map 函数的对象，map 会遍历对象中的每个值并生成一个新的对象。遵守两个准则

### 一致性 (Preserves identity)

object.map(x => x) ≍ object
### 组合性 (Composable)

object.map(compose(f, g)) ≍ object.map(g).map(f)  // f, g 为任意函数
在 javascript 中一个常见的函子是 Array, 因为它遵守因子的两个准则。

```javascript

    const f = x => x + 1
    const g = x => x * 2

    ;[1, 2, 3].map(x => f(g(x)))
    ;[1, 2, 3].map(g).map(f)

```

# Pointed Functor

一个实现了 of 函数的对象。

ES2015 添加了 Array.of，使 Array 成为了 Pointed Functor。

```javascript

    Array.of(1)

```

# Lift


# 引用透明性 (Referential Transparency)

一个表达式能够被它的值替代而不改变程序的行为成为引用透明。

```javascript

    const greet = () => 'hello, world.'

```

# 匿名函数 (Lambda)

匿名函数被视作一个值

```javascript

    ;(function (a) {
        return a + 1
    })

    ;(a) => a + 1

```

匿名函数通常作为高阶函数的参数

```javascript

    [1, 2].map((a) => a + 1)

```

可以把 Lambda 赋值给一个变量

```javascript

    const add1 = (a) => a + 1

```

# Lambda Caculus

数学的一个分支，使用函数创造 [通过计算模型](https://en.wikipedia.org/wiki/Lambda_calculus)


# 惰性求值 (Lazy evaluation)

按需求值机制，只有当需要计算所得值时才会计算

```javascript
    const rand = function* () {
        while (true) {
            yield Math.random()
        }
    }

    const randIter = rand()
    randIter.next()
```

# Monoid

一个对象拥有一个函数用来连接相同类型的对象。

数值加法是一个简单的 Monoid
```javascript
1 + 1   // 2
```
以上示例中，数值是对象而 + 是函数。

与另一个值结合而不会改变它的值必须存在，称为 identity。

加法的 identity 值为 0:
```javascript
1 + 0   // 1
```
需要满足结合律
```javascript
1 + (2 + 3) === (1 + 2) + 3 // true
```
数组的结合也是 Monoid
```javascript
;[1, 2].concat([3, 4])
```
identity 值为空数组

;[1, 2].concat([])
identity 与 compose 函数能够组成 monoid
```javascript
const identity = (a) => a
const compose = (f, g) => (x) => f(g(x))
```

foo 是只带一个参数的任意函数
```javascript
compose(foo, identity) ≍ compose(identity, foo) ≍ foo
```

# Monad

拥有 of 和 chain 函数的对象。chain 很像 map， 除了用来铺平嵌套数据。

```javascript

    Array.prototype.chain = function (f) {
        return this.reduce((acc, it) => acc.concat(f(it)), [])
    }

    // ['cat', 'dog', 'fish', 'bird']
    ;Array.of('cat,dog', 'fish,bird').chain(s => s.split(','))

    // [['cat', 'dog'], ['fish', 'bird']]
    ;Array.of('cat,dog', 'fish,bird').map(s => s.split(','))

```

在有些语言中，of 也称为 return，chain 也称为 flatmap 与 bind。

# Comonad

拥有 extract 与 extend 函数的对象。

```javascript

    const CoIdentity = (v) => ({
        val: v,
        extract () {
            return this.val
        },
        extend (f) {
            return CoIdentity(f(this))
        }
    })

    CoIdentity(1).extract()
    CoIdentity(1).extend(x => x.extract() + 1)   # CoIdentity(2)

```

# Applicative Functor

一个拥有 ap 函数的对象。

```javascript

    // 实现
    Array.prototype.ap = function (xs) {
        return this.reduce((acc, f) => acc.concat(xs.map(f)), [])
    }

    // 示例
    ;[(a) => a + 1].ap([1]) // [2]

```

如果你有两个对象，并需要对他们的元素执行一个二元函数

```javascript

    // Arrays that you want to combine
    const arg1 = [1, 3]
    const arg2 = [4, 5]

    // combining function - must be curried for this to work
    const add = (x) => (y) => x + y

    const partiallyAppliedAdds = [add].ap(arg1) // [(y) => 1 + y, (y) => 3 + y]

```

由此得到了一个函数数组，并且可以调用 ap 函数得到结果

```javascript

    partiallyAppliedAdds.ap(arg2) // [5, 6, 7, 8]

```

# Applicative Functor

一个拥有 ap 函数的对象。

```javascript

    // 实现
    Array.prototype.ap = function (xs) {
        return this.reduce((acc, f) => acc.concat(xs.map(f)), [])
    }

    // 示例
    ;[(a) => a + 1].ap([1]) // [2]

```

如果你有两个对象，并需要对他们的元素执行一个二元函数

```javascript

    // Arrays that you want to combine
    const arg1 = [1, 3]
    const arg2 = [4, 5]

    // combining function - must be curried for this to work
    const add = (x) => (y) => x + y

    const partiallyAppliedAdds = [add].ap(arg1) // [(y) => 1 + y, (y) => 3 + y]

```

# 态射 (Morphism)

一个变形的函数。

# 自同态 (Endomorphism)

输入输出是相同类型的函数。

```javascript

    // uppercase :: String -> String
    const uppercase = (str) => str.toUpperCase()

    // decrement :: Number -> Number
    const decrement = (x) => x - 1

```

# 同构 (Isomorphism)

不用类型对象的变形，保持结构并且不丢失数据。

例如，一个二维坐标既可以表示为数组 [2, 3]，也可以表示为对象 {x: 2, y: 3}。

```javascript
    // 提供函数在两种类型间互相转换
    const pairToCoords = (pair) => ({x: pair[0], y: pair[1]})

    const coordsToPair = (coords) => [coords.x, coords.y]

    coordsToPair(pairToCoords([1, 2])) // [1, 2]

    pairToCoords(coordsToPair({x: 1, y: 2})) // {x: 1, y: 2}
```

# Setoid

拥有 equals 函数的对象。equals 可以用来和其它对象比较。

```javascript

    Array.prototype.equals = function (arr) {
    const len = this.length
    if (len !== arr.length) {
    return false
    }
    for (let i = 0; i < len; i++) {
    if (this[i] !== arr[i]) {
      return false
    }
    }
    return true
    }

    ;[1, 2].equals([1, 2])   // true
    ;[1, 2].equals([3, 4])   // false

```

# 半群 (Semigroup)

An object that has a concat function that combines it with another object of the same type.

```javascript

    ;[1].concat([2]) // [1, 2]

```

# Foldable

An object that has a reduce function that can transform that object into some other type.

```javascript

    const sum = list => list.reduce((account, value) => account + value, 0)
    sum([1, 2, 3])

```

# Traversbale
TODO

# Type Signatures

Often functions in JavaScript will include comments that indicate the types of their arguments and return values.

There's quite a bit of variance across the community but they often follow the following patterns:

```javascript

    // functionName :: firstArgType -> secondArgType -> returnType

    // add :: Number -> Number -> Number
    const add = (x) => (y) => x + y

    // increment :: Number -> Number
    const increment = (x) => x + 1

```

If a function accepts another function as an argument it is wrapped in parentheses.

```javascript

    // call :: (a -> b) -> a -> b
    const call = (f) => (x) => f(x)

```

The letters a, b, c, d are used to signify that the argument can be of any type. The following version of map takes a function that transforms a value of some type a into another type b, an array of values of type a, and returns an array of values of type b.

```javascript

    // map :: (a -> b) -> [a] -> [b]
    const map = (f) => (list) => list.map(f)

```

Further reading

- [Ramda's type signatures](https://github.com/ramda/ramda/wiki/Type-Signatures)
- [Mostly Adequate Guide](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch7.html#whats-your-type)
- [What is Hindley-Milner?](http://stackoverflow.com/questions/399312/what-is-hindley-milner/399392#399392) on Stack Overflow

# Union type

A union type is the combination of two types together into another one.

JS doesn't have static types but let's say we invent a type NumOrString which is a sum of String and Number.

The + operator in JS works on strings and numbers so we can use this new type to describe its inputs and outputs:

```javascript

    // add :: (NumOrString, NumOrString) -> NumOrString
    const add = (a, b) => a + b

    add(1, 2) // Returns number 3
    add('Foo', 2) // Returns string "Foo2"
    add('Foo', 'Bar') // Returns string "FooBar"

```

Union types are also known as algebraic types, tagged unions, or sum types.

There's a couple libraries in JS which help with defining and using union types.
- [union-type](https://github.com/paldepind/union-type)
- [daggy](https://github.com/fantasyland/daggy)

# Product type

A product type combines types together in a way you're probably more familiar with:

```javascript

    // point :: (Number, Number) -> {x: Number, y: Number}
    const point = (x, y) => ({x: x, y: y})

```

It's called a product because the total possible values of the data structure is the product of the different values.

See also [Set theory](https://en.wikipedia.org/wiki/Set_theory).

# Option

Option is a union type with two cases often called Some and None.

Option is useful for composing functions that might not return a value.

```javascript

// Naive definition

    const Some = (v) => ({
        val: v,
        map (f) {
            return Some(f(this.val))
        },
        chain (f) {
            return f(this.val)
        }
    })

    const None = () => ({
        map (f) {
            return this
        },
        chain (f) {
            return this
        }
    })

    // maybeProp :: (String, {a}) -> Option a
    const maybeProp = (key, obj) => typeof obj[key] === 'undefined' ? None() : Some(obj[key])

```

Use `chain` to sequence functions that return `Options`

```javascript

    // getItem :: Cart -> Option CartItem
    const getItem = (cart) => maybeProp('item', cart)

    // getPrice :: Item -> Option Number
    const getPrice = (item) => maybeProp('price', item)

    // getNestedPrice :: cart -> Option a
    const getNestedPrice = (cart) => getItem(obj).chain(getPrice)

    getNestedPrice({}) // None()
    getNestedPrice({item: {foo: 1}}) // None()
    getNestedPrice({item: {price: 9.99}}) // Some(9.99)

```

`Option` is also known as `Maybe`. `Some` is sometimes called `Just`. `None` is sometimes called `Nothing`.

# Functional Programming Libraries in JavaScript

- [mori](https://github.com/swannodette/mori)
- [Immutable](https://github.com/facebook/immutable-js/)
- [Ramda](https://github.com/ramda/ramda)
- [Folktale](http://folktalejs.org/)
- [monet.js](https://cwmyers.github.io/monet.js/)
- [lodash](https://github.com/lodash/lodash)
- [Underscore.js](https://github.com/jashkenas/underscore)
- [Lazy.js](https://github.com/dtao/lazy.js)
- [maryamyriameliamurphies.js](https://github.com/sjsyrek/maryamyriameliamurphies.js)
- [Haskell in ES6](https://github.com/casualjavascript/haskell-in-es6)
