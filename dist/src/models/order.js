"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
const db_1 = __importDefault(require("../db"));
class OrderStore {
    async index() {
        try {
            const conn = await db_1.default.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Cannot get orders: ${err}`);
        }
    }
    async show(id) {
        try {
            const conn = await db_1.default.connect();
            const sql = 'SELECT * FROM orders WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Cannot find order ${id}: ${err}`);
        }
    }
    async create(o) {
        try {
            const conn = await db_1.default.connect();
            const sql = 'INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *';
            const result = await conn.query(sql, [o.status, o.user_id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Cannot add new order: ${err}`);
        }
    }
    async addProduct(quantity, orderId, productId) {
        try {
            const conn = await db_1.default.connect();
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [quantity, orderId, productId]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Cannot add product ${productId} to order ${orderId}: ${err}`);
        }
    }
    async update(id, order) {
        try {
            const conn = await db_1.default.connect();
            const sql = 'UPDATE orders SET status = $1, user_id = $2 WHERE id = $3 RETURNING *';
            const result = await conn.query(sql, [order.status, order.user_id, id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not update order ${id}. Error: ${err}`);
        }
    }
    async delete(id) {
        try {
            const conn = await db_1.default.connect();
            const sql = 'DELETE FROM orders WHERE id = $1 RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not delete order ${id}. Error: ${err}`);
        }
    }
    async currentOrderByUser(userId) {
        try {
            const conn = await db_1.default.connect();
            const sql = 'SELECT * FROM orders WHERE user_id = $1 AND status = $2';
            const result = await conn.query(sql, [userId, 'active']);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find current order for user ${userId}. Error: ${err}`);
        }
    }
    async fiveMostRecentByUser(userId) {
        try {
            const conn = await db_1.default.connect();
            const sql = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC LIMIT 5';
            const result = await conn.query(sql, [userId]);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Unable to get five most recent orders for user ${userId}. Error: ${err}`);
        }
    }
}
exports.OrderStore = OrderStore;
