const { Router } = require("express");
const { getAllProducts, createProduct, editProductStatus, editProductById } = require("../controllers/products.controllers.js");

const router = Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.put("/status/:id", editProductStatus);
router.put("/:id", editProductById);

module.exports = router;
