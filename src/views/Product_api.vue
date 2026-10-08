<template>
  <div class="product-app-container py-5 min-vh-100 position-relative">
    
    <!-- Navbar / Header Bar ด้านบนสำหรับแสดงตะกร้าสินค้า -->
    <div class="container mb-4">
      <div class="d-flex justify-content-between align-items-center p-3 rounded-4 bg-dark-glass border border-secondary border-opacity-25">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-gem text-warning fs-4"></i>
          <span class="fw-bold text-light fs-5">LUXURY STORE</span>
        </div>
        
        <!-- ปุ่มเปิดตะกร้าสินค้า -->
        <button 
          class="btn btn-cart-bar position-relative px-4 py-2 d-flex align-items-center gap-2 rounded-pill"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#cartOffcanvas"
        >
          <i class="bi bi-bag-fill fs-5"></i>
          <span class="d-none d-sm-inline fw-semibold">ตะกร้าสินค้า</span>
          <span 
            v-if="totalCartItems > 0" 
            class="badge rounded-pill bg-danger ms-1 cart-count-badge"
          >
            {{ totalCartItems }}
          </span>
        </button>
      </div>
    </div>

    <div class="container">
      
      <!-- ส่วนหัว Header -->
      <div class="text-center mb-5">
        <span class="badge category-badge px-3 py-2 text-uppercase mb-2">Exclusive Collection</span>
        <h2 class="fw-bold text-light display-5 mb-2">สินค้ายอดนิยม</h2>
        <div class="divider mx-auto"></div>
      </div>

      <!-- รายการสินค้า Grid -->
      <div class="row g-4">
        <div 
          class="col-12 col-sm-6 col-lg-3" 
          v-for="product in products" 
          :key="product.id"
        >
          <div class="card product-card h-100 border-0 overflow-hidden position-relative">
            
            <!-- Badge ส่วนลด -->
            <div class="position-absolute top-0 start-0 m-3 z-2">
              <span class="badge discount-badge px-2.5 py-1.5" v-if="product.discountPercentage">
                -{{ Math.round(product.discountPercentage) }}%
              </span>
            </div>

            <!-- กรอบรูปภาพสินค้า -->
            <div class="img-wrapper position-relative overflow-hidden">
              <img
                :src="product.thumbnail"
                class="card-img-top product-img"
                :alt="product.title"
              />
              <div class="img-overlay d-flex align-items-center justify-content-center">
                <button @click="addToCart(product)" class="btn view-text fw-medium">
                  <i class="bi bi-plus-lg me-1"></i>เพิ่มลงตะกร้า
                </button>
              </div>
            </div>

            <!-- รายละเอียดสินค้า -->
            <div class="card-body d-flex flex-column p-4">
              <!-- Rating & Brand -->
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="brand-text text-uppercase small">{{ product.brand || 'Premium' }}</span>
                <div class="rating-box small text-warning d-flex align-items-center gap-1">
                  <i class="bi bi-star-fill"></i>
                  <span class="text-light fw-semibold">{{ product.rating }}</span>
                </div>
              </div>

              <!-- ชื่อสินค้า -->
              <h5 class="card-title product-title text-light mb-3" :title="product.title">
                {{ product.title }}
              </h5>

              <!-- ส่วนราคาและปุ่ม Add To Cart -->
              <div class="mt-auto pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
                <div>
                  <span class="text-secondary micro-text d-block">ราคา</span>
                  <span class="price-text fw-bold">${{ product.price }}</span>
                </div>
                
                <!-- ปุ่ม Add To Cart -->
                <button 
                  type="button" 
                  @click="addToCart(product)"
                  class="btn btn-add-cart rounded-circle d-flex align-items-center justify-content-center"
                  title="เพิ่มลงตะกร้า"
                >
                  <i class="bi bi-bag-plus-fill fs-5"></i>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Offcanvas ตะกร้าสินค้า -->
<div class="offcanvas offcanvas-end bg-dark text-light border-start border-secondary border-opacity-25" tabindex="-1" id="cartOffcanvas">
  <div class="offcanvas-header border-bottom border-secondary border-opacity-25 p-4">
    <h5 class="offcanvas-title fw-bold d-flex align-items-center gap-2">
      <i class="bi bi-bag-check-fill text-warning"></i> ตะกร้าสินค้าของคุณ ({{ totalCartItems }})
    </h5>
    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>

  <div class="offcanvas-body p-4">
    <!-- กรณีตะกร้าว่างเปล่า -->
    <div v-if="!cart.length" class="text-center py-5 text-secondary">
      <i class="bi bi-bag-x display-1 mb-3 opacity-50 d-block"></i>
      <p class="mb-0">ยังไม่มีสินค้าในตะกร้าของคุณ</p>
    </div>

        <!-- รายการสินค้าในตะกร้า -->
        <div v-else class="d-flex flex-column gap-3">
          <div 
            v-for="item in cart" 
            :key="'cart-' + item.id" 
            class="cart-item-card p-3 rounded-3 d-flex gap-3 align-items-center bg-dark-glass border border-secondary border-opacity-25"
          >
            <img :src="item.thumbnail" :alt="item.title" class="cart-item-img rounded-2" />
            <div class="flex-grow-1">
              <h6 class="mb-1 text-light text-truncate" style="max-width: 150px;">{{ item.title }}</h6>
              <div class="text-warning fw-bold small">${{ item.price }}</div>
              
              <!-- ปุ่มปรับจำนวนสินค้า -->
              <div class="d-flex align-items-center gap-2 mt-2">
                <button @click="updateQuantity(item.id, -1)" class="btn btn-sm btn-outline-secondary py-0 px-2">-</button>
                <span class="small fw-semibold">{{ item.quantity }}</span>
                <button @click="updateQuantity(item.id, 1)" class="btn btn-sm btn-outline-secondary py-0 px-2">+</button>
              </div>
            </div>

            <!-- ปุ่มลบรายการ -->
            <button @click="removeFromCart(item.id)" class="btn btn-link text-danger p-0 border-0 ms-auto">
              <i class="bi bi-trash3 fs-5"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- สรุปราคารวมและปุ่มชำระเงิน -->
      <div v-if="cart.length > 0" class="offcanvas-footer p-4 border-top border-secondary border-opacity-25">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-secondary">ราคารวมทั้งหมด:</span>
          <span class="fs-4 fw-bold gold-text-gradient">${{ totalPrice.toFixed(2) }}</span>
        </div>
        <button class="btn btn-checkout w-100 py-3 fw-bold rounded-3">
          ดำเนินการชำระเงิน
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";

