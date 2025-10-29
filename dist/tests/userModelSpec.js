"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../src/models/user");
const store = new user_1.UserStore();
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
