<template>
  <!-- เปลี่ยน align-items-center เป็น align-items-start และเพิ่ม pt-5 -->
  <div class="container d-flex align-items-start justify-content-center min-vh-100 pt-5">
    <div class="card about-card text-center p-4 p-md-5 shadow-lg border-0">
      <div class="card-body">
        <!-- ไอคอนหรือโลโก้ด้านบน -->
        <div class="icon-box mb-3 mx-auto d-flex align-items-center justify-content-center">
          <i class="bi bi-info-circle-fill fs-1 text-danger"></i>
        </div>

        <!-- หัวข้อหลัก -->
        <h1 class="">
          About Us
        </h1>
        
        <div class="divider mx-auto mb-4"></div>

        <!-- ข้อความทดสอบ/เนื้อหา -->
        <h3 class="h4 text-secondary mb-4">
          ทดสอบการใช้งานระบบ
        </h3>

        <p class="text-body-tertiary mb-4">
          ยินดีต้อนรับสู่หน้าข้อมูลระบบ พัฒนาด้วย Vue.js ร่วมกับ Bootstrap 5
        </p>

        <!-- ปุ่ม action -->
        <div class="d-flex justify-content-center gap-3">
          <router-link to="/" class="btn btn-danger btn-lg px-4 fw-semibold">
            Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>