"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../db"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
});
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = parseInt(process.env.SALT_ROUNDS);
class UserStore {
    async index() {
        const conn = await pool.connect();
        const result = await conn.query('SELECT * FROM users');
        conn.release();
        return result.rows;
    }
    async show(id) {
        const conn = await pool.connect();
        const result = await conn.query('SELECT * FROM users WHERE id = $1', [id]);
        conn.release();
        return result.rows[0];
    }
    async create(u) {
        try {
            const conn = await pool.connect();
            const hash = bcrypt_1.default.hashSync(u.password + pepper, saltRounds);
            const result = await conn.query('INSERT INTO users (username, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING *', [u.username, hash, u.firstname, u.lastname]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Unable to create user (${u.username}): ${err}`);
        }
    }
    async update(u) {
        try {
            const conn = await db_1.default.connect();
            const sql = 'UPDATE users SET username=$2, password=$3, firstname=$4, lastname=$5 WHERE id=$1 RETURNING *';
            const result = await conn.query(sql, [u.username, u.password, u.firstname, u.lastname, u.id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Cannot update user ${u.id}: ${err}`);
        }
    }
    async delete(id) {
        try {
            const conn = await db_1.default.connect();
            const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Cannot delete user ${id}: ${err}`);
        }
    }
    async authenticate(username, password) {
        const conn = await pool.connect();
        const result = await conn.query('SELECT * FROM users WHERE username =1$', [username]);
        conn.release();
        if (result.rows.length) {
            const user = result.rows[0];
            if (bcrypt_1.default.compareSync(password + pepper, user.password)) {
                return user;
            }
        }
        return null;
    }
}
exports.UserStore = UserStore;
