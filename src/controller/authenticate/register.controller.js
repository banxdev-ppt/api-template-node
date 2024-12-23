const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { db } = require('../../config/database');
const { formatFilename } = require('../../helpers/convertFilename');
const { uploadFile } = require('../../helpers/uploadFile');

const registerController = async (req, res) => {
  try {
    const { username, password, email, phone_number, address, citizen_id } = req.body;
    const file = req.file;

    //** เช็คข้อมูลใน database ว่ามีผู้ใช้งานนี้รึยัง */
    const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ? OR username = ? OR phone_number = ?', [email, username, phone_number]);
    if (existingUser.length > 0) {
      return res.status(400).json({ statusCode: 400, taskStatus: false, message: 'ชื่อผู้ใช้ หรือเบอร์มือถือนี้ถูกใช้งานแล้ว' });
    }

    const hash_password = await bcrypt.hash(password, 10);

    if (!hash_password) {
      return res.status(500).json({ statusCode: 500, taskStatus: false, message: 'แปลงรหัสผ่านไม่สำเร็จ' });
    } else {
      let profile = null;
      let filename = null;
      if (file) {
        //** กรณีที่มีไฟล์ส่งมาจะเอาชื่อไฟล์ไปแปลง format ใน formatFilename */
        filename = formatFilename(file.originalname ?? '', 'profiles');
        const folderPath = path.join(__dirname, '../../uploads/profiles');
        const filePath = path.join(folderPath, filename);

        if (fs.existsSync(filePath)) {
          profile = null;
        } else {
          profile = filename;
        }
      }

      const query = 'INSERT INTO users (username, password, email, phone_number, address, citizen_id, profile) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [username, hash_password, email, phone_number, address, citizen_id, profile];
      const [result] = await db.promise().query(query, values);

      const data = { email, password };

      if (result && file && profile) {
        const upload_state = await uploadFile('profiles', filename, file.buffer);
        if (!upload_state) {
          return res.status(500).json({ statusCode: 500, taskStatus: false, message: 'ไม่สามารถอัพโหลดไฟล์ภาพได้' });
        }

        return res.status(201).json({ statusCode: 201, taskStatus: true, message: 'สมัครสมาชิกสำเร็จ', data });
      } else if (result) {
        return res.status(201).json({ statusCode: 201, taskStatus: true, message: 'สมัครสมาชิกสำเร็จ', data });
      }
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ statusCode: 500, taskStatus: false, message: error.message });
  }
};

module.exports = { registerController };
