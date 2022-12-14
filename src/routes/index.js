const express = require("express");
const productsRouter = require("./products.routes.js");
const orderRouter = require("./orders.routes.js");

const router = express.Router();

router.use("/product", productsRouter);
router.use("/order", orderRouter);

module.exports = router;
