---
layout:     post
title:      "RxJS Guide"
subtitle:   "RxJS"
date:       2017-06-10
author:     "Asher"
header-img: "home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Trip
---

- Rece Condition

> A race condition or race hazard is the behavior of an electronic, software, or other system where the output is dependent on the sequence or timing of other uncontrollable events.

竞态，当对统一数据进行多次非同步的存取时

- Memory Lake

在SPA中，没有合理的清除监听事件

- Complex State

在非同步行为下，管理状态

- Exception Handling

异常捕获

# RxJS

RxJS是一套由Observable sequences来组合非同步行为和事件基础程序的库, 也称Functional Reactive Program，或者Function Program 和 Reactive Program思想的结合

## Functional Program

Functional Programming 是一种编程范式(programming paradigm)，就像Object-oriented Programming(OOP)一样，就是一种写程式的方法论，这些方法论告诉我们如何思考及解决问题。

简单说Functional Programming 核心思想就是做运算处理，并用function 来思考问题。

函数式编程在使用的时候的特点就是，你已经再也不知道数据是从哪里来了，每一个函数都是为了用小函数组织成更大的函数，函数的参数也是函数，函数返回的也是函数，最后得到一个超级牛逼的函数，就等着别人用他来写一个main函数把数据灌进去了。

- 函数为一等公民

一等公民就是指跟其他资料型别具有同等地位，也就是说函式能够被赋值给变数，函式也能够被当作参数传入另一个函式，也可当作一个函式的回传值

- Pure Function

当参数不变的时候，函数永远返回相同的值，没有side effect影响。

- 优势

可读性高： 通过函数来封装操作。
可维护：由于Pure function等特性，执行结果不会影响外部状态。
易于并行、平行处理：只做运算不碰I\O, 再加上没有Side Effect, 不用担心deadlock的问题。

## Reactive Program

简单来说就是当变数或资源发生变动时，由变数或资源自动告诉我发生变动了

当我们在使用vue开发时，只要一有绑定的变数发生改变，相关的变数及画面也会跟着变动，而开发者不需要写这其中如何通知发生变化的每一步程式码，只需要专注在发生变化时要做什么事，这就是典型的Reactive Programming (记得必须是由变数或资源主动告知！)

> Vue.js在做two-ways data binding是透过ES5 definedProperty的getter/setter。每当变数发生变动时，就会执行getter/setter从而收集有改动的变数，这也被称为依赖收集。

# Observable & Observer

observable类似一个序列，里面的数据随着时间推送, 可以同时处理同步、非同步的行为。
observable可以被订阅，而订阅者是Observer。

```javascript
var observable = Rx.Observable.create(observer => {
    observer.next(1)
    observer.next(2)
    observer.next(3)
    observer.complate()
    observer.next(4)
})

var observer = {
    next: next => console.log(next),
    error: error => console.log(error),
    complete: () => console.log('Complate~')
}

observable.subscribe(observer)
```

# Operators

### create

通过create来创建Observable

### of

创建需要同步处理数据的observable

```javascript
const source = Rx.Observable.of(['Asher', 'Sean'])

source.subscribe({
    next: value => console.log(value),
    error: () => console.log('Error'),
    complate: () => console.log('Complate')
})
```  

### from

将可列举( Array, String, Promise )的数据转换成observable

### fromEvent

将事件转化为observable

```javascript
const source = Rx.Observable.fromEvent(DOM, 'click')

source.subscribe({
    next: value => console.log(value),
    error: error => console.log('error'),
    complete: () => console.log('complate')
})
```

### fromEventPattern

同时具有注册监听和移除监听两种方法的时间, 可以解除绑定事件addEventListener, removeEventListener

```javascript

class Producer {
    constructor() {
        this.listeners = []
    }

    addListener(listener) {
        if(typeof listener === 'function') {
            this.listeners.push(listener)
        } else {
            throw new Error('listener 必須是 function')
        }
    }

    removeListener(listener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1)
    }

    notify(message) {
        this.listeners.forEach(listener => {
            listener(message);
        })
    }
}
// ------- 以上都是之前的程式碼 -------- //

var egghead = new Producer(); 
// egghead 同時具有 註冊監聽者及移除監聽者 兩種方法

var source = Rx.Observable
    .fromEventPattern(
        (handler) => egghead.addListener(handler), 
        (handler) => egghead.removeListener(handler)
    );
  
source.subscribe({
    next: function(value) {
        console.log(value)
    },
    complete: function() {
        console.log('complete!');
    },
    error: function(error) {
        console.log(error)
    }
})

egghead.notify('Hello! Can you hear me?');
// Hello! Can you hear me?

```
### empty, never, throw

