const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    // Mantenemos el 'id' manual para que tus enlaces actuales (ej: /producto/mindray-tci) sigan funcionando
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    marca: {
        type: String,
        required: true,
        trim: true
    },
    modelo: {
        type: String,
        default: ''
    },
    // Definimos categorías como un Array para poder filtrar mejor
    categoria: {
        type: [String], 
        default: []
    },
    // Para tus filtros especiales ("Bombas TCI", "Monitoreo Neonatal", etc.)
    solucionEspecifica: {
        type: [String],
        default: []
    },
    descripcion: {
        type: String,
        default: ''
    },
    // Guardaremos las URLs de las imágenes. 
    // Lo mantenemos como String separado por comas para compatibilidad con tu Frontend actual.
    imagen: {
        type: String, 
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);