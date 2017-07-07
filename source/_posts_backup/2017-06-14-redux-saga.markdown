---
layout:     post
title:      "Redux Saga"
subtitle:   ""
date:       2017-06-14
author:     "Asher"
header-img: "home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - Redux
---

# DEMO

> 话不多说，先尝一个栗子

```javascript
// selector
const _getAutoInterval = (state:any) => {
    const { counter } = state
    return counter.autoInterval
}

// worker
import { select, put, call, race, take } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { INCREMENT, CANCEL_AUTO_INCREMENT, SET_AUTOINTERVAL } from '../../constants/actionType'

const _autoIncrement = function*() {
    while(true){
        yield put({ type: INCREMENT })
        yield delay(1000)
    }
}

export function* autoIncrement() {
    const autoInterval = yield select(_getAutoInterval)

    if(autoInterval) {
        yield put({ type: SET_AUTOINTERVAL, autoInterval: false })
        yield put({ type: CANCEL_AUTO_INCREMENT })
    } else {
        yield put({ type: SET_AUTOINTERVAL, autoInterval: true })
        yield race({
            response: call(_autoIncrement),
            cancel: take(CANCEL_AUTO_INCREMENT)
        })
    }
}

// watcher
import { takeLatest } from 'redux-saga/effects'
import { autoIncrement } from '../workers'
import { AUTO_INCREMENT } from '../../constants/actionType'

export function* watchAutoIncrement() {
    yield takeLatest(AUTO_INCREMENT, autoIncrement)
}

// index
import { fork } from 'redux-saga/effects';
import { watchAutoIncrement } from './watchers'

export default [
    fork(watchAutoIncrement)
]


// sagas
import { all } from 'redux-saga/effects';
import rootCounterSaga from './modules/counter/saga'

export default function* rootSaga() {
    yield all([
        ...rootCounterSaga
    ])
}


// store
import createSagaMiddleware from 'redux-saga'
import rootSaga from './rootSaga'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

// mount it on the Store
const middlewares = [sagaMiddleware]
const finalCreateStore = applyMiddleware(...middlewares)(createStore)
const store = finalCreateStore(rootReducer)

sagaMiddleware.run(rootSages)
```

# API

## Middleware API

> createSagaMiddleware(options)

Creates a Redux middleware and connects the Sagas to the Redux Store

```javascript
import configureStore from './configureStore'
import rootSaga from './sagas'
// ... other imports

const store = configureStore()
store.runSaga(rootSaga)
```

## Saga Helpers

`takeEvery(pattern, saga, ...args)`

- pattern: String | Array | Function
- saga: Function, a Generator function
- args: Array<any>  将被传入启动的任务作为参数。takeEvery 会把当前的 action 放入参数列表（action 将作为 saga 的最后一个参数）

发起的action与pattern匹配时，派生相应的saga.

```javascript
import { takeEvery } from `redux-saga/effects`

function* fetchUser(action) {
  ...
}

function* watchFetchUser() {
  yield takeEvery('USER_REQUESTED', fetchUser)
}
```

> takeEvery是一个高阶API通过fork和take实现

```javascript
const takeEvery(pattern, saga, args) => fork(function*(){
    while (true) {
        const action = yield take(pattern)
        yield fork(saga, ...args.concat(action))
    }
})
```

`takeLatest(pattern, saga, args)`

- pattern: String | Array | Function
- saga: Function, a Generator function
- args: Array<any>  将被传入启动的任务作为参数。takeEvery 会把当前的 action 放入参数列表（action 将作为 saga 的最后一个参数）


发起的action与pattern匹配时，派生相应的saga并取消前一个未完成的saga.

```javascript
import { takeLatest } from `redux-saga/effects`

function* fetchUser(action) {
  ...
}

function* watchLastFetchUser() {
  yield takeLatest('USER_REQUESTED', fetchUser)
}
```

> takeEvery是一个高阶API通过fork和take实现

```javascript
const takeLatest = (pattern, saga, ...args) => fork(function*() {
  let lastTask
  while (true) {
    const action = yield take(pattern)
    if (lastTask) {
      yield cancel(lastTask) // cancel is no-op if the task has already terminated
    }
    lastTask = yield fork(saga, ...args.concat(action))
  }
})
```

