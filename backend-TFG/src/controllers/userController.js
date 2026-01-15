const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');

// Función auxiliar para asegurarse de que existe el directorio
async function ensureDirectoryExists(directory) {
    try {
        await fs.access(directory);
    } catch (error) {
        // Si el directorio no existe, lo creamos
        await fs.mkdir(directory, { recursive: true });
    }
}

class UserController {
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Validaciones básicas
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos'
                });
            }

            // Crear nuevo usuario
            const userId = await UserModel.create({ username, email, password });

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                userId
            });
        } catch (error) {
            console.error('Error en el registro:', error);
            res.status(500).json({
                success: false,
                message: 'Error al registrar el usuario',
                details: error.message
            });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email y contraseña requeridos' });
            }

            // Busca el usuario por email
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
            }

            // Verifica la contraseña
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
            }

            const { password: _, ...userWithoutPassword } = user;

            // Generar token JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    username: user.username
                },
                process.env.JWT_SECRET || 'tu_clave_secreta',
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                user: userWithoutPassword,
                token: token
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error al iniciar sesión',
                details: error.message
            });
        }
    }

    static async getProfile(req, res) {
        try {

            const userId = req.user.id;

            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(404).json({
                    message: 'Usuario no encontrado',
                    details: `No se encontró ningún usuario con el ID: ${userId}`
                });
            }

            const { password, ...userWithoutPassword } = user;

            res.json(userWithoutPassword);
        } catch (error) {
            console.error('Error getting profile:', error);
            res.status(500).json({
                message: 'Error al obtener el perfil',
                details: error.message
            });
        }
    }

    static async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const updateData = {};
            if (req.body.username) {
                updateData.username = req.body.username;
            }
            if (req.body.email) {
                updateData.email = req.body.email;
            }

            // Manejar el cambio de contraseña
            if (req.body.currentPassword && req.body.newPassword) {
                // Verificar la contraseña actual
                const user = await UserModel.findById(userId, true);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'Usuario no encontrado'
                    });
                }

                if (!user.password) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error en la configuración de la cuenta',
                        details: 'No hay contraseña configurada'
                    });
                }

                try {
                    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
                    if (!isMatch) {
                        return res.status(400).json({
                            success: false,
                            message: 'La contraseña actual es incorrecta'
                        });
                    }
                    updateData.password = req.body.newPassword;
                } catch (error) {
                    console.error('Error verifying password:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error al verificar la contraseña',
                        details: error.message
                    });
                }
            }

            // Manejar la imagen de perfil si se subió una
            if (req.file) {
                try {
                    // Convertir el buffer de la imagen a Base64
                    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
                    updateData.avatar = base64Image;
                } catch (error) {
                    return res.status(500).json({
                        success: false,
                        message: 'Error al procesar la imagen de perfil',
                        details: error.message
                    });
                }
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No se proporcionaron datos para actualizar'
                });
            }

            const success = await UserModel.updateProfile(userId, updateData);

            if (!success) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el perfil'
                });
            }

            const updatedUser = await UserModel.findById(userId);

            res.json({
                success: true,
                user: updatedUser,
                message: 'Perfil actualizado correctamente'
            });
        } catch (error) {
            console.error('Error detallado al actualizar el perfil:', error);
            console.error('Stack trace:', error.stack);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                details: error.message
            });
        }
    }

    static async getProfilePicture(req, res) {
        try {
            const userId = req.params.userId;
            const user = await UserModel.findById(userId);

            if (!user || !user.avatar || user.avatar === 'default-profile.jpg' || !user.avatar.startsWith('data:image')) {
                // Para simplificar, si no hay base64, devolvemos un 404 o una imagen por defecto local
                // Pero como estamos en Vercel, no podemos confiar en archivos locales.
                // En el frontend manejaremos el caso de default-profile.jpg
                return res.status(404).send('No profile picture found');
            }

            // Extraer el tipo mime y la data base64
            const matches = user.avatar.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                return res.status(400).send('Invalid avatar data');
            }

            const contentType = matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');

            res.set('Content-Type', contentType);
            res.send(buffer);
        } catch (error) {
            console.error('Error al obtener la imagen de perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener la imagen de perfil',
                details: error.message
            });
        }
    }

    static async updatePlan(req, res) {
        try {

            const userId = req.user.id;
            const { plan } = req.body;

            // Validar el plan
            if (!plan || !['Free', 'Premium'].includes(plan)) {
                return res.status(400).json({
                    success: false,
                    message: 'Plan no válido. Debe ser "Free" o "Premium"'
                });
            }

            // Obtener el usuario actual para verificar si ya tiene ese plan
            const currentUser = await UserModel.findById(userId);
            if (currentUser.plan === plan) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya tienes este plan activo'
                });
            }

            // Actualizar el plan
            const success = await UserModel.updatePlan(userId, plan);
            if (!success) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el plan'
                });
            }

            // Obtener el usuario actualizado
            const updatedUser = await UserModel.findById(userId);

            res.json({
                success: true,
                message: `Plan actualizado a ${plan} exitosamente`,
                user: updatedUser
            });
        } catch (error) {
            console.error('Error al actualizar el plan:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                details: error.message
            });
        }
    }

    static async deleteProfile(req, res) {
        try {
            const userId = req.user.id;
            const deleted = await UserModel.deleteById(userId);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado o ya eliminado'
                });
            }
            res.json({
                success: true,
                message: 'Cuenta eliminada correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar la cuenta:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar la cuenta',
                error: error.message
            });
        }
    }
}

module.exports = UserController;