const express = require("express");

const testRouter = require("./test");
const productsRouter = require("./products.routes.js");

const router = express.Router();

router.use("/test", testRouter);
router.use("/products", productsRouter);

module.exports = router;
