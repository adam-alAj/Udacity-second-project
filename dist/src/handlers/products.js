"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const store = new product_1.ProductStore();
const tokenSec = process.env.TOKEN_SECRET;
const index = async (_req, res) => {
    try {
        const products = await store.index();
        res.json(products);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
const show = async (req, res) => {
    try {
        const product = await store.show(parseInt(req.params.id));
        res.json(product);
    }
    catch (err) {
        res.status(404).json({ error: 'Product not found' });
    }
};
const create = async (req, res) => {
    try {
        const product = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
        };
        const newProduct = await store.create(product);
        res.json(newProduct);
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
};
const update = async (req, res) => {
    try {
        const product = {
            id: parseInt(req.params.id),
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        };
        const updatedProduct = await store.update(product);
        res.json(updatedProduct);
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
const popularProducts = async (_req, res) => {
    try {
        const products = await store.popularProducts();
        res.json(products);
    }
    catch (err) {
        res.status(400);
        res.json({ error: err.message });
    }
};
const productRoutes = (app) => {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products', create);
    app.put('/products/:id', verifyAuthToken, update);
    app.delete('/products/:id', verifyAuthToken, destroy);
    app.get('/products/popular', popularProducts);
};
exports.default = productRoutes;
