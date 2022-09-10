const { Router } = require("express");
const { getAllProducts, createProduct, editProductStatus, editProductByID } = require("../controllers/products.controllers.js");

const router = Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.put("/status/:id", editProductStatus);
router.put("/:id", editProductByID);

module.exports = router;
