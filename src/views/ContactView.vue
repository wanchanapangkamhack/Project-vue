<template>
  <div class="auth-app-container d-flex align-items-center justify-content-center min-vh-100 p-3">
    <div class="card auth-card text-center p-4 p-md-5 border-0 position-relative overflow-hidden">
      
      <!-- แสง Background Glow เคลื่อนไหวตามสถานะ -->
      <div class="bg-glow" :class="{ 'glow-active': isLoggedIn }"></div>

      <div class="card-body position-relative z-1 p-0">
        
        <!-- Icon / Avatar ส่วนหัว -->
        <div class="avatar-container mb-4 mx-auto d-flex align-items-center justify-content-center" :class="{ 'avatar-active': isLoggedIn }">
          <i v-if="isLoggedIn" class="bi bi-person-check-fill fs-1 text-gold"></i>
          <i v-else class="bi bi-shield-lock-fill fs-1 text-secondary"></i>
        </div>

        <!-- ข้อความต้อนรับ -->
        <transition name="fade" mode="out-in">
          <div v-if="isLoggedIn" key="welcome" class="mb-4">
            <span class="badge status-badge badge-success mb-2 px-3 py-2">
              <i class="bi bi-circle-fill me-1"></i> ออนไลน์
            </span>
            <h1 class="fw-bold gold-text-gradient mb-2">ยินดีต้อนรับกลับมา!</h1>
            <p class="text-secondary small">เข้าสู่ระบบสำเร็จ พร้อมใช้งานฟีเจอร์ระดับพรีเมียมแล้ว</p>
          </div>

          <div v-else key="login" class="mb-4">
            <span class="badge status-badge badge-secondary mb-2 px-3 py-2">
              <i class="bi bi-lock-fill me-1"></i> ปลอดภัย
            </span>
            <h1 class="fw-bold text-light mb-2">กรุณาเข้าสู่ระบบ</h1>
            <p class="text-secondary small">เข้าสู่ระบบเพื่อเข้าถึงแดชบอร์ดและข้อมูลของคุณ</p>
          </div>
        </transition>

        <!-- เส้นแบ่งดีไซน์หรู -->
        <div class="divider mx-auto mb-4"></div>

        <!-- ปุ่มเข้าสู่ระบบ / ออกจากระบบ -->
        <button 
          @click="toggleLogin" 
          class="btn btn-luxury btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-3"
          :class="isLoggedIn ? 'btn-logout' : 'btn-login'"
        >
          <i :class="isLoggedIn ? 'bi bi-box-arrow-right' : 'bi bi-shield-lock'"></i>
          <span>{{ isLoggedIn ? 'ออกจากระบบ' : 'เข้าสู่ระบบ' }}</span>
        </button>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false, // ตัวแปรเก็บสถานะการเข้าสู่ระบบ
    };
  },
  methods: {
    toggleLogin() {
      this.isLoggedIn = !this.isLoggedIn;
    },
  },
};
</script>

<style scoped>
/* คอนเทนเนอร์หลัก */
.auth-app-container {
  background: radial-gradient(circle at center, #191b22 0%, #0a0b0e 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* การ์ดสไตล์ Glassmorphism */
.auth-card {
  max-width: 440px;
  width: 100%;
  background: rgba(22, 25, 34, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
}

/* รัศมีแสงสีด้านหลัง */
.bg-glow {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(100, 110, 140, 0.2) 0%, rgba(0, 0, 0, 0) 70%);
  filter: blur(40px);
  transition: all 0.6s ease;
  pointer-events: none;
}

.bg-glow.glow-active {
  background: radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(0, 0, 0, 0) 70%);
}

/* กล่อง Icon / Avatar */
.avatar-container {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.avatar-active {
  background: rgba(212, 175, 55, 0.1);
  border-color: rgba(212, 175, 55, 0.4);
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.2);
  transform: scale(1.05);
}

/* ตัวหนังสือสีทอง Gradient */
.gold-text-gradient {
  background: linear-gradient(135deg, #fff2a3 0%, #d4af37 50%, #aa7c11 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gold {
  color: #d4af37;
}

/* เส้นแบ่ง */
.divider {
  width: 50px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

/* Badge สถานะ */
.status-badge {
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.75rem;
}

.badge-success {
  background: rgba(46, 204, 113, 0.15);
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.badge-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #a0a0a0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* ปุ่มสไตล์ Luxury */
.btn-luxury {
  border: none;
  border-radius: 16px;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

/* ปุ่มเข้าสู่ระบบ (สีทอง Gradient) */
.btn-login {
  background: linear-gradient(135deg, #d4af37 0%, #997314 100%);
  color: #0d0e12;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.btn-login:hover {
  background: linear-gradient(135deg, #e5be48 0%, #b3881a 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(212, 175, 55, 0.45);
  color: #000;
}

/* ปุ่มออกจากระบบ (สีกราไฟต์ขอบแดง) */
.btn-logout {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3) !important;
  color: #ff6b6b;
}

.btn-logout:hover {
  background: #dc3545;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
}

.btn-luxury:active {
  transform: translateY(0);
}

/* Vue Transitions */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>