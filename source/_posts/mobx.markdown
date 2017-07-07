---
layout:     post
title:      "Mobx"
subtitle:   "Mobx"
date:       2017-03-17
author:     "Asher"
header-img: "home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Mobx
---

# 话不多说先来一个栗子
[GitHub MobxTemplate](https://github.com/AsherJia/MobxTemplate){:target="_blank"}

# FRP

> The essence of functional reactive programming is to specify the dynamic behavior of a value completely
> at the time of declaration. -- Heinrich Apfelmus

所以，FRP 的本质是，在声明一个值的时候，同时指定他的动态行为。这个值可能是事件，也可能是数据。

# 分支

然后 FRP 有两个重要的分支：

* 基于 Event Stream 的 FRP
* Transparent FRP (TFRP)

基于 Event Stream 的 FRP 擅长于管理 Stream，可进行 Joining, splitting, merging, mapping, sampling 等等。在需要处理多个 Event Stream 的时候非常有用，但对于简单场景来说，就过于复杂了。比如 RxJS 和 BaconJS 就属于此类。

Transparent FRP 是在背后去实现 Reactive Programming 。和 Event Stream 的 FRP 一样，TFRP 会在需要的时候更新 View，不同的是 TFRP 不需要你定义如何 (How) 以及何时 (When) 更新。这一类型的框架有 Meter(Tracker)，knockoutJS 和 EmberJS 。

那么已经有这么多实现了，为什么还要有 Mobx ?

# Mobx

Mobx 和其他实现有些不同。

* 同步执行 (这样监听的值始终是最新的，并且调试会方便，因为没有额外的 Promise/Async 库引入的堆栈信息)
* 没有引入额外的数据结构，基于普通的 Object, Class, Array 实现 (更少学习成本，更新数据时更自然)
* 独立方案 (不捆绑框架，相比 Meter, EmberJS 和 VueJS 而言)

# 基本原理

而要理解 mobx 的原理，我们需要一个更底层的例子。

```javascript

import { observable, autorun } from 'mobx';

const counter = observable(0);
autorun(() => {
console.log('autorun', counter.get());
});

counter.set(1);

```

运行结果:

```javascript

autorun 0
autorun 1

```

大家可能会好奇，为什么 `counter.set()` 之后，`autorun` 会自动执行? 要达到这个目的，通过 `counter` 需要知道 `autorun` 是依赖他的。那么这个依赖关系是在什么时候以及如何生成的呢?

先看代码，这里涉及了 `mobx` 的 `observable` 和 `autorun` 接口。与此相关的有 `Observable` 和 `Derivation` 两个类。 `Observable` 是数据源，`Derivation` 是推导。

类定义如下：

```javascript

Observable
  - observing: [Derivation]
  - get()
  - set()

Derivation
  - observer: [Observable]

```

然后，`autorun`执行的步骤是这样的：

* 生成一个Derivation
* 执行传入函数，计算出observing
    * 怎么计算？访问数据是会走到Observable的get方法，通过get方法做记录
* 在observing的Observable的observer里添加这个Derivation

到这里，Observable和Derivation的依赖关联就简历起来了。

那么，`counter.set()`执行之后是如何触发`autorun`的自动执行？在有了上面这一层依赖关系之后，这个就很好理解了。counter.set()执行时会从自己的observing属性里取依赖他的Derivation,并触发他们的重新执行。


# 运行时依赖计算

```javascript

import { observable, autorun } from 'mobx'

const counter = observable(0)
const foo = observalbe(0)
const bar = observable(0)

autorun(() => {
    if (counter.get() === 0) {
        console.log('foo ', foo.get())
    } else {
        console.log('bar ', bar.get())
    }
})

bar.set(10)  // no console log
counter.set(1) // trigger autorun
foo.set(100) // no console log
bar.set(100) // trigger autorun

```

实际上前面的`autorun`的执行步骤是做了简化的，真实：

* 生成Derivation
* 记录oldObserving(+)
* 执行传入函数，计算出observing
    * 访问数据时会走到Obdervable的get()方法，通过get()方法做的记录
* 和oldObderving做diff, 得到新增和删除列表
* 通过前面得到的diff结果，修改Observable的observing

相比之前的，增加了diff的逻辑，以达到每次执行时候动态更新依赖关系表的目的。

# get/set magic

大家在看前面的例子里可能会有个疑问，为啥第一个例子里可以通过 appState.counter 来设置，而后面的例子里需要用 counter.get 和 counter.set 来取值和设值?

这和数据类型有关，mobx 支持的类型有 primitives, arrays, classes 和 objects 。primitives (原始类型) 只能通过 set 和 get 方法取值和设值。而 Object 则可以利用 Object.defineProperty 方法自定义 getter 和 setter 。

```javascript

Object.defineProperty(adm.target, propName, {
    configurable: true,
    enumerable: !isComputed,
    get: function() {
        return observable.get();
    },
    set: isComputed
        ? throwingComputedValueSetter
        : createSetter(adm, observable as ObservableValue<any>, propName)
});

```
详见[源码](https://github.com/mobxjs/mobx/blob/44a86f45170d52368858d27ea3bc77ed583a58fa/src/types/observableobject.ts#L108-L117)

# ComputedValue

ComputedValue 同时实现了 Observable 和 Derivation 的接口，即可以监听 Observable，也可以被 Derivation 监听。

# Reaction

Reaction 本质上是 Derivation，但他不能再被其他 Derivation 监听。

# Autorun

autorun 是 Reaction 的[简单封装](https://github.com/mobxjs/mobx/blob/e195b01d0dd6516480c76a6e952dda206e612a31/src/api/autorun.ts#L14-L27)。

```javascript

export function autorun(view: Lambda, scope?: any) {
	assertUnwrapped(view, "autorun methods cannot have modifiers");
	invariant(typeof view === "function", "autorun expects a function");
	invariant(view.length === 0, "autorun expects a function without arguments");
	if (scope)
		view = view.bind(scope);

	const reaction = new Reaction(view.name || ("Autorun@" + getNextId()), function () {
		this.track(view);
	});
	reaction.schedule();

	return reaction.getDisposer();
}

```

# 同步执行

其他的 TFRP 类库，比如 Tracker 和 Knockout ，数据更新后的执行都是异步的，需要等到下一个 event loop 。(可以想象成 setTimeout)

而 Mobx 的执行是同步的，这样做有两个好处：

* ComputedValue 在他依赖的值修改后可以马上被使用，这样你就永远不会使用一个过期的 ComputedValue
* 调试方便，堆栈里没有冗余的 Promise / async 库

# Transation

由于 mobx 的更新是同步的，所以每 set 一个值，就会触发 reaction 的更新。所以为了批量更新，就引入了 transation 。

```javascript

transaction(() => {
  user.firstName = "foo";
  user.lastName = "bar";
});

```

在一些情况下，等所有的修改执行完再执行所有的 deviration 会更合适。注意 transaction 只是推迟了 deviration 的执行，本身还是同步的。

# Action

action 是 transation 是简单封装，支持通过 decorator 的方式调用。并且是 untrack 的，这样可以在 Derivation 里调用他。

# Observe(mobx-react)

第一次render时：
    * 初始化一个 Reaction，onValidate 时会 forceUpdate Component
    * 在 reaction.track 里执行 baseRender，建立依赖关系

有数据修改时：
    * 触发 onValidate 方法，执行 forceUpdate
    * 触发 render 的执行 (由于在 reaction.track 里执行，所以会重新建立依赖关系)

shouldComponentUpdate：

    * 和 PureRenderMixin 类似的实现，阻止不必要的更新

componentWillReact:

    * 数据更新的时候触发
    * 注意和 componentWillMount 和 componentWillUpdate 的区别

[https://github.com/mobxjs/mobx](https://github.com/mobxjs/mobx)
[https://medium.com/@mweststrate/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254#.4sxpfpsuk](https://medium.com/@mweststrate/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254#.4sxpfpsuk)
