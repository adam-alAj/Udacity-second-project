import supertest from 'supertest';
import app from '../src/server';
import { ProductStore } from '../src/models/product';
import jwt from 'jsonwebtoken';

const request = supertest(app);
const store = new ProductStore();

describe('Product API Endpoints', () => {
  let token: string;
  let productId: number;

  beforeAll(async () => {
    token = jwt.sign({ user_id: 19, username: 'testuser' }, process.env.TOKEN_SECRET as string);
  });

  it('POST /products should create a new product', async () => {
    const response = await request
      .post('/products')
      .send({ name: 'API Product', price: 10, category: 'API Category' });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('API Product');
    productId = response.body.id;
  });

  it('GET /products should return all products', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /products/:id should return a single product', async () => {
    const response = await request.get(`/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
  });

  it('PUT /products/:id should update a product (with auth)', async () => {
    const response = await request
      .put(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated via API', price: 20, category: 'Updated' });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated via API');
  });

  it('DELETE /products/:id should delete a product (with auth)', async () => {
    const response = await request
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('GET /products/popular should return popular products', async () => {
    const response = await request.get('/products/popular');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTrue();
  });

  it('PUT /products/:id should fail without token', async () => {
    const response = await request.put(`/products/${productId}`).send({ name: 'Fail test' });
    expect(response.status).toBe(401);
  });
});
