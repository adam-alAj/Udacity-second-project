"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//Health check
app.get('/ping', async (req, res) => {
    try {
        // quick db check
        const result = await db_1.default.query('SELECT 1+1 as result');
        res.json({ ok: true, db: result.rows[0].result });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: 'DB connection failed', detail: err });
    }
});
exports.default = app;
