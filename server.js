const express = require('express')

//Actualización para desplegar el Front-End
const cors = require('cors')//Permisos sobre el contenido a deplegar
const path = require('path') //Express servir el Front-End

// 
const productoRoutes = require('./routes/productoRoutes')
const clientesRoutes = require('./routes/clienteRoutes')

const app = express()
const PORT = process.env.PORT || 3000 //Puerto de la aplicación

//Acualización - Permisos Cors
app.use(cors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true
}))
//Actualización: Vamos a servir los documentos HTML, CSS, JS
app.use(express.static(path.join(__dirname, 'public')))

//http://localhost:3000 ->public>index.html
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
}) 
//Ruta para los clientes
app.get('/clientes', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'clientes.html'))
}) 

//Comunicación se realizará JSON
app.use(express.json())

//Rutas
app.use('/api/productos', productoRoutes)
app.use('/api/clientes', clientesRoutes)

//Iniciar el servidor
app.listen(PORT, ()=>{
    console.log(`Servidor iniciado http://localhost:${PORT}`);
})