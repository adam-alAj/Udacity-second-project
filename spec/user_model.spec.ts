import { UserStore } from '../src/models/user';
import client from '../src/db';

const store = new UserStore();

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
describe('User Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('create method should add a user', async () => {
    const result = await store.create({
      username: 'testuser',
      password: 'test123',
      firstname: 'Test',
      lastname: 'User'
    });

    expect(result.username).toEqual('testuser');
  });
});
