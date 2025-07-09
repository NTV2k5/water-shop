// File: main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

store.dispatch('fetchProducts');

createApp(App).use(router).use(store).mount('#app');
