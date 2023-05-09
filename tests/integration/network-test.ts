import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '../../src/app';
import { createUser } from '../factories/user-factory';
import jwt from 'jsonwebtoken';
import { createNetwork } from '../factories/network-factory';
import { prisma } from '@/config';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
})

const server = supertest(app);

describe('POST /network', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/network');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.post('/network').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.post('/network').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('When token is valid', () => {
        const generateValidBody = () => ({
            title: faker.name.title(),
            network: faker.lorem.word(5),
            password: faker.internet.password(10),
        });

        it('should respond with status 400 when body is not given', async () => {
            const response = await server.post('/network');

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 400 when body is not valid', async () => {
            const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

            const response = await server.post('/network').send(invalidBody);

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 201 and with network data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const network = generateValidBody();
      
            const response = await server
              .post('/network')
              .set('Authorization', `Bearer ${token}`)
              .send({ ...network });
      
            expect(response.status).toEqual(httpStatus.CREATED);
            expect(response.body).toEqual({
              id: expect.any(Number),
              userId: user.id,
              title: network.title,
              network: network.network,
              password: network.password
            });
        });
      
        it('should insert a new network in the database', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const network = generateValidBody();
      
            const beforeCount = await prisma.network.count();
      
            await server.post('/network').set('Authorization', `Bearer ${token}`).send({ ...network });
      
            const afterCount = await prisma.network.count();
      
            expect(beforeCount).toEqual(0);
            expect(afterCount).toEqual(1);
        });
    })
})

describe('GET /network', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/network');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/network').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/network').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('When token is valid', () => {
        const generateValidBody = () => ({
            title: faker.name.title(),
            network: faker.lorem.word(5),
            password: faker.internet.password(10),
        });

        it('should respond with status 404 when user doesnt have a network yet', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
      
            const response = await server.get('/network').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 and with network data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const network = await createNetwork();
      
            const response = await server
              .get('/network')
              .set('Authorization', `Bearer ${token}`)
      
            expect(response.status).toEqual(httpStatus.CREATED);
            expect(response.body).toEqual({
              id: expect.any(Number),
              userId: user.id,
              title: network.title,
              network: network.network,
              password: network.password
            });
        });
    })
});

describe('DELETE /network', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.delete('/network');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.delete('/network').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.delete('/network').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('When token is valid', () => {
        const generateValidBody = () => ({
            title: faker.name.title(),
            network: faker.lorem.word(5),
            password: faker.internet.password(10),
        });

        it('should respond with status 404 when user doesnt have a network yet', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
      
            const response = await server.delete('/network').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should delete a network in the database', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const network = await createNetwork();
      
            const beforeCount = await prisma.network.count();
      
            await server.delete(`/network/${network.id}`).set('Authorization', `Bearer ${token}`);
      
            const afterCount = await prisma.network.count();
      
            expect(beforeCount).toEqual(1);
            expect(afterCount).toEqual(0);
        });
    })
});