- empty

```javascript
Rx.Observable.empty()
.subscribe({
    next: value => console.log(value),
    complate: () => console.log('complate~~'),
    error: error => console.log(error)
})

// complate~~
```

- never

```javascript
Rx.Observable.never()
.subscribe({
    next: value => console.log(value),
    complate: () => console.log('complate~~'),
    error: error => console.log(error)
})

// ...
```

- throw

```javascript
Rx.Observable.throw('Error~~')
.subscribe({
    next: value => console.log(value),
    complate: () => console.log('complate~~'),
    error: error => console.log(error)
})

// Error~~
```

### interval, timer

- interval
间隔x事件送出递增的整数

```javascript
Rx.Observable.interval(1000)
.subscribe(value => console.log(value))
```

- timer
timer(firstTimer, timer)
第一个参数表示第一次触发时间隔时间，第二个参数表示之后每次触发时间，送出递增的整数

```javascript
Rx.Observable.timer(1000, 2000)
.subscribe(value => console.log(value))
```

### Subscription

unsubscribe取消订阅

```javascript
var source = Rx.Observable.timer(1000, 1000);

// 取得 subscription
var subscription = source.subscribe({
    next: function(value) {
        console.log(value)
    },

    complete: function() {
        console.log('complete!');
    },

    error: function(error) {
        console.log('Throw Error: ' + error)
    }
});

setTimeout(() => {
    subscription.unsubscribe() // 停止訂閱(退訂)， RxJS 4.x 以前的版本用 dispose()
}, 5000);
// 0
// 1
// 2
// 3
// 4
```
# Operators

## map

跟数组的map行为一致

## mapTo

把传进来的值改为一个固定的值

## filter

跟数组行为一致

## take

取前几个元素后就停止

## first

取第一个元素，行为类似take(1)

## takeUtil

当某个事件发生时，让当前observable complete.

```javascript
var source = Rx.Observable.interval(1000);
var click = Rx.Observable.fromEvent(document.body, 'click');
var example = source.takeUntil(click);     
   
example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 0
// 1
// 2
// 3
// complete (點擊body了
```

## concatAll

将二维Observable变成一维

## skip

略过前X个元素

## takeLast

取最后几个元素

## last

取最后一个元素，行为同last(1)

## concat

把多个observable和为一个, 必须先等前一个observable完成(complete)，才会继续下一个.

```javascript
var source = Rx.Observable.interval(1000).take(3);
var source2 = Rx.Observable.of(3)
var source3 = Rx.Observable.of(4,5,6)
var example = source.concat(source2, source3);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 0
// 1
// 2
// 3
// 4
// 5
// 6
// complete

```

## startWith

可以再observable一开始时设置一个开始值。

```javascript
var source = Rx.Observable.interval(1000);
var example = source.startWith(0);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 0
// 0
// 1
// 2
// 3...

source : ----0----1----2----3--...
                startWith(0)
example: (0)----0----1----2----3--...
```


## merge

在时间序上同时在跑source与source2，当两件事情同时发生时，会同步送出资料(被merge的在后面)，当两个observable都结束时才会真的结束。

```javascript
var source = Rx.Observable.interval(500).take(3);
var source2 = Rx.Observable.interval(300).take(6);
var example = source.merge(source2);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 0
// 0
// 1
// 2
// 1
// 3
// 2
// 4
// 5
// complete

source : ----0----1----2|
source2: --0--1--2--3--4--5|
            merge()
example: --0-01--21-3--(24)--5|
```

## combineLatest

取各个observable最后送出的那个值再输出成一个值

```javascript
var source = Rx.Observable.interval(500).take(3);
var newest = Rx.Observable.interval(300).take(6);

var example = source.combineLatest(newest, (x, y) => x + y);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 0
// 1
// 2
// 3
// 4
// 5
// 6
// 7
// complete

source : ----0----1----2|
source2: --0--1--2--3--4--5|
            combineLatest()
example: ----01--23-4--(56)--7|
```

