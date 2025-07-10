<template>
  <div class="home" v-if="Object.keys(visibleCategories).length > 0">
    <h1>🥤 Menu nước uống</h1>

    <div
      v-for="(group, category) in visibleCategories"
      :key="category"
      class="category-section"
    >
      <h3>{{ category }}</h3>
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
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import ProductCard from "../components/ProductCard.vue";

const store = useStore();
const route = useRoute();

// Tạo dữ liệu nhóm theo category
const categorizedProducts = computed(() => {
  const map = {};
  const categories = store.state.categories;

  for (const cat of categories) {
    map[cat.name] = store.state.products.filter(
      (p) => p.category_id === cat.id
    );
  }

  return map;
});

// Nếu có query category → chỉ trả về nhóm đó
const visibleCategories = computed(() => {
  const selected = route.query.category;
  if (selected) {
    return { [selected]: categorizedProducts.value[selected] || [] };
  }
  return categorizedProducts.value;
});

console.log("All products: ", store.state.products);
console.log("Categories: ", store.state.categories);
console.log("Danh sách sau phân loại: ", categorizedProducts.value);
</script>

<style scoped>
h2 {
  font-size: 30px;
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

h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}
h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.5rem;
}

/* Mobile (dưới 768px) */
@media (max-width: 767px) {
  .grid {
    grid-template-columns: 1fr; /* 1 cột trên mobile */
  }
  h1 {
    font-size: 1.5rem;
  }
}

/* Tablet (768px - 1024px) */
@media (min-width: 768px) and (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}
</style>
