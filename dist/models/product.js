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
            return result.rows;
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
            return result.rows[0];
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
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Cannot add new product ${p.name}: ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
