"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const strongErrorHandler = require("strong-error-handler");
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const user_routes_1 = require("./user/user.routes");
const like_routes_1 = require("./like/like.routes");
const auth_routes_1 = require("./auth/auth.routes");
const passport = require("passport");
const auth_service_1 = require("./auth/auth.service");
exports.app = express_1.default();
const authService = new auth_service_1.AuthService();
authService.setupPassport();
exports.app.use(body_parser_1.json());
if (process.env.NODE_ENV != 'DEVELOPMENT') {
    exports.app.use(cors_1.default());
}
exports.app.use(passport.initialize());
exports.app.use(user_routes_1.userRouterFactory());
exports.app.use(like_routes_1.likeRouterFactory());
exports.app.use(auth_routes_1.authRouterFactory());
exports.app.use(strongErrorHandler({
    debug: true,
}));
