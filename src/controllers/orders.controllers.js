const { Product, Order, OrderProduct } = require("../db.js");
const { Op } = require("sequelize");

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

const getOrders = async (req, res, next) => {
    const { dateFrom, dateTo } = req.query;
    try {
        let query = {};
        if (dateFrom && dateTo) {
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

module.exports = {
    createOrder,
    getOrders
};
