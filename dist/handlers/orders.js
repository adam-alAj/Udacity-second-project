"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../models/order");
const store = new order_1.OrderStore();
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
const orderRoutes = (app) => {
    app.get('/orders', index);
    app.get('/orders/:id', show);
    app.post('/orders', create);
    app.post('/orders/:id/products', addProduct);
};
exports.default = orderRoutes;
