---
layout:     post
title:      "Jekyll + Github pages + Travis"
subtitle:   "Magic"
date:       2016-12-06
author:     "Asher"
header-img: "post-bg-jekyll.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Jekyll
---

### 为什么搭建Blog

> 最初的原因是在网上搜索解决方案的时候碰巧看到了一个香港妹子自己的博客
> [小白妹妹写代码](http://sabrinaluo.com/tech/ "我这么可爱一定是男孩子"){:target="_blank"}。
> 风趣幽默的表述让我也有了一个搭建Blog的冲动。
> 所以一切就此开始。。。

### Jekyll

Jekyll是一个简单的免费的Blog生成工具，类似WordPress。但是和WordPress又有很大的不同，原因是jekyll只是一个生成静态网页的工具，不需要数据库支持。但是可以配合第三方服务,例如Disqus。最关键的是jekyll可以免费部署在Github上，而且可以绑定自己的域名。

一个栗子解释安装：

```javascript
gem install jekyll //　安装jekyll

jekyll MyBlog //　新建一个空的Blog模板

jekyll server // 根据提示访问站点

// jekyll server --watch
// jekyll build
// jekyll build --watch
// jekyll clean
```

#### Jekyll themes

新建的模板不是很好看但是简介，初学这可以先用来练手。这里有一个模板的网站[JekyllThemes](http://jekyllthemes.org "Jekyll Theme"){:target="_blank"}。

> 找一个自己喜欢的模板进行改造吧～～～

### Github pages

> 之前在网上找了好多资料。。。其实认真看看文档，你就会发现这个其实非常简单。
> Github中有一个特殊的分支 `gh-pages`　这个分支中的代码github自动用来生成 Github Pages 站点。
> 所以你要做的就是建立一个Repository, 新建一个分支然后post代码jekyll下的 `_site/` 到这个分支。
> 访问username.github.io/repository即可看到你的网站。

### Travis-ci

> 首先我承认自己是一个懒人，我不想每次在发布博文的时候还要进行一次`jekyll build`
> 然后将代码再`push`到`gh-pages`上. 虽然过程比较简单, 但是每次都这样也挺烦人的, 所以我就想要一个云端的持续构建工具来帮我完成这个工作。

[Travic-ci](https://travis-ci.org/){:target="_blank"} 的用法也很简单。监听`master`分支, 当有新`commit`提交的时候就在云端跑脚本。当然这里所谓的跑脚本就是完成我们安排好的流程。

再来一个栗子：

```javascript
// 首先你要新建一个Gemfile文件来告诉travis在执行脚本钱需要安装哪些文件。
// 我的Gemfile文件：
source "https://rubygems.org"

gem "jekyll"
gem "jekyll-paginate"
```

----------------------------------------------------------

```javascript
//　然后你需要有一个.travis.yml文件来告诉travis-ci你需要让它帮你完成什么。
//　我的Travis-ci文件

language: ruby
rvm:
- 2.2
script:
- jekyll build --future
after_success:
- rm -rf `ls -a |egrep -v .git| egrep -v _site`
- mv _site//* .
- rm -rf _site
- ls -al
- git config user.name "Travis CI"
- git config user.email ${EMAIL}
- git add -A
- git status
- git commit -m "Generated Jekyll site by Travis CI - ${TRAVIS_BUILD_NUMBER}"
- git push --force "https://${DEPLOY_KEY}@${GITHUB_REPO}" HEAD: ${REPO_TARGET_BRANCH}
env:
  global:
  - NOKOGIRI_USE_SYSTEM_LIBRARIES=true
  - GITHUB_REPO: github.com/AsherJia/AsherBlog.git
  - REPO_TARGET_BRANCH: gh-pages

```

EMAIL以及DEPLOY_KEY是需要用travis来生成的，可以起到保护的作用。
这个脚本所完成的就是当有新的commit提交上来以后，执行jekyll build。
将生成的_site/下的文件push到gh-pages分支上。


```javascript
gem install travis

$ travis encrypt EMAIL=medomain.com --add

$ travis encrypt DEPLOY_KEY=token --add //这个token需要到github上生成。
```

----------------------------------------------------------

推荐一篇博文[Jekyll + Github pages + Travis CI, sitting in a tree](http://nick-dunn.co.uk/blog/jekyll-github-travis-ci-sitting-in-a-tree/){:target="_blank"}，　我在刚开始的时候就是根据这篇文章来学习的。

结束了，，，能看到这篇文章我相信你已经知道我的博客了。

> 一个简单的原因，甚至从逻辑上说不通，但是我的博客因此诞生。
> Later equals never.
