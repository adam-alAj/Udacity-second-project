"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAuthToken = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Missing authorization header' });
        }
        const token = authorizationHeader.split(' ')[1]; // شكلها: "Bearer TOKEN"
        const secret = process.env.TOKEN_SECRET;
        jsonwebtoken_1.default.verify(token, secret);
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.verifyAuthToken = verifyAuthToken;
exports.default = exports.verifyAuthToken;
