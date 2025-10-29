"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../src/server"));
const db_1 = __importDefault(require("../src/db"));
const request = (0, supertest_1.default)(server_1.default);
beforeAll(async () => {
    const conn = await db_1.default.connect();
    try {
        await conn.query('DELETE FROM order_products;');
        await conn.query('DELETE FROM orders;');
        await conn.query('DELETE FROM users;');
    }
    finally {
        conn.release();
    }
});
describe('User Endpoints', () => {
    let token;
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
