const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Conexión a MongoDB usando la variable de entorno
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error de conexión: ${error.message}`);
        // Detener el servidor si no hay base de datos, es crítico
        process.exit(1);
    }
};

module.exports = connectDB;