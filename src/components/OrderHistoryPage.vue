<template>
  <div class="history">
    <h2>Lịch sử đơn hàng</h2>
    <button @click="clearHistory" class="clear-btn">Hủy lịch sử đơn hàng</button>

    <div v-if="history.length === 0" class="empty">
      Bạn chưa có đơn hàng nào.
    </div>

    <div v-else>
      <div v-for="order in history" :key="order.id" class="order">
        <p><strong>Mã đơn:</strong> {{ order.id }}</p>
        <p><strong>Thời gian:</strong> {{ new Date(order.date).toLocaleString() }}</p>
        <p><strong>Tổng tiền:</strong> {{ order.total.toLocaleString() || 0 }}đ</p>
        <p><strong>Trạng thái:</strong> {{ order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán' }}</p>
        <table v-if="order.items && order.items.length">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Size</th>
              <th>Toppings</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in order.items" :key="index">
              <td>{{ item?.product?.name || "N/A" }}</td>
              <td>{{ getSizeName(item?.sizeId) || "N/A" }}</td>
              <td>
                {{
                  (item?.toppings?.length
                    ? item.toppings.map((t) => t.name).join(", ")
                    : "None") || "None"
                }}
                ({{ item?.toppings?.reduce((sum, t) => sum + (t?.price || 0), 0).toLocaleString() || 0 }}đ)
              </td>
              <td>{{ item?.quantity || 0 }}</td>
              <td>{{ item?.price.toLocaleString() || 0 }}đ</td>
              <td>{{ calculateItemTotal(item).toLocaleString() }}đ</td>
            </tr>
          </tbody>
        </table>
        <p v-else>Không có sản phẩm trong đơn hàng này.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const history = computed(() => store.state.history || []);
const productSizes = computed(() => store.state.productSizes || []);

const calculateItemTotal = (item) => {
  const basePrice = (item?.price || 0) * (item?.quantity || 0);
  const toppingPrice = (item?.toppings?.reduce((sum, t) => sum + (t?.price || 0), 0) || 0) * (item?.quantity || 0);
  return basePrice + toppingPrice;
};

function getSizeName(sizeId) {
  return productSizes.value.find(s => s.id === sizeId)?.size || "N/A";
}

function clearHistory() {
  if (confirm("Bạn có chắc muốn hủy toàn bộ lịch sử đơn hàng?")) {
    store.commit("clearHistory");
    syncLocalStorage();
  }
}

function syncLocalStorage() {
  if (store.state.user) {
    const historyKey = `history_${store.state.user.id || store.state.user.email}`;
    localStorage.setItem(historyKey, JSON.stringify(history.value));
    const expiry = Date.now() + 90 * 24 * 60 * 60 * 1000; // 3 tháng
    localStorage.setItem(`${historyKey}_expiry`, expiry);
    checkExpiry(historyKey);
  }
}

function checkExpiry(key) {
  const expiry = localStorage.getItem(`${key}_expiry`);
  if (expiry && Date.now() > expiry) {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_expiry`);
    if (key.includes("history")) store.commit("setHistory", []);
  }
}
</script>

<style scoped>
.history {
  padding: 2rem;
  max-width: 900px;
  margin: auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.order {
  margin-bottom: 2rem;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 10px;
}
table {
  width: 100%;
  margin-top: 10px;
  border-collapse: collapse;
}
th,
td {
  border-bottom: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
.clear-btn {
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}
.clear-btn:hover {
  background-color: #cc0000;
}
.empty {
  text-align: center;
  font-size: 18px;
  margin-top: 2rem;
}
@media (max-width: 767px) {
  h2 {
    font-size: 1.5rem;
  }
  th,
  td {
    min-width: 100px;
    padding: 0.5rem;
  }
  table {
    font-size: 0.9rem;
  }
}
@media (min-width: 768px) and (max-width: 1024px) {
  th,
  td {
    padding: 0.6rem;
  }
}
</style>