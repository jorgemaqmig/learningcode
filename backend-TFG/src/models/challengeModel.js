const db = require('../config/database');

exports.getAll = async (userPlan = 'Free') => {
    const query = userPlan === 'Premium'
        ? 'SELECT * FROM challenges ORDER BY id ASC'
        : 'SELECT * FROM challenges WHERE is_premium = FALSE ORDER BY id ASC';

    try {
        const { rows } = await db.query(query);
        return rows;
    } catch (error) {
        console.error('Error en getAll challenges:', error);
        return [];
    }
};

exports.getById = async (id, userPlan = 'Free') => {
    const query = 'SELECT * FROM challenges WHERE id = $1 LIMIT 1';
    try {
        const { rows } = await db.query(query, [id]);
        const challenge = rows[0];

        if (!challenge) {
            return null;
        }

        if (challenge.is_premium && userPlan !== 'Premium') {
            throw new Error('Este reto es exclusivo para usuarios Premium');
        }

        return challenge;
    } catch (error) {
        console.error('Error en getById challenge:', error);
        throw error;
    }
};

exports.getByCourse = async (courseId, userPlan = 'Free') => {
    let query = 'SELECT * FROM challenges WHERE course_id = $1';

    if (userPlan !== 'Premium') {
        query += ' AND is_premium = FALSE';
    }

    query += ' ORDER BY created_at ASC';

    try {
        const { rows } = await db.query(query, [courseId]);
        return rows;
    } catch (error) {
        console.error('Error en getByCourse challenges:', error);
        return [];
    }
};

exports.getBySection = async (sectionId, userPlan = 'Free') => {
    let query = 'SELECT * FROM challenges WHERE section_id = $1';

    if (userPlan !== 'Premium') {
        query += ' AND is_premium = FALSE';
    }

    try {
        const { rows } = await db.query(query, [sectionId]);
        return rows;
    } catch (error) {
        console.error('Error en getBySection challenges:', error);
        return [];
    }
};