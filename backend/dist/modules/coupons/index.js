"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponsRoutes = exports.CouponRepository = exports.CouponService = exports.CouponController = void 0;
var coupon_controller_1 = require("./controller/coupon.controller");
Object.defineProperty(exports, "CouponController", { enumerable: true, get: function () { return coupon_controller_1.CouponController; } });
var coupon_service_1 = require("./service/coupon.service");
Object.defineProperty(exports, "CouponService", { enumerable: true, get: function () { return coupon_service_1.CouponService; } });
var coupon_repository_1 = require("./repository/coupon.repository");
Object.defineProperty(exports, "CouponRepository", { enumerable: true, get: function () { return coupon_repository_1.CouponRepository; } });
var coupon_routes_1 = require("./routes/coupon.routes");
Object.defineProperty(exports, "couponsRoutes", { enumerable: true, get: function () { return __importDefault(coupon_routes_1).default; } });