## zip

取每个zip相同顺位的元素传入callback

```javascript
var source = Rx.Observable.interval(500).take(3);
var newest = Rx.Observable.interval(300).take(6);

var example = source.zip(newest, (x, y) => x + y);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 0
// 2
// 4
// complete

source : ----0----1----2|
newest : --0--1--2--3--4--5|
    zip(newest, (x, y) => x + y)
example: ----0----2----4|
```

## withLatestFrom

运行方式跟combineLatest一致，只是它有主从关系。只有在主要的observable送出值得时候，callback才会执行

```javascript
var main = Rx.Observable.from('hello').zip(Rx.Observable.interval(500), (x, y) => x);
var some = Rx.Observable.from([0,1,0,0,0,1]).zip(Rx.Observable.interval(300), (x, y) => x);

var example = main.withLatestFrom(some, (x, y) => {
    return y === 1 ? x.toUpperCase() : x;
});

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});

main   : ----h----e----l----l----o|
some   : --0--1--0--0--0--1|

withLatestFrom(some, (x, y) =>  y === 1 ? x.toUpperCase() : x);

example: ----h----e----l----L----O|
```

## scan

Observable版的reduce
```javascript
var source = Rx.Observable.from('hello')
            .zip(Rx.Observable.interval(600), (x, y) => x)

source.subscribe({
    next: value => console.log(next),
    error: error => console.log(error),
    complete: () => console.log('complete.')
})
```

## buffer

- bufferTime
- bufferCount
- bufferToggle
- bufferWhen

```javascript
var source = Rx.Observable.interval(300);
var source2 = Rx.Observable.interval(1000);
var example = source.buffer(source2);
// source.bufferTime(1000)
// source.bufferCount(3)

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// [0,1,2]
// [3,4,5]
// [6,7,8]...

source : --0--1--2--3--4--5--6--7..
source2: ---------0---------1--------...
            buffer(source2)
example: ---------([0,1,2])---------([3,4,5])    
```

## delay

延迟observable送出第一个元素的时间点

```javascript
var source = Rx.Observable.interval(1000).take(5)

var example = source.delay(500)

example.subscribe(value => console.log(value))

source : --0--1--2--3--4|
        delay(500)
example: -------0--1--2--3--4|
```

## delayWhen

delayWhen 和 delay 很像。最大的差别在于会影响observable送出的每个元素，并且可以回传一个callback

```javascript
var source = Rx.Observable.interval(300).take(5);

var example = source
              .delayWhen(
                  x => Rx.Observable.empty().delay(100 * x * x)
              );

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});

source : --0--1--2--3--4|
    .delayWhen(x => Rx.Observable.empty().delay(100 * x * x));
example: --0---1----2-----3-----4|
```

## debounce

debounce运作的方式是每次收到元素，他会先把元素cache住并等待一段时间，如果这段时间内已经没有收到任何元素，则把元素送出；如果这段时间内又收到新的元素，则会把原本cache住的元素释放掉并重新计时，不断反覆。

```javascript
var source = Rx.Observable.interval(300).take(5);
var example = source.debounceTime(1000);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 4
// complete

source : --0--1--2--3--4|
        debounceTime(1000)
example: --------------4|
```

## throttle

throttleTime 每隔x秒触发一次

```javascript
var source = Rx.Observable.interval(300).take(5);
var example = source.throttleTime(1000);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// 0
// 4
// complete
```

## distinct

去重

distinct(inElement, cleanCacheCallback)

cleanCacheCallback: 清除缓存

```javascript
var source = Rx.Observable.from(['a', 'b', 'c', 'a', 'b'])
            .zip(Rx.Observable.interval(300), (x, y) => x);
var example = source.distinct()

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// a
// b
// c
// complete
source : --a--b--c--a--b|
            distinct()
example: --a--b--c------|
```

## distinctUntilChanged

distinctUntilChanged: 只会比较最后一次送出的元素