`throttle(ms, pattern, saga, ...args)`

- ms: 节流毫秒数
- pattern: String | Array | Function
- saga: Function, a Generator function
- args: Array<any>  将被传入启动的任务作为参数。takeEvery 会把当前的 action 放入参数列表（action 将作为 saga 的最后一个参数）

```javascript
import { throttle } from `redux-saga/effects`

function* fetchAutocomplete(action) {
  const autocompleteProposals = yield call(Api.fetchAutocomplete, action.text)
  yield put({type: 'FETCHED_AUTOCOMPLETE_PROPOSALS', proposals: autocompleteProposals})
}

function* throttleAutocomplete() {
  yield throttle(1000, 'FETCH_AUTOCOMPLETE', fetchAutocomplete)
}
```

> throttle是一个高阶API通过take, fork和actionChannel来实现

```javascript
const throttle = (ms, pattern, task, ...args) => fork(function*() {
  const throttleChannel = yield actionChannel(pattern)

  while (true) {
    const action = yield take(throttleChannel)
    yield fork(task, ...args, action)
    yield call(delay, ms)
  }
})
```

## Effect creators

> Notes:
> Each function below returns a plain JavaScript object and does not perform any execution.
> The execution is performed by the middleware during the Iteration process described above.
> The middleware examines each Effect description and performs the appropriate action.

`take(pattern)`

> Creates an Effect description that instructs the middleware to wait for a specified action on the Store. The Generator is suspended until an action that matches pattern is dispatched.

- *: all disaptched actions are matched.
- action: action is matched if pattern(action) return true.
- string: the action is matched when action.type === pattern.
- array: each item in the array is matched with beforementioned rules.

`put(pattern)`

> Create an Effect that instructs the middleware to dispatch an action to the store.

`call(pattern)`

> Create an Effect that instructs the middleware to call the function.

`cps(fn, ...args)`

> Creates an Effect description that instructs the middleware to invoke fn as a Node style function.

- fn: Function - a Node style function. i.e. a function which accepts in addition to its arguments, an additional callback to be invoked by fn when it terminates. The callback accepts two parameters, where the first parameter is used to report errors while the second is used to report successful results
- args: Array<any> - an array to be passed as arguments for fn

`fork(fn, args)`

> Create an Effect that instructs the middleware to perform a no-blocking call on function.

- fn: A generate function, or a normal funciton which return a Promise as redult.
- args: An array of values that passed to arguments.

`join(task)`

> Create an Effect that instructs the middleware to wait for the result a previously forked task.

`cancel(task)`

> Creates an Effect description that instructs the middleware to cancel a previously forked task.

```javascript
import { CANCEL } from 'redux-saga'
import { fork, cancel } from 'redux-saga/effects'

function myApi() {
  const promise = myXhr(...)

  promise[CANCEL] = () => myXhr.abort()
  return promise
}

function* mySaga() {

  const task = yield fork(myApi)

  // ... later
  // will call promise[CANCEL] on the result of myApi
  yield cancel(task)
}
```

`select(selector, ...args)`

> Creates an effect that instructs the middleware to invoke the provided selector on the current Store's state (i.e. returns the result of selector(getState(), ...args)).


`actionChannel(pattern, [buffer])`

> Creates an effect that instructs the middleware to queue the actions matching pattern using an event channel. Optionally, you can provide a buffer to control buffering of the queued actions.

`cancelled()`

> Creates an effect that instructs the middleware to return whether this generator has been cancelled. Typically you use this Effect in a finally block to run Cancellation specific code

```javascript
function* saga() {
  try {
    // ...
  } finally {
    if (yield cancelled()) {
      // logic that should execute only on Cancellation
    }
    // logic that should execute in all situations (e.g. closing a channel)
  }
}
```

## Effect Combinators

`race(effect)`

> Creates an Effect description that instructs the middleware to run a Race between multiple Effects

```javascript
import { take, call, race } from `redux-saga/effects`
import fetchUsers from './path/to/fetchUsers'

function* fetchUsersSaga {
  const { response, cancel } = yield race({
    response: call(fetchUsers),
    cancel: take(CANCEL_FETCH)
  })
}
```

`all([...effect]) -parrllel effects`

> Create an effect description that instructs the middleware to run multiple effect and wait for all of them complete.
