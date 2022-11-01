const { Product, Order, OrderProduct } = require("../db.js");
const moment = require("moment");
const {
    createOrEditOrderValidationFields,
    getSoldQuantityByMonthValidation,
    existingOrderValidation,
    editOrderValidation
} = require("./validations/orderValidations");
const { Op } = require("sequelize");
const CircularJSON = require("circular-json");

const createOrder = async (req, res, next) => {
    const { name, address, notes, paymentMethod, takeAway, totalPrice, products } = req.body;
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
                takeAway,
                totalPrice
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
                res.send({ success: false, msg: "Date not is valid!", data: null });
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
        res.send({ success: true, msg: null, data: dateOrders });
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const existingOrder = await Order.findOne({
            where: {
                id
            },
            include: [
                {
                    model: Product,
                    attributes: ["name"]
                }
            ]
        });
        const errorMsg = existingOrderValidation(existingOrder, id);
        if (errorMsg) {
            res.send({ success: false, msg: errorMsg, data: null });
        } else {
            let order = CircularJSON.stringify(existingOrder);
            order = JSON.parse(order);
            order = {
                ...existingOrder,
                products: existingOrder.products.map(product => {
                    product.get({ plain: true });
                    product.orderProduct;
                })
            };

            res.send({ success: true, msg: null, data: order });
        }
    } catch (error) {
        next(error);
    }
};

const getNumberOfDays = month => {
    const thirtyOneDaysMonths = [1, 3, 5, 7, 8, 10, 12];
    const thirtyDaysMonths = [4, 6, 9, 11];

    if (thirtyOneDaysMonths.includes(parseInt(month))) {
        return 31;
    } else if (thirtyDaysMonths.includes(parseInt(month))) {
        return 30;
    } else {
        return 28;
    }
};

const getPeriods = (numberOfDays, month, year) => {
    let days;
    if (numberOfDays === 31) {
        days = [1, 9, 17, 24, 31];
    } else if (numberOfDays === 30) {
        days = [1, 9, 16, 23, 30];
    } else {
        days = [1, 8, 15, 22, moment([year]).isLeapYear() ? 29 : 28];
    }
    const firstDate = moment(`${days[0]}/${month}/${year}`, "DD/MM/yyyy");
    const secondDate = moment(`${days[1]}/${month}/${year}`, "DD/MM/yyyy");
    const thirdDate = moment(`${days[2]}/${month}/${year}`, "DD/MM/yyyy");
    const fourthDate = moment(`${days[3]}/${month}/${year}`, "DD/MM/yyyy");
    const fifthDate = moment(`${days[4]}/${month}/${year}`, "DD/MM/yyyy").set({ hour: "23", minute: "59", second: "59" });

    return {
        firstPeriod: [firstDate, secondDate],
        secondPeriod: [secondDate, thirdDate],
        thirdPeriod: [thirdDate, fourthDate],
        fourthPeriod: [fourthDate, fifthDate]
    };
};

const getOrdersByPeriod = async period =>
    await Order.findAll({
        where: {
            time: {
                [Op.between]: period
            }
        },
        include: [
            {
                model: Product,
                attributes: ["name", "price", "hexColor"]
            }
        ]
    });

const getQuantitySoldByPeriod = period => {
    let totalQuantity = 0;

    period.forEach(order => {
        order.products.forEach(product => {
            totalQuantity += product.orderProduct.quantity;
        });
    });

    return totalQuantity;
};

const getSoldQuantityByMonth = async (req, res, next) => {
    const { date } = req.params;
    try {
        const errorMsg = getSoldQuantityByMonthValidation(date);
        if (errorMsg) {
            res.send({ success: false, msg: errorMsg, data: null });
        } else {
            const month = moment(date).format("M");
            const year = moment(date).format("YYYY");
            const numberOfDays = getNumberOfDays(month);
            const { firstPeriod, secondPeriod, thirdPeriod, fourthPeriod } = getPeriods(numberOfDays, month, year);

            const ordersByPeriod = await getOrdersByPeriod([firstPeriod[0], fourthPeriod[1]]);

            const firstPeriodOrder = ordersByPeriod.filter(order => moment(order.time).isBetween(firstPeriod[0], firstPeriod[1]));
            const secondPeriodOrder = ordersByPeriod.filter(order => moment(order.time).isBetween(secondPeriod[0], secondPeriod[1]));
            const thirdPeriodOrder = ordersByPeriod.filter(order => moment(order.time).isBetween(thirdPeriod[0], thirdPeriod[1]));
            const fourthPeriodOrder = ordersByPeriod.filter(order => moment(order.time).isBetween(fourthPeriod[0], fourthPeriod[1]));

            const data = [
                {
                    label: "Week 1",
                    total: getQuantitySoldByPeriod(firstPeriodOrder)
                },
                {
                    label: "Week 2",
                    total: getQuantitySoldByPeriod(secondPeriodOrder)
                },
                {
                    label: "Week 3",
                    total: getQuantitySoldByPeriod(thirdPeriodOrder)
                },
                {
                    label: "Week 4",
                    total: getQuantitySoldByPeriod(fourthPeriodOrder)
                }
            ];

            res.send({ success: true, msg: null, data });
        }
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
    const { name, address, notes, paymentMethod, takeAway, totalPrice, products } = req.body;
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
    getOrderById,
    deleteOrder,
    editOrderStatus,
    editOrderDelivery,
    editOrder,
    getSoldQuantityByMonth
};