```javascript
var source = Rx.Observable.from(['a', 'b', 'c', 'c', 'b'])
            .zip(Rx.Observable.interval(300), (x, y) => x);
var example = source.distinctUntilChanged()

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// a
// b
// c
// b
// complete
source : --a--b--c--c--b|
            distinctUntilChanged()
example: --a--b--c-----b|
```

## cache

```javascript
var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source
                .map(x => x.toUpperCase())
                .catch(error => Rx.Observable.of('h'));

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});

source : ----a----b----c----d----2|
        map(x => x.toUpperCase())
         ----a----b----c----d----X|
        catch(error => Rx.Observable.of('h'))
example: ----a----b----c----d----h|


var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source
                .map(x => x.toUpperCase())
                .catch(error => Rx.Observable.empty());

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});

var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source
                .map(x => x.toUpperCase())
                .catch((error, obs) => obs);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});

source : ----a----b----c----d----2|
        map(x => x.toUpperCase())
         ----a----b----c----d----X|
        catch((error, obs) => obs)
example: ----a----b----c----d--------a----b----c----d--..

```

## retry

```javascript
var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source
                .map(x => x.toUpperCase())
                .retry(1);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
}); 
// a
// b
// c
// d
// a
// b
// c
// d
// Error: TypeError: x.toUpperCase is not a function
```

## retryWhen

> retryWhen 實際上是在背地裡建立一個 Subject 並把錯誤放入，會在對這個 Subject 進行內部的訂閱，因為我們還沒有講到 Subject 的觀念，大家可以先把它當作 Observable 就好了，另外記得這個 observalbe 預設是無限的，如果我們把它結束，原本的 observable 也會跟著結束。

```javascript
var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source
                .map(x => x.toUpperCase())
                .retryWhen(errorObs => errorObs.delay(1000));

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
}); 


var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source
                .map(x => x.toUpperCase())
                .retryWhen(
                errorObs => errorObs.map(err => fetch('...')));

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
}); 

```

## repeat

repeat(1)

```javascript
var source = Rx.Observable.from(['a','b','c'])
            .zip(Rx.Observable.interval(500), (x,y) => x);

var example = source.repeat();

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```


```javascript
const title = document.getElementById('title');

var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x)
            .map(x => x.toUpperCase()); 
            // 通常 source 會是建立即時同步的連線，像是 web socket

var example = source.catch(
                (error, obs) => Rx.Observable.empty()
                               .startWith('連線發生錯誤： 5秒後重連')
                               .concat(obs.delay(5000))
                 );

example.subscribe({
    next: (value) => { title.innerText = value },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
}); 
```

## 二维数组转一维数组

> Observable<Observable<T>> => Observable<T>

### concatAll

当第一个Obervable结束时才执行第二个Observable

```javascript
var click = Rx.Observable.fromEvent(document.body, 'click');
var source = click.map(e => Rx.Observable.interval(1000));

var example = source.concatAll();
example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
// (點擊後)
// 0
// 1
// 2
// 3
// 4
// 5 ...

click  : ---------c-c------------------c--.. 
        map(e => Rx.Observable.interval(1000))
source : ---------o-o------------------o--..
                   \ \
                    \ ----0----1----2----3----4--...
                     ----0----1----2----3----4--...
                     concatAll()
example: ----------------0----1----2----3----4--..
```

### switch

在新的Observable送出后，不管之前的Observable是否完成直接unsubscribe, 永远只处理新的Observable

```javascript
var click = Rx.Observable.fromEvent(document.body, 'click');
var source = click.map(e => Rx.Observable.interval(1000));

var example = source.switch();
example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});

click  : ---------c-c------------------c--.. 
        map(e => Rx.Observable.interval(1000))
source : ---------o-o------------------o--..
                   \ \                  \----0----1--...
                    \ ----0----1----2----3----4--...
                     ----0----1----2----3----4--...
                     switch()
example: -----------------0----1----2--------0----1--...
```

### mergeAll

可以同时处理多个Observable

```javascript
var click = Rx.Observable.fromEvent(document.body, 'click');
var source = click.map(e => Rx.Observable.interval(1000));

var example = source.mergeAll(); // mergeAll(integer) 限制同时执行的Observable数
example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});

click  : ---------c-c------------------c--.. 
        map(e => Rx.Observable.interval(1000))
source : ---------o-o------------------o--..
                   \ \                  \----0----1--...
                    \ ----0----1----2----3----4--...
                     ----0----1----2----3----4--...
                     switch()
example: ----------------00---11---22---33---(04)4--...
```

