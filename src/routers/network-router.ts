import { authenticateToken } from '@/middlewares/authentication-middleware';
import { Router } from 'express';


const networkRouter = Router();

networkRouter
    .all('/*', authenticateToken)
    .post('/',)
    .get('/',)
    .delete('/',)

export { networkRouter };