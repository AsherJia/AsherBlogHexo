---
layout:     post
title:      "Reducer React App's Size In Production"
subtitle:   "webpack"
date:       2016-05-19 09:30:00
author:     "Asher"
header-img: "webpack-bg.png"
header-mask: 0.3
catalog:    true
tags:
    - WebPack
---

[App](https://medium.com/@rajaraodv/two-quick-ways-to-reduce-react-apps-size-in-production-82226605771a#.qaey3854r){:target="_block"}

If you are building a React + Redux App that has Webpack, then you might have noticed that the size of the final bundle.js (the dev version) for a simple app itself could be 1MB- 2MB!
For example: Below is a picture from Webpack stats analyzer for the simple react-redux-blog (live). It shows that total size is 1.5MB and 90% (1.2MB) is just libraries in node_modules!


For example: Below is a picture from Webpack stats analyzer for the simple react-redux-blog (live). It shows that total size is 1.5MB and 90% (1.2MB) is just libraries in node_modules!
![](http://o7d3ayvg2.bkt.clouddn.com/react-redux-webpack-node_modules.png)

It could be scary😱 but Webpack and Node.js has all the tools you need to reduce the size.
I could reduce the size from 1.5MB to just 90KB by simply doing the following two things:

1: Add the following Webpack plugins (source code)

```javascript
plugins: [
    new webpack.DefinePlugin({ // <-- key to reducing React's size
        // This can reduce react lib size and disable some dev feactures like props validation
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }),
    new webpack.optimize.DedupePlugin(), //dedupe similar code
    new webpack.optimize.UglifyJsPlugin(), //minify everything
    new webpack.optimize.AggressiveMergingPlugin()//Merge chunks
  ],
```

> DefinePlugin
The DefinePlugin allows you to create global constants which can be configured at compile time. This can be very useful for allowing different behaviour between development builds and release builds. For example, you might use a global constant to determine whether logging takes place; perhaps you perform logging in your development build but not in the release build. That’s the sort of scenario the DefinePlugin facilitates.

> DedupePlugin
Search for equal or similar files and deduplicate them in the output. This comes with some overhead for the entry chunk, but can reduce file size effectively.

This doesn’t change the module semantics at all. Don’t expect to solve problems with multiple module instance. They won’t be one instance after deduplication.

`Note: Don’t use it in watch mode. Only for production builds.`

> UglifyJsPlugin
Minimize all JavaScript output of chunks. Loaders are switched into minimizing mode.
You can pass an object containing [UglifyJS options](https://github.com/mishoo/UglifyJS2#usage){:target="_block"}.

> AggressiveMergingPlugin
A plugin for a more aggressive chunk merging strategy. Even similar chunks are merged if the total size is reduced enough. As an option modules that are not common in these chunks can be moved up the chunk tree to the parents.
