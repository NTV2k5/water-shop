<template>
  <div v-if="product" class="detail">
    <img :src="product.image" :alt="product.name" />
    <div class="info">
      <h2>{{ product.name }}</h2>
      <p>{{ product.description }}</p>

      <label>Chọn size:</label>
      <div class="sizes" v-if="filteredSizes.length">
        <button
          v-for="sizeObj in filteredSizes"
          :key="sizeObj.id"
          :class="{ active: selectedSizeId === sizeObj.id }"
          @click="selectSize(sizeObj.id)"
        >
          {{ sizeObj.size }} - {{ sizeObj.price }}đ
        </button>
      </div>
      <p v-else>Không có tùy chọn size.</p>

      <div class="quantity-group">
        <button @click="decreaseQty" class="qty-btn">−</button>
        <input type="number" v-model="quantity" min="1" class="qty-input" />
        <button @click="increaseQty" class="qty-btn">+</button>
      </div>

      <p>Giá: {{ selectedPrice || 0 }}đ</p>
      <button class="add-btn" @click="addToCart">🛒 Thêm vào giỏ</button>
    </div>
  </div>
  <div v-else>
    <p>Đang tải sản phẩm hoặc sản phẩm không tồn tại.</p>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();
const router = useRouter();
const product = computed(() =>
  store.state.products.find((p) => parseInt(p.id) === parseInt(route.params.id))
);

watchEffect(() => {
  if (!product.value && store.state.products.length === 0) {
    store.dispatch("fetchProducts");
  }
  if (store.state.productSizes.length === 0) {
    store.dispatch("fetchProductSizes");
  }
});

const selectedSizeId = ref(null);
const quantity = ref(1);
const selectedPrice = ref(0);

const filteredSizes = computed(() => {
  return (
    store.state.productSizes.filter(
      (s) => parseInt(s.product_id) === parseInt(product.value?.id)
    ) || []
  );
});

onMounted(async () => {
  if (store.state.products.length === 0) {
    await store.dispatch("fetchProducts");
  }
  if (store.state.productSizes.length === 0) {
    await store.dispatch("fetchProductSizes");
  }
  if (filteredSizes.value.length && !selectedSizeId.value) {
    selectedSizeId.value = filteredSizes.value[0].id;
  }
});

const selectSize = (id) => {
  selectedSizeId.value = id;
  const sizeObj = filteredSizes.value.find((s) => s.id === id);
  selectedPrice.value = sizeObj ? sizeObj.price : 0;
};

const increaseQty = () => {
  quantity.value++;
};

const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--;
};

function addToCart() {
  if (!store.getters.isAuthenticated) {
    alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
    return;
  }
  const selectedSize = filteredSizes.value.find(
    (s) => s.id === selectedSizeId.value
  );
  if (!selectedSize) {
    alert("Vui lòng chọn size!");
    return;
  }

  for (let i = 0; i < quantity.value; i++) {
    store.commit("addToCart", {
      product: product.value,
      size: selectedSize.size,
      price: selectedSize.price,
    });
  }
  router.push("/cart");
}

watchEffect(() => {
  if (selectedSizeId.value) {
    const sizeObj = filteredSizes.value.find(
      (s) => s.id === selectedSizeId.value
    );
    selectedPrice.value = sizeObj ? sizeObj.price : 0;
  }
});
</script>

<style scoped>
.detail {
  display: flex;
  flex-wrap: wrap;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  margin: 1rem auto;
  max-width: 900px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
img {
  width: 100%;
  max-width: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 2rem;
}
.info {
  flex: 1;
}
.sizes button {
  margin-right: 10px;
  margin-top: 5px;
  padding: 5px 10px;
  border: 1px solid #aaa;
  border-radius: 5px;
  background-color: #eee;
  cursor: pointer;
}
.sizes button.active {
  background-color: #4caf50;
  color: white;
}
.quantity-group {
  display: inline-flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  background: white;
  margin: 1rem 0;
}

.qty-btn {
  background: #f0f0f0;
  border: none;
  padding: 8px 14px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s;
}

.qty-btn:hover {
  background: #ddd;
}

.qty-input {
  width: 50px;
  text-align: center;
  border: none;
  font-size: 16px;
  outline: none;
  padding: 8px 0;
}

.add-btn {
  padding: 0.8rem 1.5rem;
  margin-left: 15px;
  background-color: #ff5722;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}
.add-btn:hover {
  background-color: #e64a19;
}

/* Mobile */
@media (max-width: 767px) {
  h2 {
    font-size: 1.5rem;
  }
  p {
    font-size: 0.9rem;
  }
  .product-info {
    flex-direction: column;
  }
  img {
    max-width: 100%;
    height: auto;
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1024px) {
  h2 {
    font-size: 1.6rem;
  }
  p {
    font-size: 0.95rem;
  }
}
</style>
