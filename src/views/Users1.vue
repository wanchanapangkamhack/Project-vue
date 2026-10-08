<template>
  <div class="user-app-container py-5 min-vh-100">
    <div class="container">

      <!-- Header Bar -->
      <div class="d-flex justify-content-between align-items-center p-3 p-md-4 rounded-4 bg-dark-glass border border-secondary border-opacity-25 shadow-lg mb-5">
        <div class="d-flex align-items-center gap-3">
          <div class="brand-icon-box d-flex align-items-center justify-content-center rounded-3">
            <i class="bi bi-people-fill text-warning fs-4"></i>
          </div>
          <div>
            <h1 class="h5 fw-bold text-light mb-0 tracking-wide">USER MANAGEMENT</h1>
            <span class="micro-text text-secondary text-uppercase d-none d-sm-block">Directory & Account Control</span>
          </div>
        </div>

        <button 
          @click="openAddModal" 
          class="btn btn-warning px-4 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2"
        >
          <i class="bi bi-person-plus-fill fs-6"></i>
          <span class="d-none d-sm-inline">เพิ่มผู้ใช้ใหม่</span>
        </button>
      </div>

      <!-- Title Section -->
      <div class="text-center mb-5">
        <span class="badge category-badge px-3 py-2 text-uppercase mb-2">Admin Panel</span>
        <h2 class="fw-bold text-light display-6 mb-2">รายชื่อผู้ใช้งานทั้งหมด</h2>
        <div class="divider mx-auto"></div>
      </div>

      <!-- Search & Filter Bar -->
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
              placeholder="ค้นหาด้วยชื่อ, อีเมล หรือเมือง..."
            />
          </div>
        </div>
        <div class="col-12 col-md-auto text-secondary small">
          แสดงทั้งหมด <span class="text-warning fw-bold">{{ filteredUsers.length }}</span> รายการ
        </div>
      </div>

      <!-- Table Section -->
      <div class="table-card rounded-4 border border-secondary border-opacity-25 overflow-hidden shadow-lg">
        <div class="table-responsive">
          <table class="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr class="table-header-row">
                <th width="70" class="text-center py-3">ID</th>
                <th class="py-3">ชื่อ - นามสกุล</th>
                <th class="py-3">อีเมล</th>
                <th class="py-3">ที่อยู่ (City / Street)</th>
                <th width="160" class="text-center py-3">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="isLoading">
                <td colspan="5" class="text-center py-5 text-secondary">
                  <div class="spinner-border text-warning mb-2" role="status"></div>
                  <p class="mb-0 small">กำลังโหลดข้อมูลผู้ใช้งาน...</p>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="filteredUsers.length === 0">
                <td colspan="5" class="text-center py-5 text-secondary">
                  <i class="bi bi-person-x display-6 d-block mb-2 opacity-50"></i>
                  <span>ไม่พบข้อมูลผู้ใช้งานที่ตรงกัน</span>
                </td>
              </tr>

              <!-- User Rows -->
              <tr v-else v-for="user in filteredUsers" :key="user.id" class="user-row">
                <td class="text-center fw-semibold text-secondary">
                  #{{ user.id }}
                </td>

                <td>
                  <div class="d-flex align-items-center gap-3">
                    <div class="avatar-box rounded-circle d-flex align-items-center justify-content-center text-warning fw-bold">
                      {{ user.name ? user.name.charAt(0) : 'U' }}
                    </div>
                    <div>
                      <div class="fw-semibold text-light">{{ user.name }}</div>
                      <span class="micro-text text-secondary">@{{ user.username || 'user' }}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <span class="text-info">{{ user.email }}</span>
                </td>

                <td>
                  <div class="small text-light mb-0.5">
                    <i class="bi bi-geo-alt text-warning me-1"></i>{{ user.address?.city || '-' }}
                  </div>
                  <span class="micro-text text-secondary d-block ps-3">
                    {{ user.address?.street || '-' }}
                  </span>
                </td>

                <td class="text-center">
                  <div class="d-flex align-items-center justify-content-center gap-1">
                    <!-- ปุ่มแก้ไข -->
                    <button
                      type="button"
                      @click="openEditModal(user)"
                      class="btn btn-outline-info btn-sm rounded-pill px-2.5 py-1"
                      title="แก้ไขข้อมูล"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>

                    <!-- ปุ่มลบ -->
                    <button
                      type="button"
                      @click="deleteUser(user.id)"
                      class="btn btn-outline-danger btn-sm rounded-pill px-2.5 py-1"
                      title="ลบผู้ใช้งาน"
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

    <!-- Modal เพิ่ม / แก้ไข ผู้ใช้งาน -->
    <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-light border border-secondary border-opacity-25 shadow-lg">
          <div class="modal-header border-bottom border-secondary border-opacity-25">
            <h5 class="modal-title fw-bold text-warning d-flex align-items-center gap-2">
              <i :class="isEditMode ? 'bi bi-pencil-square' : 'bi bi-person-plus'"></i>
              <span>{{ isEditMode ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้ใหม่' }}</span>
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form @submit.prevent="saveUser">
            <div class="modal-body p-4">
              <div class="mb-3">
                <label class="form-label text-secondary small">ชื่อ - นามสกุล</label>
                <input v-model="form.name" type="text" class="form-control bg-dark-glass text-light border-secondary border-opacity-25 shadow-none" required placeholder="เช่น John Doe" />
              </div>
              <div class="mb-3">
                <label class="form-label text-secondary small">อีเมล</label>
                <input v-model="form.email" type="email" class="form-control bg-dark-glass text-light border-secondary border-opacity-25 shadow-none" required placeholder="john@example.com" />
              </div>
              <div class="row g-3">
                <div class="col-6">
                  <label class="form-label text-secondary small">เมือง (City)</label>
                  <input v-model="form.address.city" type="text" class="form-control bg-dark-glass text-light border-secondary border-opacity-25 shadow-none" placeholder="เช่น Bangkok" />
                </div>
                <div class="col-6">
                  <label class="form-label text-secondary small">ถนน (Street)</label>
                  <input v-model="form.address.street" type="text" class="form-control bg-dark-glass text-light border-secondary border-opacity-25 shadow-none" placeholder="เช่น Sukhumvit Rd." />
                </div>
              </div>
            </div>
            <div class="modal-footer border-top border-secondary border-opacity-25">
              <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">ยกเลิก</button>
              <button type="submit" class="btn btn-warning rounded-pill px-4 fw-bold">
                {{ isEditMode ? 'บันทึกการแก้ไข' : 'เพิ่มผู้ใช้' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";

export default {
  setup() {
    const users = ref([]);
    const searchQuery = ref("");
    const isLoading = ref(true);

    // Modal Form State
    const isEditMode = ref(false);
    const form = ref({
      id: null,
      name: "",
      email: "",
      username: "",
      address: {
        city: "",
        street: ""
      }
    });

    let modalInstance = null;

    // ดึงข้อมูลผู้ใช้งานจาก API
    const fetchUsers = async () => {
      try {
        isLoading.value = true;
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        users.value = await response.json();
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        isLoading.value = false;
      }
    };

    // ค้นหาผู้ใช้งานจาก ชื่อ, อีเมล หรือ เมือง
    const filteredUsers = computed(() => {
      const q = searchQuery.value.toLowerCase();
      return users.value.filter((user) => 
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.address?.city?.toLowerCase().includes(q)
      );
    });

    // --- Actions ---
    const openAddModal = () => {
      isEditMode.value = false;
      form.value = {
        id: null,
        name: "",
        email: "",
        username: "",
        address: { city: "", street: "" }
      };
      showModal();
    };

    const openEditModal = (user) => {
      isEditMode.value = true;
      form.value = {
        ...user,
        address: {
          city: user.address?.city || "",
          street: user.address?.street || ""
        }
      };
      showModal();
    };

    const showModal = () => {
      if (!modalInstance && window.bootstrap) {
        modalInstance = new window.bootstrap.Modal(document.getElementById("userModal"));
      }
      modalInstance?.show();
    };

    const hideModal = () => {
      modalInstance?.hide();
    };

    const saveUser = () => {
      if (isEditMode.value) {
        const index = users.value.findIndex((u) => u.id === form.value.id);
        if (index !== -1) {
          users.value[index] = { ...form.value };
        }
      } else {
        const newId = users.value.length ? Math.max(...users.value.map(u => u.id)) + 1 : 1;
        users.value.unshift({
          ...form.value,
          id: newId,
          username: form.value.name.toLowerCase().replace(/\s+/g, '')
        });
      }
      hideModal();
    };

    const deleteUser = (id) => {
      if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้?")) {
        users.value = users.value.filter((u) => u.id !== id);
      }
    };

    onMounted(fetchUsers);

    return {
      users,
      searchQuery,
      isLoading,
      filteredUsers,
      isEditMode,
      form,
      openAddModal,
      openEditModal,
      saveUser,
      deleteUser,
    };
  },
};
</script>

<style scoped>
.user-app-container {
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

.avatar-box {
  width: 38px;
  height: 38px;
  background: rgba(212, 175, 55, 0.15);
  border: 1px solid rgba(212, 175, 55, 0.3);
  font-size: 0.95rem;
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

.user-row {
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.user-row:hover {
  background-color: rgba(212, 175, 55, 0.05) !important;
}

.micro-text {
  font-size: 0.7rem;
}
</style>