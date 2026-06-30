// =======================================================
// Sistema de Inventario de Productos
// Programación Front End - Sumativa 2
// =======================================================

// ===== Arreglo principal =====
let productos = JSON.parse(localStorage.getItem("productos")) || [];

// ===== Elementos del DOM =====
const formulario = document.getElementById("formProducto");
const nombre = document.getElementById("nombre");
const precio = document.getElementById("precio");
const categoria = document.getElementById("categoria");
const mensaje = document.getElementById("mensaje");
const tablaProductos = document.getElementById("tablaProductos");
const totalProductos = document.getElementById("totalProductos");
const valorTotal = document.getElementById("valorTotal");
const buscar = document.getElementById("buscar");

// =======================================================
// Sanitizar texto (Seguridad contra XSS)
// Asistencia IA: sugerencia de buenas prácticas.
// =======================================================

function sanitizarTexto(texto) {

    return texto
        .trim()
        .replace(/[<>]/g, "");

}

// =======================================================
// Validaciones
// =======================================================

function validarFormulario() {

    const nombreProducto = sanitizarTexto(nombre.value);
    const precioProducto = Number(precio.value);

    if (nombreProducto.length < 3) {

        mostrarMensaje("El nombre debe tener al menos 3 caracteres.", "red");
        return false;

    }

    const expresion = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/;

    if (!expresion.test(nombreProducto)) {

        mostrarMensaje("El nombre contiene caracteres inválidos.", "red");
        return false;

    }

    if (isNaN(precioProducto) || precioProducto <= 0) {

        mostrarMensaje("Ingrese un precio válido.", "red");
        return false;

    }

    if (categoria.value === "") {

        mostrarMensaje("Seleccione una categoría.", "red");
        return false;

    }

    return true;

}

// =======================================================
// Mostrar mensajes
// =======================================================

function mostrarMensaje(texto, color) {

    mensaje.textContent = texto;
    mensaje.style.color = color;

}
// =======================================================
// Agregar producto
// =======================================================

function agregarProducto() {

    const producto = {

        id: Date.now(),

        nombre: sanitizarTexto(nombre.value),

        precio: Number(precio.value),

        categoria: categoria.value

    };

    productos.push(producto);

    guardarProductos();

    renderizarProductos();

    formulario.reset();

    mostrarMensaje("Producto agregado correctamente.", "green");

}

// =======================================================
// Guardar en LocalStorage
// =======================================================

function guardarProductos() {

    localStorage.setItem("productos", JSON.stringify(productos));

}

// =======================================================
// Eliminar producto
// =======================================================

function eliminarProducto(id) {

    productos = productos.filter(producto => producto.id !== id);

    guardarProductos();

    renderizarProductos();

}

// =======================================================
// Renderizar productos
// =======================================================

function renderizarProductos(lista = productos) {

    tablaProductos.textContent = "";

    lista.forEach(producto => {

        const fila = document.createElement("tr");

        const tdNombre = document.createElement("td");
        tdNombre.textContent = producto.nombre;

        const tdPrecio = document.createElement("td");
        tdPrecio.textContent = "$" + producto.precio.toLocaleString();

        const tdCategoria = document.createElement("td");
        tdCategoria.textContent = producto.categoria;

        const tdAccion = document.createElement("td");

        const boton = document.createElement("button");
        boton.textContent = "Eliminar";
        boton.className = "btnEliminar";

        boton.addEventListener("click", () => {

            eliminarProducto(producto.id);

        });

        tdAccion.appendChild(boton);

        fila.appendChild(tdNombre);
        fila.appendChild(tdPrecio);
        fila.appendChild(tdCategoria);
        fila.appendChild(tdAccion);

        tablaProductos.appendChild(fila);

    });

    actualizarEstadisticas();

}
// =======================================================
// Actualizar estadísticas
// =======================================================

function actualizarEstadisticas() {

    totalProductos.textContent = productos.length;

    const total = productos.reduce((acumulador, producto) => {

        return acumulador + producto.precio;

    }, 0);

    valorTotal.textContent = total.toLocaleString();

}

// =======================================================
// Buscar productos
// =======================================================

buscar.addEventListener("input", () => {

    const texto = sanitizarTexto(buscar.value).toLowerCase();

    const filtrados = productos.filter(producto =>

        producto.nombre.toLowerCase().includes(texto)

    );

    renderizarProductos(filtrados);

});

// =======================================================
// Evento formulario
// =======================================================

formulario.addEventListener("submit", function(e){

    e.preventDefault();

    if(validarFormulario()){

        agregarProducto();

    }

});

// =======================================================
// Cargar datos al iniciar
// =======================================================

renderizarProductos();