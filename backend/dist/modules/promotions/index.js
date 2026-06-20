"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promotionsRoutes = exports.PromotionRepository = exports.PromotionService = exports.PromotionController = void 0;
var promotion_controller_1 = require("./controller/promotion.controller");
Object.defineProperty(exports, "PromotionController", { enumerable: true, get: function () { return promotion_controller_1.PromotionController; } });
var promotion_service_1 = require("./service/promotion.service");
Object.defineProperty(exports, "PromotionService", { enumerable: true, get: function () { return promotion_service_1.PromotionService; } });
var promotion_repository_1 = require("./repository/promotion.repository");
Object.defineProperty(exports, "PromotionRepository", { enumerable: true, get: function () { return promotion_repository_1.PromotionRepository; } });
var promotion_routes_1 = require("./routes/promotion.routes");
Object.defineProperty(exports, "promotionsRoutes", { enumerable: true, get: function () { return __importDefault(promotion_routes_1).default; } });
