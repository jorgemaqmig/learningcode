const db = require('../config/database');

class ProgressModel {
    static async markSectionAsCompleted(userId, sectionId, courseId) {
        // La restricción única en la DB es (user_id, course_id, section_id)
        const query = `
            INSERT INTO user_sections (user_id, section_id, course_id, completed_at) 
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
            ON CONFLICT (user_id, course_id, section_id) 
            DO UPDATE SET completed_at = CURRENT_TIMESTAMP
        `;
        try {
            await db.query(query, [userId, sectionId, courseId]);
            return true;
        } catch (error) {
            console.error('Error en markSectionAsCompleted:', error);
            throw new Error(`Error al marcar sección como completada: ${error.message}`);
        }
    }

    static async unmarkSectionAsCompleted(userId, sectionId) {
        const query = 'DELETE FROM user_sections WHERE user_id = $1 AND section_id = $2';
        try {
            const { rowCount } = await db.query(query, [userId, sectionId]);
            return rowCount > 0;
        } catch (error) {
            console.error('Error en unmarkSectionAsCompleted:', error);
            throw new Error(`Error al desmarcar sección: ${error.message}`);
        }
    }

    static async getCompletedSectionsForCourse(userId, courseId) {
        const query = `
            SELECT us.section_id
            FROM user_sections us
            INNER JOIN course_sections cs ON us.section_id = cs.id
            WHERE us.user_id = $1 
            AND us.course_id = $2
        `;

        try {
            const { rows } = await db.query(query, [userId, courseId]);
            return rows.map(row => row.section_id);
        } catch (error) {
            console.error('Error en getCompletedSectionsForCourse:', error);
            return [];
        }
    }

    static async updateCourseProgress(userId, courseId, percentage, status, completedAt) {
        const query = `
            INSERT INTO user_courses (user_id, course_id, progress_percentage, status, completed_at, last_updated_at)
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id, course_id) 
            DO UPDATE SET 
                progress_percentage = EXCLUDED.progress_percentage, 
                status = EXCLUDED.status, 
                completed_at = EXCLUDED.completed_at, 
                last_updated_at = CURRENT_TIMESTAMP
        `;
        try {
            await db.query(query, [userId, courseId, percentage, status, completedAt]);
            return true;
        } catch (error) {
            console.error('Error en updateCourseProgress:', error);
            throw new Error(`Error al actualizar progreso del curso: ${error.message}`);
        }
    }

    static async getCourseProgress(userId, courseId) {
        const query = 'SELECT * FROM user_courses WHERE user_id = $1 AND course_id = $2 LIMIT 1';
        try {
            const { rows } = await db.query(query, [userId, courseId]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error en getCourseProgress:', error);
            return null;
        }
    }

    static async getAllUserProgress(userId) {
        const query = 'SELECT * FROM user_courses WHERE user_id = $1 ORDER BY last_updated_at DESC';
        try {
            const { rows } = await db.query(query, [userId]);
            return rows;
        } catch (error) {
            console.error('Error en getAllUserProgress:', error);
            return [];
        }
    }
}

module.exports = ProgressModel;