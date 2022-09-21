const { Product, Order, OrderProduct } = require("../db.js");
const moment = require("moment");
const { createOrEditOrderValidationFields, existingOrderValidation, editOrderValidation } = require("./validations/orderValidations");

const createOrder = async (req, res, next) => {
    const { name, address, notes, paymentMethod, deliveredBy, takeAway, totalPrice, time, products } = req.body;
    try {
        const errorMsg = createOrEditOrderValidationFields(req.body);
        if (errorMsg) {
            res.send({ success: false, msg: errorMsg });
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
                    subtotal: productInOrder.subtotal,
                    notes: productInOrder.notes
                });
            });
            await Promise.all(promises);
            res.send({ success: true, msg: "Order has been created succesfully!" });
        }
    } catch (error) {
        next(error);
    }
};

const getOrders = async (req, res, next) => {
    const { dateFrom, dateTo } = req.query;
    try {
        let query = {};
        if (dateFrom && dateTo) {
            if (!moment(dateFrom).isValid() || !moment(dateTo).isValid()) {
                res.send({ success: false, msg: "Date not is valid!" });
                return;
            }
            query = {
                time: {
                    [Op.between]: [dateFrom, dateTo]
                }
            };
        }
        const dateOrders = await Order.findAll({
            where: query,
            include: [
                {
                    model: Product,
                    attributes: ["name", "price", "hexColor"]
                }
            ]
        });
        res.send(dateOrders);
    } catch (error) {
        next(error);
    }
};

const deleteOrder = async (req, res, next) => {
    const { id } = req.params;
    try {
        const orderToDelete = await Order.findByPk(id);
        const errorMsg = existingOrderValidation(orderToDelete, id);

        if (errorMsg) {
            res.send({ success: false, msg: errorMsg });
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
        const errorMsg = existingOrderValidation(existingOrder, id);

        if (errorMsg) {
            res.send({ success: false, msg: errorMsg });
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
        const errorMsg = existingOrderValidation(existingOrder, id);

        if (errorMsg) {
            res.send({ success: false, msg: errorMsg });
        } else {
            await Order.update({ deliveredBy }, { where: { id: id } });
            res.send({ success: true, msg: `Delivery has been changed succesfully to ${deliveredBy}!` });
        }
    } catch (error) {
        next(error);
    }
};

const editOrder = async (req, res, next) => {
    const { id } = req.params;
    const { name, address, notes, paymentMethod, takeAway, totalPrice, time, products } = req.body;
    try {
        const orderToEdit = await Order.findByPk(id);
        const errorMsg = editOrderValidation(orderToEdit, id, req.body);

        if (errorMsg) {
            res.send({ success: false, msg: errorMsg });
        } else {
            orderToEdit.name = name;
            orderToEdit.address = address;
            orderToEdit.notes = notes;
            orderToEdit.paymentMethod = paymentMethod;
            orderToEdit.takeAway = takeAway;
            orderToEdit.totalPrice = totalPrice;
            orderToEdit.time = time;

            orderToEdit.save();

            const orderProducts = await OrderProduct.findAll({
                where: {
                    orderId: orderToEdit.id
                }
            });

            orderProducts?.forEach(async orderProduct => {
                return await orderProduct.destroy();
            });

            const promises = products?.map(async productInOrder => {
                return await OrderProduct.create({
                    orderId: orderToEdit.id,
                    productId: productInOrder.productId,
                    quantity: productInOrder.quantity,
                    subtotal: productInOrder.subtotal,
                    notes: productInOrder.notes
                });
            });
            await Promise.all(promises);
            res.send({ success: true, msg: "Order has been edited succesfully!" });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getOrders,
    deleteOrder,
    editOrderStatus,
    editOrderDelivery,
    editOrder
};
