"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsRoutes = exports.ReportsRepository = exports.ReportsService = exports.ReportsController = void 0;
var reports_controller_1 = require("./controller/reports.controller");
Object.defineProperty(exports, "ReportsController", { enumerable: true, get: function () { return reports_controller_1.ReportsController; } });
var reports_service_1 = require("./service/reports.service");
Object.defineProperty(exports, "ReportsService", { enumerable: true, get: function () { return reports_service_1.ReportsService; } });
var reports_repository_1 = require("./repository/reports.repository");
Object.defineProperty(exports, "ReportsRepository", { enumerable: true, get: function () { return reports_repository_1.ReportsRepository; } });
var reports_routes_1 = require("./routes/reports.routes");
Object.defineProperty(exports, "reportsRoutes", { enumerable: true, get: function () { return __importDefault(reports_routes_1).default; } });
