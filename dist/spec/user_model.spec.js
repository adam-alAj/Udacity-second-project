"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../src/models/user");
const db_1 = __importDefault(require("../src/db"));
const store = new user_1.UserStore();
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
