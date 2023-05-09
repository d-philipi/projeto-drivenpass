import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '../../src/app';
import { createUser } from '../factories/user-factory';
import jwt from 'jsonwebtoken';
import { duplicatedTitleError } from '../../src/services/credential-service/errors';
import { createCredential } from '../factories/credential-factory';
import { prisma } from '@/config';

beforeAll(async () => {
    await init();
    await cleanDb();
});

const server = supertest(app);

describe('POST /credential', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/credential');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.post('/credential').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.post('/credential').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('When token is valid', () => {
        const generateValidBody = () => ({
            title: faker.name.title(),
            url: faker.internet.url(),
            username: faker.internet.userName(),
            password: faker.internet.password(10),
        });

        it('should respond with status 400 when body is not given', async () => {
            const response = await server.post('/credential');

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 400 when body is not valid', async () => {
            const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

            const response = await server.post('/credential').send(invalidBody);

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 409 when there is an credential with given title', async () => {
            const body = generateValidBody();
            await createUser(body);

            const response = await server.post('/credential').send(body);

            expect(response.status).toBe(httpStatus.CONFLICT);
            expect(response.body).toEqual(duplicatedTitleError());
        });

        it('should respond with status 201 and with credential data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const credential = generateValidBody();
      
            const response = await server
              .post('/credential')
              .set('Authorization', `Bearer ${token}`)
              .send({ ...credential });
      
            expect(response.status).toEqual(httpStatus.CREATED);
            expect(response.body).toEqual({
              id: expect.any(Number),
              userId: user.id,
              title: credential.title,
              url: credential.url,
              username: credential.username,
              password: credential.password
            });
        });
      
        it('should insert a new credential in the database', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const credential = generateValidBody();
      
            const beforeCount = await prisma.credential.count();
      
            await server.post('/credential').set('Authorization', `Bearer ${token}`).send({ ...credential });
      
            const afterCount = await prisma.credential.count();
      
            expect(beforeCount).toEqual(0);
            expect(afterCount).toEqual(1);
        });
    })
});

describe('GET /credential', () => {});

describe('DELETE /credential', () => {});