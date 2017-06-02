---
layout:     post
title:      "Babel Plugin"
subtitle:   "Babel Plugin"
date:       2017-03-24
author:     "Asher"
header-img: "home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Babel
---
[Babel](http://babeljs.io/)

# Polyfill
[Polyfill](http://babeljs.io/docs/usage/polyfill/#top)

> npm install --save babel-polyfill

Babel includes a polyfill that includes a custom regenerator [runtime](https://github.com/facebook/regenerator/blob/master/runtime.js) and [core-js](https://github.com/zloirock/core-js).

This will emulate a full ES2015 environment and is intended to be used in an application rather than a library/tool. This polyfill is automatically loaded when using `babel-node`.

# Stage-X(Experimental Presets)

Any transforms in stage-x presets are changes to the language that haven’t been approved to be part of a release of Javascript (such as ES6/ES2015).

> "Changes to the language are developed by way of a process which provides guidelines for evolving an addition from an idea to a fully specified feature"

The TC39 categorizes proposals into the following stages:

* [stage-0](http://babeljs.io/docs/plugins/preset-stage-0/) - Strawman: just an idea, possible Babel plugin.
* [stage-1](http://babeljs.io/docs/plugins/preset-stage-1/) - Proposal: this is worth working on.
* [stage-2](http://babeljs.io/docs/plugins/preset-stage-2/) - Draft: initial spec.
* [stage-3](http://babeljs.io/docs/plugins/preset-stage-3/) - Candidate: complete spec and initial browser implementations.
* stage-4 - Finished: will be added to the next yearly release.

Also check out the current TC39 proposals and its process document.


# Plugins

[transform-decorators-legacy](http://babeljs.io/docs/plugins/transform-decorators/#top)

> Stage 2 decorators are in progress babel/babel#2645. Patches welcome!
> In Babel 7, transform-decorators-legacy will be the default plugin in Stage-0.

[babel-plugin-syntax-dynamic-import](https://babeljs.io/docs/plugins/syntax-dynamic-import/)

[Bolg](https://medium.com/@thejameskyle/react-loadable-2674c59de178#.mm1sd44jb)
> babelrc { "plugins": ["syntax-dynamic-import"] }
