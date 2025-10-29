"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../src/models/product");
const db_1 = __importDefault(require("../src/db"));
const store = new product_1.ProductStore();
describe('Product Model', () => {
    const testProduct = {
        name: 'Test Product',
        price: 99.99,
        category: 'Test Category'
    };
    let createdProduct;
    beforeAll(async () => {
        const conn = await db_1.default.connect();
        await conn.query('DELETE FROM order_products;');
        await conn.query('DELETE FROM orders;');
        await conn.query('DELETE FROM products;');
        conn.release();
    });
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
    it('create() should add a product', async () => {
        createdProduct = await store.create(testProduct);
        expect(createdProduct).toEqual(jasmine.objectContaining({
            name: testProduct.name,
            price: testProduct.price,
            category: testProduct.category
        }));
    });
    it('index() should return a list of products', async () => {
        const result = await store.index();
        expect(result.length).toBeGreaterThan(0);
    });
    it('show() should return the correct product', async () => {
        const result = await store.show(createdProduct.id);
        expect(result).toEqual(createdProduct);
    });
    it('update() should modify a product', async () => {
        const updated = await store.update({
            id: createdProduct.id,
            name: 'Updated Product',
            price: 199.99,
            category: 'Updated Category'
        });
        expect(updated.name).toBe('Updated Product');
        expect(updated.price).toBe(199.99);
    });
    it('popularProducts() should return a list (even if empty)', async () => {
        const popular = await store.popularProducts();
        expect(popular).toBeInstanceOf(Array);
    });
    it('delete() should remove the product', async () => {
        await store.delete(createdProduct.id.toString());
        const products = await store.index();
        const exists = products.find((p) => p.id === createdProduct.id);
        expect(exists).toBeUndefined();
    });
});
