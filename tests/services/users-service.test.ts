import faker from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { cleanDb } from '../helpers';
import { prisma } from '@/config';
import { init } from '@/app';
import userService from './user-service';
import { duplicatedEmailError, invalidCredentialsError } from './user-service/errors';
import { createUser } from './user-service';
import { createUser as createUserSeed } from '../factories/user-factory';


beforeAll(async () => {
  await init();
  await cleanDb();
});

describe('createUser', () => {
  it('should throw duplicatedUserError if there is a user with given email', async () => {
    const existingUser = await createUserSeed();

    try {
      await userService.createUser({
        email: existingUser.email,
        password: faker.internet.password(6),
      });
      fail('should throw duplicatedUserError');
    } catch (error) {
      expect(error).toEqual(duplicatedEmailError());
    }
  });

  it('should create user when given email is unique', async () => {
    const user = await userService.createUser({
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    expect(user).toEqual(
      expect.objectContaining({
        id: dbUser.id,
        email: dbUser.email,
      }),
    );
  });

  it('should hash user password', async () => {
    const rawPassword = faker.internet.password(6);
    const user = await userService.createUser({
      email: faker.internet.email(),
      password: rawPassword,
    });

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    expect(dbUser.password).not.toBe(rawPassword);
    expect(await bcrypt.compare(rawPassword, dbUser.password)).toBe(true);
  });
});


describe('signIn', () => {
  const generateParams = () => ({
    email: faker.internet.email(),
    password: faker.internet.password(6),
  });

  it('should throw InvalidCredentialError if there is no user for given email', async () => {
    const params = generateParams();

    try {
      await userService.signIn(params);
      fail('should throw InvalidCredentialError');
    } catch (error) {
      expect(error).toEqual(invalidCredentialsError());
    }
  });

  it('should throw InvalidCredentialError if given password is invalid', async () => {
    const params = generateParams();
    await createUser({
      email: params.email,
      password: 'invalid-password',
    });

    try {
      await userService.signIn(params);
      fail('should throw InvalidCredentialError');
    } catch (error) {
      expect(error).toEqual(invalidCredentialsError());
    }
  });

  describe('when email and password are valid', () => {
    it('should return user data if given email and password are valid', async () => {
      const params = generateParams();
      const user = await createUser(params);

      const { user: signInUser } = await userService.signIn(params);
      expect(user).toEqual(
        expect.objectContaining({
          id: signInUser.id,
          email: signInUser.email,
        }),
      );
    });

    it('should create new session and return given token', async () => {
      const params = generateParams();
      const user = await createUser(params);

      const { token: createdSessionToken } = await userService.signIn(params);

      expect(createdSessionToken).toBeDefined();
      const session = await prisma.session.findFirst({
        where: {
          token: createdSessionToken,
          userId: user.id,
        },
      });
      expect(session).toBeDefined();
    });
  });
});