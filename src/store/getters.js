export default {
  getProductById: (state) => (id) => {
    return state.products.find(p => p.id === parseInt(id));
  },
  cartTotal(state) {
    return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  isAuthenticated(state) {
    return !!state.user;
  }
};