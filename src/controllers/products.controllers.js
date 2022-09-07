const { Product } = require("../db.js");
const { Op } = require("sequelize");

const createProduct = async (req, res, next) => {
    const { name, description, price, hexColor } = req.body;
    try {
        const existingProduct = await Product.findOne({
            where: {
                [Op.or]: [{ name: name }, { hexColor: hexColor }]
            }
        });

        if (existingProduct) {
            if (existingProduct.name === name) {
                res.send({ success: false, msg: `The name ${name} is already assigned for another product` });
            }
            if (existingProduct.hexColor === hexColor) {
                res.send({ success: false, msg: `The color ${hexColor} is already assigned for another product` });
            }
        } else if (price <= 0) {
            res.send({ success: false, msg: "Price must be a number greater than 0." });
        } else {
            await Product.create({
                name,
                description,
                price,
                hexColor
            });

            res.send({ success: true, msg: "Product has been created succesfully!" });
        }
    } catch (error) {
        next(error);
    }
};

const editStatusProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        const existingProduct = await Product.findOne({
            where: {
                id: id
            }
        });

        if (!existingProduct) {
            res.send({ success: false, msg: `There is no product with the id "${id}"` });
        } else {
            existingProduct.status === true
                ? await existingProduct.update({ status: false })
                : await existingProduct.update({ status: true });
            res.send({
                success: true,
                msg: `The ${existingProduct.name} product status was successfully edited to "${existingProduct.status}" `
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    editStatusProduct
};
