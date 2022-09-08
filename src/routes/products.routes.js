const { Router } = require("express");
const { getAllProducts, createProduct, editProductStatus } = require("../controllers/products.controllers.js");

const router = Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.put("/status/:id", editProductStatus);

module.exports = router;
