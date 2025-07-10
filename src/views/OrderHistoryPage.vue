<template>
  <div class="history">
    <h2>🧾 Lịch sử đơn hàng</h2>

    <div v-if="history.length === 0" class="empty">
      Bạn chưa có đơn hàng nào.
    </div>

    <div v-else>
      <div v-for="order in history" :key="order.id" class="order">
        <p><strong>Mã đơn:</strong> {{ order.id }}</p>
        <p><strong>Thời gian:</strong> {{ order.date }}</p>
        <p><strong>Tổng tiền:</strong> {{ order.total }}đ</p>
        <table>
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Size</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in order.items" :key="index">
              <td>{{ item.product.name }}</td>
              <td>{{ item.size }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.price }}đ</td>
              <td>{{ item.price * item.quantity }}đ</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const history = computed(() => store.state.history)
</script>

<style scoped>
.history {
  padding: 2rem;
  max-width: 900px;
  margin: auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
th, td {
  border-bottom: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
.empty {
  text-align: center;
  font-size: 18px;
  margin-top: 2rem;
}

/* Mobile */
@media (max-width: 767px) {
  h2 {
    font-size: 1.5rem;
  }
  th, td {
    min-width: 100px;
    padding: 0.5rem;
  }
  table {
    font-size: 0.9rem;
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1024px) {
  th, td {
    padding: 0.6rem;
  }
}
</style>
