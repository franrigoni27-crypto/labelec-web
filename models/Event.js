const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    // Usamos 'fecha_texto' porque en tu diseño permites poner cosas como "Noviembre 2024"
    fecha_texto: {
        type: String,
        required: true
    },
    ubicacion: {
        type: String,
        required: true
    },
    subtitulo: {
        type: String,
        required: true
    },
    // URL de la imagen del evento
    imagen_url: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', EventSchema);