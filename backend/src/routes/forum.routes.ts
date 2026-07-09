import { Router } from 'express';
import { ForumController } from '../controllers/forum.controller';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createForumTopicSchema } from '../utils/validators';

const router = Router();
const controller = new ForumController();

router.get('/topics', controller.getTopics);
router.get('/topics/:id', controller.getTopicById);
router.post('/topics', authenticate, validateBody(createForumTopicSchema), controller.createTopic);
router.put('/topics/:id', authenticate, controller.updateTopic);
router.delete('/topics/:id', authenticate, controller.deleteTopic);
router.post('/topics/:id/replies', authenticate, controller.createReply);
router.put('/replies/:id', authenticate, controller.updateReply);
router.delete('/replies/:id', authenticate, controller.deleteReply);
router.post('/topics/:id/like', authenticate, controller.likeTopic);

export default router;
