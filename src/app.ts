import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';

import { connectDb, disconnectDB, loadEnv } from './config';

loadEnv();

import {
  credentialRouter,
  networkRouter,
  usersRouter,
} from './routers';


const app = express();
app
  .use(cors())
  .use(express.json())
  .get('/health', (_req, res) => res.send('OK!'))
  .use('/users', usersRouter)
  .use('/credential', credentialRouter)
  .use('/network', networkRouter)

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;