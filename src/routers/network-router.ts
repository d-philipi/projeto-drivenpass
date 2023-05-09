import { authenticateToken } from '@/middlewares/authentication-middleware';
import { Router } from 'express';

import { forgetNetwork, newNetwork, searchNetwork } from '@/controllers';

const credentialRouter = Router();

credentialRouter
    .all('/*', authenticateToken)
    .post('/', newNetwork)
    .get('/:networkId', searchNetwork)
    .delete('/:networkId', forgetNetwork)

export { credentialRouter };