<template>
  <div class="gold-app-container d-flex align-items-center justify-content-center min-vh-100 py-5 px-3">
    <div class="card gold-card p-4 p-md-5 border-0 position-relative overflow-hidden w-100">
      
      <!-- เอฟเฟกต์แสง Background Gold Glow -->
      <div class="gold-glow"></div>

      <div class="card-body position-relative z-1 p-0">
        
        <!-- ส่วนหัวข้อหลัก -->
        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mb-4">
          <div class="d-flex align-items-center gap-3">
            <div class="gold-icon-box d-flex align-items-center justify-content-center">
              <i class="bi bi-coin fs-2"></i>
            </div>
            <div>
              <h2 class="fw-bold gold-text-gradient mb-0">ราคาทองวันนี้</h2>
              <p class="text-secondary small mb-0" v-if="lastUpdated">
                <i class="bi bi-clock-history me-1"></i> อัปเดตล่าสุด: {{ lastUpdated }}
              </p>
            </div>
          </div>

          <!-- ปุ่มกดดึงข้อมูลใหม่ -->
          <button 
            class="btn btn-gold-action d-flex align-items-center gap-2 fw-semibold px-4 py-2" 
            @click="fetchGold"
            :disabled="isLoading"
          >
            <i class="bi bi-arrow-repeat fs-5" :class="{ 'spin-anim': isLoading }"></i>
            <span>{{ isLoading ? 'กำลังอัปเดต...' : 'อัปเดตราคา' }}</span>
          </button>
        </div>

        <!-- แสดงข้อความ Error หากโหลด API ไม่สำเร็จ -->
        <div v-if="errorMessage" class="alert alert-custom-danger py-2 px-3 mb-4 d-flex align-items-center gap-2">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Stat Cards สรุปราคาทอง -->
        <div class="row g-3 mb-4" v-if="golds.length > 0">
          <div class="col-12 col-md-6" v-for="item in golds" :key="'card-' + item.name">
            <div class="stat-card p-3 rounded-4 border">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-light fw-bold fs-6">{{ item.name }}</span>
                <span class="badge gold-badge px-2 py-1 fs-7">Realtime</span>
              </div>
              <div class="row text-center g-2 mt-1">
                <div class="col-6">
                  <div class="price-box p-2 rounded-3">
                    <span class="text-secondary d-block micro-text mb-1">รับซื้อ</span>
                    <span class="fs-5 fw-bold text-success">{{ formatNumber(item.buy) }}</span>
                    <span class="text-secondary micro-text ms-1">บาท</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="price-box p-2 rounded-3">
                    <span class="text-secondary d-block micro-text mb-1">ขายออก</span>
                    <span class="fs-5 fw-bold text-danger">{{ formatNumber(item.sell) }}</span>
                    <span class="text-secondary micro-text ms-1">บาท</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ตารางแสดงข้อมูลรายละเอียด -->
        <div class="table-responsive rounded-4 overflow-hidden border border-secondary border-opacity-25 shadow-sm">
          <table class="table gold-table text-center align-middle mb-0">
            <thead>
              <tr>
                <th scope="col" class="py-3 text-start ps-4">ประเภททอง</th>
                <th scope="col" class="py-3">ราคารับซื้อ (บาท)</th>
                <th scope="col" class="py-3">ราคาขายออก (บาท)</th>
                <th scope="col" class="py-3 pe-4">ส่วนต่าง</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading && golds.length === 0">
                <td colspan="4" class="py-5 text-secondary">
                  <div class="spinner-border text-warning mb-2" role="status"></div>
                  <div>กำลังดึงข้อมูลราคาทอง...</div>
                </td>
              </tr>
              <tr v-for="item in golds" :key="item.name" class="gold-row">
                <!-- ชื่อประเภททอง -->
                <td class="text-start ps-4 fw-semibold text-light">
                  <i class="bi bi-shield-fill-check text-warning me-2"></i>
                  {{ item.name }}
                </td>

                <!-- ราคารับซื้อ -->
                <td class="fw-bold text-success fs-5">
                  {{ formatNumber(item.buy) }}
                </td>

                <!-- ราคาขายออก -->
                <td class="fw-bold text-danger fs-5">
                  {{ formatNumber(item.sell) }}
                </td>

                <!-- ส่วนต่าง (Sell - Buy) -->
                <td class="pe-4 text-secondary">
                  +{{ formatNumber(item.sell - item.buy) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const golds = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const lastUpdated = ref('')

// ฟังก์ชันดึงข้อมูล API
const fetchGold = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const res = await fetch('https://api.chnwt.dev/thai-gold-api/latest')
    if (!res.ok) throw new Error('ไม่สามารถเชื่อมต่อ API ได้')

    const data = await res.json()
    const price = data.response.price

    // ดึงเวลาอัปเดตจาก API (ถ้ามี) หรือใช้เวลาปัจจุบัน
    lastUpdated.value = data.response.date ? `${data.response.date} (${data.response.update_time || ''})` : new Date().toLocaleTimeString('th-TH')

    golds.value = [
      {
        name: "ทองคำแท่ง",
        buy: parseFloat(price.gold_bar.buy.replace(/,/g, "")),
        sell: parseFloat(price.gold_bar.sell.replace(/,/g, ""))
      },
      {
        name: "ทองรูปพรรณ",
        buy: parseFloat(price.gold.buy.replace(/,/g, "")),
        sell: parseFloat(price.gold.sell.replace(/,/g, ""))
      }
    ]
  } catch (error) {
    console.error("โหลดข้อมูลผิดพลาด:", error)
    errorMessage.value = "ไม่สามารถอัปเดตราคาทองได้ กรุณาลองใหม่อีกครั้ง"
  } finally {
    isLoading.value = false
  }
}

