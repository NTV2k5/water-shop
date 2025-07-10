<template>
  <div class="card" @click="$router.push(`/product/${product.id}`)">
    <img :src="product.image" :alt="product.name" />
    <h3>{{ product.name }}</h3>
    <p>{{ product.description }}</p>
    <p class="price">{{ minPrice }}đ</p>
  </div>
</template>

<script>
export default {
  props: {
    product: Object
  },
  computed: {
    minPrice() {
      const sizes = this.$store.state.productSizes.filter(
        s => s.product_id === this.product.id
      );
      if (!sizes.length) return 0;
      return Math.min(...sizes.map(s => s.price));
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
  width: 100%; /* Linh hoạt theo container */
  max-width: 250px; /* Giới hạn tối đa */
  height: 300px; /* Chiều cao tự động */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card:hover {
  transform: translateY(-5px);
}

img {
  width: 100%;
  height: 180px; /* Giới hạn chiều cao hình ảnh để vừa với card */
  object-fit: cover;
  border-radius: 8px;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1.3rem; /* Điều chỉnh kích thước chữ nếu cần */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* Ngăn chặn chữ dài tràn ra ngoài */
}

p {
  margin: 0.3rem 0;
  font-size: 1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: wrap;
}

.price {
  color: #e91e63;
  font-weight: bold;
  margin-top: auto; /* Đẩy giá xuống dưới cùng */
  /* font-size: 1.2rem; */
}

/* Mobile */
@media (max-width: 767px) {
  .card {
    max-width: 100%;
  }
  img {
    height: 150px;
  }
  h3 {
    font-size: 1rem;
  }
  p {
    font-size: 0.8rem;
  }
}
</style>
