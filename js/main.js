// Productos disponibles
        const productos = [
            {id: 1, nombre: "Coca Cola 2L", precio: 1200},
            {id: 2, nombre: "Cerveza 361 1L", precio: 800},
            {id: 3, nombre: "Cerveza 1890 1L", precio: 850},
            {id: 4, nombre: "100 Pipers 750cc", precio: 3500},
            {id: 5, nombre: "Andes Rubia Lata 500cc", precio: 400},
            {id: 6, nombre: "Quilmes Negra Lata 500cc", precio: 450}
        ];
        
        // Constructor para items del carrito
        function ItemCarrito(producto, cantidad, cliente, tipoPago, tipoCliente) {
            this.producto = producto;
            this.cantidad = cantidad;
            this.cliente = cliente;
            this.tipoPago = tipoPago;
            this.tipoCliente = tipoCliente;
            this.subtotal = producto.precio * cantidad;
        }
        
        let carrito = [];
        let productoActual = null;
        
        // Cargar productos en la interfaz
        const cargarProductos = () => {
            const grid = document.getElementById('productos-grid');
            const select = document.getElementById('productoSeleccionado');
            
            productos.forEach(producto => {
                // Crear tarjeta de producto
                const div = document.createElement('div');
                div.className = 'producto';
                div.innerHTML = `
                    <h4>${producto.nombre}</h4>
                    <p>$${producto.precio}</p>
                `;
                div.onclick = () => seleccionarProducto(producto);
                grid.appendChild(div);
                
                // Agregar al select
                const option = document.createElement('option');
                option.value = producto.id;
                option.textContent = producto.nombre;
                select.appendChild(option);
            });
        };
        
        const seleccionarProducto = (producto) => {
            productoActual = producto;
            document.getElementById('productoSeleccionado').value = producto.id;
            
            // Actualizar estilos
            document.querySelectorAll('.producto').forEach(p => p.classList.remove('selected'));
            event.target.closest('.producto').classList.add('selected');
        };
        
        const agregarProducto = () => {
            const cliente = document.getElementById('cliente').value;
            const cantidad = parseInt(document.getElementById('cantidad').value);
            const productoId = document.getElementById('productoSeleccionado').value;
            const tipoPago = document.getElementById('tipoPago').value;
            const tipoCliente = document.getElementById('tipoCliente').value;
            
            if (!cliente || !cantidad || !productoId) {
                alert('Complete todos los campos');
                return;
            }
            
            const producto = productos.find(p => p.id == productoId);
            const item = new ItemCarrito(producto, cantidad, cliente, tipoPago, tipoCliente);
            carrito.push(item);
            
            actualizarCarrito();
            limpiarFormulario();
        };
        
        const actualizarCarrito = () => {
            const container = document.getElementById('carrito-items');
            container.innerHTML = '';
            
            carrito.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'carrito-item';
                div.innerHTML = `
                    <span>${item.producto.nombre}</span>
                    <span>Cant: ${item.cantidad}</span>
                    <span>$${item.producto.precio}</span>
                    <span>$${item.subtotal}</span>
                    <button class="btn-danger" onclick="eliminarItem(${index})">X</button>
                `;
                container.appendChild(div);
            });
            
            actualizarTotal();
        };
        
        const actualizarTotal = () => {
            const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
            document.getElementById('total').textContent = total.toFixed(2);
        };
        
        const eliminarItem = (index) => {
            carrito.splice(index, 1);
            actualizarCarrito();
        };
        
        const limpiarFormulario = () => {
            document.getElementById('cantidad').value = '1';
            document.getElementById('productoSeleccionado').value = '';
            productoActual = null;
            document.querySelectorAll('.producto').forEach(p => p.classList.remove('selected'));
        };
        
        const limpiar = () => {
            carrito = [];
            actualizarCarrito();
            limpiarFormulario();
            document.getElementById('cliente').value = '';
        };
        
        const eliminar = () => {
            if (carrito.length > 0) {
                carrito.pop();
                actualizarCarrito();
            }
        };
        
        const guardar = () => {
            if (carrito.length === 0) {
                alert('No hay productos en el carrito');
                return;
            }
            
            const venta = {
                fecha: new Date().toLocaleString(),
                items: carrito,
                total: carrito.reduce((sum, item) => sum + item.subtotal, 0)
            };
            
            // Guardar en memoria (simulando almacenamiento)
            window.ventaGuardada = venta;
            mostrarTicket(venta, 'GUARDADA');
        };
        
        const confirmar = () => {
            if (carrito.length === 0) {
                alert('No hay productos en el carrito');
                return;
            }
            
            const venta = {
                fecha: new Date().toLocaleString(),
                items: carrito,
                total: carrito.reduce((sum, item) => sum + item.subtotal, 0)
            };
            
            mostrarTicket(venta, 'CONFIRMADA');
        };
        
        const mostrarTicket = (venta, estado) => {
            document.getElementById('pagina-venta').classList.add('hidden');
            document.getElementById('pagina-ticket').classList.remove('hidden');
            
            const ticket = document.getElementById('ticket');
            ticket.innerHTML = `
                <div class="ticket-header">
                    <h2>TICKET DE VENTA</h2>
                    <p>Estado: ${estado}</p>
                    <p>${venta.fecha}</p>
                </div>
                <div>
                    <p><strong>Cliente:</strong> ${venta.items[0]?.cliente || 'N/A'}</p>
                    <p><strong>Tipo Pago:</strong> ${venta.items[0]?.tipoPago || 'N/A'}</p>
                    <p><strong>Tipo Cliente:</strong> ${venta.items[0]?.tipoCliente || 'N/A'}</p>
                </div>
                <br>
                ${venta.items.map(item => `
                    <div class="ticket-item">
                        <span>${item.producto.nombre}</span>
                        <span>$${item.subtotal}</span>
                    </div>
                    <div style="font-size: 12px; color: #666;">
                        ${item.cantidad} x $${item.producto.precio}
                    </div>
                `).join('')}
                <div class="ticket-total">
                    <div class="ticket-item">
                        <span>TOTAL:</span>
                        <span>$${venta.total.toFixed(2)}</span>
                    </div>
                </div>
            `;
        };
        
        const volverVenta = () => {
            document.getElementById('pagina-ticket').classList.add('hidden');
            document.getElementById('pagina-venta').classList.remove('hidden');
            limpiar();
        };
        
        // Inicializar
        cargarProductos();