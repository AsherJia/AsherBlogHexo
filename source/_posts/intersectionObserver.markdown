---
layout:     post
title:      "Intersection Observer"
subtitle:   "Web API"
date:       2017-12-28 15:38
author:     "Asher"
header-img: "post-bg-gulp.jpg"
header-mask: 0.3
catalog:    true
tags:
    - web API
---

# 文章开头先来一个栗子

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
    </div>

    <script>
        var io = new IntersectionObserver(entrys => {
            for (let entry of entrys) {
                console.log('entry: ', entry)
                console.log('entry.target: ', entry.target)
                if (entry.intersectionRatio > 0) {
                    entry.target.className = 'box'
                } else {
                    entry.target.className = 'box blue'
                }
            }
        }, {})

        var elements = document.getElementsByClassName('box')

        for (let element of elements) {
            io.observe(element)
        }
    </script>
    <style>
        .box {
            display: block;
            height: 200px;
            width: 200px;
            background: red;
            margin-top: 100px;
        }
        .blue {
            background: blue
        }
    </style>
</body>
</html>
```

# IntersectionObserver

```javascript

var io = new IntersectionObserver(callback, option)

io.observe(element)

io.unobserve(element)

io.disconnect()

```

## callback 参数

目标元素的可见性变化时，就会调用观察器的回调函数`callback`

`callback`

# IntersectionObserverEntry

- IntersectionObserverEntry
    - target: 被观察的目标元素，是一个DOM节点对象
    - rootBounds: 根元素的矩形区域信息，getBoundingClientRect() 方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回null
    - boundingClientRect: 目标元素的矩形区域的信息
    - intersectionRect: 目标元素与视口的交叉区域信息
    - intersectionRatio: 目标元素的可见比例，即`intersectionRect`占`boundingClientRect`的比例，完全可见时为`1`， 完全不可见时小于等于`0`

```javascript
{
  time: 3893.92,
  rootBounds: ClientRect {
    bottom: 920,
    height: 1024,
    left: 0,
    right: 1024,
    top: 0,
    width: 920
  },
  boundingClientRect: ClientRect {
     // ...
  },
  intersectionRect: ClientRect {
    // ...
  },
  intersectionRatio: 0.54,
  target: element
}

```

> IntersectionObserver API 是异步的，不随着目标元素的滚动同步触发
> IntersectionObserver 的实现，应该采用 requestIdleCallback(), 即只有线程空闲下来，才会执行观察器。这意味着，这个观察器的优先级非常低，只在其他任务执行完，浏览器有了空闲才会执行。