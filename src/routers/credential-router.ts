import { authenticateToken } from '@/middlewares/authentication-middleware';
import { Router } from 'express';

import { forgetCredential, newCredential, searchCredential } from '@/controllers';

const credentialRouter = Router();

credentialRouter
    .all('/*', authenticateToken)
    .post('/', newCredential)
    .get('/:credentialId', searchCredential)
    .delete('/:credentialId', forgetCredential)

export { credentialRouter };