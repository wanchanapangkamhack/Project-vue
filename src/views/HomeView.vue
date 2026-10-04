<template>
  <div class="container">

    <div class="px-4 py-5 my-5 text-center"> <img class="d-block mx-auto mb-4" src="../assets/image/Msi-Logo.jpg" alt=""
        width="72" height="57">
      <h1 class="display-5 fw-bold text-body-emphasis">Centered hero</h1>
      <div class="col-lg-6 mx-auto">
        <p class="lead mb-4">Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most
          popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive
          prebuilt components, and powerful JavaScript plugins.</p>
        <div class="d-grid gap-2 d-sm-flex justify-content-sm-center"> <button type="button"
            class="btn btn-primary btn-lg px-4 gap-3">Primary button</button> <button type="button"
            class="btn btn-outline-secondary btn-lg px-4">Secondary</button></div>
      </div>

      <div class="container col-xxl-8 px-4 py-5">
  <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
    
    <!-- ฝั่งขวา: ใส่รูปภาพ MSI -->
    <div class="col-10 col-sm-8 col-lg-6"> 
      <img src="https://gzhls.at/i/21/21/2832121-l0.jpg" 
           class="d-block mx-lg-auto img-fluid rounded-3 shadow" 
           alt="MSI Gaming Laptop" 
           width="700" 
           height="500" 
           loading="lazy"> 
    </div>
    
    <!-- ฝั่งซ้าย: เนื้อหาข้อความ -->
    <div class="col-lg-6">
      <h1 class="display-5 fw-bold text-body-emphasis lh-1 mb-3">MSI True Gaming Experience</h1>
      <p class="lead">สัมผัสพลังแห่งการเล่นเกมและการทำงานขั้นสุดด้วยโน้ตบุ๊กและอุปกรณ์ฮาร์ดแวร์ประสิทธิภาพสูงจาก MSI ออกแบบมาเพื่อเกมเมอร์และครีเอเตอร์โดยเฉพาะ</p>
      
      <div class="d-grid gap-2 d-md-flex justify-content-md-start"> 
        <button type="button" class="btn btn-danger btn-lg px-4 me-md-2">ดูสินค้า MSI</button> 
        <button type="button" class="btn btn-outline-dark btn-lg px-4">ข้อเสนอพิเศษ</button> 
      </div>
    </div>

  </div>
</div>

      <div class="container col-xl-10 col-xxl-8 px-4 py-5">
  <div class="row align-items-center g-lg-5 py-5">
    
    <!-- ส่วนฝั่งซ้าย: ใส่รูปภาพ MSI และข้อความ -->
    <div class="col-lg-7 text-center text-lg-start">
      <!-- รูปภาพ MSI (เปลี่ยน URL ภาพใน src ได้ตามต้องการ) -->
      <img 
        src="https://msi.com/images/m_logo.png" 
        alt="MSI Logo" 
        class="img-fluid mb-4" 
        style="max-height: 80px;"
      >
      
      <h1 class="display-4 fw-bold lh-1 text-body-emphasis mb-3">MSI Membership Sign-up</h1>
      <p class="col-lg-10 fs-4">สมัครสมาชิก MSI เพื่อรับสิทธิพิเศษ อัปเดตไดรเวอร์ และข่าวสารเกี่ยวกับเกมมิ่งโน้ตบุ๊กและอุปกรณ์ IT ชั้นนำ</p>
    </div>

    <!-- ส่วนฝั่งขวา: ฟอร์มลงชื่อเข้าใช้ / สมัครสมาชิก -->
    <div class="col-md-10 mx-auto col-lg-5">
      <form class="p-4 p-md-5 border rounded-3 bg-body-tertiary">
        <div class="form-floating mb-3"> 
          <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"> 
          <label for="floatingInput">Email address</label> 
        </div>
        
        <div class="form-floating mb-3"> 
          <input type="password" class="form-control" id="floatingPassword" placeholder="Password"> 
          <label for="floatingPassword">Password</label> 
        </div>
        
        <div class="checkbox mb-3"> 
          <label> 
            <input type="checkbox" value="remember-me"> Remember me
          </label> 
        </div> 
        
        <button class="w-100 btn btn-lg btn-danger" type="submit">Sign up</button>
        <hr class="my-4"> 
        <small class="text-body-secondary">By clicking Sign up, you agree to the terms of use.</small>
      </form>
    </div>

  </div>
</div>


    </div>


  </div>
</template>
