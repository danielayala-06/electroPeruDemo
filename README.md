# Procedimientos

1. Clonar el repositorio
```bash
git clone 
```

2. Restaurar la BD
```sql
CREATE database electroperu;
USE electroperu;
-- creacion de la tabla productos
CREATE TABLE productos(
id INT auto_increment PRIMARY KEY,
descripcion VARCHAR(50) NOT NULL,
garantia TINYINT NOT NULL,
precio DECIMAL(7,2) NOT NULL
)ENGINE = INNODB;

INSERT INTO productos(descripcion, garantia, precio) values
('Teclado mecanico', 13, 400),
('Monitor', 2, 399);
SELECT * FROM productos;
```
3. Abir el proyecto _electroperu_ en VSCode

4. Abrir la terminal **CTRL + Ñ** escribit:
```cmd
npm install
```
Se ejecutará la instalación de todas las dependencias definidas en **package.json**

5. Crear e ingresar los parámetros en el archivo **.env**
6. Ejecutar el servidor (_nodemon_)
```
nodemon server
```
7.- Verificar cada verbo(GET/PUT/POST/DELETE) utilizando PostMan, ThunderClient
