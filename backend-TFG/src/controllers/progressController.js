const ProgressModel = require('../models/progressModel');
const CourseModel = require('../models/courseModel');
const db = require('../config/database');

class ProgressController {
    static async _updateCourseProgress(userId, courseId) {
        // Obtener el plan del usuario desde la base de datos
        const userQuery = 'SELECT plan FROM users WHERE id = $1';
        const { rows: userRows } = await db.query(userQuery, [userId]);
        const userPlan = userRows[0]?.plan || 'Free';
        
        // Obtener secciones completadas con información de premium
        const query = `
            SELECT us.section_id, cs.is_premium
            FROM user_sections us
            INNER JOIN course_sections cs ON us.section_id = cs.id
            WHERE us.user_id = $1 AND us.course_id = $2 AND cs.course_id = $3
            ORDER BY cs.section_order
        `;
        const { rows: completedRows } = await db.query(query, [userId, courseId, courseId]);
        
        // Filtrar secciones según el plan del usuario
        const completedSections = userPlan === 'Premium' 
            ? completedRows 
            : completedRows.filter(row => !row.is_premium);
        
        // Obtener el total de secciones según el plan del usuario
        const totalSections = await CourseModel.getTotalSectionsCount(courseId, userPlan);

        if (typeof totalSections !== 'number') {
            throw new Error('Failed to retrieve total sections count as a number.');
        }

        // Calcular el porcentaje
        const progressPercentage = totalSections > 0 ? Math.round((completedSections.length / totalSections) * 100) : 0;
        
        let courseStatus = 'in_progress';
        let courseCompletedAt = null;

        if (progressPercentage === 100) {
            courseStatus = 'completed';
            courseCompletedAt = new Date();
        } else if (progressPercentage === 0 && completedSections.length === 0) {
            courseStatus = 'not_started';
        }
        
        await ProgressModel.updateCourseProgress(userId, courseId, progressPercentage, courseStatus, courseCompletedAt);
        return { progressPercentage, status: courseStatus };
    }

    static async markSectionComplete(req, res) {
        const { userId, courseId, sectionId } = req.params;
        try {
            await ProgressModel.markSectionAsCompleted(userId, sectionId, courseId);
            const progress = await ProgressController._updateCourseProgress(userId, courseId);
            res.status(200).json({ message: 'Sección marcada como completada.', progress });
        } catch (error) {
            console.error('Error al marcar sección como completada:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    }

    static async unmarkSectionComplete(req, res) {
        const { userId, courseId, sectionId } = req.params;
        try {
            await ProgressModel.unmarkSectionAsCompleted(userId, sectionId);
            const progress = await ProgressController._updateCourseProgress(userId, courseId);
            res.status(200).json({ message: 'Sección desmarcada.', progress });
        } catch (error) {
            console.error('Error al desmarcar sección:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    }

    static async getCourseProgress(req, res) {
        const { userId, courseId } = req.params;
        try {
            const courseProgress = await ProgressModel.getCourseProgress(userId, courseId);
            const completedSections = await ProgressModel.getCompletedSectionsForCourse(userId, courseId);
            if (!Array.isArray(completedSections)) {
                console.error('[ProgressController] CRITICAL: completedSections in getCourseProgress is not an array! Value:', completedSections);
                 return res.status(500).json({ message: 'Internal error: completedSections format incorrect in getCourseProgress.' });
            }

            if (courseProgress) {
                res.json({ ...courseProgress, completed_sections: completedSections });
            } else {
                const totalSections = await CourseModel.getTotalSectionsCount(courseId);
                if (totalSections === null || typeof totalSections !== 'number') {
                    console.error(`[ProgressController] Failed to get total sections for course ${courseId} or it's not a number. Value: ${totalSections}`);
                    return res.status(404).json({ message: 'Curso no encontrado o error al obtener número de secciones.' });
                }
                res.json({
                    user_id: userId,
                    course_id: courseId,
                    progress_percentage: 0,
                    status: 'not_started',
                    completed_at: null,
                    completed_sections: []
                });
            }
        } catch (error) {
            console.error('[ProgressController] Error in getCourseProgress:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    }

    static async getAllUserProgress(req, res) {
        const { userId } = req.params;
        try {
            const allProgress = await ProgressModel.getAllUserProgress(userId);
            
            res.json(allProgress);
        } catch (error) {
            console.error('[ProgressController] Error al obtener todo el progreso del usuario:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    }
}

module.exports = ProgressController;