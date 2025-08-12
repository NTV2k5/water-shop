<template>
  <div class="admin-page">
    <h2>Quản lý cửa hàng</h2>
    <div v-if="!isAdmin" class="error">
      Bạn không có quyền truy cập trang này!
    </div>
    <div v-else>
      <!-- Quản lý sản phẩm -->
      <h3>Quản lý sản phẩm</h3>
      <div class="product-management">
        <h4>Thêm sản phẩm mới</h4>
        <form @submit.prevent="addProduct">
          <input
            v-model="newProduct.name"
            placeholder="Tên sản phẩm"
            required
          />
          <input
            v-model="newProduct.description"
            placeholder="Mô tả"
            required
          />
          <input
            type="file"
            @change="handleFileUpload($event, 'new')"
            accept="image/*"
            required
          />
          <select v-model="newProduct.category_id" required>
            <option value="" disabled>Chọn danh mục</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
          Giá size S:
          <input
            v-model.number="newProduct.priceS"
            type="number"
            min="0"
            placeholder="Giá size S"
            required
          />
          Giá size M:
          <input
            v-model.number="newProduct.priceM"
            type="number"
            min="0"
            placeholder="Giá size M"
            required
          />
          Giá size L:
          <input
            v-model.number="newProduct.priceL"
            type="number"
            min="0"
            placeholder="Giá size L"
            required
          />
          Số lượng đánh giá:
          <input
            v-model.number="newProduct.rating"
            type="number"
            min="0"
            max="5"
            placeholder="Đánh giá"
            required
          />
          <button type="submit">Thêm sản phẩm</button>
        </form>

        <h4>Danh sách sản phẩm</h4>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Danh mục</th>
              <th>Đánh giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.description }}</td>
              <td>{{ getCategoryName(product.category_id) }}</td>
              <td>{{ product.rating }}</td>
              <td>
                <button @click="startEdit(product)">Sửa</button>
                <button @click="deleteProduct(product.id)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Form sửa sản phẩm -->
        <div v-if="editingProduct" class="edit-form">
          <h4>Sửa sản phẩm</h4>
          <form @submit.prevent="updateProduct">
            <input
              v-model="editingProduct.name"
              placeholder="Tên sản phẩm"
              required
            />
            <input
              v-model="editingProduct.description"
              placeholder="Mô tả"
              required
            />
            <input
              type="file"
              @change="handleFileUpload($event, 'edit')"
              accept="image/*"
            />
            <img v-if="editingProduct.image" :src="editingProduct.image" alt="Preview" style="width:100px; height:auto;" />
            <select v-model="editingProduct.category_id" required>
              <option value="" disabled>Chọn danh mục</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            <input
              v-model.number="editingProduct.rating"
              type="number"
              min="0"
              max="5"
              placeholder="Đánh giá"
              required
            />
            <button type="submit">Lưu thay đổi</button>
            <button type="button" @click="cancelEdit">Hủy</button>
          </form>
        </div>
      </div>

      <!-- Thống kê đơn hàng -->
      <h3>Thống kê đơn hàng</h3>
      <div class="statistics">
        <select v-model="timeFrame" @change="fetchStatistics">
          <option value="day">Theo ngày</option>
          <option value="week">Theo tuần</option>
          <option value="month">Theo tháng</option>
          <option value="quarter">Theo quý</option>
          <option value="year">Theo năm</option>
        </select>
        <table>
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Tổng đơn hàng</th>
              <th>Tổng doanh thu</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stat in statistics" :key="stat.time">
              <td>{{ stat.time }}</td>
              <td>{{ stat.orderCount }}</td>
              <td>{{ stat.totalRevenue.toLocaleString() }}đ</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- So sánh đơn hàng của người dùng -->
      <h3>So sánh đơn hàng của người dùng</h3>
      <div class="order-comparison">
        <input v-model="compareUserEmail" placeholder="Nhập email người dùng" />
        <button @click="compareOrders">So sánh</button>
        <div v-if="comparisonResult">
          <h4>Kết quả so sánh</h4>
          <p>
            Tổng đơn hàng của người dùng: {{ comparisonResult.userOrderCount }}
          </p>
          <p>
            Tổng doanh thu từ người dùng:
            {{ comparisonResult.userTotalRevenue.toLocaleString() }}đ
          </p>
          <p>
            Tỷ lệ so với tổng đơn hàng:
            {{ comparisonResult.percentage.toFixed(2) }}%
          </p>
        </div>
      </div>
    </div>
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
const isAdmin = computed(() => store.state.user?.role === "admin");
const products = computed(() => store.state.products || []);
const categories = ref([]);
const editingProduct = ref(null);
const newProduct = ref({
  name: "",
  description: "",
  image: "",
  category_id: "",
  priceS: 0,
  priceM: 0,
  priceL: 0,
  rating: 0,
});

