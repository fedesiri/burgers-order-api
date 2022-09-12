const { Router } = require("express");
const { createOrder } = require("../controllers/orders.controllers.js");

const router = Router();

router.post("/", createOrder);

module.exports = router;
