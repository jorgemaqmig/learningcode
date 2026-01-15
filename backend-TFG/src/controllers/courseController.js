const CourseModel = require('../models/courseModel');
const ProgressModel = require('../models/progressModel');

class CourseController {
    static async getAllCourses(req, res) {
        try {
            const userPlan = req.query.userPlan || 'Free';
            const courses = await CourseModel.getAll(userPlan);
            res.json(courses);
        } catch (error) {
            console.error('Error getting courses:', error);
            res.status(500).json({
                message: 'Error al obtener los cursos',
                error: error.message,
                details: error.stack
            });
        }
    }

    static async getCourseById(req, res) {
        try {
            const courseId = req.params.id;
            const userPlan = req.query.userPlan || 'Free';
            const course = await CourseModel.getById(courseId, userPlan);
            if (course) {
                res.json(course);
            } else {
                res.status(404).json({ message: 'Curso no encontrado' });
            }
        } catch (error) {
            console.error('Error getting course:', error);
            res.status(500).json({ message: 'Error al obtener el curso', error: error.message });
        }
    }

    static async getCourseSections(req, res) {
        try {
            const courseId = req.params.id;
            const userId = req.query.userId;
            const userPlan = req.query.userPlan || 'Free';

            const sections = await CourseModel.getSections(courseId, userPlan);

            if (userId) {
                const completedSections = await ProgressModel.getCompletedSectionsForCourse(userId, courseId);

                const sectionsWithProgress = sections.map(section => ({
                    ...section,
                    completado: completedSections.includes(section.id)
                }));
                res.json(sectionsWithProgress);
            } else {
                res.json(sections.map(section => ({ ...section, completado: false })));
            }
        } catch (error) {
            console.error('Error getting course sections:', error);
            res.status(500).json({ message: 'Error al obtener las secciones', error: error.message });
        }
    }

    static async getCourseResources(req, res) {
        try {
            const courseId = req.params.id;
            const userPlan = req.query.userPlan || 'Free';

            const resources = await CourseModel.getDownloadableResources(courseId, userPlan);
            res.json(resources);
        } catch (error) {
            console.error('Error getting course resources:', error);
            res.status(500).json({ message: 'Error al obtener los recursos', error: error.message });
        }
    }

    static async getPremiumContent(req, res) {
        try {
            const courseId = req.params.id;
            const userPlan = req.query.userPlan;

            if (userPlan !== 'Premium') {
                return res.status(403).json({
                    message: 'Este contenido es exclusivo para usuarios Premium'
                });
            }

            const content = await CourseModel.getPremiumContent(courseId);
            res.json(content);
        } catch (error) {
            console.error('Error getting premium content:', error);
            res.status(500).json({ message: 'Error al obtener el contenido premium', error: error.message });
        }
    }
}

module.exports = CourseController;