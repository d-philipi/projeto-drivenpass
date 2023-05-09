import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

import { prisma } from '../src/config';

import { createUser } from './factories/user-factory';
import { createSession } from './factories/sessions-factory';


export async function cleanDb() {
  await prisma.credential.deleteMany({});
  await prisma.network.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
}

export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, "top_secret");

  await createSession(token);

  return token;
}