### concatMap

> map加上concatAll的简化写法

```javascript
// concatAll
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source
                .map(e => Rx.Observable.interval(1000).take(3))
                .concatAll();
                
example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});

// concatMap
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source.concatAap(e => Rx.Observable.interval(1000).take(3));

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});

source : -----------c--c------------------...
        concatMap(c => Rx.Observable.interval(100).take(3))
example: -------------0-1-2-0-1-2---------...
```

- concatAll(outerObservable, innerObservable, outerObservableIndex, innerObservableIndex)
    - 外部observable 送出的元素
    - 内部observable 送出的元素
    - 外部observable 送出元素的index
    - 内部observable 送出元素的index

```javascript
function getPostData() {
    return fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(res => res.json())
}
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source.concatMap(
                e => Rx.Observable.from(getPostData()), 
                (e, res, eIndex, resIndex) => res.title);

example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
```

### switchMap

> switch和map的简写

```javascript
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source
                .map(e => Rx.Observable.interval(1000).take(3))
                .switch();
                
example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});

var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source
                .switchMap(
                    e => Rx.Observable.interval(100).take(3)
                );
                
example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});

source : -----------c--c-----------------...
        concatMap(c => Rx.Observable.interval(100).take(3))
example: -------------0--0-1-2-----------...
```

### mergeMap

> map加上mergeAll的简写, alias name floatMap

```javascript
var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source
                .map(e => Rx.Observable.interval(1000).take(3))
                .mergeAll();
                
example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});

var source = Rx.Observable.fromEvent(document.body, 'click');

var example = source
                .mergeMap(
                    e => Rx.Observable.interval(100).take(3)
                );
                
example.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});

source : -----------c-c------------------...
        concatMap(c => Rx.Observable.interval(100).take(3))
example: -------------0-(10)-(21)-2----------...
```

> concatMap, switchMap, mergeMap有一个共同的特性是可以把回传的第一个参数的promise转化为observable不需要通过Rx.Observable.from来转换。
- concatMap用在可以确定内部的observable结束时间比外部observable发送时间来快的情境，并且不希望有任何并行处理行为，适合少数要一次一次完成到底的的UI动画或特别的HTTP request行为。
- switchMap 用在只要最后一次行为的结果，适合绝大多数的使用情境。
- mergeMap 用在并行处理多个observable，适合需要并行处理的行为，像是多个I/O 的并行处理。

### window

window 很類似 buffer 可以把一段時間內送出的元素拆出來，只是 buffer 是把元素拆分到陣列中變成
```javascript
Observable<T> => Observable<Array<T>>
```
而 window 則是會把元素拆分出來放到新的 observable 變成
```javascript
Observable<T> => Observable<Observable<T>>
```

buffer 是把拆分出來的元素放到陣列並送出陣列；window 是把拆分出來的元素放到 observable 並送出 observable

```javascript
var click = Rx.Observable.fromEvent(document, 'click');
var source = Rx.Observable.interval(1000);
var example = source.window(click);

example
  .switch()
  .subscribe(console.log);
// 0
// 1
// 2
// 3
// 4
// 5 ...

click  : -----------c----------c------------c--
source : ----0----1----2----3----4----5----6---..
                    window(click)
example: o----------o----------o------------o--
         \          \          \
          ---0----1-|--2----3--|-4----5----6|
                    switch()
       : ----0----1----2----3----4----5----6---... 
```

### windowToggle

windowToggle可以传入两个参数，第一个传入开始的observable, 第二个传入callback控制结束的observable.

```javascript
var source = Rx.Observable.interval(1000);
var mouseDown = Rx.Observable.fromEvent(document, 'mousedown');
var mouseUp = Rx.Observable.fromEvent(document, 'mouseup');

var example = source
  .windowToggle(mouseDown, () => mouseUp)
  .switch();
  
example.subscribe(console.log);

source   : ----0----1----2----3----4----5--...

mouseDown: -------D------------------------...
mouseUp  : ---------------------------U----...

        windowToggle(mouseDown, () => mouseUp)

         : -------o-------------------------...
                  \
                   -1----2----3----4--|
                   switch()
example  : ---------1----2----3----4---------...
```

