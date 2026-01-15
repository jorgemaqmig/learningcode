const ChallengeModel = require('../models/challengeModel');

// Obtener todos los retos
exports.getAllChallenges = async (req, res) => {
    try {
        const userPlan = req.query.userPlan || 'Free';
        const challenges = await ChallengeModel.getAll(userPlan);
        res.json(challenges);
    } catch (error) {
        console.error('Error en getAllChallenges:', error);
        res.status(500).json({
            message: 'Error al obtener los retos',
            error: error.message,
            details: error.stack
        });
    }
};

// Obtener reto por ID
exports.getChallengeById = async (req, res) => {
    try {
        const challengeId = req.params.id;
        const userPlan = req.query.userPlan || 'Free';
        const challenge = await ChallengeModel.getById(challengeId, userPlan);

        if (challenge) {
            res.json(challenge);
        } else {
            res.status(404).json({ message: 'Reto no encontrado' });
        }
    } catch (error) {
        console.error('Error en getChallengeById:', error);
        res.status(500).json({ message: 'Error al obtener el reto', error: error.message });
    }
};

// Obtener retos por curso
exports.getChallengesByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userPlan = req.query.userPlan || 'Free';
        const challenges = await ChallengeModel.getByCourse(courseId, userPlan);
        res.json(challenges);
    } catch (error) {
        console.error('Error en getChallengesByCourse:', error);
        res.status(500).json({ message: 'Error al obtener los retos del curso', error: error.message });
    }
};

// Obtener retos por sección
exports.getChallengesBySection = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const userPlan = req.query.userPlan || 'Free';
        const challenges = await ChallengeModel.getBySection(sectionId, userPlan);
        res.json(challenges);
    } catch (error) {
        console.error('Error en getChallengesBySection:', error);
        res.status(500).json({ message: 'Error al obtener los retos de la sección', error: error.message });
    }
}; 