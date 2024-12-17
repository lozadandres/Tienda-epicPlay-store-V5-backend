// Importamos las dependencias necesarias
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Carga las variables de entorno al inicio del archivo

// Configuramos el servidor Express
const app = express();
app.use(express.json()); // Middleware para analizar JSON en las solicitudes
app.use(cors()); // Habilitar CORS para permitir solicitudes de diferentes orígenes

// Obtén la URI de MongoDB desde las variables de entorno
const mongoUri = process.env.MONGO_URI;
// Conectamos a MongoDB usando Mongoose
mongoose.connect(mongoUri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log("Conexión exitosa a MongoDB"))
  .catch((error) => console.error("Error al conectar con MongoDB:", error));

// Creamos un modelo de Mongoose para nuestros datos
const Item = mongoose.model("users", new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, default: 0 },
    category: { type: String, required: true }
}));

// Ruta para obtener todos los elementos
app.get("/items", async (req, res) => {
    const items = await Item.find();
    res.json(items); // Enviamos la lista de elementos en formato JSON
});

// Ruta para crear un nuevo elemento
//http://localhost:5000/items
app.post("/items", async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save(); // Guardamos el nuevo elemento en la base de datos
    res.status(201).json(newItem); // Enviamos el elemento creado en formato JSON
}); 

// Ruta para actualizar un elemento existente
app.put("/items/:id", async (req, res) => {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem); // Enviamos el elemento actualizado en formato JSON
});

// Ruta para eliminar un elemento
app.delete("/items/:id", async (req, res) => {
    await Item.findByIdAndDelete(req.params.id); // Eliminamos el elemento de la base de datos
    res.status(204).send(); // Enviamos un código de estado 204 sin contenido
});


// Definir el puerto en el que se ejecutará el servidor 
const port = process.env.PORT || 5000;

// Iniciar el servidor 
app.listen(port, () => { 
    console.log(`El servidor está ejecutándose en el puerto ${port}`); 
});