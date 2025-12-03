const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    // Título de la noticia
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    // Breve descripción para la tarjeta en el listado
    resumen: {
        type: String,
        required: true
    },
    // Contenido completo de la noticia
    texto: {
        type: String,
        required: true
    },
    // URLs de las imágenes (separadas por comas o guardadas como array en el futuro)
    imagen_url: {
        type: String,
        default: ''
    },
    // Fecha de publicación automática
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('News', NewsSchema);