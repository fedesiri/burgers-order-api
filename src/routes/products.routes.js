const { Router } = require("express");
const { createProduct, editStatusProduct } = require("../controllers/products.controllers");
const router = Router();

router.post("/", createProduct);
router.put("/status/:id", editStatusProduct);

module.exports = router;
