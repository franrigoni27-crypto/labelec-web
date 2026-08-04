const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true
    },
    // URL de la imagen de portada (una sola)
    imagen_url: {
        type: String,
        default: ''
    },
    // Fecha y hora real del curso (datetime)
    fecha: {
        type: Date,
        required: true
    },
    disertante: {
        type: String,
        default: ''
    },
    // Link de la reunión (Zoom/Meet) - solo visible al admin, nunca expuesto en API pública
    link_reunion: {
        type: String,
        default: ''
    },
    // 0 o vacío = sin límite
    cupo_maximo: {
        type: Number,
        default: 0
    },
    // Controla visibilidad en la landing/listado público
    activo: {
        type: Boolean,
        default: true
    },
    // Switch manual: false = curso próximo (inscripción normal), true = curso pasado (contenido desbloqueable)
    es_pasado: {
        type: Boolean,
        default: false
    },
    // --- Contenido que se desbloquea al completar el formulario (solo cursos pasados) ---
    contenido_mensaje: {
        type: String,
        default: ''
    },
    // Galería de imágenes (URLs de Cloudinary)
    contenido_imagenes: {
        type: [String],
        default: []
    },
    // Links de interés con etiqueta (Grabación, Drive, video, etc.)
    contenido_links: {
        type: [{
            titulo: { type: String, default: '' },
            url: { type: String, default: '' }
        }],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', CourseSchema);