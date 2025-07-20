<template>
  <div class="home">
    <h1 v-if="!loading && !error">Menu nước uống</h1>
    <div v-if="loading" class="text-center">Đang tải dữ liệu...</div>
    <div v-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-if="!loading && !error && Object.keys(visibleCategories).length > 0">
      <div
        v-for="(group, category) in visibleCategories"
        :key="category"
        class="category-section"
      >
        <h3>{{ category }} ({{ group.length }} sản phẩm)</h3>
        <div class="grid-wrapper">
          <div class="grid">
            <ProductCard
              v-for="product in group"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!loading && !error && Object.keys(visibleCategories).length === 0"
      class="text-center"
    >
      Không có sản phẩm hoặc danh mục để hiển thị. Kiểm tra category_id.
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import ProductCard from "../components/ProductCard.vue";

const store = useStore();
const route = useRoute();
const loading = ref(true);
const error = ref(null);

onMounted(() => {
  loading.value = true;
  error.value = null;
  console.log("Bắt đầu tải dữ liệu từ store...");
  store
    .dispatch("fetchProducts")
    .then(() => store.dispatch("fetchProductSizes"))
    .then(() => store.dispatch("fetchCategories"))
    .then(() => {
      console.log("Products từ store:", store.state.products);
      console.log("Product sizes từ store:", store.state.productSizes);
      console.log("Categories từ store:", store.state.categories);
    })
    .catch((err) => {
      error.value = "Lỗi khi tải dữ liệu. Vui lòng kiểm tra server.";
      console.error("Lỗi chi tiết:", err);
    })
    .finally(() => {
      loading.value = false;
    });
});

const categorizedProducts = computed(() => {
  const map = {};
  const categories = store.state.categories;
  for (const cat of categories) {
    const catId = String(cat.id).trim();
    const filtered = store.state.products.filter((p) => {
      const prodCatId = String(p.category_id).trim();
      return prodCatId === catId;
    });
    map[cat.name] = filtered.map((product) => {
      const defaultSize = store.state.productSizes.find(
        (ps) => ps.product_id === product.id
      );
      return {
        ...product,
        price: defaultSize ? defaultSize.price : 0,
      };
    });
  }
  return map;
});

const visibleCategories = computed(() => {
  const selected = route.query.category;
  return selected
    ? { [selected]: categorizedProducts.value[selected] || [] }
    : categorizedProducts.value;
});
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}
.home {
  padding: 2rem;
}
.category-section {
  margin-bottom: 2.5rem;
}
.grid-wrapper {
  display: flex;
  justify-content: center;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}
h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.5rem;
}

/* Responsive */
@media (max-width: 767px) {
  .grid {
    grid-template-columns: 1fr;
  }
  h1 {
    font-size: 1.5rem;
  }
}
@media (min-width: 768px) and (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}
</style>
