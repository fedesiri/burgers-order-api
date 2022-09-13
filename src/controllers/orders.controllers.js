const { Order, OrderProduct } = require("../db.js");

const createOrder = async (req, res, next) => {
    const { name, address, notes, paymentMethod, deliveredBy, takeAway, totalPrice, time, products } = req.body;
    try {
        if (!name) {
            res.send({ success: false, msg: "The order must have a name" });
        } else if (!takeAway && !address) {
            res.send({ success: false, msg: "The order must have an address" });
        } else if (totalPrice < 0) {
            res.send({ success: false, msg: "Price must be a number greater than 0" });
        } else {
            const order = await Order.create({
                name,
                address,
                notes,
                paymentMethod,
                deliveredBy,
                takeAway,
                totalPrice,
                time
            });

            const promises = products?.map(async productInOrder => {
                return await OrderProduct.create({
                    orderId: order.id,
                    productId: productInOrder.productId,
                    quantity: productInOrder.quantity,
                    subtotal: productInOrder.subtotal
                });
            });
            await Promise.all(promises);
            res.send({ success: true, msg: "Order has been created succesfully!" });
        }
    } catch (error) {
        next(error);
    }
};

const deleteOrder = async (req, res, next) => {
    const { id } = req.params;
    try {
        const orderToDelete = await Order.findByPk(id);

        if (!orderToDelete) {
            res.send({ success: false, msg: `There is no order with the id '${id}'` });
        } else {
            await orderToDelete.destroy();
            res.send({ success: true, msg: `The order was successfully deleted!` });
        }
    } catch (error) {
        next(error);
    }
};

const editOrderStatus = async (req, res, next) => {
    const { id } = req.params;
    try {
        const existingOrder = await Order.findByPk(id);

        if (!existingOrder) {
            res.send({ success: false, msg: `There is no order with the id '${id}'` });
        } else {
            const newStatus = !existingOrder.status;
            await existingOrder.update({ status: newStatus });
            res.send({
                success: true,
                msg: `The order status was successfully edited to '${existingOrder.status}' `
            });
        }
    } catch (error) {
        next(error);
    }
};

const editOrderDelivery = async (req, res, next) => {
    const { id } = req.params;
    const { deliveredBy } = req.body;

    try {
        const existingOrder = await Order.findByPk(id);

        if (!existingOrder) {
            res.send({ success: false, msg: `There is no order with the id '${id}'` });
        } else {
            await Order.update({ deliveredBy }, { where: { id: id } });
            res.send({ success: true, msg: `Delivery has been changed succesfully to ${deliveredBy}!` });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    deleteOrder,
    editOrderStatus,
    editOrderDelivery
};
