export default {
  setUser(state, user) {
    state.user = user;
    if (user) {
      const cartKey = `cart_${user.id || user.email}`;
      const historyKey = `history_${user.id || user.email}`;
      const savedHistory = localStorage.getItem(historyKey);
      if (savedHistory) {
        try {
          state.history = JSON.parse(savedHistory);
        } catch (e) {
          console.error('Lỗi parse history:', e);
          state.history = [];
        }
      }
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        if (cartData.length > 0) {
          state.cart = cartData;
        }
      }
    }
  },
  logout(state) {
    state.user = null;
    if (state.user && state.user.id) {
      const cartKey = `cart_${state.user.id}`;
      const historyKey = `history_${state.user.id}`;
      localStorage.removeItem(cartKey);
      localStorage.removeItem(historyKey);
    }
    state.cart = [];
    state.history = [];
  },
  setProducts(state, products) {
    state.products = products;
  },
  setProductSizes(state, sizes) {
    state.productSizes = sizes;
  },
  setCategories(state, categories) {
    state.categories = categories;
  },
  addToCart(state, { product, size, price }) {
    if (!state.user) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return;
    }
    const existing = state.cart.find(
      item => item.product.id === product.id && item.size === size
    );
    if (existing) {
      existing.quantity++;
    } else {
      state.cart.push({ product, size, price, quantity: 1 });
    }
    if (state.user) {
      const cartKey = `cart_${state.user.id || state.user.email}`;
      localStorage.setItem(cartKey, JSON.stringify(state.cart));
    }
  },
  removeFromCart(state, index) {
    if (!state.user) {
      alert('Vui lòng đăng nhập để quản lý giỏ hàng!');
      return;
    }
    state.cart.splice(index, 1);
    if (state.user) {
      const cartKey = `cart_${state.user.id || state.user.email}`;
      localStorage.setItem(cartKey, JSON.stringify(state.cart));
    }
  },
  incrementItem(state, index) {
    if (!state.user) {
      alert('Vui lòng đăng nhập để thay đổi số lượng!');
      return;
    }
    state.cart[index].quantity++;
    if (state.user) {
      const cartKey = `cart_${state.user.id || state.user.email}`;
      localStorage.setItem(cartKey, JSON.stringify(state.cart));
    }
  },
  decrementItem(state, index) {
    if (!state.user) {
      alert('Vui lòng đăng nhập để thay đổi số lượng!');
      return;
    }
    if (state.cart[index].quantity > 1) {
      state.cart[index].quantity--;
    } else {
      state.cart.splice(index, 1);
    }
    if (state.user) {
      const cartKey = `cart_${state.user.id || state.user.email}`;
      localStorage.setItem(cartKey, JSON.stringify(state.cart));
    }
  },
  checkout(state) {
    if (!state.user) {
      alert('Vui lòng đăng nhập để thanh toán!');
      return;
    }
    if (state.cart.length > 0) {
      state.history.push({
        id: Date.now(),
        items: state.cart.map(item => ({
          ...item,
          product: { ...item.product }
        })),
        total: state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        date: new Date().toLocaleString()
      });
    }
    state.cart = [];
    if (state.user) {
      const cartKey = `cart_${state.user.id || state.user.email}`;
      const historyKey = `history_${state.user.id || state.user.email}`;
      localStorage.setItem(historyKey, JSON.stringify(state.history));
      localStorage.setItem(cartKey, JSON.stringify(state.cart));
    }
  }
};