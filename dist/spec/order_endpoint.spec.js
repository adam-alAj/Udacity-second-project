"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../src/server"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const request = (0, supertest_1.default)(server_1.default);
const token = jsonwebtoken_1.default.sign({ user_id: 19, username: 'testuser' }, process.env.TOKEN_SECRET);
describe('Order API Endpoints', () => {
    let orderId;
    it('POST /orders should create an order', async () => {
        const response = await request
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
            status: 'active',
            user_id: 19,
        });
        expect(response.status).toBe(200);
        orderId = response.body.id;
        expect(response.body.status).toBe('active');
    });
    it('GET /orders should return all orders', async () => {
        const response = await request
            .get('/orders')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });
    it('GET /orders/:id should return a specific order', async () => {
        const response = await request
            .get(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(orderId);
    });
    it('PUT /orders/:id should update an order', async () => {
        const response = await request
            .put(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'complete', user_id: 19 });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('complete');
    });
    it('GET /users/:user_id/orders/current should return current order', async () => {
        const response = await request
            .get(`/users/19/orders/current`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    it('DELETE /orders/:id should delete an order', async () => {
        const response = await request
            .delete(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
});
