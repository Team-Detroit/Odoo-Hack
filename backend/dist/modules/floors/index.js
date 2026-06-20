"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.floorsRoutes = exports.FloorRepository = exports.FloorService = exports.FloorController = void 0;
var floor_controller_1 = require("./controller/floor.controller");
Object.defineProperty(exports, "FloorController", { enumerable: true, get: function () { return floor_controller_1.FloorController; } });
var floor_service_1 = require("./service/floor.service");
Object.defineProperty(exports, "FloorService", { enumerable: true, get: function () { return floor_service_1.FloorService; } });
var floor_repository_1 = require("./repository/floor.repository");
Object.defineProperty(exports, "FloorRepository", { enumerable: true, get: function () { return floor_repository_1.FloorRepository; } });
var floor_routes_1 = require("./routes/floor.routes");
Object.defineProperty(exports, "floorsRoutes", { enumerable: true, get: function () { return __importDefault(floor_routes_1).default; } });
