import Vue from 'vue';
import createConfig from '@curi/core';
import { installCuri } from '@curi/vue';
import Browser from '@hickory/browser';

import routes from './routes';
import App from './components/App';

const history = Browser();
const config = createConfig(history, routes);

installCuri(Vue, config);

config.respond((response, action) => {
  const vm = new Vue({
    el: '#root',
    template: '<app />',
    components: { app: App }
  });
}, { once: true });
