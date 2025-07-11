import { createEvent } from '@controllers/events';
import { apiKeyAuth } from '@middleware';
import { Router } from 'express';

const router = Router();

router.post('/', apiKeyAuth, createEvent);

export default router;
