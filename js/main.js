// Variables globales
let carrito = [];
let totalVenta = 0;

// Función constructora para crear productos en la venta
function ProductoVenta(codigo, articulo, cantidad, precio) {
    this.codigo = codigo;
    this.articulo = articulo;
    this.cantidad = cantidad;
    this.precio = precio;
    this.subtotal = () => this.cantidad * this.precio;
}

// Función para renderizar la tabla
const renderizarTabla = () => {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // limpia la tabla

    carrito.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.cantidad}</td>
            <td>${item.codigo}</td>
            <td>${item.articulo}</td>
            <td>${item.cantidad}</td>
            <td>CERVEZAS</td>
            <td>-</td>
            <td>$ ${item.subtotal()}</td>
            <td class="status-active">Activo</td>
        `;
        tbody.appendChild(tr);
    });

    calcularTotal();
};

// Función flecha para calcular total
const calcularTotal = () => {
    totalVenta = carrito.reduce((acc, item) => acc + item.subtotal(), 0);
    console.log(`Total actual: $${totalVenta}`);
};

// Evento para el botón "Agregar"
document.querySelector(".add-button").addEventListener("click", () => {
    const productoInput = document.querySelector(".product-search").value;
    const cantidadInput = parseInt(document.querySelector(".quantity-input").value);

    if (!productoInput || isNaN(cantidadInput) || cantidadInput <= 0) {
        alert("Ingrese un producto válido y cantidad mayor a 0");
        return;
    }

    // Simular obtención del código y precio (podría venir de un inventario)
    const codigo = Math.floor(Math.random() * 1000) + "-X";
    const precio = Math.floor(Math.random() * 5000) + 1000; // random entre 1000 y 6000

    // Crear objeto producto
    const nuevoProducto = new ProductoVenta(codigo, productoInput, cantidadInput, precio);
    carrito.push(nuevoProducto);

    console.log(`Producto agregado: ${productoInput} x${cantidadInput} - $${nuevoProducto.subtotal()}`);
    renderizarTabla();
});

// Evento para el botón "Guardar" -> almacenar en localStorage
document.querySelector(".save-button").addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("No hay productos en la venta para guardar.");
        return;
    }

    // Guardamos como JSON
    localStorage.setItem("ultimaVenta", JSON.stringify(carrito));
    alert("Venta guardada correctamente en localStorage ✔");

    // También podríamos limpiar carrito después
    carrito = [];
    renderizarTabla();
});

// Botón "Limpiar" -> vacía carrito
document.querySelector(".text-button:nth-of-type(1)").addEventListener("click", () => {
    carrito = [];
    renderizarTabla();
    alert("Carrito limpiado.");
});

// Botón "Eliminar" -> borra del localStorage
document.querySelector(".text-button:nth-of-type(2)").addEventListener("click", () => {
    localStorage.removeItem("ultimaVenta");
    alert("Venta eliminada del localStorage.");
});

// Ejemplo de uso de filter / map: al cargar página, revisar ventas anteriores
window.addEventListener("DOMContentLoaded", () => {
    const ventaGuardada = JSON.parse(localStorage.getItem("ultimaVenta"));
    if (ventaGuardada) {
        // reconvertimos a objetos con métodos
        carrito = ventaGuardada.map(item => new ProductoVenta(item.codigo, item.articulo, item.cantidad, item.precio));
        renderizarTabla();
        console.log("Venta anterior recuperada del localStorage.");
    }
});
