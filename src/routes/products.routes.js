const { Router } = require("express");
const { getAllProducts } = require("../controllers/products.controllers.js");

const router = Router();

// GET /products?name="...":
router.get("/", getAllProducts);

module.exports = router;
