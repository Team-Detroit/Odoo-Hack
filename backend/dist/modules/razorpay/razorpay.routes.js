"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const razorpay_controller_1 = require("../razorpay/razorpay.controller");
const router = (0, express_1.Router)();
const ctrl = new razorpay_controller_1.RazorpayController();
router.post('/razorpay/create-order', (req, res) => ctrl.createOrder(req, res));
router.post('/razorpay/verify', (req, res) => ctrl.verifyPayment(req, res));
exports.default = router;
