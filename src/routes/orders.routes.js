const { Router } = require("express");
const { createOrder, deleteOrder } = require("../controllers/orders.controllers.js");

const router = Router();

router.post("/", createOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
