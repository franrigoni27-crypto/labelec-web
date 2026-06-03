require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

// Conectar a la base de datos
connectDB();

const crearUsuario = async () => {
    try {
        // --- CONFIGURA AQUÍ TU USUARIO Y CONTRASEÑA ---
        const nuevoAdmin = new User({
            username: 'admin',        // Puedes cambiar 'admin' por tu nombre
            password: 'password123'   // ¡Pon una contraseña segura aquí!
        });

        // Al guardar, el modelo User.js encriptará la contraseña automáticamente
        await nuevoAdmin.save();
        
        console.log('✅ ¡Usuario Administrador creado con éxito!');
        process.exit();
    } catch (error) {
        console.log('❌ Error al crear usuario:', error.message);
        process.exit(1);
    }
};

crearUsuario();