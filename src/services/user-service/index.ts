import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { duplicatedEmailError, invalidCredentialsError } from './errors';
import userRepository from '../../repositories/users-repository';
import { exclude } from '../../utils/prisma-utils';
import sessionRepository from '../../repositories/session-repository';

export async function createUser({ email, password }: CreateUserParams): Promise<User> {

  await validateUniqueEmailOrFail(email);

  const hashedPassword = await bcrypt.hash(password, 12);
  return userRepository.create({
    email,
    password: hashedPassword,
  });
}

async function validateUniqueEmailOrFail(email: string) {
  const userWithSameEmail = await userRepository.findByEmail(email);
  if (userWithSameEmail) {
    throw duplicatedEmailError();
  }
}

export type CreateUserParams = Pick<User, 'email' | 'password'>;


async function signIn(params: SignInParams): Promise<SignInResult> {
    const { email, password } = params;
  
    const user = await getUserOrFail(email);
  
    await validatePasswordOrFail(password, user.password);
  
    const token = await createSession(user.id);
  
    return {
      user: exclude(user, 'password'),
      token,
    };
}
  
async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
    const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
    if (!user) throw invalidCredentialsError();
  
    return user;
}
  
async function createSession(userId: number) {
    const token = jwt.sign({ userId }, "top_secret");
    await sessionRepository.create({
      token,
      userId,
    });
  
    return token;
}
  
async function validatePasswordOrFail(password: string, userPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, userPassword);
    if (!isPasswordValid) throw invalidCredentialsError();
}
  
export type SignInParams = Pick<User, 'email' | 'password'>;
  
type SignInResult = {
    user: Pick<User, 'id' | 'email'>;
    token: string;
};
  
type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

const userService = {
    createUser,
    signIn
};
  
export default userService;