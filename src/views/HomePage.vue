<template>
  <div class="home">
    <h2>🥤 Menu nước uống</h2>

    <div v-for="(group, category) in visibleCategories" :key="category" class="category-section">
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
  for (const product of store.state.products) {
    if (!map[product.category]) {
      map[product.category] = [];
    }
    map[product.category].push(product);
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
</script>

<style scoped>
h2{
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
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1000px;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
}
h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.5rem;
}
</style>
