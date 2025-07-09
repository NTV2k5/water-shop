<template>
  <div class="card" @click="$router.push(`/product/${product.id}`)">
    <img :src="product.image" :alt="product.name" />
    <h3>{{ product.name }}</h3>
    <p>{{ product.description }}</p>
    <p class="price">Từ {{ minPrice }}đ</p>
  </div>
</template>

<script>
export default {
  props: {
    product: Object
  },
  computed: {
    minPrice() {
      return Math.min(...Object.values(this.product.sizes));
    }
  }
}
</script>


<style scoped>
.card {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  cursor: pointer;
}
.card:hover {
  transform: translateY(-5px);
}
img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
}
h3 {
  margin: 0.5rem 0;
}
.price {
  color: #e91e63;
  font-weight: bold;
}
</style>
