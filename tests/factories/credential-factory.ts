import bcrypt from 'bcrypt';
import faker from '@faker-js/faker';
import { prisma } from '../../src/config';
import { Credential } from '@/protocols';

export async function createCredential(params: Partial<Credential> = {}, userId: number = 1): Promise<Credential> {
  const incomingPassword = params.password || faker.internet.password(6);
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);

  return prisma.credential.create({
    data: {
        title: params.title || faker.name.title(),
        url: params.url || faker.internet.url(),
        username: params.username || faker.internet.userName(),
        password: hashedPassword,
        userId: userId
    },
  });
}