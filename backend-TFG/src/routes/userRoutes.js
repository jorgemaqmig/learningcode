const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const db = require('../config/database');

const router = express.Router();

// Asegurarse de que existe el directorio de uploads
const ensureUploadDir = async () => {
    const uploadDir = path.join(__dirname, '../../uploads/profileimages');
    try {
        await fs.access(uploadDir);
    } catch (error) {
        await fs.mkdir(uploadDir, { recursive: true });
    }
    return uploadDir;
};

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            const uploadDir = await ensureUploadDir();
            cb(null, uploadDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        // Generar un nombre temporal único para el archivo
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `temp-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
        return cb(new Error('Solo se permiten imágenes (jpg, jpeg, png)'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: fileFilter
});

router.get('/setup-db', async (req, res) => {
    try {
        // En PostgreSQL, comprobamos information_schema
        const checkQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'avatar'
        `;
        const { rows } = await db.query(checkQuery);

        if (rows.length === 0) {
            await db.query(`
                ALTER TABLE users
                ADD COLUMN avatar VARCHAR(255) DEFAULT 'default-profile.jpg'
            `);

            await db.query(`
                UPDATE users 
                SET avatar = 'default-profile.jpg' 
                WHERE avatar IS NULL
            `);
        }

        res.json({ message: 'Database setup completed successfully' });
    } catch (error) {
        console.error('Database setup error:', error);
        res.status(500).json({
            message: 'Error setting up database',
            error: error.message
        });
    }
});

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile',
    authMiddleware,
    upload.single('avatar'),
    UserController.updateProfile
);
router.get('/profile/picture/:userId', UserController.getProfilePicture);

router.patch('/plan', authMiddleware, UserController.updatePlan);

router.delete('/profile', authMiddleware, UserController.deleteProfile);

module.exports = router;