---
layout:     post
title:      "Redux Async Function"
subtitle:   "Async"
date:       2017-03-22
author:     "Asher"
header-img: "home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Redux
---

# Redux异步方案选型

作为react社区最热门的状态管理框架，相信很多人都准备甚至正在使用Redux。

由于Redux的理念非常精简，没有追求大而全，这份架构上的优雅却在某种程度上伤害了使用体验：不能开箱即用，甚至是异步这种最常见的场景也要借助社区方案。

如果你已经挑花了眼，或者正在挑但不知道是否适合，或者已经挑了但不知道会不会有坑，这篇文章应该适合你。

本文会从一些常见的Redux异步方案出发，介绍它们的优缺点，进而讨论一些与异步相伴的常见场景，帮助你在选型时更好地权衡利弊。


## 简单方案
### redux-thunk：指路先驱

[Github](https://github.com/gaearon/redux-thunk)

> Redux本身只能处理同步的Action，但可以通过中间件来拦截处理其它类型的action，比如函数(Thunk)，再用回调触发普通Action
> 从而实现异步处理，在这点上所有Redux的异步方案都是类似的。

### redux-promise：瘦身过头

由于redux-thunk写起来实在是太麻烦了，社区当然会有其它轮子出现。[redux-promise](https://github.com/pburtchaell/redux-promise-middleware)则是其中比较知名的，同样也享受了官网出镜的待遇。

它自定义了一个middleware，当检测到有action的payload属性是Promise对象时，就会:

* 若resolve，触发一个此action的拷贝，但payload为promise的value，并设status属性为”success”
* 若reject，触发一个此action的拷贝，但payload为promise的reason，并设status属性为”error”

```javascript
//action types
const GET_DATA = 'GET_DATA';

//action creator
const getData = function(id) {
    return {
        type: GET_DATA,
        payload: api.getData(id) //payload为promise对象
    }
}

//reducer
function reducer(oldState, action) {
    switch(action.type) {
    case GET_DATA:
        if (action.status === 'success') {
            return successState
        } else {
               return errorState
        }
    }
}
```

请等等，任何能明显减少代码量的方案，都应该小心它是否过度省略了什么东西，减肥是好事，减到骨头就残了。

#### 场景解析之：乐观更新

多数异步场景都是保守更新的，即等到请求成功才渲染数据。而与之相对的乐观更新，则是不等待请求成功，在发送请求的同时立即渲染数据。

最常见的例子就是微信等聊天工具，发送消息时消息立即进入了对话窗，如果发送失败的话，在消息旁边再作补充提示即可。这种交互”乐观”地相信请求会成功，因此称作乐观更新(Optimistic update)。

由于乐观更新发生在用户操作时，要处理它，意味着必须有action表示用户的初始动作

在上面redux-thunk的例子中，我们看到了GET_DATA, GET_DATA_SUCCESS、GET_DATA_FAILED三个action，分别表示初始动作、异步成功和异步失败，其中第一个action使得redux-thunk具备乐观更新的能力。

而在redux-promise中，最初触发的action被中间件拦截然后过滤掉了。原因很简单，redux认可的action对象是 plain JavaScript objects，即简单对象，而在redux-promise中，初始action的payload是个Promise。

另一方面，使用status而不是type来区分两个异步action也非常值得商榷，按照redux对action的定义以及社区的普遍实践，个人还是倾向于使用不同的type，用同一type下的不同status区分action额外增加了一套隐形的约定，甚至不符合该redux-promise作者自己所提倡的FSA，体现在代码上则是在switch-case内再增加一层判断。

### redux-promise-middleware：拔乱反正

redux-promise-middleware相比redux-promise，采取了更为温和和渐进式的思路，保留了和redux-thunk类似的三个action。

```javascript
//action types
const GET_DATA = 'GET_DATA',
    GET_DATA_PENDING = 'GET_DATA_PENDING',
    GET_DATA_FULFILLED = 'GET_DATA_FULFILLED',
    GET_DATA_REJECTED = 'GET_DATA_REJECTED';
//action creator
const getData = function(id) {
    return {
        type: GET_DATA,
        payload: {
            promise: api.getData(id),
            data: id
        }
    }
}

//reducer
const reducer = function(oldState, action) {
    switch(action.type) {
    case GET_DATA_PENDING :
        return oldState; // 可通过action.payload.data获取id
    case GET_DATA_FULFILLED :
        return successState;
    case GET_DATA_REJECTED :
        return errorState;
    }
}
```

如果不需要乐观更新，action creator可以使用和redux-promise完全一样的，更简洁的写法，

```javascript
const getData = function(id) {
    return {
        type: GET_DATA,
        payload: api.getData(id) //等价于 {promise: api.getData(id)}
    }
}
```

此时初始actionGET_DATA_PENDING仍然会触发，但是payload为空。

相对redux-promise于粗暴地过滤掉整个初始action，redux-promise-middleware选择创建一个只过滤payload中的promise属性的XXX_PENDING作为初始action，以此保留乐观更新的能力。

同时在action的区分上，它选择了回归type的”正途”，_PENDING、_FULFILLED、_REJECTED等后缀借用了promise规范 (当然它们是可配置的) 。

它的遗憾则是只在action层实现了简化，对reducer层则束手无策。另外，相比redux-thunk，它还多出了一个_PENDING的字符串模板代码(三个action却需要四个type)。

> 社区有类似type-to-reducer这样试图简化reducer的库。但由于reducer和异步action通常是两套独立的方案，reducer相关的库无法去猜测异步action的后缀是什么(甚至有没有后缀)，社区也没有相关标准，也就很难对异步做出精简和抽象了。

### redux-action-tools：软文预警

无论是redux-thunk还是redux-promise-middleware，模板代码都是显而易见的，每次写XXX_COMPLETED这样的代码都觉得是在浪费生命——你得先在常量中声明它们，再在action中引用，然后是reducer，假设像redux-thunk一样每个异步action有三个type，三个文件加起来你就得写九次!

国外开发者也有相同的报怨：

有没有办法让代码既像redux-promise一样简洁，又能保持乐观更新的能力呢？

redux-action-tools是我给出的答案：

```javascript
const GET_DATA = 'GET_DATA';

//action creator
const getData = createAsyncAction(GET_DATA, function(id) {
    return api.getData(id)
})

//reducer
const reducer = createReducer()
    .when(getData, (oldState, action) => oldState)
    .done((oldState, action) => successState)
    .failed((oldState, action) => errorState)
    .build()
```

redux-action-tools在action层面做的事情与前面几个库大同小异：同样是派发了三个action：GET_DATA/GET_DATA_SUCCESS/GET_DATA_FAILED。这三个action的描述见下表：

type When payload meta.asyncPhase ${actionName} 异步开始前 同步调用参数 ‘START’ ${actionName}_COMPLETED 异步成功 value of promise ‘COMPLETED’ ${actionName}_FAILED 异步失败 reason of promise ‘FAILED’
createAsyncAction参考了redux-promise作者写的redux-actions ，它接收三个参数，分别是：

* actionName 字符串，所有派生action的名字都以它为基础，初始action则与它同名
* promiseCreator 函数，必须返回一个promise对象
* metaCreator 函数，可选，作用后面会演示到

目前看来，其实和redux-promise/redux-promise-middleware大同小异。而真正不同的，是它同时简化了reducer层! 这种简化来自于对异步行为从语义角度的抽象：

> 当(when)初始action发生时处理同步更新，若异步成功(done)则处理成功逻辑，若异步失败(failed)则处理失败逻辑

抽离出when/done/failed三个关键词作为api，并使用链式调用将他们串联起来：when函数接收两个参数：actionName和handler，其中handler是可选的，done和failed则只接收一个handler参数，并且只能在when之后调用——他们分别处理 ${actionName}_SUCCESS 和 ${actionName}_FAILED .

无论是action还是reducer层，XX_SUCCESS/XX_FAILED相关的代码都被封装了起来，正如在例子中看到的——你甚至不需要声明它们! 创建一个异步action，然后处理它的成功和失败情况，事情本该这么简单。

更进一步的，这三个action默认都根据当前所处的异步阶段，设置了不同的meta(见上表中的meta.asyncPhase)，它有什么用呢？用场景说话：

#### 场景解析：失败处理与Loading

它们是异步不可回避的两个场景，几乎每个项目会遇到。
以异步请求的失败处理为例，每个项目通常都有一套比较通用的，适合多数场景的处理逻辑，比如弹窗提示。同时在一些特定场景下，又需要绕过通用逻辑进行单独处理，比如表单的异步校验

而在实现通用处理逻辑时，常见的问题有以下几种：

* 底层处理，扩展性不足

```javascript
 function fetchWrapper(args) {
     return fetch.apply(fetch, args)
         .catch(commonErrorHandler)
 }
```

在较底层封装ajax库可以轻松实现全局处理，但问题也非常明显：

一是扩展性不足，比如少数场景想要绕过通用处理逻辑，还有一些场景错误是前端生成而非直接来自于请求；
二是不易组合，比如有的场景一个action需要多个异步请求，但异常处理和loading是不需要重复的，因为用户不需要知道一个动作有多少个请求。

* 不够内聚，侵入业务代码

```javascript
 //action creator
 const getData = createAsyncAction(GET_DATA, function(id) {
     return api.getData(id)
         .catch(commonErrorHandler) //调用错误处理函数
 })
```

在有业务意义的action层调用通用处理逻辑，既能按需调用，又不妨碍异步请求的组合。但由于通用处理往往适用于多数场景，这样写会导致业务代码变得冗余，因为几乎每个action都得这么写。

* 高耦合，高风险

也有人把上面的方案做个依赖反转，改为在通用逻辑里监听业务action：

```javascript
 function commonErrorReducer(oldState, action) {
     switch(action.type) {
     case GET_DATA_FAILED:
     case PUT_DATA_FAILED:
     //... tons of action type
         return commonErrorHandler(action)
     }
 }
```

这样做的本质是把冗余从业务代码中拿出来集中管理。

问题在于每添加一个请求，都需要修改公共代码，把对应的action type加进来。且不说并行开发时merge冲突，如果加了一个异步action，但忘了往公共处理文件中添加——这是很可能会发生的——而异常是分支流程不容易被测试发现，等到发现，很可能就是事故而不是bug了。

通过以上几种常见方案的分析，我认为比较完善的错误处理(Loading同理)需要具备如下特点：

* 面向异步动作(action)，而非直接面向请求
* 不侵入业务代码
* 默认使用通用处理逻辑，无需额外代码
* 可以绕过通用逻辑

而借助redux-action-tools提供的meta.asyncPhase，可以轻易用middleware实现以上全部需求!

```javascript
import _ from 'lodash'
import { ASYNC_PHASES } from 'redux-action-tools'

function errorMiddleWare({dispatch}) {
  return next => action => {
    const asyncStep = _.get(action, 'meta.asyncStep');

    if (asyncStep === ASYNC_PHASES.FAILED) {
      dispatch({
        type: 'COMMON_ERROR',
        payload: {
          action
        }
      })
    }
    next(action);
  }
}
```

以上中间件一旦检测到meta.asyncStep字段为FAILED的action便触发新的action去调用通用处理逻辑。面向action、不侵入业务、默认工作 (只要是用createAsyncAction声明的异步) ! 轻松实现了理想需求中的前三点，那如何定制呢？既然拦截是面向meta的，只要在创建action时支持对meta的自定义就行了，而createAsyncAction的第三个参数就是为此准备的：

```javascript
import _ from 'lodash'
import { ASYNC_PHASES } from 'redux-action-tools'

const customizedAction = createAsyncAction(
  type,
  promiseCreator, //type 和 promiseCreator此处无不同故省略
  (payload, defaultMeta) => {
    return { ...defaultMeta, omitError: true }; //向meta中添加配置参数
  }
)

function errorMiddleWare({dispatch}) {
  return next => action => {
    const asyncStep = _.get(action, 'meta.asyncStep');
    const omitError = _.get(action, 'meta.omitError'); //获取配置参数

    if (!omitError && asyncStep === ASYNC_PHASES.FAILED) {
      dispatch({
        type: 'COMMON_ERROR',
        payload: {
          action
        }
      })
    }
    next(action);
  }
}
```

类似的，你可以想想如何处理Loading，需要强调的是建议尽量用增量配置的方式进行扩展，而不要轻易删除和修改meta.asyncPhase。
比如上例可以通过删除meta.asyncPhase实现同样功能，但如果同时还有其它地方也依赖meta.asyncPhase(比如loadingMiddleware)，就可能导致本意是定制错误处理，却改变了Loading的行为，客观来讲这层风险是基于meta拦截方案的最大缺点，然而相比多数场景的便利、健壮，个人认为特殊场景的风险是可以接受的，毕竟这些场景在整个开发测试流程容易获得更多关注。

## 进阶方案

上面所有的方案，都把异步请求这一动作放在了action creator中，这样做的好处是简单直观，且和Flux社区一脉相承(见下图)。因此个人将它们归为相对简单的一类。

下面将要介绍的，是相对复杂一类，它们都采用了与上图不同的思路，去追求更优雅的架构、解决更复杂的问题

### redux-loop：分形! 组合!

众所周知，Redux是借鉴自Elm的，然而在Elm中，异步的处理却并不是在action creator层，而是在reducer(Elm中称update)层：

> 图片来源于： [jarvisaoieong/redux-architecture](https://github.com/jarvisaoieong/redux-architecture)

这样做的目的是为了实现彻底的可组合性(composable)。在redux中，reducer作为函数是可组合的，action正常情况下作为纯对象也是可组合的，然而一旦涉及异步，当action嵌套组合的时候，中间件就无法正常识别，这个问题让redux作者Dan也发出感叹 There is no easy way to compose Redux applications并且开了一个至今仍然open的issue，对组合、分形与redux的故事，有兴趣的朋友可以观摩以上链接，甚至了解一下Elm，篇幅所限，本文难以尽述。

而redux-loop，则是在这方面的一个尝试，它更彻底的模仿了Elm的模式：引入Effects的概念并将其置入reducer，官方示例如下：

```javascript
import { Effects, loop } from 'redux-loop';
import { loadingStart, loadingSuccess, loadingFailure } from './actions';

export function fetchDetails(id) {
  return fetch(`/api/details/${id}`)
    .then((r) => r.json())
    .then(loadingSuccess)
    .catch(loadingFailure);
}

export default function reducer(state, action) {
  switch (action.type) {
    case 'LOADING_START':
      return loop(
        { ...state, loading: true },
        Effects.promise(fetchDetails, action.payload.id)
      ); // 同时返回状态与副作用

    case 'LOADING_SUCCESS':
      return {
        ...state,
        loading: false,
        details: action.payload
      };

    case 'LOADING_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload.message
      };

    default:
      return state;
  }
}
```

注意在reducer中，当处理LOADING_START时，并没有直接返回state对象，而是用loop函数将state和Effect”打包”返回(实际上这个返回值是数组[State, Effect]，和Elm的方式非常接近)。

然而修改reducer的返回类型显然是比较暴力的做法，除非Redux官方出面，否则很难获得社区的广泛认同。更复杂的返回类型会让很多已有的API，三方库面临危险，甚至combineReducer都需要用redux-loop提供的定制版本，这种”破坏性”也是Redux作者Dan没有采纳redux-loop进入Redux核心代码的原因：”If a solution doesn’t work with vanilla combineReducers(), it won’t get into Redux core”。

对Elm的分形架构有了解，想在Redux上继续实践的人来说，redux-loop是很好的参考素材，但对多数人和项目而言，最好还是更谨慎地看待

### redux-saga：难、而美

[Redux-saga](https://github.com/redux-saga/redux-saga)

另一个著名的库，它让异步行为成为架构中独立的一层(称为saga)，既不在action creator中，也不和reducer沾边。

它的出发点是把副作用 (Side effect，异步行为就是典型的副作用) 看成”线程”，可以通过普通的action去触发它，当副作用完成时也会触发action作为输出。

```javascript
import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import Api from '...'

function* getData(action) {
   try {
      const response = yield call(api.getData, action.payload.id);
      yield put({type: "GET_DATA_SUCCEEDED", payload: response});
   } catch (e) {
      yield put({type: "GET_DATA_FAILED", payload: error});
   }
}

function* mySaga() {
  yield* takeEvery("GET_DATA", getData);
}

export default mySaga;
```

相比action creator的方案，它可以保证组件触发的action是纯对象，因此至少在项目范围内(middleware和saga都是项目的顶层依赖，跨项目无法保证)，action的组合性明显更加优秀。

而它最为主打的，则是`可测试性`和强大的`异步流程控制`。

由于强制所有saga都必须是generator函数，借助generator的next接口，异步行为的每个中间步骤都被暴露给了开发者，从而实现对异步逻辑”step by step”的测试。这在其它方案中是很少看到的 (当然也可以借鉴generator这一点，但缺少约束)。

而强大得有点眼花缭乱的API，特别是channel的引入，则提供了武装到牙齿级的异步流程控制能力。

然而，回顾我们在讨论简单方案时提到的各种场景与问题，redux-saga并没有去尝试回答和解决它们，这意味着你需要自行寻找解决方案。而generator、相对复杂的API和单独的一层抽象也让不少人望而却步。

包括我在内，很多人非常欣赏redux-saga。它的架构和思路毫无疑问是优秀甚至优雅的，但使用它之前，最好想清楚它带来的优点(可测试性、流程控制、高度解耦)与付出的成本是否匹配，特别是异步方面复杂度并不高的项目，比如多数以CRUD为主的管理系统。

#### 场景解析：竞态

竞态：

```javascript
function fetchFriend(id) {
    return dispatch => {
        dispatch({ type: 'FETCH_FRIEND' });
        return fetch(`http://localhost/api/friend/${id}`)
            .then(response => response.json())
            .then(json => dispatch({ type: 'RECEIVE_FRIENDS', payload: json }));
    }
}
```
如果 fetch 修改为 buttonclick，setTimeout 这样的开始可以确定顺序的，
但是 fetch 是和服务器沟通的，服务器处理数据返回顺序是不确定
那么怎么处理？

冲突流程如下：
 点击看好友1信息
 服务器请求
 没等1返回， 看好友2信息 (我就想看这个)
 好友2服务器请求返回比较快(可能在cache中)
 显示好友2信息了
 等了一会儿1返回了
 覆盖了2   (BOOM!)

由于异步返回时间的不确定性，后发出的请求可能先返回，如何确保异步结果的渲染是按照请求发生顺序，而不是返回顺序？

这在redux-thunk为代表的简单方案中是要费点功夫的：

```javascript
function fetchFriend(id){
    return (dispatch, getState) => {
        //步骤1：在reducer中 set state.currentFriend = id;
        dispatch({type: 'FETCH_FIREND', payload: id});

        return fetch(`http://localhost/api/firend/${id}`)
            .then(response => response.json())
            .then(json => {
                //步骤2：只处理currentFriend的对应response
                const { currentFriend } = getState();
                (currentFriend === id) && dispatch({type: 'RECEIVE_FIRENDS', playload: json})
            });
    }
}
```

以上只是示例，实际中不一定需要依赖业务id，也不一定要把id存到store里，只要为每个请求生成key，以便处理请求时能够对应起来即可。

而在redux-saga中，一切非常地简单：

```javascript
import { takeLatest } from `redux-saga`

function* fetchFriend(action) {
  ...
}

function* watchLastFetchUser() {
  yield takeLatest('FETCH_FIREND', fetchFriend)
}
```

这里的重点是takeLatest，它限制了同步事件与异步返回事件的顺序关系。

另外还有一些基于响应式编程(Reactive Programming)的异步方案(如redux-observable)也能非常好地处理竞态场景，因为描述事件流之间的关系，正是整个响应式编程的抽象基石，而竞态在本质上就是如何保证同步事件与异步返回事件的关系，正是响应式编程的用武之地。

> 实际项目中可以用高阶函数模仿takeLatest的功能，redux-thunk类方案也可以较低成本地处理竞态

```javascript
function takeLatestAsyncResult(promiseCreator) {
  var index = 0;
  return function () {
    index++;
    var promise = promiseCreator.apply(this, arguments);

    function guardLatest(func, reqIndex) {
      return function() {
        if (reqIndex === index) {
          func.apply(this, arguments)
        }
      }
    }

    return new Promise(function(resolve, reject) {
      promise.then(
        guardLatest(resolve, index),
        guardLatest(reject, index)
      );
    });
  }
}

function runTimeout(timeout) {
	return new Promise(function(resolve) {
    setTimeout(function() {
			resolve(timeout);
    }, timeout)
  })
}

function getAsyncTaskRunner(label, promiseCreator) {
  return function(value) {
    promiseCreator(value).then(function() {
      console.log(`${label} : ${value}`)
    })
  }
}

function runAsyncQue(arr) {
  arr.map(getAsyncTaskRunner('runAsyncQue', runTimeout));
}

function runLatestAsync(arr) {
	var wrappedTimeout = takeLatestAsyncResult(runTimeout);
  arr.map(getAsyncTaskRunner('runLatestAsync', wrappedTimeout));
}

runAsyncQue([2000, 1000, 3000, 500, 400])

runLatestAsync([2000, 1000, 3000, 500, 400])


function takeLatestAsyncResult(promiseCreator) {
    let index = 0;

    return function(){
        index++;

        const promise = promiseCreator.apply(this, arguments);

        function guardLatest(func, reqIndex) {
            return function() {
                if (reqIndex === index) {
                    func.apply(this, arguments)
                }
            }
        }

        return new Promise(function(resolve, reject){
            promise.then(
                guardLatest(resolve, index),
                guardLatest(reject, index)
            )
        })
    }
}



```
