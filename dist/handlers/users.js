"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const store = new user_1.UserStore();
const tokenSec = process.env.TOKEN_SECRET;
// create new user
const create = async (req, res) => {
    try {
        const user = {
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        };
        const newUser = await store.create(user);
        const token = jsonwebtoken_1.default.sign({ user: newUser }, tokenSec);
        res.json({ token });
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
};
const authenticate = async (req, res) => {
    try {
        const { username, password } = req.body;
        const u = await store.authenticate(username, password);
        if (!u) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jsonwebtoken_1.default.sign({ user: u }, tokenSec);
        res.json({ token });
    }
    catch (err) {
        res.status(401).json({ error: `${err}` });
    }
};
// get all users
const index = async (_req, res) => {
    try {
        const users = await store.index();
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
// get single user
const show = async (req, res) => {
    try {
        const user = await store.show(parseInt(req.params.id));
        res.json(user);
    }
    catch (err) {
        res.status(404).json({ error: 'User not found' });
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
const userRoutes = (app) => {
    app.get('/users', verifyAuthToken, index);
    app.get('/users/:id', verifyAuthToken, show);
    app.post('/users', create);
    app.post('/users/authenticate', authenticate);
};
exports.default = userRoutes;