const timeFrame = ref("day");
const statistics = ref([]);
const compareUserEmail = ref("");
const comparisonResult = ref(null);

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

onMounted(() => {
  if (!isAdmin.value) {
    router.push("/");
    alert("Bạn không có quyền truy cập trang quản lý!");
    return;
  }
  fetchCategories();
  fetchProducts();
  fetchStatistics();
});

async function fetchCategories() {
  try {
    const res = await axiosInstance.get("/categories");
    store.commit("setCategories", res.data);
    categories.value = res.data;
  } catch (err) {
    console.error("Lỗi lấy danh mục:", err);
  }
}

async function fetchProducts() {
  try {
    const res = await axiosInstance.get("/products");
    store.commit("setProducts", res.data);
  } catch (err) {
    console.error("Lỗi lấy sản phẩm:", err);
  }
}

function getCategoryName(categoryId) {
  const category = categories.value.find((c) => c.id == categoryId);
  return category ? category.name : "N/A";
}

function handleFileUpload(event, type) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    if (type === 'new') {
      newProduct.value.image = e.target.result;
    } else if (type === 'edit') {
      editingProduct.value.image = e.target.result;
    }
  };
  reader.readAsDataURL(file);
}

async function addProduct() {
  try {
    // Tìm maxId cho products
    const productRes = await axiosInstance.get("/products");
    const maxProductId = productRes.data.length
      ? Math.max(...productRes.data.map(p => parseInt(p.id)))
      : 0;
    const newProductId = (maxProductId + 1).toString();

    // POST product mới
    const productPayload = {
      id: newProductId,
      name: newProduct.value.name,
      description: newProduct.value.description,
      image: newProduct.value.image,
      category_id: newProduct.value.category_id,
      rating: newProduct.value.rating,
      comments: []
    };
    const resProduct = await axiosInstance.post("/products", productPayload);

    // Tìm maxId cho product_sizes
    const sizeRes = await axiosInstance.get("/product_sizes");
    const maxSizeId = sizeRes.data.length
      ? Math.max(...sizeRes.data.map(s => parseInt(s.id)))
      : 0;

    // POST 3 sizes
    const sizes = [
      { id: (maxSizeId + 1).toString(), product_id: parseInt(newProductId), size: "S", price: newProduct.value.priceS },
      { id: (maxSizeId + 2).toString(), product_id: parseInt(newProductId), size: "M", price: newProduct.value.priceM },
      { id: (maxSizeId + 3).toString(), product_id: parseInt(newProductId), size: "L", price: newProduct.value.priceL }
    ];

    for (const size of sizes) {
      await axiosInstance.post("/product_sizes", size);
    }

    // Cập nhật state
    store.commit("setProducts", [...products.value, resProduct.data]);
    store.dispatch("fetchProductSizes"); // Refresh sizes in store

    newProduct.value = {
      name: "",
      description: "",
      image: "",
      category_id: "",
      priceS: 0,
      priceM: 0,
      priceL: 0,
      rating: 0,
    };
    alert("Thêm sản phẩm thành công!");
  } catch (err) {
    console.error("Lỗi thêm sản phẩm:", err);
  }
}

