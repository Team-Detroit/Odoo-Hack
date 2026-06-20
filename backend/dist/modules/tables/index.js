"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tablesRoutes = exports.TableRepository = exports.TableService = exports.TableController = void 0;
var table_controller_1 = require("./controller/table.controller");
Object.defineProperty(exports, "TableController", { enumerable: true, get: function () { return table_controller_1.TableController; } });
var table_service_1 = require("./service/table.service");
Object.defineProperty(exports, "TableService", { enumerable: true, get: function () { return table_service_1.TableService; } });
var table_repository_1 = require("./repository/table.repository");
Object.defineProperty(exports, "TableRepository", { enumerable: true, get: function () { return table_repository_1.TableRepository; } });
var table_routes_1 = require("./routes/table.routes");
Object.defineProperty(exports, "tablesRoutes", { enumerable: true, get: function () { return __importDefault(table_routes_1).default; } });
