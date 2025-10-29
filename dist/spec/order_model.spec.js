"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../src/models/order");
const store = new order_1.OrderStore();
describe('Order Model', () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('should have an update method', () => {
        expect(store.update).toBeDefined();
    });
    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });
    it('should have a currentOrderByUser method', () => {
        expect(store.currentOrderByUser).toBeDefined();
    });
    let createdOrderId;
    it('create() should add a new order', async () => {
        const result = await store.create({
            status: 'active',
            user_id: 19, // تأكد أن المستخدم هذا موجود فعلاً (من pgAdmin)
        });
        createdOrderId = result.id;
        expect(result).toEqual({
            id: createdOrderId,
            status: 'active',
            user_id: 19,
        });
    });
    it('index() should return a list of orders', async () => {
        const result = await store.index();
        expect(result.length).toBeGreaterThan(0);
    });
    it('show() should return the correct order', async () => {
        const result = await store.show(createdOrderId);
        expect(result.id).toBe(createdOrderId);
    });
    it('update() should modify an order', async () => {
        const result = await store.update(String(createdOrderId), {
            status: 'complete',
            user_id: 19,
        });
        expect(result.status).toBe('complete');
    });
    it('delete() should remove an order', async () => {
        const result = await store.delete(String(createdOrderId));
        expect(result.id).toBe(createdOrderId);
    });
});
