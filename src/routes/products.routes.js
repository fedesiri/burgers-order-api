const { Router } = require("express");
const { createProduct, editProductStatus } = require("../controllers/products.controllers");
const router = Router();

router.post("/", createProduct);
router.put("/status/:id", editProductStatus);

module.exports = router;
