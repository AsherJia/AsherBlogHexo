---
layout:     post
title:      "Redux"
subtitle:   "Redux"
date:       2016-07-04 15:23
author:     "Asher"
header-img: "home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Redux
---

> A container does data fetching and then renders its corresponding sub-component.
> That’s it.

Dumb Components:
- 它必须能独立运作。。不能依赖依赖这个app的actions 或者 stores 部分
- 可以允许有this.props.children,这样的话有助于这个组件有修改弹性
- 接受数据和数据的改变只能通过props來处理,不必也不能用state。
- 组件的外观能用一个css來维护(这样才更容易重用，类似支付宝的ant)
- 很少用到state,(一般呈现动画的时候可能会用到。。比如控制下拉框的展开或者收起)
- 也许会用到其他的dumb components
- 比如说: Page, Sidebar, Story, UserInfo, List,像这些都是dumb components.

Smart Components:
- 一定包含至少一个Smart 或者 Dumb的元件，（这肯定啊。。不然他干的啥）
- 负责把从flux(or redux等)接收到的state传给dumb component
- 负责call action,并把它的callback传給dumb component
- 它应该只有结构没有外观（这样的话。。改个样式只需要改dumb 组件 就好了。。他写着。。他写那里 不然很累啊）
- 比如说: UserPage, FollowersSidebar, StoryContainer, FollowedUserList.

Benefit:
- 有助理你分离关注点，这样的话更有助于理解你的app的业务逻辑 和 它的ui
- 更有助于复用你的dumb组件，你可以将你的dumb组件复用于别的state下，而且这两个state还完全不同
- 本质上dumb 组件 其实 就是你的app的调色版。。你可以将它们放到一个页面上。。然后让设计师除了app的业务逻辑，样式随便怎么改


https://github.com/acdlite/flummox/blob/v3.5.1/docs/docs/guides/why-flux-component-is-better-than-flux-mixin.md

https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775

https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750#.vdqkadwoc


https://segmentfault.com/a/1190000004212752

https://segmentfault.com/a/1190000005147407

https://github.com/happypoulp/redux-tutorial

> A higher-order component is just a function that takes an existing component and
>>returns another component that wraps it.

https://github.com/gaearon/react-hot-boilerplate

http://www.jchapron.com/2015/08/14/getting-started-with-redux/

http://jaysoo.ca/2016/02/28/organizing-redux-application/

https://github.com/reactjs/reselect
