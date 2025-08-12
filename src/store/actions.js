import axios from 'axios';
import { API_URL } from '@/constaint';

export default {
  async fetchProducts({ commit }) {
    try {
      const res = await axios.get(`${API_URL}/products`);
      console.log('Fetched products:', res.data);
      if (!res.data || !Array.isArray(res.data)) throw new Error('Dữ liệu products không hợp lệ');
      commit('setProducts', res.data);
    } catch (err) {
      console.error('Lỗi fetchProducts:', err.message, err.response?.data);
    }
  },
  async fetchProductSizes({ commit }) {
    try {
      const res = await axios.get(`${API_URL}/product_sizes`);
      console.log('Fetched product_sizes:', res.data);
      if (!res.data || !Array.isArray(res.data)) throw new Error('Dữ liệu product_sizes không hợp lệ');
      commit('setProductSizes', res.data);
    } catch (err) {
      console.error('Lỗi fetchProductSizes:', err.message, err.response?.data);
    }
  },
  async fetchCategories({ commit }) {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      console.log('Fetched categories:', res.data);
      if (!res.data || !Array.isArray(res.data)) throw new Error('Dữ liệu categories không hợp lệ');
      commit('setCategories', res.data);
    } catch (err) {
      console.error('Lỗi fetchCategories:', err.message, err.response?.data);
    }
  },
  async fetchToppings({ commit }) {
    try {
      const res = await axios.get(`${API_URL}/toppings`);
      console.log('Fetched toppings:', res.data);
      if (!res.data || !Array.isArray(res.data)) throw new Error('Dữ liệu toppings không hợp lệ');
      commit('setToppings', res.data);
    } catch (err) {
      console.error('Lỗi fetchToppings:', err.message, err.response?.data);
    }
  },
  async initializeData({ dispatch }) {
    await Promise.all([
      dispatch('fetchProducts'),
      dispatch('fetchProductSizes'),
      dispatch('fetchCategories'),
      dispatch('fetchToppings'),
    ]);
  },
  async saveRating({ commit }, { productId, rating }) {
    try {
      const res = await axios.patch(`${API_URL}/products/${productId}`, { rating });
      console.log('Saved rating:', res.data);
      commit('setRating', { productId, rating: res.data.rating });
    } catch (err) {
      console.error('Lỗi saveRating:', err.message, err.response?.data);
    }
  },
 async saveComment({ commit, state }, { productId, comment }) {
  try {
    const newComment = {
      id: Date.now(),
      user: state.user?.name || "Ẩn danh",
      date: new Date().toISOString(),
      text: comment
    };

    // Lấy sản phẩm hiện tại
    const product = state.products.find(p => p.id === productId);
    if (!product) throw new Error('Không tìm thấy sản phẩm');

    // Thêm comment mới
    const updatedComments = [...(product.comments || []), newComment];

    // Gửi PATCH lên server để cập nhật comments
    const res = await axios.patch(`${API_URL}/products/${productId}`, {
      comments: updatedComments
    });

    console.log('Saved comment:', res.data);

    // Cập nhật state
    commit('addComment', { productId, comment: newComment });
  } catch (err) {
    console.error('Lỗi saveComment:', err.message, err.response?.data);
  }
}

};