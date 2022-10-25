const { Router } = require("express");
const {
    createOrder,
    editOrderDelivery,
    deleteOrder,
    editOrderStatus,
    editOrder,
    getOrders,
    getSoldQuantityByMonth
} = require("../controllers/orders.controllers.js");

const router = Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/sold/:date", getSoldQuantityByMonth);
router.put("/delivery/:id", editOrderDelivery);
router.delete("/:id", deleteOrder);
router.put("/status/:id", editOrderStatus);
router.put("/:id", editOrder);

module.exports = router;
