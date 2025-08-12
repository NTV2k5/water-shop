import { createRouter, createWebHistory } from 'vue-router';
import RegisterPage from '../components/RegisterPage.vue';
import LoginPage from '../components/LoginPage.vue';
import ProductDetail from '../components/ProductDetailPage.vue';
import HomePage from '../components/HomePage.vue';
import CartPage from '../components/CartPage.vue';
import OrderHistoryPage from '../components/OrderHistoryPage.vue';
import AdminPage from '../components/AdminPage.vue';
import TheBill from '../components/TheBill.vue'; // New import
import { useStore } from 'vuex';

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/register', component: RegisterPage },
    { path: '/login', component: LoginPage },
    { path: '/product/:id', name: 'ProductDetail', component: ProductDetail, props: true },
    { path: '/cart', name: 'Cart', component: CartPage },
    { path: '/history', name: 'History', component: OrderHistoryPage },
    { path: '/bill', name: 'Bill', component: TheBill }, // New route
    { 
      path: '/admin', 
      name: 'Admin', 
      component: AdminPage,
      meta: { requiresAdmin: true }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
  const store = useStore();
  if (to.meta.requiresAdmin && (!store.state.user || store.state.user.role !== 'admin')) {
    alert('Bạn không có quyền truy cập trang quản lý!');
    next('/');
  } else {
    next();
  }
});

export default router;