import bcrypt from 'bcrypt';
import faker from '@faker-js/faker';
import { prisma } from '../../src/config';
import { Network } from '@/protocols';

export async function createNetwork(params: Partial<Network> = {}, userId: number = 1): Promise<Network> {
  const incomingPassword = params.password || faker.internet.password(6);
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);

  return prisma.network.create({
    data: {
        title: params.title || faker.name.title(),
        network: params.network || faker.internet.userName(),
        password: hashedPassword,
        userId: userId
    },
  });
}