- window
- windowCount
- windowTime
- windowToggle
- windowWhen


# Observable

## 延迟计算
Observable只有在订阅(subscribe)之后才会执行。

## 渐进式取值
数组的operators每一次当所有的数据计算完之后才会进行下一次计算。
Observable每个元素送出后就会计算到底, 这就是渐进式取值。

# Subject

> Subject 可以拿去订阅Observable(source) 代表他是一个Observer，同时Subject 又可以被Observer(observerA, observerB) 订阅，代表他是一个Observable。

- Subject 同时是Observable 又是Observer
- Subject 会对内部的observers 清单进行组播(multicast)


Subject 是 Observable 的子类别，这个子类别当中用上述的五个方法实现了 Observer Pattern，所以他同时具有 Observable 與 Observer 的特性，而跟 Observable 最大的差异就是 Subject 是具有状态的，也就是儲存的那份清單！

```javascript
var subject = {
    observers: [],
    subscribe: function(observer) {
        this.observers.push(observer)
    },
    next: function(value) {
        this.observers.forEach(o => o.next(value))    
    },
    error: function(error){
        this.observers.forEach(o => o.error(error))
    },
    complete: function() {
        this.observers.forEach(o => o.complete())
    }
}

var source = Rx.Observable.interval(1000).take(3);

var observerA = {
    next: value => console.log('A next: ' + value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('A complete!')
}

var observerB = {
    next: value => console.log('B next: ' + value),
    error: error => console.log('B error: ' + error),
    complete: () => console.log('B complete!')
}

var subject = new Rx.Subject()

subject.subscribe(observerA)

source.subscribe(subject);

setTimeout(() => {
    subject.subscribe(observerB);
}, 1000);

// "A next: 0"
// "A next: 1"
// "B next: 1"
// "A next: 2"
// "B next: 2"
// "A complete!"
// "B complete!"
```

# BehaviorSubject

BehaviorSubject 跟Subject 最大的不同就是BehaviorSubject 是用来呈现当前的值，而不是单纯的发送事件。BehaviorSubject 会记住最新一次发送的元素，并把该元素当作目前的值，在使用上BehaviorSubject 建构式需要传入一个参数来代表起始的状态

```javascript
var subject = new Rx.BehaviorSubject(0); // 0 為起始值
var observerA = {
    next: value => console.log('A next: ' + value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('A complete!')
}

var observerB = {
    next: value => console.log('B next: ' + value),
    error: error => console.log('B error: ' + error),
    complete: () => console.log('B complete!')
}

subject.subscribe(observerA);
// "A next: 0"
subject.next(1);
// "A next: 1"
subject.next(2);
// "A next: 2"
subject.next(3);
// "A next: 3"

setTimeout(() => {
    subject.subscribe(observerB); 
    // "B next: 3"
},3000)
```

从上面这个范例可以看得出来BehaviorSubject 在建立时就需要给定一个状态，并在之后任何一次订阅，就会先送出最新的状态。其实这种行为就是一种状态的表达而非单存的事件，就像是年龄跟生日一样，年龄是一种状态而生日就是事件；所以当我们想要用一个stream 来表达年龄时，就应该用BehaviorSubject。

# ReplaySubject

重新订阅时发送最后X个元素

```javascript
var subject = new Rx.ReplaySubject(2); // 重複發送最後 2 個元素
var observerA = {
    next: value => console.log('A next: ' + value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('A complete!')
}

var observerB = {
    next: value => console.log('B next: ' + value),
    error: error => console.log('B error: ' + error),
    complete: () => console.log('B complete!')
}

subject.subscribe(observerA);
subject.next(1);
// "A next: 1"
subject.next(2);
// "A next: 2"
subject.next(3);
// "A next: 3"

setTimeout(() => {
    subject.subscribe(observerB);
    // "B next: 2"
    // "B next: 3"
},3000)
```

# AsyncSubject

返回最后送出的元素

