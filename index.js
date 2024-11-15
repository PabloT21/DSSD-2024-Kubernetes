const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Almacenamiento en memoria para los Tokens
const tokenStorage = new Map();

// Función para generar un token único
function generateToken(collectionPointId) {
    const currentMonth = new Date().getMonth();
    const year = new Date().getFullYear();
    
    // Si ya existe un token para este punto en el mes actual, retornarlo
    const existingToken = tokenStorage.get(`${collectionPointId}-${currentMonth}-${year}`);
    if (existingToken) {
        return existingToken;
    }

    // Genera nuevo Token (número entre 10000 y 99999)
    const token = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
    
    // Almacena el token
    tokenStorage.set(`${collectionPointId}-${currentMonth}-${year}`, token);
    
    return token;
}

// Función para validad el ID ingresado
function isValidCollectionPointId(id) {
    return typeof id === 'string' && id.trim().length > 0;
}

// Endpoint para obtener el token:
// Parámetros:
// - collectionPointId: ID del punto de recolección 
app.post('/api/lottery/token', (req, res) => {
    const collectionPointId = req.body.collectionPointId;

    if (!isValidCollectionPointId(collectionPointId)) {
        return res.status(400).json({
            error: 'ID de punto de recolección inválido'
        });
    }

    try {
        const token = generateToken(collectionPointId);
        
        res.json({
            success: true,
            data: {
                collectionPointId,
                token,
                expirationDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 28, 20, 0, 0),
                message: 'Token generado con exito'
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al generar token'
        });
    }
});

// Health check para Kubernetes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});