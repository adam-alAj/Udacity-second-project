"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../models/order");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const store = new order_1.OrderStore();
const tokenSec = process.env.TOKEN_SECRET;
const index = async (_req, res) => {
    const orders = await store.index();
    res.json(orders);
};
const show = async (req, res) => {
    const order = await store.show(parseInt(req.params.id));
    res.json(order);
};
const create = async (req, res) => {
    const order = {
        status: req.body.status,
        user_id: req.body.user_id,
    };
    const newOrder = await store.create(order);
    res.json(newOrder);
};
const addProduct = async (req, res) => {
    const orderId = parseInt(req.params.id);
    const productId = parseInt(req.body.product_id);
    const quantity = parseInt(req.body.quantity);
    const addedProduct = await store.addProduct(quantity, orderId, productId);
    res.json(addedProduct);
};
const update = async (req, res) => {
    try {
        const updated = await store.update(req.params.id, req.body);
        res.json(updated);
    }
    catch (err) {
        res.status(400).json(err);
    }
};
const destroy = async (req, res) => {
    try {
        const deleted = await store.delete(req.params.id);
        res.json(deleted);
    }
    catch (err) {
        res.status(400).json(err);
    }
};
const currentOrderByUser = async (req, res) => {
    try {
        const userId = req.params.user_id;
        const order = await store.currentOrderByUser(userId);
        res.json(order);
    }
    catch (err) {
        res.status(400).json(err);
    }
};
const verifyAuthToken = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(' ')[1];
        jsonwebtoken_1.default.verify(token, tokenSec);
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Access denied, invalid token' });
    }
};
const orderRoutes = (app) => {
    app.get('/orders', index);
    app.get('/orders/:id', show);
    app.post('/orders', create);
    app.post('/orders/:id/products', addProduct);
    app.put('/orders/:id', verifyAuthToken, update);
    app.delete('/orders/:id', verifyAuthToken, destroy);
    app.get('/users/:user_id/orders/current', verifyAuthToken, currentOrderByUser);
};
exports.default = orderRoutes;
