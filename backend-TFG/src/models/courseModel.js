const db = require('../config/database');

class CourseModel {
    static async getAll(userPlan = 'Free') {
        const query = userPlan === 'Premium'
            ? 'SELECT * FROM courses ORDER BY id ASC'
            : 'SELECT * FROM courses WHERE is_premium = FALSE ORDER BY id ASC';

        try {
            const { rows } = await db.query(query);
            return rows;
        } catch (error) {
            console.error('Error en getAll courses:', error);
            throw error;
        }
    }

    static async getById(id, userPlan = 'Free') {
        const query = 'SELECT * FROM courses WHERE id = $1 LIMIT 1';
        try {
            const { rows } = await db.query(query, [id]);
            const course = rows[0];

            if (!course) return null;

            if (course.is_premium && userPlan !== 'Premium') {
                throw new Error('Este curso es exclusivo para usuarios Premium');
            }

            return course;
        } catch (error) {
            console.error('Error en getById course:', error);
            throw error;
        }
    }

    static async getSections(courseId, userPlan = 'Free') {
        let query = 'SELECT * FROM course_sections WHERE course_id = $1';

        if (userPlan !== 'Premium') {
            query += ' AND is_premium = FALSE';
        }

        query += ' ORDER BY section_order ASC';

        try {
            const { rows } = await db.query(query, [courseId]);
            return rows;
        } catch (error) {
            console.error('Error en getSections:', error);
            throw error;
        }
    }

    static async getTotalSectionsCount(courseId, userPlan = 'Free') {
        const query = userPlan === 'Premium'
            ? 'SELECT COUNT(*) as total_sections FROM course_sections WHERE course_id = $1'
            : 'SELECT COUNT(*) as total_sections FROM course_sections WHERE course_id = $1 AND is_premium = FALSE';

        try {
            const { rows } = await db.query(query, [courseId]);
            return rows[0] ? parseInt(rows[0].total_sections, 10) : 0;
        } catch (error) {
            console.error('Error en getTotalSectionsCount:', error);
            return 0;
        }
    }

    static async getPremiumContent(courseId) {
        // Nota: Asegúrate de que esta tabla existe en Supabase
        const query = 'SELECT * FROM course_premium_content WHERE course_id = $1';
        try {
            const { rows } = await db.query(query, [courseId]);
            return rows;
        } catch (error) {
            // Si la tabla no existe aún, devolvemos array vacío en vez de romper
            console.warn('Tabla course_premium_content no encontrada o error:', error.message);
            return [];
        }
    }

    static async getDownloadableResources(courseId, userPlan = 'Free') {
        let query = 'SELECT * FROM course_resources WHERE course_id = $1';

        if (userPlan !== 'Premium') {
            query += ' AND is_premium = FALSE';
        }

        try {
            const { rows } = await db.query(query, [courseId]);
            return rows;
        } catch (error) {
            console.warn('Tabla course_resources no encontrada o error:', error.message);
            return [];
        }
    }
}

module.exports = CourseModel;
