<template>
  <div class="cart">
    <h2>🛒 Giỏ hàng</h2>
    <div v-if="cart.length === 0" class="empty">
      Giỏ hàng của bạn đang trống.
    </div>

    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Size</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in cart" :key="index">
            <td>{{ item.product.name }}</td>
            <td>{{ item.size }}</td>
            <td>{{ item.product.sizes[item.size] }}đ</td>
            <td>
              <button @click="decrement(index)">-</button>
              {{ item.quantity }}
              <button @click="increment(index)">+</button>
            </td>
            <td>{{ item.product.sizes[item.size] * item.quantity }}đ</td>
            <td><button @click="remove(index)">❌</button></td>
          </tr>
        </tbody>
      </table>

      <div class="total">
        <p><strong>Tổng cộng:</strong> {{ total }}đ</p>
        <button class="checkout" @click="checkout">Thanh toán</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const cart = computed(() => store.state.cart)
const total = computed(() => store.getters.cartTotal)

function remove(index) {
  store.commit('removeFromCart', index)
}
function increment(index) {
  store.commit('incrementItem', index)
}
function decrement(index) {
  store.commit('decrementItem', index)
}
function checkout() {
  if (cart.value.length === 0) return
  store.commit('checkout')
  alert('Đã thanh toán thành công!')
}
</script>

<style scoped>
.cart {
  padding: 2rem;
  max-width: 900px;
  margin: auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  padding: 12px;
  border-bottom: 1px solid #ccc;
  text-align: center;
}
button {
  padding: 4px 8px;
  font-size: 16px;
}
.checkout {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.5rem;
  font-weight: bold;
  margin-top: 1rem;
  cursor: pointer;
}
.checkout:hover {
  background-color: #388e3c;
}
.empty {
  text-align: center;
  font-size: 18px;
  padding: 2rem;
}
.total {
  text-align: right;
  margin-top: 1rem;
}
</style>
