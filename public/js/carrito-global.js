// public/js/carrito-global.js
// Este script se encarga de actualizar el contador del carrito en el menú de todas las páginas.

function actualizarContadorNav() {
    let carrito = [];
    
    // 1. Intentar leer el carrito de la memoria
    try {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
        }
    } catch (e) {
        // En caso de error de lectura, reseteamos la memoria.
        console.error("Error leyendo carrito. Reseteando.");
        localStorage.setItem('carrito', '[]');
        carrito = [];
    }

    // 2. LIMPIEZA AUTOMÁTICA (Elimina ítems nulos/fantasmas)
    // Filtramos solo los productos que sean válidos (que no sean null y tengan un ID)
    const carritoLimpio = Array.isArray(carrito) ? carrito.filter(item => item && item.id) : [];

    // Si encontramos basura (la longitud es diferente), guardamos la versión limpia
    if (carrito.length !== carritoLimpio.length) {
        console.log("Limpiando items corruptos del carrito...");
        carrito = carritoLimpio;
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // 3. ACTUALIZAR EL MENÚ
    const navCarrito = document.getElementById('nav-carrito');
    
    if (navCarrito) {
        const cantidad = carrito.length;
        
        // Texto Unificado y Correcto
        navCarrito.textContent = `Carrito de Cotización (${cantidad})`;
        
        // Estilo visual: Azul si hay items, Gris si está vacío (Se mantiene en el elemento HTML que lo llama)
        if (cantidad > 0) {
            navCarrito.style.color = '#47B5E7'; 
            navCarrito.style.fontWeight = '700';
        } else {
            navCarrito.style.color = '#727376';
            navCarrito.style.fontWeight = '600';
        }
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorNav();
});