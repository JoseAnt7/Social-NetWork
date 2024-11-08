const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = 3001;

// Configura la conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar con MySQL:', err);
  } else {
    console.log('Conectado a MySQL');
  }
});

app.use(cors({
    origin: 'http://localhost:3000' // Cambia esto según el origen de tu frontend
  }));

app.use(express.json());

// Ruta de prueba
app.get('/api/test', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error en la consulta' });
    } else {
      res.json(results);
    }
  });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE Email = ? AND Contraseña = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else if (results.length > 0) {
            // Usuario encontrado
            res.json({ success: true, message: 'Inicio de sesión exitoso' });
        } else {
            // Credenciales incorrectas
            res.json({ success: false, message: 'Correo o contraseña incorrectos' });
        }
    });
});


app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
