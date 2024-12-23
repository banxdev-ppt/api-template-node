const { db } = require('../../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [row] = await db.promise().query('SELECT id, username, password, email, phone_number, address, citizen_id, profile, created_date FROM users WHERE email = ? OR phone_number = ?', [username, username]);

    if (row.length === 0) {
      return res.status(500).json({ statusCode: 500, taskStatus: false, message: 'ไม่พบบัญชีผู้ใช้งาน' });
    }

    const data = row[0];

    const userData = {
      id: data.id,
      username: data.username,
      email: data.email,
      phone_number: data.phone_number,
      address: data.address,
      citizen_id: data.citizen_id,
      profile: data.profile,
      created_date: data.created_date,
    };

    const hash = data.password;
    const check_password = await bcrypt.compare(password, hash);

    if (!check_password) {
      return res.status(500).json({ statusCode: 500, taskStatus: false, message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    const token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: '1d' });
    return res.status(200).json({ statusCode: 200, taskStatus: true, message: 'สำเร็จ', data: { ...userData, token } });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ statusCode: 400, taskStatus: false, message: error.message });
  }
};

module.exports = { loginController };
