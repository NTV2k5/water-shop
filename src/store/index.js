import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        products: [],
        cart: [],
        history: [],
        user: null
    },
    getters: {
        getProductById: (state) => (id) => {
            return state.products.find(p => p.id === parseInt(id));
        },
        cartTotal(state) {
            return state.cart.reduce((total, item) => {
                const price = item.product.sizes[item.size];
                return total + price * item.quantity;
            }, 0);
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },

        logout(state) {
            state.user = null
        },
        setProducts(state, products) {
            state.products = products
        },
        addToCart(state, { product, size }) {
            const existing = state.cart.find(
                item => item.product.id === product.id && item.size === size
            );
            if (existing) {
                existing.quantity++;
            } else {
                state.cart.push({ product, size, quantity: 1 });
            }
        },
        removeFromCart(state, index) {
            state.cart.splice(index, 1);
        },
        incrementItem(state, index) {
            state.cart[index].quantity++;
        },
        decrementItem(state, index) {
            if (state.cart[index].quantity > 1) state.cart[index].quantity--;
        },
        checkout(state) {
            state.history.push({
                id: Date.now(),
                items: [...state.cart],
                total: state.cart.reduce((sum, item) => {
                    return sum + item.product.sizes[item.size] * item.quantity;
                }, 0),
                date: new Date().toLocaleString()
            });
            state.cart = [];
        }
    },
    actions: {
        async fetchProducts({ commit }) {
            const res = await axios.get('http://localhost:3000/products')
            commit('setProducts', res.data)
        }
    }
});
