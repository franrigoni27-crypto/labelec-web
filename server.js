require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const multer = require('multer');
const nodemailer = require('nodemailer');

// --- Configuraciones ---
const connectDB = require('./config/db');
const { storage } = require('./config/cloudinary'); 
const upload = multer({ storage }); 

// --- Modelos ---
const Product = require('./models/Product');
const News = require('./models/News');
const Event = require('./models/Event');
const User = require('./models/User');

const app = express();
connectDB(); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } 
}));

const protect = (req, res, next) => {
    if (req.session.userId) return next();
    res.redirect('/admin/login');
};

app.use((req, res, next) => { res.locals.user = req.session.userId; next(); });

// --- RUTAS PÚBLICAS (Igual que antes) ---
app.get('/', (req, res) => res.render('index', { titulo: 'Inicio' }));
app.get('/alquileres', (req, res) => res.render('alquileres'));
app.get('/servicio', (req, res) => res.render('servicio'));
app.get('/informacion', (req, res) => res.render('informacion'));
app.get('/carrito', (req, res) => res.render('carrito'));
app.get('/novedades', (req, res) => res.render('novedades'));

app.get('/categoria/:nombreCategoria', async (req, res) => {
    try {
        const catSearch = req.params.nombreCategoria.replace(/-/g, ' '); 
        const productos = await Product.find({ categoria: { $regex: catSearch, $options: 'i' } });
        const filtros = new Set();
        productos.forEach(p => p.solucionEspecifica.forEach(s => filtros.add(s)));
        res.render('categoria', { nombreCategoria: req.params.nombreCategoria, productos, filtrosDisponibles: Array.from(filtros) });
    } catch (error) { res.status(500).send('Error'); }
});

app.get('/marca/:nombreMarca', async (req, res) => {
    try {
        const marcaSlug = req.params.nombreMarca; 
        const productos = await Product.find({ marca: { $regex: `^${marcaSlug}$`, $options: 'i' } });
        res.render('marca', { nombreMarca: marcaSlug, nombreMarcaSlug: marcaSlug.toLowerCase(), productos });
    } catch (error) { res.status(500).send('Error'); }
});

app.get('/producto', (req, res) => res.render('producto'));
app.get('/novedad', (req, res) => res.render('novedad')); 

// --- API DATA ---
app.get('/api/productos', async (req, res) => { const prods = await Product.find(); res.json(prods); });
app.get('/api/novedades', async (req, res) => { const news = await News.find().sort({ fecha: -1 }); res.json(news); });
app.get('/api/novedades/:id', async (req, res) => { try { res.json(await News.findById(req.params.id)); } catch (e) { res.status(404).json(null); } });
app.get('/api/eventos', async (req, res) => { const evts = await Event.find().sort({ createdAt: -1 }); res.json(evts); });

// --- EMAILS ---
const createTransporter = () => nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });

app.post('/api/cotizar', async (req, res) => {
    const { nombre, email, telefono, mensaje, carrito } = req.body;
    const lista = carrito.map(i => `- ${i.nombre} (${i.marca}) x${i.quantity}`).join('\n');
    try {
        await createTransporter().sendMail({
            from: `"Web Labelec" <${process.env.EMAIL_USER}>`, to: 'info@labelec.com', 
            subject: `Cotización - ${nombre}`, text: `Cliente: ${nombre}\nEmail: ${email}\nTel: ${telefono}\n\nItems:\n${lista}\n\nMensaje: ${mensaje}`
        });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false }); }
});

app.post('/api/soporte', async (req, res) => {
    const { nombre, email, equipo, problema } = req.body;
    try {
        await createTransporter().sendMail({
            from: `"Soporte" <${process.env.EMAIL_USER}>`, to: 'info@labelec.com',
            subject: `Soporte - ${equipo}`, text: `Cliente: ${nombre}\nEmail: ${email}\nEquipo: ${equipo}\nProblema: ${problema}`
        });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false }); }
});

app.post('/api/alquiler', async (req, res) => {
    const { nombre, email, equipo, duracion } = req.body;
    try {
        await createTransporter().sendMail({
            from: `"Alquiler" <${process.env.EMAIL_USER}>`, to: 'info@labelec.com',
            subject: `Alquiler - ${equipo}`, text: `Cliente: ${nombre}\nEmail: ${email}\nEquipo: ${equipo}\nDuración: ${duracion}`
        });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false }); }
});


