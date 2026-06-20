"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kdsRoutes = exports.KdsRepository = exports.KdsService = exports.KdsController = void 0;
var kds_controller_1 = require("./controller/kds.controller");
Object.defineProperty(exports, "KdsController", { enumerable: true, get: function () { return kds_controller_1.KdsController; } });
var kds_service_1 = require("./service/kds.service");
Object.defineProperty(exports, "KdsService", { enumerable: true, get: function () { return kds_service_1.KdsService; } });
var kds_repository_1 = require("./repository/kds.repository");
Object.defineProperty(exports, "KdsRepository", { enumerable: true, get: function () { return kds_repository_1.KdsRepository; } });
var kds_routes_1 = require("./routes/kds.routes");
Object.defineProperty(exports, "kdsRoutes", { enumerable: true, get: function () { return __importDefault(kds_routes_1).default; } });
