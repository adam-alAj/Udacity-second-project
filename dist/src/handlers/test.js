"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verifyAuthToken_1 = __importDefault(require("../middleware/verifyAuthToken"));
const testRoutes = (app) => {
    app.get('/protected', verifyAuthToken_1.default, (req, res) => {
        res.json({ message: 'Access granted ✅' });
    });
};
exports.default = testRoutes;
