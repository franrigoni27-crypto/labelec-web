const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuración con tus credenciales del .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración del almacenamiento
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'labelec_uploads', // Nombre de la carpeta en tu nube
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Formatos permitidos
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Opcional: Redimensionar si son gigantes
    }
});

module.exports = { cloudinary, storage };