import { Prisma } from '@prisma/client';
import { prisma } from '../../config';

async function create(data: SessionUncheckedCreateInput) {
  return prisma.session.create({
    data,
  });
}

const sessionRepository = {
  create,
};

export default sessionRepository;

export type SessionUncheckedCreateInput = {
  id?: number
  userId: number
  token: string
  createdAt?: Date | string
  updatedAt?: Date | string
}