// ฟังก์ชัน format ตัวเลขให้มี comma
const formatNumber = (num) => {
  if (isNaN(num)) return '0'
  return num.toLocaleString()
}

onMounted(fetchGold)
</script>

<style scoped>
/* คอนเทนเนอร์หลัก */
.gold-app-container {
  background: radial-gradient(circle at center, #18191d 0%, #0a0a0c 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* การ์ดหลักสไตล์ Glassmorphism */
.gold-card {
  max-width: 820px;
  background: rgba(22, 24, 30, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 28px;
  border: 1px solid rgba(212, 175, 55, 0.2) !important;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.7);
}

/* แสงรัศมีสีทองด้านหลัง */
.gold-glow {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, rgba(0, 0, 0, 0) 70%);
  filter: blur(40px);
  pointer-events: none;
}

/* ข้อความสีทอง Gradient */
.gold-text-gradient {
  background: linear-gradient(135deg, #fff2a3 0%, #d4af37 50%, #aa7c11 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* กล่องไอคอนส่วนหัว */
.gold-icon-box {
  width: 54px;
  height: 54px;
  background: linear-gradient(135deg, #d4af37, #8a640f);
  color: #121316;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

/* ปุ่มกดอัปเดต */
.btn-gold-action {
  background: linear-gradient(135deg, #d4af37 0%, #997314 100%);
  color: #000;
  border: none;
  border-radius: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 18px rgba(212, 175, 55, 0.25);
}

.btn-gold-action:hover:not(:disabled) {
  background: linear-gradient(135deg, #e5be48 0%, #b3881a 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.4);
  color: #000;
}

.btn-gold-action:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Stat Cards สรุปข้อมูล */
.stat-card {
  background: rgba(14, 15, 19, 0.6);
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.price-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.gold-badge {
  background: rgba(212, 175, 55, 0.15);
  color: #d4af37;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 20px;
}

/* ตารางแสดงผล */
.gold-table {
  background: transparent;
  color: #e0e0e0;
}

.gold-table thead {
  background: rgba(10, 11, 14, 0.9);
  color: #a0a0a0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.gold-table tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.2s ease;
}

.gold-table tbody tr:hover {
  background: rgba(212, 175, 55, 0.04);
}

.gold-table tbody tr:last-child {
  border-bottom: none;
}

/* แจ้งเตือนข้อผิดพลาด */
.alert-custom-danger {
  background: rgba(220, 53, 69, 0.15);
  border: 1px solid rgba(220, 53, 69, 0.3);
  color: #ff6b6b;
  border-radius: 12px;
  font-size: 0.9rem;
}

/* Utility classes */
.micro-text {
  font-size: 0.75rem;
}

.fs-7 {
  font-size: 0.75rem;
}

/* Animation ไอคอนหมุน */
.spin-anim {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>