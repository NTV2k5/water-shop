<template>
  <div class="home">
    <h1 v-if="!loading && !error">Menu nước uống</h1>
    <div v-if="loading" class="text-center">Đang tải dữ liệu...</div>
    <div v-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-if="!loading && !error && filteredProducts.length > 0">
      <div class="grid-wrapper">
        <div class="grid">
          <ProductCard
            v-for="product in paginatedProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>

    <div
      v-if="!loading && !error && filteredProducts.length === 0"
      class="text-center"
    >
      Không có sản phẩm hoặc danh mục để hiển thị.
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import ProductCard from "./ProductCard.vue";

const store = useStore();
const route = useRoute();
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  loading.value = true;
  error.value = null;
  console.log("Bắt đầu tải dữ liệu từ store...");
  try {
    await store.dispatch("initializeData");
    console.log("Products từ store:", store.state.products);
    console.log("Product sizes từ store:", store.state.productSizes);
    console.log("Categories từ store:", store.state.categories);
  } catch (err) {
    error.value = "Lỗi khi tải dữ liệu. Vui lòng kiểm tra server.";
    console.error("Lỗi chi tiết:", err);
  } finally {
    loading.value = false;
  }
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
    map[cat.name] = filtered;
  }
  return map;
});

const allProducts = computed(() => {
  let all = [];
  for (const category in categorizedProducts.value) {
    all = all.concat(categorizedProducts.value[category]);
  }
  return [...new Set(all.map(p => p.id))].map(id => all.find(p => p.id === id));
});

const filteredProducts = computed(() => {
  const query = store.state.searchQuery.toLowerCase();
  const selectedCategory = route.query.category;
  let products = allProducts.value;

  if (selectedCategory) {
    products = products.filter(p => {
      const cat = store.state.categories.find(c => String(c.id) === String(p.category_id));
      return cat && cat.name === selectedCategory;
    });
  }

  return query ? products.filter(p => p.name.toLowerCase().includes(query)) : products;
});

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / 9));
const currentPage = computed(() => store.state.currentPage);
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * 9;
  const end = start + 9;
  return filteredProducts.value.slice(start, end);
});

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    store.commit('setCurrentPage', page);
  }
};

watch(() => route.query.category, () => {
  store.commit('setCurrentPage', 1); // Reset về trang 1 khi thay đổi danh mục
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
.grid-wrapper {
  display: flex;
  justify-content: center;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  grid-template-rows: auto;
}
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
.pagination button {
  padding: 5px 10px;
  cursor: pointer;
}

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
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }
}
</style>