function startEdit(product) {
  editingProduct.value = {
    ...product,
    category_id: product.category_id.toString(),
  };
}

async function updateProduct() {
  try {
    const res = await axiosInstance.put(
      `/products/${editingProduct.value.id}`,
      {
        ...editingProduct.value,
        category_id: parseInt(editingProduct.value.category_id),
      }
    );
    store.commit(
      "setProducts",
      products.value.map((p) => (p.id === res.data.id ? res.data : p))
    );
    editingProduct.value = null;
    alert("Cập nhật sản phẩm thành công!");
  } catch (err) {
    console.error("Lỗi cập nhật sản phẩm:", err);
  }
}

function cancelEdit() {
  editingProduct.value = null;
}

async function deleteProduct(productId) {
  if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
    try {
      await axiosInstance.delete(`/products/${productId}`);
      store.commit(
        "setProducts",
        products.value.filter((p) => p.id !== productId)
      );
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
    }
  }
}

async function fetchStatistics() {
  try {
    const res = await axiosInstance.get("/orders");

    // Lọc chỉ đơn hàng đã thanh toán
    const orders = res.data.filter((o) => o.isPaid === true);

    const stats = {};
    orders.forEach((order) => {
      const date = new Date(order.date);
      let key;

      if (timeFrame.value === "day") {
        key = date.toLocaleDateString();
      } else if (timeFrame.value === "week") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // đầu tuần (Chủ nhật)
        key = `Tuần ${weekStart.toLocaleDateString()}`;
      } else if (timeFrame.value === "month") {
        key = date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
      } else if (timeFrame.value === "quarter") {
        const quarter = Math.floor((date.getMonth() + 3) / 3);
        key = `Quý ${quarter} ${date.getFullYear()}`;
      } else if (timeFrame.value === "year") {
        key = date.getFullYear().toString();
      }

      if (!stats[key]) stats[key] = { orderCount: 0, totalRevenue: 0 };
      stats[key].orderCount++;
      stats[key].totalRevenue += order.total;
    });

    statistics.value = Object.entries(stats).map(([time, data]) => ({
      time,
      orderCount: data.orderCount,
      totalRevenue: data.totalRevenue,
    }));
  } catch (err) {
    console.error("Lỗi thống kê:", err);
  }
}

async function compareOrders() {
  try {
    const userRes = await axiosInstance.get(
      `/users?email=${compareUserEmail.value}`
    );
    const user = userRes.data[0];
    if (!user) {
      alert("Không tìm thấy người dùng!");
      return;
    }

    const ordersRes = await axiosInstance.get("/orders");
    console.log("Dữ liệu đơn hàng:", ordersRes.data); // debug

    // Lọc đơn hàng đã thanh toán
    const allOrders = ordersRes.data.filter((o) => o.isPaid === true);

    // Lọc đơn hàng của người dùng đó
    const userOrders = allOrders.filter((o) => o.userId === user.id);

    // Tính phần trăm, tránh chia 0
    const percentage =
      allOrders.length > 0 ? (userOrders.length / allOrders.length) * 100 : 0;

    comparisonResult.value = {
      userOrderCount: userOrders.length,
      userTotalRevenue: userOrders.reduce((sum, o) => sum + o.total, 0),
      percentage: percentage,
    };
  } catch (err) {
    console.error("Lỗi so sánh:", err);
  }
}
</script>

<style scoped>
.admin-page {
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.product-management,
.statistics,
.order-comparison {
  margin-top: 2rem;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin-bottom: 2rem;
}
input,
select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  padding: 0.5rem 1rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 20px;
}
button:hover {
  background: #388e3c;
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
  text-align: left;
}
.error {
  color: red;
  text-align: center;
  font-size: 18px;
  padding: 2rem;
}
.edit-form {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f9f9f9;
}
</style>