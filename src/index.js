const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const { swaggerSetup } = require('./config/swagger/swagger.js');
const { db } = require('./config/database.js');
const { configCors } = require('./config/cors.js');

const authRoutes = require('./routers/authenticate/authRoutes.js');

dotenv.config({ path: '.env.development' });
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(configCors);

app.get('/', (req, res) => {
  res.send('server is running');
});

app.use('/api/swagger', swaggerUi.serve, swaggerSetup);
app.use('/auth', authRoutes);

const port = process.env.PORT || 3003;
db.getConnection((err, connection) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  } else {
    console.log('Database connected successfully');
    connection.release();
    app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
  }
});
