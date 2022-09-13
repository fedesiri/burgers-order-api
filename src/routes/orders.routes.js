const { Router } = require("express");
const { createOrder, editOrderStatus } = require("../controllers/orders.controllers.js");

const router = Router();

router.post("/", createOrder);
router.put("/status/:id", editOrderStatus);

module.exports = router;
