const { Router } = require("express");
const { createOrder, getOrders } = require("../controllers/orders.controllers.js");

const router = Router();

router.post("/", createOrder);
router.get("/", getOrders);

module.exports = router;
