---
layout:     post
title:      "EventLoop Task and Microtasks"
subtitle:   "javascript"
date:       2017-12-13 14:15
author:     "Asher"
header-img: "nodejs.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Javascript
---

# 栗子

```javascript
(function test() {
    setTimeout(function() {console.log(4)}, 0);
    new Promise(function executor(resolve) {
        console.log(1);
        for( var i=0 ; i<10000 ; i++ ) {
            i == 9999 && resolve();
        }
        console.log(2);
    }).then(function() {
        console.log(5);
    });
    console.log(3);
})()
```

> 结果为 1，2，3，5，4

> `Promise.then` 是异步执行的，而创建 `Promise` 中的 `excutor` 是同步执行的。

> `setTimeout` 的异步和 `Promise.then` 的异步 不属于同一队列


# Promise

> [Promise/A+ 规范](https://promisesaplus.com/)
> promise.then(onFulfilled, onRejected)

> 2.2.4 onFulfilled or onRejected must not be called until the execution context stack contains only platform code. [3.1].

> Here “platform code” means engine, environment, and promise implementation code. In practice, this requirement ensures that onFulfilled and onRejected execute asynchronously, after the event loop turn in which then is called, and with a fresh stack. This can be implemented with either a “macro-task” mechanism such as setTimeout or setImmediate, or with a “micro-task” mechanism such as MutationObserver or process.nextTick. Since the promise implementation is considered platform code, it may itself contain a task-scheduling queue or “trampoline” in which the handlers are called.

# Event Loop

> [HTML5](https://www.w3.org/TR/html5/webappapis.html#event-loop)

- 每个浏览器环境，至多有一个event loop
- 一个event loop可以有一个或多个task queue
- 一个task queue是一列有序的task, 用来做一下工作： Events task, Parsing task, Callbacks task, Using a resource task, Reacting to DOM manipulation task等

每个task都有自己相关的document, 比如一个task在某个element的上下文中进入队列，那么它的document就是这个element的document
每个task定义时都有一个task source, 从同一个task source来的task必须放到同一个task queue， 从不同源来的则被添加到不同的队列。
每个(task source对应的) task queue 都保证自己队列的先进先出的执行顺序，但event loop的每个return 是由浏览器决定从哪个task source挑选task。这允许浏览器为不同的task source设置不同的优先级，比如为用户交互设置更高优先级来使用户感觉流畅

# Job and Job Queues规范

一个 Job Queue 是一个先进先出的队列。一个ECMAScript必须包含以下两个Job Queue

- ScriptJobs: Jobs that validate and evaluate ECMAScript and Module source text.
- PromiseJobs: Jobs that are responses to the settlement of a Promise.

单个 `Job Queue` 中的 `PendingJob` 总是按序(先进先出)执行，但多个 `Job Queue` 可能会交错执行。
`Promise.then` 的执行其实是向 `PromiseJobs` 添加 `Job` [PromiseJobs](http://ecma-international.org/ecma-262/6.0/index.html#sec-performpromisethen)

# Event Loop 怎么处理 macro-task 和 micro-task

micro-task 在 ES2015 规范中成为 Job。
macro-task 代指 task。

- 每个线程有自己的事件循环，所以每个 web worker 才可以独立执行。然而，所有同属一个origin的windows共享一个事件循环，所以它们可以同步交流
- 事件循环不间断在跑，执行任何进入队列的task
- 一个事件循环可以有多个task source, 每个task source保证自己的任务队列的执行顺序，但由浏览器在（事件循环的）每轮中挑选某个task source的task.
- task are scheduled, 所以浏览器可以从内部到JS/DOM, 保证动作按序发生。在tasks之间，浏览器可能会render updates。从鼠标点击到事件回调需要schedule task，解析html, setTimeout这些都需要。
- microtask are scheduled, 经常是为需要直接在当前脚本执行完后立即发生的事，比如 async某些动作但不必承担新开task的弊端。microtask queue在回调之后执行，只要没有其他JS在执行中，并且在每个task的结尾。microtask中添加的microtask也被添加到microtask queue的末尾并处理。microtask包括mutation observer callbacks 和 promise callbacks。


> I/O UI render 是在每个task中间执行的。

macro-task: script(整体代码)， setTimeout, setInterval, setImmediate, I/O, UI rendering, 
micro-task: process.nextTick, Promises, Promise.resolve(), Object.observe, MutationObserver

其中 setImmediate 和 process.nextTick 是 Node.JS里面的API



```javascript
console.log('glob1')

setImmediate(() => {
    console.log('immediate1')
    precess.nextTick(() => {
        console.log('immediate1_nextTick')
    })

    new Promise((resolve) => {
        console.log('immediate1_promise')
        resolve()
    }).then(() => {
        console.log('immediate1_then')
    })
})

setTimeout(() => {
    console.log('timeout1')
    process.nextTick(() => {
        console.log('timeout1_nextTick')
    })

    new Promise((resolve) => {
        console.log('timeout1_promise')
        resolve()
    }).then(() => {
        console.log('timeout1_then')
    })

    setTimeout(() => {
        console.log('timeout1_timeout1')

        process.nextTick(() => {
            console.log('timeout1_timeout1_nextTick')
        })

        setImmediate(() => {
            console.log('timeout1_setImmediate1')
        })
    })
})

new Promise((resolve) => {
    console.log('glob1_promise')
    resolve()
}).then(() => {
    console.log('glob1_then')
})

glob1
glob1_promise
glob1_then
immediate1
immediate1_promise
immediate1_nextTick
immediate1_then
timeout1
timeout1_promise
timeout1_nextTick
timeout1_then
timeout1_timeout1
timeout1_timeout1_nextTick
timeout1_setImmediate1
```


> process.nextTick 当前task执行完立即执行 优先于micro-task