export default {
  setup() {
    const products = ref([]);
    const cart = ref([]);

    // ดึงข้อมูลสินค้า
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        products.value = data.products;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    // เพิ่มสินค้าลงตะกร้า
    const addToCart = (product) => {
      const existingItem = cart.value.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.value.push({
          ...product,
          quantity: 1,
        });
      }
    };

    // ปรับจำนวนสินค้า
    const updateQuantity = (productId, amount) => {
      const item = cart.value.find((item) => item.id === productId);
      if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) {
          removeFromCart(productId);
        }
      }
    };

    // ลบสินค้าออกจากตะกร้า
    const removeFromCart = (productId) => {
      cart.value = cart.value.filter((item) => item.id !== productId);
    };

    // คำนวณจำนวนสินค้ารวมในตะกร้า
    const totalCartItems = computed(() => {
      return cart.value.reduce((total, item) => total + item.quantity, 0);
    });

    // คำนวณราคารวมทั้งหมด
    const totalPrice = computed(() => {
      return cart.value.reduce((total, item) => total + item.price * item.quantity, 0);
    });

    onMounted(fetchProducts);

    return {
      products,
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      totalCartItems,
      totalPrice,
    };
  },
};
</script>

<style scoped>
/* คอนเทนเนอร์หลักธีม Dark Luxury */
.product-app-container {
  background: radial-gradient(circle at top, #1c1f26 0%, #0d0e12 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Glassmorphism Dark background */
.bg-dark-glass {
  background: rgba(26, 29, 38, 0.65);
  backdrop-filter: blur(10px);
}

/* เส้นขีดตกแต่ง */
.divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #d4af37, #f3e5ab);
  border-radius: 2px;
}

/* Badge ด้านบน */
.category-badge {
  background: rgba(212, 175, 55, 0.15);
  color: #d4af37;
  border: 1px solid rgba(212, 175, 55, 0.3);
  letter-spacing: 1px;
}

.discount-badge {
  background: #dc3545;
  color: #ffffff;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3);
}

/* การ์ดสินค้าสไตล์ Glassmorphism */
.product-card {
  background: rgba(26, 29, 38, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 20px;
  transition: all 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.product-card:hover {
  transform: translateY(-8px);
  border-color: rgba(212, 175, 55, 0.4) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.1);
}

/* การจัดการรูปภาพสินค้า */
.img-wrapper {
  background: rgba(15, 17, 23, 0.6);
  height: 220px;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
  transition: transform 0.5s ease;
}

.product-card:hover .product-img {
  transform: scale(1.08);
}

/* Overlay สวยงามขณะ Hover */
.img-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(13, 14, 18, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.view-text {
  color: #ffffff;
  background: rgba(212, 175, 55, 0.3);
  backdrop-filter: blur(8px);
  padding: 8px 18px;
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.5);
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.view-text:hover {
  background: rgba(212, 175, 55, 0.6);
  color: #fff;
}

.product-card:hover .img-overlay {
  opacity: 1;
}

/* รายละเอียดตัวหนังสือ */
.brand-text {
  color: #8a8d9b;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.product-title {
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.8em;
}

.price-text {
  font-size: 1.35rem;
  background: linear-gradient(135deg, #fff2a3 0%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gold-text-gradient {
  background: linear-gradient(135deg, #fff2a3 0%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.micro-text {
  font-size: 0.75rem;
}

/* ปุ่มเพิ่มลงตระกร้า */
.btn-add-cart {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #d4af37 0%, #997314 100%);
  color: #0d0e12;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.25);
}

.btn-add-cart:hover {
  background: linear-gradient(135deg, #e5be48 0%, #b3881a 100%);
  transform: scale(1.1);
  box-shadow: 0 6px 18px rgba(212, 175, 55, 0.4);
  color: #000;
}

.btn-add-cart:active {
  transform: scale(0.95);
}

/* ปุ่มตระกร้าสินค้าด้านบน Navbar */
.btn-cart-bar {
  background: linear-gradient(135deg, #d4af37 0%, #997314 100%);
  color: #0d0e12;
  border: none;
  transition: all 0.3s ease;
}

.btn-cart-bar:hover {
  background: linear-gradient(135deg, #e5be48 0%, #b3881a 100%);
  color: #000;
  transform: translateY(-2px);
}

.cart-item-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  background: #111;
}

/* ปุ่มชำระเงิน */
.btn-checkout {
  background: linear-gradient(135deg, #d4af37 0%, #997314 100%);
  color: #0d0e12;
  border: none;
  transition: all 0.3s ease;
}

.btn-checkout:hover {
  background: linear-gradient(135deg, #e5be48 0%, #b3881a 100%);
  color: #000;
}
</style>