require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
};

async function inicializarBD() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    // Tabla Usuarios
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // Tabla Movimientos
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS movimientos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          usuario_email VARCHAR(100) NOT NULL,
          tipo VARCHAR(50) NOT NULL,
          descripcion VARCHAR(255) NOT NULL,
          total DECIMAL(10,2) NOT NULL,
          estado VARCHAR(50) DEFAULT 'Completado',
          fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Base de datos sincronizada de forma segura en Aiven.");
    await connection.end();
  } catch (error) {
    console.error("❌ ERROR BD:", error.message);
  }
}

// Endpoints de Sesión y Perfil
app.post('/api/register', async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length > 0) {
      await connection.end();
      return res.status(400).json({ success: false, mensaje: 'El correo ya está registrado' });
    }
    await connection.execute('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, password]);
    await connection.end();
    res.json({ success: true, mensaje: 'Usuario registrado' });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: 'Error interno' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password]);
    await connection.end();
    if (rows.length > 0) {
      res.json({ success: true, usuario: { nombre: rows[0].nombre, email: rows[0].email } });
    } else {
      res.status(401).json({ success: false, mensaje: 'Credenciales incorrectas' });
    }
  } catch (error) {
    res.status(500).json({ success: false, mensaje: 'Error interno' });
  }
});

app.put('/api/usuarios/:email', async (req, res) => {
  const { email } = req.params;
  const { nuevoNombre } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('UPDATE usuarios SET nombre = ? WHERE email = ?', [nuevoNombre, email]);
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Endpoints de Movimientos
app.post('/api/movimientos', async (req, res) => {
  const { email, tipo, descripcion, total } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'INSERT INTO movimientos (usuario_email, tipo, descripcion, total) VALUES (?, ?, ?, ?)',
      [email, tipo, descripcion, total]
    );
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.get('/api/movimientos/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM movimientos WHERE usuario_email = ? ORDER BY fecha DESC', [email]);
    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json([]);
  }
});

// Eliminar/Anular Membresía del historial
app.delete('/api/membresia/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute("DELETE FROM movimientos WHERE usuario_email = ? AND tipo = 'Membresia'", [email]);
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Panel de Admin Global
app.get('/api/admin/ventas', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM movimientos ORDER BY fecha DESC');
    const [totales] = await connection.execute('SELECT SUM(total) as ingresos FROM movimientos');
    await connection.end();
    res.json({ historial: rows, ingresosTotales: totales[0].ingresos || 0 });
  } catch (error) {
    res.status(500).json({ historial: [], ingresosTotales: 0 });
  }
});

inicializarBD().then(() => {
  app.listen(PORT, () => console.log(`🚀 Backend en puerto ${PORT}`));
});