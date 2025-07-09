import { createRouter, createWebHistory } from 'vue-router';
import RegisterPage from '../views/RegisterPage.vue';
import LoginPage from '../views/LoginPage.vue';
import ProductDetail from '../views/ProductDetailPage.vue';
import HomePage from '../views/HomePage.vue';
import CartPage from '../views/CartPage.vue';
import OrderHistoryPage from '../views/OrderHistoryPage.vue';

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/register', component: RegisterPage },
    { path: '/login', component: LoginPage },
    { path: '/product/:id', name: 'ProductDetail', component: ProductDetail, props: true },
    { path: '/cart', name: 'Cart', component: CartPage },
    { path: '/history', name: 'History', component: OrderHistoryPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
