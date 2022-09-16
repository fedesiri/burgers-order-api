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

// debemos traer por params dateFrom y dateTo (fecha desde y hasta)
// armar la query dependiendo de si llegaron o no las fechas
// traer todas las ordenes, incluyendo los productos (tabla orderProduct)
//CasoFeliz: Devuelve todas las ordenes incluyendo los productos con la información de OrderProduct
const getOrders = async (req, res, next) => {
    const { dateFrom, dateTo } = req.query;
    //si tenemos 1 sola fecha pasada por paramtro deberiamos traer todas las ordenes de ese dia
    //si tenemos dateFrom y dateTo
    try {
        if (dateFrom && dateTo) {
            if (dateFrom < dateTo) {
                const query = {
                    where: {
                        dateFrom: dateFrom,
                        dateTo: dateTo
                    }
                };
                const dateOrders = await Order.findAll({
                    where: {
                        time: {
                            [Op.iLike]: `%${dateFrom && dateTo}%`
                        },
                        include: [
                            {
                                model: OrderProduct
                            }
                        ]
                    }
                });
                res.send(dateOrders);
            } else {
                res.send({ success: false, msg: `The date ${dateFrom} is not less than date ${dateTo}` });
            }
        } else {
            res.send({ success: false, msg: "Please insert valid date!" });
        }
    } catch (error) {
        next(error);
    }

    // controlamos que dateFrom sea menor a dateTo y hacemos un get a todas las ordenes que matcheen con dateFrom y dateTo
};

module.exports = {
    createOrder,
    getOrders
};
