import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new AIController();

router.post('/chat', authenticate, controller.chat);
router.get('/chats', authenticate, controller.getChats);
router.get('/chats/:id', authenticate, controller.getChatMessages);
router.post('/recommendations', authenticate, controller.getRecommendations);
router.post('/generate/questions', authenticate, controller.generateQuestions);
router.post('/grade', authenticate, controller.gradeSubmission);
router.post('/analyze', authenticate, controller.analyzeStudent);
router.post('/predict', authenticate, controller.predictPerformance);

export default router;
