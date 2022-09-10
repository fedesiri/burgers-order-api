const express = require("express");
const productsRouter = require("./products.routes.js");

const router = express.Router();

router.use("/product", productsRouter);

module.exports = router;