```javascript
var subject = new Rx.AsyncSubject();
var observerA = {
    next: value => console.log('A next: ' + value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('A complete!')
}

var observerB = {
    next: value => console.log('B next: ' + value),
    error: error => console.log('B error: ' + error),
    complete: () => console.log('B complete!')
}

subject.subscribe(observerA);
subject.next(1);
subject.next(2);
subject.next(3);
subject.complete();
// "A next: 3"
// "A complete!"

setTimeout(() => {
    subject.subscribe(observerB);
    // "B next: 3"
    // "B complete!"
},3000)
```

# multicast

mount subject and return an connectable observable

```javascript
var source = Rx.Observable.interval(1000)
            .take(3)
            .multicast(new Rx.Subject());

var observableA = {
    next: next => console.log('A next ', next),
    error: error => console.log('A error ', error),
    complete: () => console.log('A complete)
}

var observableB = {
    next: next => console.log('B next ', next),
    error: error => console.log('B error ', error),
    complete: () => console.log('B complete)
}

source.subscribe(observableA)

var realSubscription = source.connect(); // source.subscribe(subject)

var subscriptionB;
setTimeout(() => {
    subscriptionB = source.subscribe(observerB);
}, 1000);

setTimeout(() => {
    subscriptionA.unsubscribe();
    subscriptionB.unsubscribe(); 
    // 這裡雖然 A 跟 B 都退訂了，但 source 還會繼續送元素
}, 5000);

setTimeout(() => {
    realSubscription.unsubscribe();
    // 這裡 source 才會真正停止送元素
}, 7000);
```

# refCount

refCount必须搭配multicast一起使用，他可以建立一个只要有订阅就自动connect的observable.

```javascript
var source = Rx.Observable.interval(1000)
             .do(x => console.log('send: ' + x))
             .multicast(new Rx.Subject())
             .refCount();

var observerA = {
    next: value => console.log('A next: ' + value),
    error: error => console.log('A error: ' + error),
    complete: () => console.log('A complete!')
}

var observerB = {
    next: value => console.log('B next: ' + value),
    error: error => console.log('B error: ' + error),
    complete: () => console.log('B complete!')
}

var subscriptionA = source.subscribe(observerA);
// 訂閱數 0 => 1

var subscriptionB;
setTimeout(() => {
    subscriptionB = source.subscribe(observerB);
    // 訂閱數 0 => 2
}, 1000);

setTimeout(() => {
    subscriptionA.unsubscribe(); // 訂閱數 2 => 1
    subscriptionB.unsubscribe(); // 訂閱數 1 => 0，source 停止發送元素
}, 5000);
```

# publish

> `multicast(new Rx.Subject())` 的简写

```javascript
var source = Rx.Observable.interval(1000)
             .publish() 
             .refCount();
             
// var source = Rx.Observable.interval(1000)
//             .multicast(new Rx.Subject()) 
//             .refCount();
```

加上Subject的三种变形

```javascript
var source = Rx.Observable.interval(1000)
             .publishReplay(1) 
             .refCount();
             
// var source = Rx.Observable.interval(1000)
//             .multicast(new Rx.ReplaySubject(1)) 
//             .refCount();

var source = Rx.Observable.interval(1000)
             .publishBehavior(0) 
             .refCount();
             
// var source = Rx.Observable.interval(1000)
//             .multicast(new Rx.BehaviorSubject(0)) 
//             .refCount();

var source = Rx.Observable.interval(1000)
             .publishLast() 
             .refCount();
             
// var source = Rx.Observable.interval(1000)
//             .multicast(new Rx.AsyncSubject(1)) 
//             .refCount();
```

# share

> publish + refCount => share

```javascript
var source = Rx.Observable.interval(1000)
            .share();

var source = Rx.Observable.interval(1000)
            .publish()
            .refCount();

var source = Rx.Observable.interval(1000)
            .multicast(new Rx.Subject())
            .refCount();
```

Subject使用命令的方式传送一个值到observable的串流中。

```javascript
class MyButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
        this.subject = new Rx.Subject();
        
        this.subject
            .mapTo(1)
            .scan((origin, next) => origin + next)
            .subscribe(x => {
                this.setState({ count: x })
            })
    }
    render() {
        return <button onClick={event => this.subject.next(event)}>{this.state.count}</button>
    }
}
```


