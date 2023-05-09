import { Router } from 'express';

import { newUser, singInPost } from '../controllers/users-controller';
import { createUserSchema, signInSchema } from '../schemas/users-schemas';
import { validateBody } from '../middlewares/validation-middleware';

const usersRouter = Router();

usersRouter
    .post('/', validateBody(createUserSchema), newUser)
    .post('/sign-in', validateBody(signInSchema), singInPost);

export { usersRouter };