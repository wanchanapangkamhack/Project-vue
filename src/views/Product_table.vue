<template>
  <div class="product-app-container py-5 min-vh-100">
    <div class="container">

      <!-- Header & Cart Bar -->
      <div class="d-flex justify-content-between align-items-center p-3 p-md-4 rounded-4 bg-dark-glass border border-secondary border-opacity-25 shadow-lg mb-5">
        <div class="d-flex align-items-center gap-3">
          <div class="brand-icon-box d-flex align-items-center justify-content-center rounded-3">
            <i class="bi bi-gem text-warning fs-4"></i>
          </div>
          <div>
            <h1 class="h5 fw-bold text-light mb-0 tracking-wide">LUXURY STORE</h1>
            <span class="micro-text text-secondary text-uppercase d-none d-sm-block">Inventory & Order System</span>
          </div>
        </div>

        <button 
          class="btn btn-cart-bar position-relative px-4 py-2 d-flex align-items-center gap-2 rounded-pill shadow-sm"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#cartOffcanvas"
        >
          <i class="bi bi-bag-fill fs-5"></i>
          <span class="d-none d-sm-inline fw-semibold">ตะกร้าสินค้า</span>
          <span v-if="totalCartItems > 0" class="badge rounded-pill bg-danger ms-1">
            {{ totalCartItems }}
          </span>
        </button>
      </div>

      <!-- Title Section -->
      <div class="text-center mb-5">
        <span class="badge category-badge px-3 py-2 text-uppercase mb-2">Management Panel</span>
        <h2 class="fw-bold text-light display-6 mb-2">ตารางรายการสินค้า</h2>
        <div class="divider mx-auto"></div>
      </div>

      <!-- Search, Filter & Action Bar -->
      <div class="row g-3 mb-4 justify-content-between align-items-center">
        <div class="col-12 col-md-5 col-lg-4">
          <div class="input-group">
            <span class="input-group-text bg-dark-glass border-secondary border-opacity-25 text-secondary">
              <i class="bi bi-search"></i>
            </span>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control bg-dark-glass text-light border-secondary border-opacity-25 shadow-none" 
              placeholder="ค้นหาตามชื่อสินค้า..."
            />
          </div>
        </div>

        <div class="col-12 col-md-auto d-flex align-items-center gap-3 ms-auto">
          <span class="text-secondary small d-none d-sm-inline">
            แสดงทั้งหมด <span class="text-warning fw-bold">{{ filteredProducts.length }}</span> รายการ
          </span>
          
          <!-- ปุ่มเพิ่มสินค้าใหม่ -->
          <button 
            @click="openAddModal" 
            class="btn btn-warning px-4 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2"
          >
            <i class="bi bi-plus-lg fs-6"></i>
            <span>เพิ่มสินค้าใหม่</span>
          </button>
        </div>
      </div>

      <!-- Table Section -->
      <div class="table-card rounded-4 border border-secondary border-opacity-25 overflow-hidden shadow-lg">
        <div class="table-responsive">
          <table class="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr class="table-header-row">
                <th width="70" class="text-center py-3">ID</th>
                <th width="100" class="text-center py-3">รูปภาพ</th>
                <th class="py-3">ชื่อสินค้า & หมวดหมู่</th>
                <th width="100" class="text-center py-3">เรตติ้ง</th>
                <th width="120" class="text-end py-3">ราคา</th>
                <th width="220" class="text-center py-3">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="isLoading">
                <td colspan="6" class="text-center py-5 text-secondary">
                  <div class="spinner-border text-warning mb-2" role="status"></div>
                  <p class="mb-0 small">กำลังโหลดข้อมูลสินค้า...</p>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="filteredProducts.length === 0">
                <td colspan="6" class="text-center py-5 text-secondary">
                  <i class="bi bi-inbox display-6 d-block mb-2 opacity-50"></i>
                  <span>ไม่พบข้อมูลสินค้าที่ตรงกัน</span>
                </td>
              </tr>

              <!-- Product Rows -->
              <tr v-else v-for="product in filteredProducts" :key="product.id" class="product-row">
                <td class="text-center fw-semibold text-secondary">
                  #{{ product.id }}
                </td>

                <td class="text-center">
                  <div class="img-box rounded-3 p-1 mx-auto">
                    <img
                      :src="product.thumbnail || 'https://via.placeholder.com/150'"
                      :alt="product.title"
                      class="product-img"
                    />
                  </div>
                </td>

                <td>
                  <div class="fw-semibold text-light mb-1">{{ product.title }}</div>
                  <span class="badge category-chip text-uppercase micro-text">
                    {{ product.category || 'General' }}
                  </span>
                </td>

                <td class="text-center">
                  <div class="rating-box small text-warning d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill bg-dark">
                    <i class="bi bi-star-fill"></i>
                    <span class="text-light fw-semibold">{{ product.rating || '0.0' }}</span>
                  </div>
                </td>

                <td class="text-end">
                  <span class="price-text fw-bold">${{ product.price }}</span>
                </td>

                <td class="text-center">
                  <div class="d-flex align-items-center justify-content-center gap-1">
                    <!-- ปุ่มเพิ่มเข้าตะกร้า -->
                    <button
                      type="button"
                      @click="addToCart(product)"
                      class="btn btn-add-cart btn-sm rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1"
                      title="ใส่ตะกร้า"
                    >
                      <i class="bi bi-bag-plus-fill"></i>
                      <span class="d-none d-xl-inline">สั่งซื้อ</span>
                    </button>

                    <!-- ปุ่มแก้ไข -->
                    <button
                      type="button"
                      @click="openEditModal(product)"
                      class="btn btn-outline-info btn-sm rounded-pill px-2.5 py-1"
                      title="แก้ไขข้อมูล"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>

                    <!-- ปุ่มลบ -->
                    <button
                      type="button"
                      @click="deleteProduct(product.id)"
                      class="btn btn-outline-danger btn-sm rounded-pill px-2.5 py-1"
                      title="ลบสินค้า"
                    >
                      <i class="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Modal เพิ่ม / แก้ไข สินค้า -->
    <div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-light border border-secondary border-opacity-25 shadow-lg">
          <div class="modal-header border-bottom border-secondary border-opacity-25">
            <h5 class="modal-title fw-bold text-warning d-flex align-items-center gap-2">
              <i :class="isEditMode ? 'bi bi-pencil-square' : 'bi bi-plus-circle'"></i>
              <span>{{ isEditMode ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่' }}</span>
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form @submit.prevent="saveProduct">
            <div class="modal-body p-4">
              <div class="mb-3">
                <label class="form-label text-secondary small">ชื่อสินค้า</label>
                <input v-model="form.title" type="text" class="form-control bg-dark-glass text-light border-secondary border-opacity-25 shadow-none" required placeholder="เช่น iPhone 15 Pro" />
              </div>
              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label class="form-label text-secondary small">ราคา ($)</label>
                  <input v-model.number="form.price" type="number" step="0.01" class="form-control bg-dark-glass text-light border-secondary border-opacity-25 shadow-none" required placeholder="0.00" />
                </div>
                <div class="col-6">
                  <label class="form-label text-secondary small">หมวดหมู่</label>
                  <input v-model="form.category" type="text" class="form-control bg-dark-glass text-light border-secondary border-opacity-25 shadow-none" placeholder="เช่น smartphones" />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label text-secondary small">URL รูปภาพสินค้า</label>
                <input v-model="form.thumbnail" type="url" class="form-control bg-dark-glass text-light border-secondary border-opacity-25 shadow-none" placeholder="https://example.com/image.png" />
              </div>
            </div>
            <div class="modal-footer border-top border-secondary border-opacity-25">
              <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">ยกเลิก</button>
              <button type="submit" class="btn btn-warning rounded-pill px-4 fw-bold">
                {{ isEditMode ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Offcanvas Cart Drawer -->
    <div class="offcanvas offcanvas-end bg-dark text-light border-start border-secondary border-opacity-25" tabindex="-1" id="cartOffcanvas">
      <div class="offcanvas-header border-bottom border-secondary border-opacity-25 p-4">
        <h5 class="offcanvas-title fw-bold d-flex align-items-center gap-2">
          <i class="bi bi-bag-check-fill text-warning"></i> ตะกร้าสินค้าของคุณ ({{ totalCartItems }})
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>

      <div class="offcanvas-body p-4">
        <div v-if="!cart.length" class="text-center py-5 text-secondary">
          <i class="bi bi-bag-x display-1 mb-3 opacity-50 d-block"></i>
          <p class="mb-0">ยังไม่มีสินค้าในตะกร้าของคุณ</p>
        </div>

        <div v-else class="d-flex flex-column gap-3">
          <div 
            v-for="item in cart" 
            :key="'cart-' + item.id" 
            class="cart-item-card p-3 rounded-3 d-flex gap-3 align-items-center bg-dark-glass border border-secondary border-opacity-25"
          >
            <img :src="item.thumbnail" :alt="item.title" class="cart-item-img rounded-2" />
            <div class="flex-grow-1">
              <h6 class="mb-1 text-light text-truncate" style="max-width: 140px;">{{ item.title }}</h6>
              <div class="text-warning fw-bold small">${{ item.price }}</div>
              
              <div class="d-flex align-items-center gap-2 mt-2">
                <button @click="updateQuantity(item.id, -1)" class="btn btn-sm btn-outline-secondary py-0 px-2">-</button>
                <span class="small fw-semibold">{{ item.quantity }}</span>
                <button @click="updateQuantity(item.id, 1)" class="btn btn-sm btn-outline-secondary py-0 px-2">+</button>
              </div>
            </div>

            <button @click="removeFromCart(item.id)" class="btn btn-link text-danger p-0 border-0 ms-auto">
              <i class="bi bi-trash3 fs-5"></i>
            </button>
          </div>
        </div>
      </div>

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
    const searchQuery = ref("");
    const isLoading = ref(true);

    // Modal Form State
    const isEditMode = ref(false);
    const form = ref({
      id: null,
      title: "",
      price: 0,
      category: "",
      thumbnail: "",
      rating: 5.0
    });

    let modalInstance = null;

    const fetchProducts = async () => {
      try {
        isLoading.value = true;
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        products.value = data.products;
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const filteredProducts = computed(() => {
      return products.value.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    // --- Product CRUD Actions ---
    const openAddModal = () => {
      isEditMode.value = false;
      form.value = { id: null, title: "", price: 0, category: "", thumbnail: "", rating: 5.0 };
      showModal();
    };

    const openEditModal = (product) => {
      isEditMode.value = true;
      form.value = { ...product };
      showModal();
    };

    const showModal = () => {
      if (!modalInstance && window.bootstrap) {
        modalInstance = new window.bootstrap.Modal(document.getElementById("productModal"));
      }
      modalInstance?.show();
    };

    const hideModal = () => {
      modalInstance?.hide();
    };

    const saveProduct = () => {
      if (isEditMode.value) {
        // อัปเดตสินค้าที่มีอยู่
        const index = products.value.findIndex((p) => p.id === form.value.id);
        if (index !== -1) {
          products.value[index] = { ...form.value };
        }
      } else {
        // เพิ่มสินค้าใหม่
        const newId = products.value.length ? Math.max(...products.value.map(p => p.id)) + 1 : 1;
        products.value.unshift({
          ...form.value,
          id: newId,
          thumbnail: form.value.thumbnail || 'https://via.placeholder.com/150'
        });
      }
      hideModal();
    };

    const deleteProduct = (id) => {
      if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?")) {
        products.value = products.value.filter((p) => p.id !== id);
        removeFromCart(id);
      }
    };

    // --- Cart Actions ---
    const addToCart = (product) => {
      const existing = cart.value.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        cart.value.push({ ...product, quantity: 1 });
      }
    };

    const updateQuantity = (id, amount) => {
      const item = cart.value.find((i) => i.id === id);
      if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) removeFromCart(id);
      }
    };

    const removeFromCart = (id) => {
      cart.value = cart.value.filter((i) => i.id !== id);
    };

    const totalCartItems = computed(() =>
      cart.value.reduce((total, item) => total + item.quantity, 0)
    );

    const totalPrice = computed(() =>
      cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
    );

    onMounted(() => {
      fetchProducts();
    });

    return {
      products,
      cart,
      searchQuery,
      isLoading,
      filteredProducts,
      isEditMode,
      form,
      openAddModal,
      openEditModal,
      saveProduct,
      deleteProduct,
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
.product-app-container {
  background: radial-gradient(circle at top, #1a1c23 0%, #0d0e12 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.bg-dark-glass {
  background: rgba(26, 29, 38, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.brand-icon-box {
  width: 42px;
  height: 42px;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #d4af37, #f3e5ab);
  border-radius: 2px;
}

.category-badge {
  background: rgba(212, 175, 55, 0.15);
  color: #d4af37;
  border: 1px solid rgba(212, 175, 55, 0.3);
  letter-spacing: 1px;
}

.table-card {
  background: rgba(26, 29, 38, 0.75);
  backdrop-filter: blur(12px);
}

.table-header-row {
  background-color: rgba(15, 17, 23, 0.9) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #d4af37;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.product-row {
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.product-row:hover {
  background-color: rgba(212, 175, 55, 0.05) !important;
}

.img-box {
  width: 50px;
  height: 50px;
  background: rgba(15, 17, 23, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.category-chip {
  background: rgba(255, 255, 255, 0.08);
  color: #a0a5b5;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.price-text, .gold-text-gradient {
  background: linear-gradient(135deg, #fff2a3 0%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.micro-text {
  font-size: 0.7rem;
}

.btn-add-cart {
  background: linear-gradient(135deg, #d4af37 0%, #997314 100%);
  color: #0d0e12;
  border: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-add-cart:hover {
  background: linear-gradient(135deg, #e5be48 0%, #b3881a 100%);
  color: #000;
}

.btn-cart-bar, .btn-checkout {
  background: linear-gradient(135deg, #d4af37 0%, #997314 100%);
  color: #0d0e12;
  border: none;
  transition: all 0.3s ease;
}

.cart-item-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  background: #111;
}
</style>