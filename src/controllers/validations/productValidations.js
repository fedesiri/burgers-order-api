const { Product } = require("../../db.js");
const { Op } = require("sequelize");

const errorNameMsg = `The name is already assigned for another product`;
const errorHexColorMsg = `The color is already assigned for another product`;
const errorPriceMsg = "Price must be a number greater than 0";
const errorIdMsg = `There is no product with that id`;

const createProductValidation = async body => {
    const { name, hexColor, price } = body;

    const existingProduct = await Product.findOne({
        where: {
            [Op.or]: [{ name: name }, { hexColor: hexColor }]
        }
    });
    if (existingProduct) {
        if (existingProduct.name === name) {
            return errorNameMsg;
        }
        if (existingProduct.hexColor === hexColor) {
            return errorHexColorMsg;
        }
    } else if (price <= 0) {
        return errorPriceMsg;
    }

    return null;
};

const editProductStatusValidation = async id => {
    const existingProduct = await Product.findByPk(id);
    if (!existingProduct) {
        return errorIdMsg;
    } else {
        const newStatus = !existingProduct.status;
        await existingProduct.update({ status: newStatus });
    }

    return null;
};

const editProductByIdValidation = async (params, body) => {
    const { id } = params;
    const { name, price, hexColor } = body;

    const existingProduct = await Product.findByPk(id);
    if (!existingProduct) {
        return errorIdMsg;
    }
    if (price < 0) {
        return errorPriceMsg;
    }
    if (existingProduct.name !== name) {
        const existingProductByName = await Product.findOne({
            where: {
                name: name
            }
        });
        if (existingProductByName?.name === name) {
            return errorNameMsg;
        }
    }
    if (existingProduct.hexColor !== hexColor) {
        const existingProductByHexColor = await Product.findOne({
            where: {
                hexColor: hexColor
            }
        });
        if (existingProductByHexColor?.hexColor === hexColor) {
            return errorHexColorMsg;
        }
    }

    return null;
};

module.exports = {
    createProductValidation,
    editProductStatusValidation,
    editProductByIdValidation
};
