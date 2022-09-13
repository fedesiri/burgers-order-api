const { Router } = require("express");
const { createOrder, editOrderDelivery } = require("../controllers/orders.controllers.js");

const router = Router();

router.post("/", createOrder);
router.put("/delivery/:id", editOrderDelivery);

module.exports = router;
