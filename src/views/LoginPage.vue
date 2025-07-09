<template>
  <div class="auth-container">
    <h2>🔐 Đăng nhập</h2>
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

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();
const store = useStore();

const login = async () => {
  try {
    const res = await axios.get('http://localhost:3000/users', {
  params: {
    email: email.value,
    password: password.value
  }
})

    if (res.data.length > 0) {
      store.commit("setUser", res.data[0]);
      router.push("/");
    } else {
      error.value = "Sai email hoặc mật khẩu";
    }
  } catch {
    error.value = "Lỗi đăng nhập";
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
