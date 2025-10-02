const express = require('express')
const productoRoutes = require('./routes/productoRoutes')

const app = express()
const PORT = process.env.PORT || 3000 //Puerto de la aplicación

//Comunicación se realizará JSON
app.use(express.json())

//Rutas
app.use('/api/productos', productoRoutes)

//Iniciar el servidor
app.listen(PORT, ()=>{
    console.log(`Servidor iniciado http://localhost:${PORT}`);
})