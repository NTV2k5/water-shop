export default {
  getProductById: (state) => (id) => {
    return state.products.find((p) => p.id === parseInt(id));
  },
  cartTotal(state) {
    return state.cart.reduce((total, item) => {
      const basePrice = item.price * item.quantity;
      const toppingPrice = item.toppings.reduce((sum, t) => sum + t.price, 0) * item.quantity;
      return total + basePrice + toppingPrice;
    }, 0);
  },
  isAuthenticated(state) {
    return !!state.user;
  },
};