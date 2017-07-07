---
layout:     post
title:      "Flex 布局"
subtitle:   "弹性布局"
date:       2016-05-19 09:30:00
author:     "Asher"
header-img: "post-bg-e2e-ux.jpg"
header-mask: 0.3
catalog:    true
tags:
    - CSS
---

# Flex 布局

Flex是Flexible Box的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。
任何一个容器都可以指定为Flex布局.

``` css
.box {
    display: flex;
    display: -webkit-flex;
}

.box {
    display: inline-flex;
    display: -webkit-inline-flex;
}
```


![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071004.png)

> 容器默认存在两根轴：水平的主轴（`main axis`）和垂直的交叉轴（`cross axis`）。
> 主轴的开始位置（`与边框的交叉点`）叫做`main start`，结束位置叫做m`ain end`；
> 交叉轴的开始位置叫做`cross start`，结束位置叫做`cross end`。
> 项目默认沿主轴排列。单个项目占据的主轴空间叫做`main size`，占据的交叉轴空间叫做`cross size`。

# 容器

## flex-direction

项目的排列方向

``` css
.box {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071005.png)

* row 垂直向上 (`default`)
* row-reverse 垂直向下
* column 水平向右
* column-reverse 水平向左


## flex-warp
如果一条轴线排不下，如何换行。

```css
.box{
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071006.png)

* nowrap 不换行 (`default`)
* wrap 换行 第一行在上
* wrap-reverse 换行 第一行在下


## flex-flow

flex-direction + flex-wrap

```css
.box {
  flex-flow: <flex-direction> || <flex-wrap>;
}
```


## justify-content

项目在主轴上的对齐方式。

```css
.box {
    justify-content: flex-start | flex-end | center | space-between | space-around
}
```


![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071010.png)

* felx-start 左对齐
* flex-end 右对齐
* center 居中
* space-between 两端对齐，项目之间的间隔都相等
* space-around 项目两侧的间隔相等

## align-items

项目在交叉轴上如何对齐

```css
.box {
    align-items: flex-start | flex-end | center | baseline | stretch
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071011.png)

flex-start 交叉轴的起点对齐
flex-end 交叉轴的终点对齐
center 交叉轴的中点对齐
baseline 项目的第一行文字的基线对齐
stretch 如果项目未设置高度或设为auto，将占满整个容器的高度 (`default`)

## align-content

当有多跟轴线的时候项目的对齐方式

```css
.box {
    align-content: flex-start | flex-end | center | space-around | space-between | stretch
}
```

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071012.png)

* flex-start 与交叉轴的起点对齐
* flex-end 与交叉轴的终点对齐
* center 与交叉轴的中点对齐
* space-between 与交叉轴两端对齐，轴线之间的间隔平均分布
* space-around 每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍
* stretch 轴线占满整个交叉轴(`defalut`)


# 项目的属性

## order

定义项目的排列顺序。数值越小，排列越靠前，默认为0。

```css
.item {
  order: <integer>;
}
```


## flex-grow

定义项目的放大比例，默认为0，即存在剩余空间也不放大。

```css
.item {
    flex-grow: <number>  // default 0
}
```


## flex-shrink

定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。

```css
.item {
    flex-shrink: <number> // default 1
}
```

> 如果所有项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小。如果一个项目的flex-shrink属性为0，其
> 项目都为1，则空间不足时，前者不缩小。
> 负值对该属性无效。


## flex-basis

定义了在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。

```css
.item {
  flex-basis: <length> | auto; /* default auto */
}
```

## flex

flex: flex-grow flex-shrik fles-basis
flex: auto (1 1 auto)
flex: none (0 0 auto)

## align-self

允许单个项目有与其他项目不同的对齐方式。 可覆盖align-item。

来个栗子:

``` css
    .container1 {
        display: flex;
        background-color: yellow;
        width: 500px;
        height: 500px;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-content: center;
    }

    .sub1 {
        background-color: red;
        margin: 10px;
        width: 40px;
        height: 40px;
        flex-shrink: 0;
        align-self: flex-end;
    }

    .sub2 {
        background-color: green;
        margin: 10px;
        width: 40px;
        height: 40px;
        flex-shrink: 0;
    }

    .sub3 {
        background-color: black;
        margin: 10px;
        width: 40px;
        height: 40px;
        flex-shrink: 0;
    }
```

```html
    <div class='container1'>
        <div class='sub1'></div>
        <div class='sub2'></div>
        <div class='sub3'></div>
        <div class='sub1'></div>
        <div class='sub2'></div>
        <div class='sub3'></div>
        <div class='sub1'></div>
        <div class='sub2'></div>
        <div class='sub3'></div>
        <div class='sub1'></div>
        <div class='sub2'></div>
        <div class='sub3'></div>
        <div class='sub1'></div>
        <div class='sub2'></div>
        <div class='sub3'></div>
        <div class='sub1'></div>
    </div>
```
