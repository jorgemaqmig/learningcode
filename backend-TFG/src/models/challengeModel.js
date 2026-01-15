const db = require('../config/database');

exports.getAll = async (userPlan = 'Free') => {
    const query = userPlan === 'Premium'
        ? 'SELECT * FROM challenges ORDER BY id ASC'
        : 'SELECT * FROM challenges WHERE is_premium = 0 ORDER BY id ASC';

    try {
        const { rows } = await db.query(query);
        return rows.map(r => ({ ...r, is_premium: !!r.is_premium }));
    } catch (error) {
        console.error('Error en getAll challenges:', error);
        throw error;
    }
};

exports.getById = async (id, userPlan = 'Free') => {
    const query = 'SELECT * FROM challenges WHERE id = $1 LIMIT 1';
    try {
        const { rows } = await db.query(query, [id]);
        const challenge = rows[0] ? { ...rows[0], is_premium: !!rows[0].is_premium } : null;

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
        query += ' AND is_premium = 0';
    }

    query += ' ORDER BY created_at ASC';

    try {
        const { rows } = await db.query(query, [courseId]);
        return rows.map(r => ({ ...r, is_premium: !!r.is_premium }));
    } catch (error) {
        console.error('Error en getByCourse challenges:', error);
        return [];
    }
};

exports.getBySection = async (sectionId, userPlan = 'Free') => {
    let query = 'SELECT * FROM challenges WHERE section_id = $1';

    if (userPlan !== 'Premium') {
        query += ' AND is_premium = 0';
    }

    try {
        const { rows } = await db.query(query, [sectionId]);
        return rows.map(r => ({ ...r, is_premium: !!r.is_premium }));
    } catch (error) {
        console.error('Error en getBySection challenges:', error);
        return [];
    }
};