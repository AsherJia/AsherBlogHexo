---
layout:     post
title:      "Gulp"
subtitle:   "Github"
date:       2016-05-20 17:57:00
author:     "Asher"
header-img: "post-bg-gulp.jpg"
header-mask: 0.3
catalog:    true
tags:
    - 前端工具
---

# Gulp

> gulp 是基于 Nodejs 的自动任务运行器，能自动化地完成javascript/coffee/sass/less/html/image/css
> 等文件的的测试、检查、合并、压缩、格式化、浏览器自动刷新、部署文件生成，并监听文件在改动后重复指定的这些
> 步骤。在实现上， gulp
> 借鉴了Unix操作系统的管道（pipe）思想，前一级的输出，直接变成后一级的输入，使得在操作上非常简单.

![](http://o7d3ayvg2.bkt.clouddn.com/gulp-detail.jpg)

# 推荐使用nvm

[NVM](https://github.com/creationix/nvm){:target="_block"}

```javascript
npm install gulp --global --save-dev
```

# Gulpfile.js

```javascript
var gulp = require('gulp');

gulp.task('default', () => {
    gulp.src()
        .pipe()
        .pipe()
        ...
})

```

## gulp.src(globs[, options])

> Emits files matching provided glob or an array of globs.
> Returns a [stream](http://nodejs.org/api/stream.html){:target="_block"} of
> [Vinyl](https://github.com/gulpjs/vinyl-fs){:target="_block"} files that can be
> [piped](https://nodejs.org/api/stream.html#stream_readable_pipe_destination_options){:target="_block"} to plugins.

> 读取单个或一组文件，　返回一个可以被接入其他插件的文件流。

### options {}

* options.buffer boolean/true
false的时候　返回不带缓冲的文件流

* options.read boolean/true

返回null　不读取文件

* options.base string everyting before glob starts [gulp2base](https://github.com/contra/glob2base)


## gulp.dest(path[, options])

可扩展，具有写入功能。　反向输出文件可多个，当文件不存在的时候可以自动创建。

```javascript
gulp.src('./client/templates/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./build/templates'))
  .pipe(minify())
  .pipe(gulp.dest('./build/minified_templates'));
```


* path 输出地址

### options {}

* options.cwd process.cwd()：前脚本的工作目录的路径 当文件输出路径为相对路径将会用到
* options.mode 0777 指定被创建文件夹的权限


## gulp.task(name[, deps], fn)

创建gulp任务

* name string 任务名
* deps stringArray 任务依赖，被依赖的任务会返回当前任务的事件流所以会先执行。
* fn fun 当前任务的内容


## gulp.watch(glob [, opts], tasks) or gulp.watch(glob [, opts, cb])

监听文件变化，当文件变化时执行tasks

* glob 需要处理的文件
* opts [gaze](https://github.com/shama/gaze)
* tasks array 文件变化时要跑的任务
* cb　callback function

```javascript
gulp.watch('js/**/*.js', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```

* event.type added, changed, deleted or renamed.
* event.path 触发时间的文件的路径(The path to the file that triggered the event.)

# Gulp plugin

[慢慢整理](http://www.open-open.com/lib/view/open1426232157888.html)

## HTML&CSS

* [autoprefixer](https://github.com/postcss/autoprefixer) - parse CSS and add vendor prefixes to rules by Can I Use.


[H1](http://yaowenjie.github.io/front-end/using-gulp-with-babel)
[H2](https://www.talkingcoder.com/article/6367591948982623481)
