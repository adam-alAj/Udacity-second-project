"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
const db_1 = __importDefault(require("../db"));
class ProductStore {
    async index() {
        try {
            const conn = await db_1.default.connect();
            const sql = `SELECT * FROM products`;
            const result = await conn.query(sql);
            conn.release();
            return result.rows.map((row) => ({
                id: row.id,
                name: row.name,
                price: parseFloat(row.price),
                category: row.category,
            }));
        }
        catch (err) {
            throw new Error(`Cannot get products: ${err}`);
        }
    }
    async show(id) {
        try {
            const conn = await db_1.default.connect();
            const sql = `SELECT * FROM products WHERE id=($1)`;
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0].map((row) => ({
                id: row.id,
                name: row.name,
                price: parseFloat(row.price),
                category: row.category,
            }));
        }
        catch (err) {
            throw new Error(`Cannot find product ${id}: ${err}`);
        }
    }
    async create(p) {
        try {
            const conn = await db_1.default.connect();
            const sql = 'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [p.name, p.price, p.category]);
            conn.release();
            return result.rows[0].map((row) => ({
                id: row.id,
                name: row.name,
                price: parseFloat(row.price),
                category: row.category,
            }));
        }
        catch (err) {
            throw new Error(`Cannot add new product ${p.name}: ${err}`);
        }
    }
    async update(p) {
        try {
            const conn = await db_1.default.connect();
            const sql = 'UPDATE products SET name=$1, price=$2, category=$3 WHERE id=$4 RETURNING *';
            const result = await conn.query(sql, [p.name, p.price, p.category, p.id]);
            conn.release();
            return result.rows[0].map((row) => ({
                id: row.id,
                name: row.name,
                price: parseFloat(row.price),
                category: row.category,
            }));
        }
        catch (err) {
            throw new Error(`Cannot update product ${p.id}: ${err}`);
        }
    }
    async delete(id) {
        try {
            const conn = await db_1.default.connect();
            const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0].map((row) => ({
                id: row.id,
                name: row.name,
                price: parseFloat(row.price),
                category: row.category,
            }));
        }
        catch (err) {
            throw new Error(`Cannot delete product ${id}: ${err}`);
        }
    }
    async popularProducts() {
        try {
            const connection = await db_1.default.connect();
            const sql = `
      SELECT products.id, products.name, products.price, COUNT(order_products.product_id) AS order_count
      FROM order_products
      JOIN products ON order_products.product_id = products.id
      GROUP BY products.id
      ORDER BY order_count DESC
      LIMIT 5;
    `;
            const result = await connection.query(sql);
            connection.release();
            return result.rows.map((row) => ({
                id: row.id,
                name: row.name,
                price: parseFloat(row.price),
                category: row.category,
            }));
        }
        catch (err) {
            throw new Error(`Unable to get popular products: ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
