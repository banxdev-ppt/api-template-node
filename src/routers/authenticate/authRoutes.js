const express = require('express');
const { uploadMiddleware } = require('../../middleware/uploadMiddleware');
const { loginController } = require('../../controller/authenticate/login.controller');
const { registerController } = require('../../controller/authenticate/register.controller');

//** router คือฟังก์ชันนึงของ express ที่เป็นการแบ่ง route ออกมาแต่ใช้งานร่วมกันในหน้า index.js */
const router = express.Router();

//** profiles คือ folder ที่จะจัดเก็บ (ใน uploads), profile_image คือ key ของ formData ที่ส่งมาจากหน้าบ้าน หรือ postman */
const upload = uploadMiddleware('profiles').single('profile_image');

router.post('/login', loginController);

//** upload คือ middleware ที่ใช้ในการตรวจสอบการทำงาน */
router.post('/register', upload, registerController);

module.exports = router;
