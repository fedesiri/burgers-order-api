const { Router } = require("express");
const {
    getAllProducts,
    createProduct,
    editProductStatus,
    editProductById,
    getProductById
} = require("../controllers/products.controllers.js");

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/status/:id", editProductStatus);
router.put("/:id", editProductById);

module.exports = router;
