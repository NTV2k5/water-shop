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
    const cartKey = `cart_${state.user?.id || state.user?.email}`;
    const historyKey = `history_${state.user?.id || state.user?.email}`;
    const userKey = `user_${state.user?.id || state.user?.email}`;
    localStorage.removeItem(cartKey);
    localStorage.removeItem(historyKey);
    localStorage.removeItem(userKey);
    state.cart = [];
    state.history = [];
  },
  setProducts(state, products) {
    state.products = products.map(product => ({
      ...product,
      rating: product.rating || 0,
      comments: product.comments || []
    }));
  },
  setProductSizes(state, sizes) {
    state.productSizes = sizes;
  },
  setCategories(state, categories) {
    state.categories = categories;
  },
  setToppings(state, toppings) {
    state.toppings = toppings;
  },
  addToCart(state, { product, sizeId, price, toppings }) {
    if (!state.user) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return;
    }
    console.log("Adding to cart:", { product, sizeId, price, toppings });
    let effectiveSizeId = sizeId;
    if (!sizeId) {
      const defaultSize = "S";
      const productSize = state.productSizes.find(s => s.product_id === Number(product.id) && s.size === defaultSize);
      effectiveSizeId = productSize ? productSize.id : null;
      console.log("No sizeId provided, using default sizeId:", effectiveSizeId, "for product:", product.id);
    }
    if (!effectiveSizeId) {
      effectiveSizeId = null;
      console.warn("No matching sizeId found, using null sizeId for product:", product.id);
    }
    const existing = state.cart.find(
      (item) => item.product.id === product.id && item.sizeId === effectiveSizeId && JSON.stringify(item.toppings) === JSON.stringify(toppings)
    );
    if (existing) {
      existing.quantity++;
    } else {
      state.cart.push({ product, sizeId: effectiveSizeId, price: price || product.price, toppings: toppings || [], quantity: 1 });
    }
    if (state.user) {
      const cartKey = `cart_${state.user.id || state.user.email}`;
      localStorage.setItem(cartKey, JSON.stringify(state.cart));
      const expiry = Date.now() + 90 * 24 * 60 * 60 * 1000;
      localStorage.setItem(`${cartKey}_expiry`, expiry);
    }
  },
  addToHistory(state, order) {
    if (!Array.isArray(state.history)) {
      state.history = [];
    }
    state.history.push(order);
    console.log("Added to history:", order);
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
      const expiry = Date.now() + 90 * 24 * 60 * 60 * 1000;
      localStorage.setItem(`${cartKey}_expiry`, expiry);
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
      const expiry = Date.now() + 90 * 24 * 60 * 60 * 1000;
      localStorage.setItem(`${cartKey}_expiry`, expiry);
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
      const expiry = Date.now() + 90 * 24 * 60 * 60 * 1000;
      localStorage.setItem(`${cartKey}_expiry`, expiry);
    }
  },
  checkout(state, orderData) {
    if (!state.user) {
      alert('Vui lòng đăng nhập để thanh toán!');
      return;
    }
    console.log("Checkout called, user before:", state.user);
    if (state.cart.length > 0) {
      const order = orderData || {
        id: `order_${Date.now()}`,
        userId: state.user.id,
        items: state.cart.map((item) => ({
          ...item,
          product: { ...item.product },
          toppings: item.toppings || [],
          isPaid: false
        })),
        total: state.cart.reduce((sum, item) => {
          const basePrice = (item.price || 0) * (item.quantity || 0);
          const toppingPrice = (item.toppings || []).reduce((s, t) => s + (t?.price || 0), 0) * (item.quantity || 0);
          return sum + basePrice + toppingPrice;
        }, 0),
        date: new Date().toISOString(),
        isPaid: orderData?.isPaid || false
      };
      state.history.push(order);
      state.cart = [];
      if (state.user) {
        const cartKey = `cart_${state.user.id || state.user.email}`;
        const historyKey = `history_${state.user.id || state.user.email}`;
        localStorage.setItem(historyKey, JSON.stringify(state.history));
        localStorage.setItem(cartKey, JSON.stringify(state.cart));
        const expiry = Date.now() + 90 * 24 * 60 * 60 * 1000;
        localStorage.setItem(`${historyKey}_expiry`, expiry);
        localStorage.setItem(`${cartKey}_expiry`, expiry);
      }
    }
    console.log("Checkout completed, user after:", state.user);
  },
  clearHistory(state) {
    if (!state.user) {
      alert('Vui lòng đăng nhập để quản lý lịch sử!');
      return;
    }
    state.history = [];
    if (state.user) {
      const historyKey = `history_${state.user.id || state.user.email}`;
      localStorage.removeItem(historyKey);
      localStorage.removeItem(`${historyKey}_expiry`);
    }
  },
  setCart(state, cart) {
    state.cart = cart.map(item => ({
      ...item,
      sizeId: item.sizeId || null
    }));
  },
  setHistory(state, history) {
    state.history = history;
  },
  addComment(state, { productId, comment }) {
    const product = state.products.find(p => p.id === productId);
    if (product) {
      product.comments.push(comment);
    }
  },
  setSearchQuery(state, query) {
    state.searchQuery = query;
  },
  setCurrentPage(state, page) {
    state.currentPage = page;
  },
  setRating(state, { productId, rating }) {
    const product = state.products.find(p => p.id === productId);
    if (product && rating >= 0 && rating <= 5) {
      product.rating = rating;
    }
  }
};