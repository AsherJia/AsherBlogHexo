---
layout:     post
title:      "Data Structure And Algorithms"
subtitle:   "Algorithms"
date:       2019-04-15
author:     "Asher"
header-img: ""
header-mask: 0.3
catalog:    true
tags:
    - Algorithms
---

> T(n) = O(f(n))

- 只关注循环执行次数最多的一段代码
- 加法法则：总复杂度等于量级最大的那段代码的复杂度
- 乘法法则：嵌套代码的复杂度等于嵌套内外代码复杂度的乘积

- 常量阶 O(1)
    - 只要代码的执行时间，不随着n的增大而增大。

- 对数阶 O(log n)
```javascript
while (i<n) {
    i = i*2
}
```

- 线性阶 O(n)
```javascript
while (i<n) {
    i = i+1
}
```

- 线性对数阶 O(n*logn)
```javascript
while (i<n) {
    i = i+1
    while (k<n) {
        k = k*2
    }
}
O(n*logn)
```

- K次方阶 O(n^k)
```javascript
while (i<n) {
    i = i+1
    while (k<n) {
        k = k+1
    }
}
```

- 指数阶 O(2^n)
```javascript
while(i<n) {
    while(k<2n){
        k++
    }
    i++
}
```

- 阶乘阶 O(n!)
```javascript
void T(int n) {
    while(i<n){
        T(n-1)
        i++
    }
}
```


> 空间复杂度

- O(1)

- O(n)

- O(n^k)

![](https://static001.geekbang.org/resource/image/49/04/497a3f120b7debee07dc0d03984faf04.jpg)


> 最好情况时间复杂度（best case time complexity）
> 最坏情况时间复杂度（worst case time complexity）
> 平均情况时间复杂度（average case time complexity）
> 均摊时间复杂度（amortized time complexity）

