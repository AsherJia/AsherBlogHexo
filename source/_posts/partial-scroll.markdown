---
layout:     post
title:      "Partial Scroll"
subtitle:   "Github"
date:       2016-05-19 09:30:00
author:     "Asher"
header-img: "webpack-bg.png"
header-mask: 0.3
catalog:    true
tags:
    - HTML
---

### 局部滚到

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>Document</title>
</head>
<style type="text/css">
	.page {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;

		background: #F0F8FF;
	}

	.header {
	    position: absolute;
	    top: 0;
	    right: 0;
	    left: 0;
	    background: #2A3BC6;
	    height: 140px;
	    z-index: 2;
	}

	.side {
		position: absolute;
		width: 200px;
		top: 140px;
		bottom: 0;
		left: 0;
		overflow: auto;

		background: #54E5AB;
	}

	.content {
		position: absolute;
		overflow: auto;
		top: 140px;
		left: 200px;
		right: 0;
		bottom: 0;
	}

</style>
<body>
	<div class='page'>
		<div class='header'></div>
		<div class='side'></div>
		<div class='content'></div>
	</div>
</body>
</html>
```
