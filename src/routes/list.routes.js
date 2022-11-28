import { Router } from 'express';
import consultantRouter from './consultants.routes';
// import clientRouter from './clients.routes';

const router = Router();

router.use('/consultant', consultantRouter);
// router.use('/client', clientRouter);

export default router;