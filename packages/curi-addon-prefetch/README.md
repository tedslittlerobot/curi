# curi-addon-prefetch

The prefetch addon enables you to run a `uri`'s `load` function prior to actually navigating to that location. This is only useful for in-app navigation. If the user uses the browser's forward/back buttons, the loading will be handled within the `createConfig`.

### Installation

```js
npm install --save curi-addon-prefetch
```

### Usage

```js
import createConfig from 'curi';
import prefetch from 'curi-addon-prefetch';

const history = ...;
const routes = [...];

const conf = createConfig(history, routes, { addons: [prefetch] });
```

This addon will only register routess that have a `load` function in their `load` object.

```js
// will register
{
  name: 'User',
  path: 'user/:id',
  load: (response, { params }) => {
    // fetch and store the data
    return fetch(`/api/user/${params.id}`)
      .then(resp => resp.json())
      .then(data => {
        Store.save(data)
      });
  }
}

// will NOT register
{
  name: 'User',
  path: 'user/:id'
}
{
  name: 'User',
  path: 'user/:id',
  preload: () => {
    return import('./components/User').then(resp => resp.default)
  }
}
```