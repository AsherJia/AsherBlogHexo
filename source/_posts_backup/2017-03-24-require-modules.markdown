---
layout:     post
title:      "Require Modules"
subtitle:   "Require Modules"
date:       2017-03-24
author:     "Asher"
header-img: "home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Require
---

[Require Modules](https://medium.freecodecamp.com/requiring-modules-in-node-js-everything-you-need-to-know-e7fbd119be8#.3kt6vpu5h)

Node uses two core modules for managing module dependencies:
* The require module, which appears to be available on the global scope — no need to require('require').
* The module module, which also appears to be available on the global scope — no need to require('module').

You can think of the require module as the command and the module module as the organizer of all required modules.

Requiring a module in Node isn’t that complicated of a concept.

> const config = require('/path/to/file');

The main object exported by the require module is a function (as used in the above example). When Node invokes that require() function with a local file path as the function’s only argument, Node goes through the following sequence of steps:

* Resolving: To find the absolute path of the file.
* Loading: To determine the type of the file content.
* Wrapping: To give the file its private scope. This is what makes both the require and module objects local to every file we require.
* Evaluating: This is what the VM eventually does with the loaded code.
* Caching: So that when we require this file again, we don’t go over all the steps another time.

In this article, I’ll attempt to explain with examples these different stages and how they affect the way we write modules in Node.
Let me first create a directory to host all the examples using my terminal:

> mkdir ~/learn-node && cd ~/learn-node

All the commands in the rest of this article will be run from within `~/learn-node`.

# Resolving a local path

Let me introduce you to the `module` object. You can check it out in a simple REPL session:

```javascript

~/learn-node $ node
> module
Module {
  id: '<repl>',
  exports: {},
  parent: undefined,
  filename: null,
  loaded: false,
  children: [],
  paths: [ ... ] }

```

Every module object gets an id property to identify it. This id is usually the full path to the file, but in a REPL session it’s simply <repl>.
Node modules have a one-to-one relation with files on the file-system. We require a module by loading the content of a file into memory.
However, since Node allows many ways to require a file (for example, with a relative path or a pre-configured path), before we can load the content of a file into the memory we need to find the absolute location of that file.
When we require a 'find-me' module, without specifying a path:
