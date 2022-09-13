const { Router } = require("express");
const { createOrder, deleteOrder, editOrderStatus } = require("../controllers/orders.controllers.js");

const router = Router();

router.post("/", createOrder);
router.delete("/:id", deleteOrder);
router.put("/status/:id", editOrderStatus);

module.exports = router;
