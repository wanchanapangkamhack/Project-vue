<template>
  <div class="grade-app-container d-flex align-items-center justify-content-center min-vh-100 p-3">
    <div class="card grade-card text-center p-4 p-md-5 border-0 position-relative overflow-hidden">
      <!-- เอฟเฟกต์แสง Background Glow -->
      <div class="bg-glow"></div>

      <div class="card-body position-relative z-1">
        <!-- ไอคอนหัวข้อ -->
        <div class="icon-box mb-3 mx-auto d-flex align-items-center justify-content-center">
          <i class="bi bi-trophy-fill fs-2"></i>
        </div>
        
        <h2 class="fw-bold text-uppercase text-light tracking-wide mb-1">ระบบตัดเกรด</h2>
        <p class="text-secondary small mb-4">ระบุคะแนนของคุณเพื่อประเมินผลการเรียน</p>

        <!-- ฟอร์มกรอกคะแนน -->
        <div class="mb-4 text-start">
          <label for="scoreInput" class="form-label text-light fs-6 fw-medium mb-2">
            คะแนนที่ได้ <span class="text-secondary fs-7">(0 - 100)</span>
          </label>
          <div class="input-group">
            <span class="input-group-text bg-dark border-secondary text-secondary">
              <i class="bi bi-pencil-square"></i>
            </span>
            <input 
              type="text" 
              id="scoreInput"
              inputmode="numeric"
              :value="score"
              class="form-control form-control-lg bg-dark text-light border-secondary custom-input" 
              placeholder="กรอกคะแนนที่นี่..."
              @input="onInput"
              @keyup.enter="calculateGrade"
            />
          </div>
        </div>

        <!-- ปุ่มคำนวณเกรด -->
        <button 
          @click="calculateGrade" 
          class="btn btn-gradient-red btn-lg w-100 fw-bold shadow-sm mb-3 d-flex align-items-center justify-content-center gap-2"
        >
          <i class="bi bi-calculator"></i>
          <span>คำนวณเกรด</span>
        </button>

        <!-- ข้อความแจ้งเตือนความผิดพลาด -->
        <transition name="fade">
          <div v-if="errorMessage" class="alert alert-custom-danger py-2 px-3 mt-3 d-flex align-items-center justify-content-center gap-2" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <span>{{ errorMessage }}</span>
          </div>
        </transition>

        <!-- ผลลัพธ์เกรด -->
        <transition name="scale">
          <div v-if="grade !== ''" class="result-card mt-4 p-4 rounded-4 position-relative">
            <p class="text-uppercase tracking-wider text-secondary small fw-semibold mb-1">ผลการประเมิน</p>
            
            <div class="grade-display my-2" :class="gradeColorClass">
              {{ grade }}
            </div>

            <span class="badge rounded-pill px-3 py-2 fs-6 mb-3" :class="badgeClass">
              {{ gradeStatusText }}
            </span>

            <!-- แถบ Progress แสดงสัดส่วนคะแนน -->
            <div class="progress mt-2" style="height: 6px; background-color: rgba(255, 255, 255, 0.1);">
              <div 
                class="progress-bar progress-bar-striped progress-bar-animated" 
                role="progressbar" 
                :style="{ width: score + '%' }"
                :class="progressBarClass"
              ></div>
            </div>
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      score: '',      // ค่าคะแนน
      grade: '',      // ผลลัพธ์เกรด
      errorMessage: '' // ข้อความแจ้งเตือน
    }
  },
  computed: {
    // กำหนดสีตัวอักษรเกรด
    gradeColorClass() {
      switch (this.grade) {
        case 'A': return 'color-a';
        case 'B': return 'color-b';
        case 'C': return 'color-c';
        case 'D': return 'color-d';
        case 'F': return 'color-f';
        default: return 'text-light';
      }
    },
    // กำหนดสี Badge
    badgeClass() {
      switch (this.grade) {
        case 'A': return 'bg-success text-white';
        case 'B': return 'bg-info text-dark';
        case 'C': return 'bg-warning text-dark';
        case 'D': return 'bg-primary text-white';
        case 'F': return 'bg-danger text-white';
        default: return 'bg-secondary text-white';
      }
    },
    // กำหนดสี Progress Bar
    progressBarClass() {
      switch (this.grade) {
        case 'A': return 'bg-success';
        case 'B': return 'bg-info';
        case 'C': return 'bg-warning';
        case 'D': return 'bg-primary';
        case 'F': return 'bg-danger';
        default: return 'bg-secondary';
      }
    },
    // ข้อความอธิบายระดับเกรด
    gradeStatusText() {
      switch (this.grade) {
        case 'A': return 'ดีเยี่ยม (Excellent)';
        case 'B': return 'ดีมาก (Very Good)';
        case 'C': return 'ดี (Good)';
        case 'D': return 'ผ่านเกณฑ์ (Pass)';
        case 'F': return 'ไม่ผ่านเกณฑ์ (Fail)';
        default: return '';
      }
    }
  },
  methods: {
    // จัดการการพิมพ์: อนุญาตเฉพาะตัวเลข 0-9 และจำกัดความยาวไม่เกิน 3 หลัก
    onInput(event) {
      let val = event.target.value.replace(/[^0-9]/g, '');
      if (val.length > 3) val = val.slice(0, 3);
      
      this.score = val;
      event.target.value = val; // อัปเดต Value ใน DOM ให้ตรงกันทันที
      
      if (this.errorMessage) this.errorMessage = '';
    },
    calculateGrade() {
      if (this.score === '' || this.score === null) {
        this.errorMessage = 'กรุณากรอกคะแนนก่อนคำนวณ';
        this.grade = '';
        return;
      }

      const numScore = Number(this.score);

      if (numScore < 0 || numScore > 100 || isNaN(numScore)) {
        this.errorMessage = 'กรุณากรอกคะแนนระหว่าง 0 ถึง 100';
        this.grade = '';
        return;
      }

      this.errorMessage = '';

      if (numScore >= 80) {
        this.grade = 'A';
      } else if (numScore >= 70) {
        this.grade = 'B';
      } else if (numScore >= 60) {
        this.grade = 'C';
      } else if (numScore >= 50) {
        this.grade = 'D';
      } else {
        this.grade = 'F';
      }
    }
  }
}
</script>

