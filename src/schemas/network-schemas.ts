import Joi from 'joi';
import { Network } from '@/protocols';

export const networkSchema = Joi.object<Network>({
    title: Joi.string().required(),
    network: Joi.string().required(),
    password: Joi.string().min(10).required()
});