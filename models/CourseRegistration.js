const mongoose = require('mongoose');

const CourseRegistrationSchema = new mongoose.Schema({
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    nombre_completo: {
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

// Índice único compuesto: bloquea inscripciones duplicadas (mismo email en mismo curso)
CourseRegistrationSchema.index({ curso: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('CourseRegistration', CourseRegistrationSchema);