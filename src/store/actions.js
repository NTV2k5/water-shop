import axios from 'axios';

export default {
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
};