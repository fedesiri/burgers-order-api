const { Router } = require("express");
const {
    createOrder,
    editOrderDelivery,
    deleteOrder,
    editOrderStatus,
    editOrder,
    getOrders
} = require("../controllers/orders.controllers.js");

const router = Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.put("/delivery/:id", editOrderDelivery);
router.delete("/:id", deleteOrder);
router.put("/status/:id", editOrderStatus);
router.put("/:id", editOrder);

module.exports = router;
