---
layout:     post
title:      "HTML5"
subtitle:   "HTML5 tab"
date:       2016-05-23 15:08
author:     "Asher"
header-img: "home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - H5
---

## HTML 标签

# 注释
```html
<!--
    DOM
-->

<!--
    JAVA SCRIPT
//-->
```

# DOCTYPE
```html
<!DOCTYPE> 声明不是 HTML 标签；它是指示 web 浏览器关于页面使用哪个 HTML 版本进行编写的指令。
在 HTML 4.01 中，<!DOCTYPE> 声明引用 DTD，因为 HTML 4.01 基于 SGML(standard generalized markup language)。DTD 规定了标记语言的规则，这样浏览器才能正确地呈现内容。
HTML5 不基于 SGML，所以不需要引用 DTD。
```

# abbr
```html
<abbr title=''/>　标签指向简称或缩写
```

# address
```html
<address>
标签定义文档或者文章的作者的联系信息。
标签不应该用于描述通讯地址，除非它是联系信息的一部分。
该元素通常连同其他信息被包含在<footer>中
```

# area
```html
<map>
    <area shape="" coords="" href="" alt=""/>
</map>

<area>标签定义图像映射中的区域（注：图像映射指得是带有可点击区域的图像），没有结束标签。
```

# article
```html
<article>规定独立的自包含内容。一篇文章应该有其自身的意义，应该有可能独立于站点的其他部分对其进行开发。
```

# aside
```htlm
<aside>定义其所处内容之外的内容。例如文章的侧栏。
```

# audio
```html
<audio src=""></audio>　定义声音内容。
autoplay:
controls：　显示控件
loop:循环播放
muted:规定视频输出应该静音
preload: 音频在页面加载是进行播放，使用autoplay测忽略该属性。
src:
```

# b
```html
<b></b>　粗体
```

# base
```html
<base> 标签为页面上的所有链接规定默认地址或默认目标。
```

# bdi, bdo
```html
<bdi dir="ltr/rtl/auto"></bdi>

<bdo dir="ltr/rtl/auto"></bdo>

标签允许您设置一段文本，使其脱离其父元素的文本方向设置。

```

# canvas
```html
<canvas id="" height="" width=""></canvas>

```
