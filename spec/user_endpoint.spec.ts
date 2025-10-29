import supertest from 'supertest';
import app from '../src/server';
import client from '../src/db';

const request = supertest(app);

beforeAll(async () => {
  const conn = await client.connect();
  try {
    await conn.query('DELETE FROM order_products;');
    await conn.query('DELETE FROM orders;');
    await conn.query('DELETE FROM users;');
  } finally {
    conn.release();
  }
});


describe('User Endpoints', () => {
  let token: string;

  it('should create a new user and return a token', async () => {
    const response = await request.post('/users').send({
      username: 'adamtest',
      password: '123456',
      firstname: 'Adam',
      lastname: 'Alafandi'
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    token = response.body.token;
  });

  it('should get list of users when authenticated', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should fail to get users without token', async () => {
    const response = await request.get('/users');
    expect(response.status).toBe(401);
  });
});
