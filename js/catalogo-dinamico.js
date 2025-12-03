// catalogo-dinamico.js
// Este script llena automáticamente las páginas de categoría

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Buscar el contenedor donde poner los productos
    // Debe tener un atributo data-categoria="NombreExacto"
    const gridContainer = document.querySelector('.product-grid'); 
    
    if (!gridContainer) {
        console.warn('No se encontró un contenedor .product-grid para cargar productos.');
        return;
    }

    // Leer qué categoría quiere mostrar esta página (ej: "Anestesia")
    // Si no tiene atributo, intenta leer el título h2
    let categoriaBuscada = gridContainer.getAttribute('data-categoria');
    
    if (!categoriaBuscada) {
        // Fallback: intentar adivinar por el título H2 de la sección
        const titulo = document.querySelector('section.productos h2');
        if (titulo) categoriaBuscada = titulo.textContent.trim();
    }

    console.log(`Cargando catálogo para: "${categoriaBuscada}"...`);

    try {
        // 2. Pedir todos los productos al servidor
        const response = await fetch('/api/productos');
        const todosLosProductos = await response.json();

        // 3. Filtrar (Ignorando mayúsculas/minúsculas)
        const productosFiltrados = todosLosProductos.filter(p => {
            // p.categoria es un array o string. Verificamos si incluye la buscada.
            const catStr = Array.isArray(p.categoria) ? p.categoria.join(' ') : p.categoria;
            return catStr.toLowerCase().includes(categoriaBuscada.toLowerCase());
        });

        // 4. Renderizar
        if (productosFiltrados.length === 0) {
            gridContainer.innerHTML = `<p>No hay productos cargados en esta categoría aún.</p>`;
            return;
        }

        gridContainer.innerHTML = ''; // Limpiar contenido estático (demo)

        productosFiltrados.forEach(p => {
            // Obtener primera imagen o default
            const imgs = (p.imagen || '').split(',');
            const imgUrl = imgs[0] && imgs[0].length > 3 ? imgs[0] : 'img/favicon.png';

            // Crear tarjeta HTML
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${imgUrl}" alt="${p.nombre}" onerror="this.src='img/favicon.png'">
                <div class="product-card-content">
                    <h3 style="color: var(--color-primario); font-size: 18px;">${p.nombre}</h3>
                    <p style="font-size: 13px; color: #666;">${p.marca} - ${p.modelo || ''}</p>
                    
                    <a href="producto.html?id=${p.id}" class="cta-button-secundario" style="width:100%; text-align:center; display:block; margin-top:10px;">
                        Ver Detalles
                    </a>
                </div>
            `;
            gridContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error cargando catálogo:", error);
        gridContainer.innerHTML = `<p style="color:red">Error de conexión al cargar productos.</p>`;
    }
});