import { authenticateToken } from '@/middlewares/authentication-middleware';
import { Router } from 'express';

import { forgetNetwork, newNetwork, searchNetwork } from '@/controllers';
import { networkSchema } from '@/schemas/network-schemas';
import { validateBody } from '@/middlewares/validation-middleware';

const credentialRouter = Router();

credentialRouter
    .all('/*', authenticateToken)
    .post('/', validateBody(networkSchema), newNetwork)
    .get('/:networkId', searchNetwork)
    .delete('/:networkId', forgetNetwork)

export { credentialRouter };