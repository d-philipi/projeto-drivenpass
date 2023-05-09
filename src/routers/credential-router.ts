import { authenticateToken } from '@/middlewares/authentication-middleware';
import { Router } from 'express';

import { forgetCredential, newCredential, searchCredential } from '@/controllers';
import { credentialSchema } from '@/schemas/credential-schemas';
import { validateBody } from '@/middlewares/validation-middleware';

const credentialRouter = Router();

credentialRouter
    .all('/*', authenticateToken)
    .post('/', validateBody(credentialSchema),newCredential)
    .get('/', searchCredential)
    .delete('/:credentialId', forgetCredential)

export { credentialRouter };