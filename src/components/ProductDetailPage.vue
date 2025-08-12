
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
          {{ sizeObj.size }} - {{ sizeObj.price.toLocaleString() }}đ
        </button>
      </div>
      <p v-else>Không có tùy chọn size.</p>

      <label>Thêm topping:</label>
      <div class="toppings" v-if="toppings.length">
        <div
          v-for="topping in toppings"
          :key="topping.id"
          class="topping-option"
        >
          <label>
            <input
              type="checkbox"
              v-model="selectedToppings"
              :value="topping"
              @change="updatePrice"
            />
            {{ topping.name }} (+{{ topping.price.toLocaleString() }}đ)
          </label>
        </div>
      </div>
      <p v-else>Không có topping để chọn.</p>

      <div class="quantity-group">
        <button @click="decreaseQty" class="qty-btn">−</button>
        <input type="number" v-model="quantity" min="1" class="qty-input" />
        <button @click="increaseQty" class="qty-btn">+</button>
      </div>

      <p>Giá: {{ totalPrice.toLocaleString() }}đ</p>
      <button class="add-btn" @click="addToCart">Thêm vào giỏ</button>

      <!-- Thêm rating -->
      <div class="rating">
        <label for="rating">Đánh giá: </label>
        <select v-model="selectedRating" @change="updateRating" id="rating">
          <option disabled value="">Chọn sao đánh giá</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }} sao</option>
        </select>
        <div v-if="product.ratings && product.ratings.length">
          <p v-for="(r, index) in product.ratings" :key="index">
            {{ r.user }} ({{ new Date(r.date).toLocaleDateString() }}): ⭐ {{ r.value }}/5
          </p>
        </div>
      </div>

      <!-- Thêm bình luận -->
      <div class="comments-section">
        <input
          v-model="commentText"
          placeholder="Thêm bình luận..."
          @keypress.enter="submitComment"
        />
        <button @click="submitComment" class="submit-btn">Gửi</button>
        <div class="comments">
          <p v-for="comment in product.comments" :key="comment.id">
            <strong>{{ comment.user }}</strong> ({{ new Date(comment.date).toLocaleDateString() }}): {{ comment.text }}
          </p>
        </div>
      </div>
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

const selectedSizeId = ref(null);
const quantity = ref(1);
const selectedToppings = ref([]);
const toppings = computed(() => store.state.toppings);
const commentText = ref("");
const selectedRating = ref("");
const user = computed(() => store.state.currentUser || "Ẩn danh");

watchEffect(() => {
  if (!product.value && store.state.products.length === 0) {
    store.dispatch("fetchProducts");
  }
  if (store.state.productSizes.length === 0) {
    store.dispatch("fetchProductSizes");
  }
  if (store.state.toppings.length === 0) {
    store.dispatch("fetchToppings");
  }
});

const filteredSizes = computed(() => {
  return (
    store.state.productSizes.filter(
      (s) => parseInt(s.product_id) === parseInt(product.value?.id)
    ) || []
  );
});

onMounted(async () => {
  if (store.state.products.length === 0) await store.dispatch("fetchProducts");
  if (store.state.productSizes.length === 0)
    await store.dispatch("fetchProductSizes");
  if (store.state.toppings.length === 0) await store.dispatch("fetchToppings");
  if (filteredSizes.value.length && !selectedSizeId.value) {
    selectedSizeId.value = filteredSizes.value[0].id;
  }
});

const selectSize = (id) => {
  selectedSizeId.value = id;
  updatePrice();
};

const updatePrice = () => {
  const sizeObj = filteredSizes.value.find(
    (s) => s.id === selectedSizeId.value
  );
  const basePrice = sizeObj ? sizeObj.price : 0;
  const toppingPrice = selectedToppings.value.reduce(
    (sum, t) => sum + t.price,
    0
  );
  return basePrice + toppingPrice;
};

const totalPrice = computed(() => {
  const basePrice =
    filteredSizes.value.find((s) => s.id === selectedSizeId.value)?.price || 0;
  const toppingPrice = selectedToppings.value.reduce(
    (sum, t) => sum + t.price,
    0
  );
  return (basePrice + toppingPrice) * quantity.value;
});

const increaseQty = () => {
  quantity.value++;
};

const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--;
};

const updateRating = () => {
  if (product.value) {
    const rating = {
      user: user.value,
      value: selectedRating.value,
      date: new Date().toISOString(),
    };
    if (!product.value.ratings) product.value.ratings = [];
    product.value.ratings.push(rating);
    store.dispatch("updateProduct", product.value);
    selectedRating.value = "";
  }
};

const submitComment = () => {
  if (commentText.value.trim() && product.value) {
    const comment = {
      user: user.value,
      text: commentText.value,
      date: new Date().toISOString(),
    };
    product.value.comments.push(comment);
    store.dispatch("updateProduct", product.value);
    commentText.value = "";
  }
};

const addToCart = () => {
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
      sizeId: selectedSize.id,
      price: selectedSize.price,
      toppings: selectedToppings.value,
    });
  }
  router.push("/cart");
};
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
  max-height: 480px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 2rem;
}
.info {
  flex: 1;
}
label input {
  position: relative;
  top: 20px;
}
.sizes button {
  margin-right: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  padding: 5px 10px;
  border: 1px solid #aaa;
  border-radius: 5px;
  background-color: #fff;
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
.rating {
  margin: 1rem 0;
}
.rating select {
  margin-left: 5px;
  padding: 5px;
}
.comments-section {
  margin: 1rem 0;
}
.comments {
  margin-top: 10px;
  text-align: left;
  max-height: 100px;
  overflow-y: auto;
}
input {
  margin-top: 5px;
  padding: 5px;
  width: 100%;
}
button {
  padding: 5px 10px;
  background: #2c3e50;
  color: #000;
  border: none;
  cursor: pointer;
}
button:hover {
  background: #34495e;
}
.submit-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-top: 10px;
  width: 90px;
  height: 30px;
}
@media (max-width: 767px) {
  h2 {
    font-size: 1.5rem;
  }
  p {
    font-size: 0.9rem;
  }
  .detail {
    flex-direction: column;
  }
  img {
    max-width: 100%;
    height: auto;
    margin-right: 0;
    margin-bottom: 1rem;
  }
}
@media (min-width: 768px) and (max-width: 1024px) {
  h2 {
    font-size: 1.6rem;
  }
  p {
    font-size: 0.95rem;
  }
}
</style>