使用Subject的时机：
- 当一个observable的操作过程中发生了side effect, 而我们不希望这个side effect 因为多个subscribe而被触发多次
```javascript
const result = Rx.Observable.interval(1000).take(6)
            .map(x => Math.random())

const result1 = result.subscribe(x => console.log('A: ', x))
const result2 = result.subscribe(x => console.log('B: ', x))

const result2 = Rx.Observable.interval(1000).take(6)
            .map(x => Math.random())
            .multicast(new Rx.Subject())
            .refCount()
            // .publish()
            // .refCount()

            // .share()
const result3 = result.subscribe(x => console.log('A: ', x))
const result4 = result.subscribe(x => console.log('B: ', x))

```


# 简易Observable

```javascript
const create = subscriber => { subscribe: observer => subscriber(observer) }

const observable = create(observer => {
    observer.next(1)
    observer.next(2)
    observer.next(3)
})

const observer = {
    next: value => console.log('value: ', value) 
}

observable.subscribe(observer)
```

# Scheduler

scheduler控制一个observable什么时候发送资源，以及资源如何送达。

- scheduler是一个数据结构，它知道如何根据优先级或者其他数据结构存储任务。
- scheduler是一个运行环境，它规定任务何时何地被执行，比如：立即执行，callback中执行，setTimeout中执行，animation frame中执行。
- schrduler是一个虚拟时钟，它规定任务在特定的时间点执行。

```javascript
var observable = Rx.Observable.create(function (observer) {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
});

console.log('before subscribe');
observable.observeOn(Rx.Scheduler.async) // 設為 async
.subscribe({
    next: (value) => { console.log(value); },
    error: (err) => { console.log('Error: ' + err); },
    complete: () => { console.log('complete'); }
});
console.log('after subscribe');

// "before subscribe"
// "after subscribe"
// 1
// 2
// 3
// "complete"
```

## Scheduler

- queue
- async
- asap
- animationFrame

要使用Scheduler除了前面用到的observeOn()方法外，以下这几个creation operators最后一个参数都能接收Scheduler

- bindCallback
- bindNodeCallback
- combineLatest
- concat
- empty
- from
- fromPromise
- interval
- merge
- of
- range
- throw
- timer

```javascript
var observable = Rx.Observable.from([1,2,3,4,5], Rx.Scheduler.async);
```

> queue
queue的运作方式跟预设的立即执行很像，但是当我们使用到递回的方法时，他会伫列这些行为而非直接执行，一个递回的operator就是他会执行另一个operator，最好的例子就是repeat()，如果我们不给他参数的话，他会执行无限多次，像下面这个例子

```javascript
Rx.Observable.of(10).repeat().take(1)
.subscribe(console.log);
```

这个例子在RxJS 4.x的版本中执行会使浏览器挂掉，因为take(1)永远不会被执行到repeat会一直重复要元素，而在RxJS 5中他预设了无限的observable为queue所以他会把repeat的next行为先伫列起来，因为前一个complete还在执行中，而这时repeat就会回传一个可退订的物件给take(1)等到repeat的next被第一次执行时就会结束，因为take(1)会直接收到值。

使用情境：

queue 很适合用在会有递回的operator 且具有大量资料时使用，在这个情况下queue 能避免不必要的效能损耗。

> asap

asap 的行为很好理解，它是非同步的执行，在浏览器其实就是setTimeout 设为0 秒(在NodeJS 中是用process.nextTick)，因为行为很好理解这里就不写例子了。

使用情境：

asap 因为都是在setTimeout 中执行，所以不会有block event loop 的问题，很适合用在永远不会退订的observable，例如在背景下持续监听server 送来的通知。

> async

这个是在RxJS 5 中新出现的Scheduler，它跟asap 很像但是使用setInterval 来运作，通常是跟时间相关的operator 才会用到。

> animationFrame

这个相信大家应该都知道，他是利用Window.requestAnimationFrame这个API去实作的，所以执行周期就跟Window.requestAnimationFrame一模一样。

使用情境：

在做复杂运算，且高频率触发的UI 动画时，就很适合使用animationFrame，以可以搭配throttle operator 使用。


# Cold Observable

> 每个Observable的subscribe都是项目独立的。

# Hot Observable

> 每个Observable的subscribe都是共享的, 由subject来实现。