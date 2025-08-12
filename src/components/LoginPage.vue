<template>
  <div class="auth-container">
    <h2>Đăng nhập</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Mật khẩu"
        required
      />
      <button type="submit">Đăng nhập</button>
    </form>
    <p v-if="error" class="error-text">{{ error }}</p>

    <p class="switch">
      Chưa có tài khoản?
      <router-link to="/register">Đăng ký ngay</router-link>
    </p>
  </div>
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { API_URL } from "@/constaint";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();
const store = useStore();

const login = async () => {
  error.value = "";
  try {
    const response = await axios.get(`${API_URL}/users`);
    const users = response.data;
    const user = users.find(
      (u) => u.email === email.value && u.password === password.value
    );

    if (user) {
      store.commit("setUser", user);
      const userKey = `user_${user.id || user.email}`;
      localStorage.setItem('userKey', userKey);
      localStorage.setItem(userKey, JSON.stringify(user));
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      error.value = "Sai email hoặc mật khẩu";
    }
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    error.value = "Lỗi kết nối server. Vui lòng thử lại sau!";
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.auth-container h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}
.auth-container input {
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.auth-container button {
  width: 100%;
  padding: 10px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
}
.auth-container .error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
.auth-container .switch {
  text-align: center;
  margin-top: 1rem;
}
.auth-container .switch a {
  color: #e91e63;
  text-decoration: none;
}
.error-text {
  color: red;
  text-align: center;
  margin-top: 1rem;
}
</style>