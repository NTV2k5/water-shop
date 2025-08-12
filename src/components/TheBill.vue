<template>
  <div class="bill-container">
    <h2>Hóa Đơn Thanh Toán</h2>
    <form @submit.prevent>
      <label>Họ và tên:</label>
      <input v-model="fullName" placeholder="Họ và tên" required />
      <label>Email:</label>
      <input v-model="email" placeholder="Email" required />
      <label>Số điện thoại:</label>
      <input v-model="phone" placeholder="Số điện thoại" required />
      <label>Địa chỉ:</label>
      <input v-model="address" placeholder="Địa chỉ" required />
    </form>
    <h3>Danh sách sản phẩm</h3>
    <table>
      <thead>
        <tr>
          <th>Tên sản phẩm</th>
          <th>Số lượng</th>
          <th>Đơn giá</th>
          <th>Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in cart" :key="index">
          <td>{{ item.product.name }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.price.toLocaleString() }}đ</td>
          <td>{{ itemTotal(item).toLocaleString() }}đ</td>
        </tr>
      </tbody>
    </table>
    <p class="total">Tổng tiền: {{ total.toLocaleString() }}đ</p>
    <p class="note">Vui lòng chuyển khoản với nội dung: Thanh toan don hang {{ orderId }}</p>
    <div class="payment-methods">
      <label>
        <input type="radio" v-model="paymentMethod" value="cash" />
        Thanh toán bằng tiền mặt (Chưa thanh toán)
      </label>
      <label>
        <input type="radio" v-model="paymentMethod" value="qr" />
        Quét mã QR để thanh toán
      </label>
    </div>
    <div v-if="paymentMethod === 'qr'" class="qr-section">
      <p>Quét mã QR để thanh toán (Tài khoản TPbank 00001541824):</p>
      <img :src="qrUrl" alt="VietQR Code" />
    </div>
    <button @click="confirmPayment" :disabled="!paymentMethod">Xác nhận thanh toán</button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { API_URL } from "@/constaint";

const store = useStore();
const router = useRouter();
const cart = computed(() => store.state.cart);
const user = computed(() => store.state.user);

const fullName = ref("");
const email = ref("");
const phone = ref("");
const address = ref("");
const paymentMethod = ref("");
const error = ref("");
const orderId = ref(Date.now());

onMounted(() => {
  if (user.value) {
    fullName.value = user.value.fullName || "";
    email.value = user.value.email;
    phone.value = user.value.phone || "";
    address.value = user.value.address || "";
  }
});

const itemTotal = (item) => {
  const basePrice = item.price * item.quantity;
  const toppingPrice = item.toppings.reduce((sum, t) => sum + t.price, 0) * item.quantity;
  return basePrice + toppingPrice;
};

const total = computed(() => cart.value.reduce((sum, item) => sum + itemTotal(item), 0));

const qrUrl = computed(() => {
  return `https://api.vietqr.io/image/970423-00001541824-DorbpUh.jpg?accountName=DRINK%20SHOP&amount=${total.value}`;
});

async function confirmPayment() {
  error.value = "";
  if (!fullName.value || !email.value || !phone.value || !address.value) {
    error.value = "Vui lòng điền đầy đủ thông tin!";
    return;
  }
  try {
    const isPaid = paymentMethod.value === "qr";
    const order = {
      id: `order_${orderId.value}`,
      userId: store.state.user.id,
      fullName: fullName.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
      total: total.value,
      date: new Date().toISOString(),
      items: cart.value.map((item) => ({
        product: item.product,
        sizeId: item.sizeId,
        toppings: item.toppings,
        quantity: item.quantity,
        price: item.price,
      })),
      isPaid,
    };
    await axios.post(`${API_URL}/orders`, order);
    store.commit("checkout", { ...order, isPaid });
    store.commit("addToHistory", order);
    alert(`Thanh toán ${isPaid ? "thành công" : "bằng tiền mặt (chưa thanh toán)"}!`);
    router.push("/history");
  } catch (err) {
    error.value = "Xử lý thanh toán thất bại: " + (err.message || "Lỗi không xác định");
    console.error("Exception in payment:", err);
  }
}
</script>

<style scoped>
.bill-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}
th, td {
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  text-align: left;
}
.total {
  font-weight: bold;
  text-align: right;
}
.note {
  font-style: italic;
  color: #555;
}
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
}
.qr-section {
  text-align: center;
  margin: 1rem 0;
}
.qr-section img {
  width: 200px;
  height: 200px;
}
button {
  padding: 0.7rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: #388e3c;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>