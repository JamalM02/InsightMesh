import { Router } from 'express';
import eventRoutes from './event.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
router.use('/events', eventRoutes);

export default router;
