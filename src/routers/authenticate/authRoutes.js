const express = require('express');
const { uploadMiddleware } = require('../../middleware/uploadMiddleware');
const { loginController } = require('../../controller/authenticate/login.controller');
const { registerController } = require('../../controller/authenticate/register.controller');

const router = express.Router();
const upload = uploadMiddleware().single('profile_image');

router.post('/login', loginController);
router.post('/register', upload, registerController);

module.exports = router;
