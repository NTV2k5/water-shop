import { createStore } from 'vuex';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

export default createStore({
  state,
  getters,
  mutations,
  actions,
  created() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart && this.state.user) {
      try {
        this.state.cart = JSON.parse(savedCart);
      } catch (e) {
        console.error('Lỗi parse cart:', e);
        this.state.cart = [];
      }
    }
    const savedHistory = localStorage.getItem('history');
    if (savedHistory && this.state.user) {
      try {
        this.state.history = JSON.parse(savedHistory);
      } catch (e) {
        console.error('Lỗi parse history:', e);
        this.state.history = [];
      }
    }
  }
});