const db = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
    static async create(userData) {
        const { username, email, password } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const defaultAvatar = 'default-profile.jpg';

        // PostgreSQL uses RETURNING to get the inserted ID
        const query = 'INSERT INTO users (username, email, password, avatar, plan) VALUES ($1, $2, $3, $4, $5) RETURNING id';
        try {
            const { rows } = await db.query(query, [username, email, hashedPassword, defaultAvatar, 'Free']);
            return rows[0].id;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error(`Error al crear el usuario: ${error.message}`);
        }
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
        try {
            const { rows } = await db.query(query, [email]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw new Error(`Error al buscar usuario por email: ${error.message}`);
        }
    }

    static async findById(id, includePassword = false) {
        const columns = includePassword
            ? 'id, username, email, avatar, password, plan'
            : 'id, username, email, avatar, plan';

        const query = `SELECT ${columns} FROM users WHERE id = $1 LIMIT 1`;

        try {
            const { rows } = await db.query(query, [id]);
            if (!rows[0]) {
                return null;
            }
            const user = rows[0];

            // Valores por defecto si son nulos
            user.avatar = user.avatar || 'default-profile.jpg';
            user.plan = user.plan || 'Free';

            return user;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw new Error(`Error al buscar usuario por ID: ${error.message}`);
        }
    }

    static async updateProfile(userId, userData) {
        const updates = [];
        const values = [];
        const { username, email, password, avatar } = userData;

        if (username) {
            updates.push(`username = $${values.length + 1}`);
            values.push(username);
        }
        if (email) {
            updates.push(`email = $${values.length + 1}`);
            values.push(email);
        }
        if (password) {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                updates.push(`password = $${values.length + 1}`);
                values.push(hashedPassword);
            } catch (error) {
                console.error('Error hashing password:', error);
                throw new Error('Error al procesar la contraseña');
            }
        }
        if (avatar) {
            updates.push(`avatar = $${values.length + 1}`);
            values.push(avatar);
        }

        if (updates.length === 0) {
            return false;
        }

        values.push(userId);
        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;

        try {
            const { rowCount } = await db.query(query, values);
            return rowCount > 0;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw new Error(`Error al actualizar el perfil: ${error.message}`);
        }
    }

    static async updatePlan(userId, plan) {
        if (!['Free', 'Premium'].includes(plan)) {
            throw new Error('Plan inválido. Debe ser "Free" o "Premium"');
        }

        const query = 'UPDATE users SET plan = $1 WHERE id = $2';
        try {
            const { rowCount } = await db.query(query, [plan, userId]);
            return rowCount > 0;
        } catch (error) {
            console.error('Error updating user plan:', error);
            throw new Error(`Error al actualizar el plan: ${error.message}`);
        }
    }

    static async testConnection() {
        try {
            const result = await db.query('SELECT 1 as connected');
            return result.rows[0].connected === 1;
        } catch (error) {
            console.error('Database connection error:', error);
            return false;
        }
    }

    static async deleteById(userId) {
        try {
            // Eliminar dependencias primero (aunque Supabase suele usar CASCADE si se configuró)
            await db.query('DELETE FROM user_sections WHERE user_id = $1', [userId]);
            await db.query('DELETE FROM user_courses WHERE user_id = $1', [userId]);

            const query = 'DELETE FROM users WHERE id = $1';
            const { rowCount } = await db.query(query, [userId]);
            return rowCount > 0;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error(`Error al eliminar el usuario: ${error.message}`);
        }
    }
}

module.exports = UserModel;