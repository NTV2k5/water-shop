<template>
  <div class="auth-container">
    <h2>Đăng ký</h2>
    <form @submit.prevent="register">
      <input v-model="username" placeholder="Tên người dùng" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Mật khẩu"
        required
      />
      <button type="submit">Đăng ký</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p class="switch">
      Đã có tài khoản?
      <router-link to="/login">Đăng nhập</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const username = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const register = async () => {
  try {
    const res = await axios.get(
      `http://localhost:3000/users?email=${email.value}`
    );
    if (res.data.length > 0) {
      error.value = "Email đã tồn tại!";
      return;
    }
    await axios.post("http://localhost:3000/users", {
      username: username.value,
      email: email.value,
      password: password.value,
    });
    router.push("/login");
  } catch {
    error.value = "Đăng ký thất bại";
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

