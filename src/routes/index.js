const express = require("express");
const productsRouter = require("./products.routes.js");

const router = express.Router();

router.use("/products", productsRouter);

module.exports = router;
