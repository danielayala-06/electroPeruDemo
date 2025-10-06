const API_URL = 'http://localhost:3000/api/productos'
        
        const formulario = document.getElementById('form-producto')
        const tabla = document.querySelector('#tabla-productos tbody')
        
        const idProducto = document.getElementById('idProducto') //Caja oculta para obtener el ID

        const descripcion = document.getElementById('descripcion')
        const garantia = document.getElementById('garantia')
        const precio = document.getElementById('precio')

        const btnCancelar = document.getElementById('btnCancelar')
        const btnGuardar = document.getElementById('btnGuardar')

        btnCancelar.addEventListener("click", ()=>{
            btnGuardar.innerText = 'Guardar'
        })

        //Obtener los datos (backend)

        async function obtenerProductos(){
            const response = await fetch(API_URL, {method:'get'});
            const productos = await response.json()
            //console.log(productos)
            
            //Creamos una nueva final y celdas con los datos contenidos en JSON
            tabla.innerHTML = '';

            productos.forEach(producto => {
                //Crea una nueva fila y celdas con los datos contenidos en JSON
                const row = tabla.insertRow()

                row.insertCell().textContent = producto.id
                row.insertCell().textContent = producto.descripcion
                row.insertCell().textContent = producto.garantia
                row.insertCell().textContent = producto.precio

                //La ultima celda contendrá 2 botones (funcionalidad)
                const actionCell = row.insertCell()
                
                //Botón 1: Editar
                const editButton = document.createElement('button')
                editButton.textContent = 'Editar'
                editButton.classList.add('btn')
                editButton.classList.add('btn-info')
                editButton.classList.add('btn-sm')
                editButton.onclick = ()=>cargarParaEdicion(producto)

                //Botón 2: Eliminar
                const deleteButton = document.createElement('button')
                deleteButton.textContent= 'Eliminar'
                deleteButton.classList.add('btn')
                deleteButton.classList.add('btn-danger')
                deleteButton.onclick = ()=> eliminarProducto(producto.id, producto.descripcion)

                //Agregamos ambos botones a la última celda
                actionCell.appendChild(editButton)
                actionCell.appendChild(deleteButton)
            });
            

        }
        
        async function eliminarProducto(id, descripcion){
            //console.log(id, descripcion)
            if(confirm(`¿Está seguro de eliminar el producto: ${descripcion}`)){
                try {
                    const response = await fetch(API_URL+`/${id}`,{
                        method: 'delete'
                    } )

                    if(!response.ok){
                        throw new Error(`Error al eliminar: ${descripcion}`)
                    }

                    //Eliminado correctamente
                    const result = await response.json()
                    console.log(result)
                    obtenerProductos()

                } catch (e) {
                    console.error(e)
                }
            }
        }

        //Al pulsar el botón Guardar (submit) - DEbemos verificar si: registrar | Actualizar
        formulario.addEventListener("submit", async(e)=>{
            e.preventDefault()//Anulamos el evnto submit
            
            const data = {
                descripcion: descripcion.value,
                garantia: parseInt(garantia.value),
                precio: parseFloat(precio.value)
            }
            //para guarda, necesitamos almacenar los datos en formato JSON
            //Preparamos un objeto JS con la misma estructura
            
            //Enviar los datos (1.URL, 2.VERBO, 3.TIPO DE DATO, 4.JSON)
            let response = null
            try {
                //¿Actualizamos o registramos?
                if(idProducto.value == ''){ //Si esta vacio creamos un nuevo producto
                    response = await fetch(API_URL, {
                        method:'post',
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(data)
                    }) 
                }else{
                    //Actualizar
                    response = await fetch(API_URL+`/${idProducto.value}`, {
                        method:'put',
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(data)
                    }) 
                }
                
                const result = await response.json()
                console.log(result)
                formulario.reset()
                
            } catch (e) {
                console.error(e)
            }
            obtenerProductos()
        })

        async function cargarParaEdicion(producto){
            idProducto.value = producto.id

            descripcion.value = producto.descripcion
            garantia.value = producto.garantia
            precio.value = producto.precio

            btnGuardar.innerText = 'Actualizar'
        }

        //Cuando la pagína este lista, se ejecutara el obtener productos
        document.addEventListener("DOMContentLoaded", obtenerProductos);