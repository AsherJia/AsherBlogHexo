---
layout:     post
title:      "About ReactJs"
subtitle:   "ReactJs"
date:       2017-03-22
author:     "Asher"
header-img: "home-bg.jpg"
header-mask: 0.3
catalog:    true
tags:
    - ReactJs
---

# Redux-Saga V.S. Redux-Observable

## Question

I have used Redux-Saga. Code written with it is easy to reason so far, except JS generator function is messing up my head from time to time. From my understanding, Redux-Observable can achieve the similar job that handles side effects but without using generator function.

However, docs from Redux-Observable does not provide many opinions of why it is superior against Redux-Saga. I would want to know whether not using generator function is the only benefit of using Redux-Observable. And what could be the downsides, gotcha or compromises from using Redux-Observable instead of Redux-Saga? Thanks in advance.

## Answer

We don't currently provide any reason redux-observable is better than redux-saga because...it's not. 😆

They solve the same problem in extremely similar ways, but have some fundamental differences that only become truly apparent once you use them enough.

redux-observable defers nearly everything to idiomatic RxJS. So if you have RxJS knowledge (or gain it), learning and using redux-observable is super super natural. That also means that this knowledge is transferable to things other than redux. If you decide to switch to MobX, if you decide to switch to Angular2, if you decide to switch to some future hotness X, chances are extremely good that RxJS can help you. This is because RxJS is a generic async library, and in many ways is like a programming language in itself. The whole "Reactive Programming" paradigm. RxJS existed since 2012 and started as a port of Rx.NET (there are "ports" in nearly every major language, it's that useful).

redux-saga provides it's time-based operators itself, so while the knowledge you acquire about generators and handling side effects in this process-manager style is transferable, the actual operators and usage is not used in any other major library. So that's a little unfortunate, but certainly shouldn't be a deal-breaker by itself.

It also uses "effects as data" (described here), which might be hard to wrap your head around at first, but it means that your redux-saga code doesn't actually perform the side effects itself. Instead, the helper functions you use create objects that are like tasks that represent the intent to do the side effect and then the internal library performs it for you. This makes testing extremely easy, without the need for mocking and is very attractive once you get the hang of it.

People often ask why we don't do something like that with redux-observable; it's fundamentally incompatible with Rx. In Rx, we use operators like .debounceTime() that encapsulates the logic required to debounce, but that means if we wanted to make a version of it that doesn't actually perform the debouncing and instead emits task objects with the intent, you've now lost the power of Rx because you can't just chain operators anymore because they'd be operating on that task object, not the real result of the operation. This is really hard to explain elegantly, it again requires heavy understanding of Rx to understand the incompatibility of approaches.

As ThorbenA mentioned, I don't shy away from admitting that redux-saga is currently (10/13/16) the clear leader in complex side effect management for redux. It was started earlier and has a more robust community. So there's a lot of attraction to using the de facto standard over the new kid on the block. I think it's safe to say if you use either without prior knowledge, you're in for some confusion. We both use fairly advanced concepts that once you "get", makes complex side effect management far easier, but until then many stumble.

The most important advice I can give is not to bring in either of these libraries before you need them. If you're only making simple ajax calls, you probably don't need them. redux-thunk is stupid simple to learn and provides enough for the basics--but the more complex the async the harder (or even impossible) it becomes for redux-thunk. But for redux-observable/saga in many ways it shines the most the more complex the async is. There's also a lot of merit in using redux-thunk with one of the others (redux-observable/saga) in the same project! redux-thunk for your common simple stuff and then only using redux-observable/saga for complex stuff. That's a great way to remain productive, so you're not fighting redux-observable/saga for things that would be trivial with redux-thunk.



- Metal Model
- Side by side Comparison
- Which one do I prefer and Why?
- Futher Reading and Discussion


### Metal Model

> Saga = Worker + Watcher

```javascript
import API from '...'

function* Watcher(){
    yield takeEvery('do_thing', Worker)
}

function* Worker() {
    const users = yield API.get('/api/users')
    yield put({type:'done', users})
}
```

> Rxjs = Epic(Type + Operators)

```javascript
import API from '...'

const Epic = action$ =>
    action$
        .ofType('do_thing')
        .flatMap(()=>API.get('/api/users'))
        .map(users=>({type:'done', users}))
```

### Side by side Comparison

> Demo Part (1/3)

- Fetch User
- Fetch User (cancelable)
- Do three things in sequence
- Login, Logout, Cancel (with redux)

> Fetch User from /api/users/1
> Saga

```javascript
import axios from 'axios'

function* watchSaga(){
  yield takeEvery('fetch_user', fetchUser) // waiting for action (fetch_user)
}

function* fetchUser(action){
    try {
        yield put({type:'fetch_user_ing'})
        const response = yield call(axios.get,'/api/users/1')
        yield put({type:'fetch_user_done',user:response.data})
  } catch (error) {
        yield put({type:'fetch_user_error',error})
  }
}
```

> Fetch User from /api/users/1
> Rxjs

```javascript
import axios from 'axios'

const fetchUserEpic = action$ =>
    action$
        .ofType('fetch_user')
        .map(()=>({type:'fetch_user_ing'}))
        .flatMap(()=>axios.get('/api/users/1'))
        .map(response=>response.data)
        .map(user=>({type:'fetch_user_done', user}))
```

> Fetch User from /api/users/1 (cancelable)
> Saga

```javascript
import { take, put, call, fork, cancel } from 'redux-saga/effects'
import API from '...'

function* fetchUser() {
    yield put({type:'fetch_user_ing'})
    const user = yield call(API)
    yield put({type:'fetch_user_done', user})
}

function* Watcher() {
    while(yield take('fetch_user')){
        const bgSyncTask = yield fork(fetchUser)
        yield take('fetch_user_cancel')
        yield cancel(bgSyncTask)
    }
}
```

> Fetch User from /api/users/1 (cancelable)
> Rxjs

```javascript
const fetchUserEpic = action$ =>
    actions$
        .ofType('fetch_user')
        .map(()=>({type:'fetch_user_ing'}))
        .flatMap(()=>{
            return Observable
                .ajax
                .get('/api/user/1')
                .map(user => ({ type: 'fetch_user_done', user }))
                .takeUntil(action$.ofType('fetch_user_cancel'))
        })
```

> Do three things in sequence

> Saga

```javascript
function* worker1() { ... }
function* worker2() { ... }
function* worker3() { ... }

function* watcher() {
  const score1 = yield* worker1()
  yield put(({type:'show_score', score1})

  const score2 = yield* worker2()
  yield put(({type:'show_score', score2})

  const score3 = yield* worker3()
  yield put(({type:'show_score', score3})
}
```

> Do three things in sequence

> Rxjs

```javascript
const score1Epic = action$ =>
    action$
        .ofType('score1')
        .reduce(worker1)
        .flatMap(score=>{
             return Observable.merge(
                {type:'show_score', score},
                {type:'score2'}
             )
         })

const score2Epic = action$ =>
    action$
        .ofType('score2')
        .reduce(worker2)
        .flatMap(score=>{
            return Observable.merge(
                {type:'show_score', score},
                {type:'score3'}
            )
        })

 const score3Epic = action$ =>
    action$
        .ofType('score3')
        .reduce(worker3)
        .map(score=>({type:'show_score', score}))
```

> Login, token, Logout, Cancel
> (with redux)

```javascript

const store = {
    token: null,
    isFetching: false
}

const tokenReducer = (state=null, action) => {
    switch (action.type) {
        case 'login_success':
            return action.token
        case 'login_error':
        case 'login_cancel':
        case 'logout'
            return null
        default:
            return state
    }
}

const isFetching = (state=false, action) => {
    switch (action.type) {
        case 'login_request':
            return true
        case 'login_success':
        case 'login_error':
        case 'login_cancel':
        case 'logout'
            return false
        default:
            return state
    }
}
```

> Login, token, Logout, Cancel
> Saga

```javascript
import { take, put, call, fork, cancel } from 'redux-saga/effects'
import Api from '...'


function* loginWatcher() {
    const { user, password } = yield take('login_request')
        , task = yield fork(authorize, user, password)
        , action = yield take(['logout', 'login_error'])

    if (action.type === 'logout') {
        yield cancel(task)
        yield put({type:'login_cancel'})
    }

}

function* authorize(user, password) {
    try {
        const token = yield call(Api.getUserToken, user, password)
        yield put({type: 'login_success', token})
  } catch (error) {
        yield put({type: 'login_error', error})
  }
}

```

> Login, token, Logout, Cancel
> Rxjs

```javascript
const authEpic = action$ =>
    action$
        .ofType('login_request')
        .flatMap(({payload:{user,password}})=>
            Observable
                .ajax
                .get('/api/userToken', { user, password })
                .map(({token}) => ({ type: 'login_success', token }))
                .takeUntil(action$.ofType('login_cancel', 'logout'))
                .catch(error => Rx.Observable.of({type:'login_error', error}))
```

> Demo Part 2/3

> Logger

```javascript
// ----- Saga ----- \\
while (true) {
    const action = yield take('*')
        , state = yield select()
console.log('action:', action)
console.log('state:', state)
}

// ----- Rxjs ----- \\
.do(value=>console.log(value))
```

> Take latest request

```javascript
// ----- Saga ----- \\
takeLatest()

// ----- Rxjs ----- \\
.switchMap()
```

> Retry with delay (1000ms)

```javascript
// ----- Saga ----- \\

... still thinking about it


// ----- Rxjs ----- \\

.retryWhen(errors=>{
    return errors.delay(1000).scan((errorCount, err)=>{
        if(errorCount < 3) return errorCount + 1
        throw err
    }, 0)
})
```

> Error Handling

```javascript

// ----- Saga ----- \\
try {
    // ... do things
} catch (error) {
    yield put({ type:'fetch_user_error',error })
}


// ----- Rxjs ----- \\

.catch(error => Observable.of({ type:'fetch_user_error', error }))

```

> Running Tasks In Parallel

```javascript
// ----- Saga ----- \\
import { call } from 'redux-saga/effects'

const [users, repos]  = yield [
  call(fetch, '/users'),
  call(fetch, '/repos')
]


// ----- Rxjs ----- \\
.flatMap(()=>{
	return Observable.merge(promiseA, promiseB)
})
```

> Throttling, Debouncing, Retrying

> Saga

```javascript
// ---- Throttling ---- \\

yield throttle(500, 'input_change', fun)

// ---- Debouncing ---- \\

yield call(delay, 500)

// ---- Retrying ---- \\

function* retryAPI(data) {
  for(let i = 0; i < 3; i++) {
    try {
      const apiResponse = yield call(apiRequest, { data });
      return apiResponse;
    } catch(err) {
      if(i < 3) {
        yield call(delay, 2000);
      }
    }
  }
  throw new Error('API request failed');
}
```

> Throttling, Debouncing, Retrying
> Saga

```javascript
// ---- Throttling ---- \\

.throtleTime(1000)

// ---- Debouncing ---- \\

.debouncing(1000)

// ---- Retrying ---- \\

.retry(3)
```

> Part (3/3)
> Test

> Saga

```javascript
{
  CALL: {
    fn: Api.fetch,  <<<<<<<<<<<<< make sure call with the right fn
    args: ['./products'] <<<<<<<< make sure call with the right args
  }
}

expect(
    fetchUser('api/users/1').next().value
).to.eql(
    call(axios.get, 'api/users/1')
)
```

> Rxjs

```javascript
// fake store ...

// ...

// ...


//   https://redux-observable.js.org/docs/recipes/WritingTests.html

```

### Which One Do I prefer?

> Coding Style

Saga

> - Effects as data
> - (Imperative style) Tell Program HOW to do things; Take time to reason about code

Rxjs

> - Events as data
> - (Declarative Style) Tell Program WHAT things to do; Easy to reason about code

---

> Function Reusability

Saga

> Low

Rxjs

> High

---

> Test

Saga

> Unit Test(easy)
> Intergration Test(easy)
> Test might fail if the order change

Rxjs

> Unit Test(Very easy)
> Intergration Test(Require Mocking)
> Test will not fail(same end result)

---

> Learn Saga

> - Redux (1 day)
> - Generator (1 day)
> - Redux-Saga (few hours)
> - Skill is not transferable

> Total Learning Time:
>> 3~5 days

---

> Learn Rxjs

> - Redux (1 day)
> - Rxjs (few days)
> - Functional Programming (2 days)
> - Redux-Observable (1 day)
> - Skill is transferable

> Total Learing Time:
>> 1~2 weeks

---

Futher Reading

> merge()
> map()
> filter()
> scan()
> combineLatest()
> concat()
> do()
> more …

> Visual Learning http://rxmarbles.com/

Futher Discussion

> Saga = Effects as data
> Rxjs = Events as data

> Saga doesn’t actually perform the side effects itself. Instead, the helper functions will create objects that represents the intent of side effect. Then the internal library performs it for you".

```javascript
call (http.get, '/users/1') // the task

CALL: { fn: http.get,  args: ['/users/1'] } // the intent
```

> This makes testing extremely easy, without the need for mocking.
