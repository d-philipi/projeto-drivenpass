import bcrypt from 'bcrypt';
import faker from '@faker-js/faker';
import { prisma } from '../../src/config';
import { Credential } from '@/protocols';

type CredentialResponse = {
  id: number;
  userId: number;
  title: string;
  url: string;
  username: string;
  password: string;
}

export async function createCredential(params: Partial<CredentialResponse> = {}, userId: number = 1): Promise<CredentialResponse> {
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