const { Router } = require("express");
const { createOrder, editOrderDelivery, deleteOrder, editOrderStatus } = require("../controllers/orders.controllers.js");

const router = Router();

router.post("/", createOrder);
router.put("/delivery/:id", editOrderDelivery);
router.delete("/:id", deleteOrder);
router.put("/status/:id", editOrderStatus);

module.exports = router;
