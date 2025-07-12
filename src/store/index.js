import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    products: [],
    productSizes: [],
    categories: [],
    cart: [],
    history: [],
    user: null // Trạng thái đăng nhập
  },
  getters: {
    getProductById: (state) => (id) => {
      return state.products.find(p => p.id === parseInt(id));
    },
    cartTotal(state) {
      return state.cart.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },
    isAuthenticated(state) {
      return !!state.user;
    }
  },
  mutations: {
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
        const cartKey = `cart_${state.user.id || state.user.email}`; // Sửa 'user' thành 'state.user'
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
        const cartKey = `cart_${state.user.id || state.user.email}`; // Sửa 'user' thành 'state.user'
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
        const cartKey = `cart_${state.user.id || state.user.email}`; // Sửa 'user' thành 'state.user'
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
  },
actions: {
    async fetchProducts({ commit }) {
      try {
        const res = await axios.get('http://localhost:3000/products');
        console.log('Fetched products:', res.data);
        if (!res.data || !Array.isArray(res.data)) throw new Error('Dữ liệu products không hợp lệ');
        commit('setProducts', res.data);
      } catch (err) {
        console.error('Lỗi fetchProducts:', err.message, err.response?.data);
      }
    },
    async fetchProductSizes({ commit }) {
      try {
        const res = await axios.get('http://localhost:3000/product_sizes');
        console.log('Fetched product_sizes:', res.data);
        if (!res.data || !Array.isArray(res.data)) throw new Error('Dữ liệu product_sizes không hợp lệ');
        commit('setProductSizes', res.data);
      } catch (err) {
        console.error('Lỗi fetchProductSizes:', err.message, err.response?.data);
      }
    },
    fetchCategories({ commit }) {
      return axios.get('http://localhost:3000/categories')
        .then(res => {
          console.log('Fetched categories:', res.data);
          if (!res.data || !Array.isArray(res.data)) throw new Error('Dữ liệu categories không hợp lệ');
          commit('setCategories', res.data);
        })
        .catch(err => {
          console.error('Lỗi fetchCategories:', err.message, err.response?.data);
        });
    }
  },
  // Thêm hook để tải dữ liệu từ localStorage khi khởi động
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
