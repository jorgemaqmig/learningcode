const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Obtener el token del header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Formato de token inválido' });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
        
        // Añadir la información del usuario decodificada a la request
        req.user = decoded;
        
        next();
    } catch (error) {
        console.error('Error de autenticación:', error);
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

module.exports = authMiddleware; 