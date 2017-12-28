---
layout:     post
title:      "Redux First Router"
subtitle:   "Github"
date:       2017-08-28 15:26:00
author:     "Asher"
header-img: "webpack-bg.png"
header-mask: 0.3
catalog:    true
tags:
    - Redux
---

> The purpose of this article is to debunk the effectiveness of route-matching components + nested routes when using Redux, while discovering a better, simpler, obvious way.

As a result we are always looking for a faster more intuitive way to do things.

It's no surprise every few months/years/days we find ourselves confronted by the fact that there's a better way to do what we're doing.

Sometimes there evolutions are so prefound that it leads to the entire development community switching how they do thind, as is the case both with React and Redux.

Today what I'm going to propose is the same thing with Routing. Yes, you heard me. The less sexy, supposedly solved problem that we've all been reinventing for years, from language to language, framework to framework. Or just following the status quo, and paying the price for it.

# REDUX-LITTLE-ROUTER

We're going to start our journey through understanding the problem by looking at the best thing out when it comes to routing with Redux:

- [redux-little-route](https://github.com/FormidableLabs/redux-little-router)

> If you aren't using Redux, React Router is still the recommended solution.
> So, this article is strictly for Redux developers.

## How does redux-little-router work?

Taking an example from its readme, you start out by defining and nesting routes like this:

```javascript
const routes = {
    '/users': {
        title: 'Users'
    },
    '/users/:slug': {
        title: 'User profile for:'
    },

    // nested route:
    '/home': {
        title: 'Home',
        '/repos': {
            title: 'Repos',
            '/:slug': {
                title: 'Repo about:'
            }
        }
    }
}
```

Then you do what's typical of redux routers (yes [there are many](https://github.com/faceyspacey/redux-first-router/blob/master/docs/prior-art.md), but few have caught on) and compose custom middleware, reducer, and enhancer:

```javascript
const { reducer, middleware, enhancer } = routerForBrowser()
const reducers = combineReducers({ router: reducer, ...others })
const enhancer = compose(enhancer, applyMiddleware(middleware))
const store = createStore(reducers, enhancers)
```

Lastly, you setup your provider(s):

```javascript
import { Provider } from 'react-redux'
import { RouterProvider } from 'redux-little-router'
import configureStore from './configureStore'

const store = configureStore()()

ReactDOM.render(
    <Provider store={store}>
        <RouterProvider store={store}>
            <YourAppComponent />
        </RouterProvider>
    </Provider>
)
```

## The primary ways to use it are:

Change the URL which results in a corresponding action dispatched:

```javascript
push('/users/james-gillmore?foo=bar')
```

Conditionally render something using their "route-matching" component `<Fragment />`(same thing as `<Route/>` in React Router):

```javascript
<Fragment forRoute='/home/repos/:slug'>
    <h1>This a code repo!</h1>
    <ConnectedRepo />
</Fragment>
```

Create a real link for SEO:

```javascript
<Link>
    Go ToReact Universal Component
</Link>
```

You can also nest fragments/routes like in React Router. Here's an example from their readme:

```javascript
<Fragment forRoute='/home'>
  <div>
    <h1>Home</h1>
    <Fragment forRoute='/bio'>
      <div>
        <h2>Bios</h2>
        <Fragment forRoute='/dat-boi'>
          <div>
            <h3>Dat Boi</h3>
            <p>Something something whaddup</p>
          </div>
        </Fragment>
      </div>
    </Fragment>
  </div>
</Fragment>
```

So obviously the goal of that snippet is to show a page for the URL `/home/bio/dat-boi`. Similar to what you can do with React Router.

Before we continue, it's important to look at the actions dispatched that allow for this:

```javascript
{
    type: 'LOCATION_CHANGED', // The same for all actions
    pathname: '/home/repos/react-universal-component',
    route: '/home/repos/:slug',
    params: {
        slug: 'react-universal-component'
    },
    query: {
        foo: 'bar'
    },
    search: '?foo=bar',
    result: {
        title: 'Repos about:',
        parent: {
            title: 'Repos',
            parent: {
                title: 'Home'
            }
        }
    }
}
```

Lastly, here's your "location" state stored in your `router` state key (which is used to power Fragments):

```javascript
{
  pathname: '/home/repos/react-universal-component',
  route: '/home/repos/:slug',
  params: {
    slug: 'react-universal-component'
  },
  query: {
    foo: 'bar'
  },
  search: '?foo=bar',
  result: {
    title: 'Repos about:'
    parent: {
      title: 'Repos',
      parent: {
        title: 'Home'
      }
    }
  }
  previous: {
    pathname: '/home/repos',
    route: '/home/repos',
    params: {},
    query: {},
    result: {
      title: 'Repos about:'
      parent: {
        title: 'Repos',
      }
    }
  }
}
```

> The state is a replica of the most recent action and the previous action

Before we move on the other ways to do this, it's important to insure everyone is up to speed.

Basically instead of Router having a separate state store, Redux state powers the `<Fragment/>` components. They are connected to state via react-redux's `connect` method. Well, the context provider at the top level of your app is, which is also an issue we'll address today.

This allows for ALL the