<style scoped>
/* พื้นหลังของแอป */
.grade-app-container {
  background: radial-gradient(circle at center, #1a1c23 0%, #0d0e12 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* การ์ดหลักดีไซน์ Glassmorphism */
.grade-card {
  max-width: 440px;
  width: 100%;
  background: rgba(26, 29, 38, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

/* เอฟเฟกต์แสง Glow ด้านหลังการ์ด */
.bg-glow {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(220, 53, 69, 0.35) 0%, rgba(0, 0, 0, 0) 70%);
  filter: blur(30px);
  pointer-events: none;
}

/* ไอคอนส่วนหัว */
.icon-box {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #dc3545, #8b0000);
  color: #ffffff;
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(220, 53, 69, 0.4);
}

/* ปรับแต่ง ช่อง Input */
.custom-input {
  box-shadow: none !important;
  transition: all 0.25s ease;
}

.custom-input:focus {
  border-color: #dc3545 !important;
  box-shadow: 0 0 12px rgba(220, 53, 69, 0.3) !important;
}

/* ปุ่มกดไล่ระดับสี */
.btn-gradient-red {
  background: linear-gradient(135deg, #e63946, #b71c1c);
  border: none;
  color: #fff;
  border-radius: 12px;
  padding: 12px;
  transition: all 0.25s ease;
}

.btn-gradient-red:hover {
  background: linear-gradient(135deg, #ff4d5a, #c62828);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(230, 57, 70, 0.4);
}

.btn-gradient-red:active {
  transform: translateY(0);
}

/* การ์ดแสดงผลลัพธ์ */
.result-card {
  background: rgba(15, 17, 23, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5);
}

/* สีกระแทกตาของตัวอักษรเกรด (Glow Effect) */
.grade-display {
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1;
}

.color-a { color: #2ecc71; text-shadow: 0 0 20px rgba(46, 204, 113, 0.4); }
.color-b { color: #00bcff; text-shadow: 0 0 20px rgba(0, 188, 255, 0.4); }
.color-c { color: #f1c40f; text-shadow: 0 0 20px rgba(241, 196, 15, 0.4); }
.color-d { color: #3498db; text-shadow: 0 0 20px rgba(52, 152, 219, 0.4); }
.color-f { color: #e74c3c; text-shadow: 0 0 20px rgba(231, 76, 60, 0.4); }

/* กล่องแจ้งเตือนความผิดพลาด */
.alert-custom-danger {
  background: rgba(220, 53, 69, 0.15);
  border: 1px solid rgba(220, 53, 69, 0.3);
  color: #ff6b6b;
  border-radius: 12px;
  font-size: 0.9rem;
}

/* Vue Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.scale-enter-active {
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.scale-enter-from {
  opacity: 0;
  transform: scale(0.85);
}
</style>