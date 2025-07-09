<template>
  <div  class="detail">
    <img :src="product.image" :alt="product.name" />
    <div class="info">
      <h2>{{ product.name }}</h2>
      <p>{{ product.description }}</p>

      <label>Chọn size:</label>
      <div class="sizes">
        <button
          v-for="(price, sizeKey) in product.sizes"
          :key="sizeKey"
          :class="{ active: size === sizeKey }"
          @click="size = sizeKey">
          {{ sizeKey }} - {{ price }}đ
        </button>
      </div>

      <div class="quantity-group">
        <button @click="decreaseQty" class="qty-btn">−</button>
        <input type="number" v-model="quantity" min="1" class="qty-input" />
        <button @click="increaseQty" class="qty-btn">+</button>
      </div>

      <button class="add-btn" @click="addToCart">🛒 Thêm vào giỏ</button>
    </div>
  </div>
 
</template>

<script setup>
import { ref, computed, watchEffect  } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();
const router = useRouter();
const product = computed(() => {
  return store.state.products.find(p => p.id == route.params.id)
})

watchEffect(() => {
  if (!product.value && store.state.products.length === 0) {
    store.dispatch('fetchProducts')
  }
})

const size = ref("M");
const quantity = ref(1);

const increaseQty = () => {
  quantity.value++;
};

const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--;
};

function addToCart() {
  for (let i = 0; i < quantity.value; i++) {
    store.commit("addToCart", { product: product.value, size: size.value });
  }
  router.push("/cart");
}
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
</style>
