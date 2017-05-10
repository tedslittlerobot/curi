import Home from './components/Home';
import Product from './components/Product';

import fakeData from './fakeData';
import store, { loadProducts, loadProduct } from './reduxStuff';

export default [
  {
    name: 'Home',
    path: '',
    value: Home,
    load: () => {
      store.dispatch(
        loadProducts(fakeData)
      );
    }
  },
  {
    name: 'Product',
    path: 'products/:id',
    value: Product,
    load: (resp) => {
      const { id } = resp.params;
      // "cache"
      const existing = store.getState();
      if (existing[id]) {
        return;
      }

      const product = fakeData[id];
      if (product) {
        store.dispatch(
          loadProduct(product)
        );
      } else {
        resp.setStatus(404);
      }
    }
  }
];