<template>
  <div class="cart">
    <h2>Giỏ hàng</h2>
    <div v-if="cart.length === 0" class="empty">
      Giỏ hàng của bạn đang trống.
    </div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Size</th>
            <th>Toppings</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in cart" :key="index">
            <td>{{ item.product.name }}</td>
            <td>{{ getSizeName(item.sizeId) }}</td>
            <td>
              {{
                item.toppings.length
                  ? item.toppings.map((t) => t.name).join(", ")
                  : "None"
              }}
              ({{
                item.toppings
                  .reduce((sum, t) => sum + t.price, 0)
                  .toLocaleString()
              }}đ)
            </td>
            <td>{{ item.price.toLocaleString() }}đ</td>
            <td>
              <button @click="decrement(index)">-</button>
              {{ item.quantity }}
              <button @click="increment(index)">+</button>
            </td>
            <td>{{ itemTotal(item).toLocaleString() }}đ</td>
            <td><button @click="remove(index)">❌</button></td>
          </tr>
        </tbody>
      </table>

      <div class="total">
        <p><strong>Tổng cộng:</strong> {{ total.toLocaleString() }}đ</p>
        <button class="checkout" @click="startCheckout">
          Thanh toán
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";


const store = useStore();
const router = useRouter();
const cart = computed(() => store.state.cart || []);
const productSizes = computed(() => store.state.productSizes || []);

const itemTotal = (item) => {
  const basePrice = item.price * item.quantity;
  const toppingPrice =
    item.toppings.reduce((sum, t) => sum + t.price, 0) * item.quantity;
  return basePrice + toppingPrice;
};

const total = computed(() => {
  return cart.value.reduce((sum, item) => sum + itemTotal(item), 0);
});

function getSizeName(sizeId) {
  if (!sizeId) return "N/A";
  const sizeIdStr = sizeId.toString();
  const size = productSizes.value.find((s) => s.id === sizeIdStr);
  return size ? size.size : "N/A";
}

function remove(index) {
  if (!store.state.user) {
    alert("Vui lòng đăng nhập để quản lý giỏ hàng!");
    return;
  }
  store.commit("removeFromCart", index);
  syncLocalStorage();
}

function increment(index) {
  if (!store.state.user) {
    alert("Vui lòng đăng nhập để thay đổi số lượng!");
    return;
  }
  store.commit("incrementItem", index);
  syncLocalStorage();
}

function decrement(index) {
  if (!store.state.user) {
    alert("Vui lòng đăng nhập để thay đổi số lượng!");
    return;
  }
  store.commit("decrementItem", index);
  syncLocalStorage();
}

function startCheckout() {
  if (!store.state.user) {
    alert("Vui lòng đăng nhập để thanh toán!");
    return;
  }
  if (cart.value.length === 0) return;
  router.push('/bill');
}

function syncLocalStorage() {
  if (store.state.user) {
    const cartKey = `cart_${store.state.user.id || store.state.user.email}`;
    localStorage.setItem(cartKey, JSON.stringify(cart.value));
    const expiry = Date.now() + 90 * 24 * 60 * 60 * 1000;
    localStorage.setItem(`${cartKey}_expiry`, expiry);
  }
}

function checkExpiry(key) {
  const expiry = localStorage.getItem(`${key}_expiry`);
  if (expiry && Date.now() > expiry) {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_expiry`);
    if (key.includes("history")) {
      store.commit("setHistory", []);
      console.log("History expired and cleared from localStorage");
    }
  }
}

onMounted(() => {
  console.log("Mounted, initial user state:", store.state.user);
  if (store.state.user) {
    const historyKey = `history_${
      store.state.user.id || store.state.user.email
    }`;
    checkExpiry(historyKey);
  }
});
</script>

<style scoped>
.success-message {
  margin-top: 10px;
  color: green;
  font-weight: bold;
  padding: 10px;
  background-color: #e0f7fa;
  border-radius: 5px;
  display: inline-block;
}
.cart {
  padding: 2rem;
  max-width: 900px;
  margin: auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th,
td {
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
.qr-payment {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
  gap: 1rem;
}

.qr-payment img {
  width: 150px;
  height: 150;
}
</style>