app.get('/historia', (req, res) => res.render('historia', { titulo: 'Nuestra Historia' }));

// --- ADMIN & AUTH ---
app.get('/admin/login', (req, res) => { if (req.session.userId) return res.redirect('/admin'); res.render('admin/login', { error: null }); });
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) { req.session.userId = user._id; return res.redirect('/admin'); }
    res.render('admin/login', { error: 'Credenciales inválidas' });
});
app.get('/auth/logout', (req, res) => { req.session.destroy(() => res.redirect('/admin/login')); });

app.get('/admin', protect, async (req, res) => {
    const productos = await Product.find().sort({ createdAt: -1 });
    const novedades = await News.find().sort({ fecha: -1 });
    const eventos = await Event.find().sort({ createdAt: -1 });
    res.render('admin/dashboard', { productos, novedades, eventos });
});

// --- ABM CON RESPUESTAS JSON (AJAX) Y MULTI-IMAGEN ---

// ABM PRODUCTOS
app.post('/admin/productos', protect, upload.array('imagenes'), async (req, res) => {
    try {
        // Extraemos 'soluciones' del cuerpo del formulario
        const { id, nombre, marca, modelo, categoria, descripcion, edit_id, soluciones } = req.body;
        
        // Convertir string de especialidades a array
        const catArray = categoria.split(',').map(c => c.trim()).filter(c => c);
        
        // Convertir string de soluciones/filtros a array (NUEVO)
        const solArray = soluciones ? soluciones.split(',').map(s => s.trim()).filter(s => s) : [];
        
        let imgUrls = "";
        if (req.files && req.files.length > 0) {
            imgUrls = req.files.map(f => f.path).join(',');
        }

        if (edit_id) {
            const updateData = { 
                nombre, marca, modelo, descripcion,
                categoria: catArray, 
                solucionEspecifica: solArray // Guardamos las soluciones
            };
            if (imgUrls) updateData.imagen = imgUrls; 
            await Product.findByIdAndUpdate(edit_id, updateData);
        } else {
            await Product.create({ 
                id, nombre, marca, modelo, descripcion, 
                categoria: catArray, 
                solucionEspecifica: solArray, // Guardamos las soluciones
                imagen: imgUrls 
            });
        }
        res.json({ success: true });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// 2. NOVEDADES (Ahora soporta array 'imagenes')
app.post('/admin/novedades', protect, upload.array('imagenes'), async (req, res) => {
    try {
        const { titulo, resumen, texto, edit_id } = req.body;
        let imgUrls = "";
        if (req.files && req.files.length > 0) {
            imgUrls = req.files.map(f => f.path).join(',');
        }

        if (edit_id) {
            const data = { titulo, resumen, texto };
            if (imgUrls) data.imagen_url = imgUrls;
            await News.findByIdAndUpdate(edit_id, data);
        } else {
            await News.create({ titulo, resumen, texto, imagen_url: imgUrls });
        }
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.delete('/admin/novedades/delete/:id', protect, async (req, res) => {
    try { await News.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    catch (e) { res.status(500).json({ success: false }); }
});

// 3. EVENTOS (Ahora soporta array 'imagenes')
app.post('/admin/eventos', protect, upload.array('imagenes'), async (req, res) => {
    try {
        const { titulo, fecha_texto, ubicacion, subtitulo, edit_id } = req.body;
        let imgUrls = "";
        if (req.files && req.files.length > 0) {
            imgUrls = req.files.map(f => f.path).join(',');
        }

        if (edit_id) {
            const data = { titulo, fecha_texto, ubicacion, subtitulo };
            if (imgUrls) data.imagen_url = imgUrls;
            await Event.findByIdAndUpdate(edit_id, data);
        } else {
            await Event.create({ titulo, fecha_texto, ubicacion, subtitulo, imagen_url: imgUrls });
        }
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.delete('/admin/eventos/delete/:id', protect, async (req, res) => {
    try { await Event.findByIdAndDelete(req.params.id); res.json({ success: true }); }
    catch (e) { res.status(500).json({ success: false }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server en puerto ${PORT}`));