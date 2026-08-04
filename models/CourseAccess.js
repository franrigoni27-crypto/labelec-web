const mongoose = require('mongoose');

// Registro de accesos a cursos PASADOS (desbloqueo de contenido).
// Es una lista SEPARADA de las inscripciones (CourseRegistration).
const CourseAccessSchema = new mongoose.Schema({
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    documento: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    ciudad_provincia: {
        type: String,
        required: true,
        trim: true
    },
    profesion: {
        type: String,
        required: true,
        trim: true
    },
    institucion: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Índice único: un mismo email cuenta una sola vez por curso (los repetidos NO se duplican)
CourseAccessSchema.index({ curso: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('CourseAccess', CourseAccessSchema);