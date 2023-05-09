import Joi from 'joi';
import { Credential } from '@/protocols';

export const credentialSchema = Joi.object<Credential>({
    title: Joi.string().required(),
    url: Joi.string().uri().required(),
    username: Joi.string().required(),
    password: Joi.string().min(10).required()
});