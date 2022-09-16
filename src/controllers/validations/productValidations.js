const { Product } = require("../../db.js");
const { Op } = require("sequelize");

const errorNameMsg = name => `The name '${name}' is already assigned for another product`;
const errorHexColorMsg = hexColor => `The color '${hexColor}' is already assigned for another product`;
const errorPriceMsg = "Price must be a number greater than 0";
const errorIdMsg = id => `There is no product with the id '${id}'`;

const createProductValidation = async body => {
    const { name, hexColor, price } = body;

    const existingProduct = await Product.findOne({
        where: {
            [Op.or]: [{ name: name }, { hexColor: hexColor }]
        }
    });
    if (existingProduct) {
        if (existingProduct.name === name) {
            return errorNameMsg(name);
        }
        if (existingProduct.hexColor === hexColor) {
            return errorHexColorMsg(hexColor);
        }
    } else if (price <= 0) {
        return errorPriceMsg;
    }

    return null;
};

const editProductStatusValidation = async id => {
    const existingProduct = await Product.findByPk(id);
    if (!existingProduct) {
        return errorIdMsg(id);
    }

    return null;
};

const editProductByIdValidation = async (id, body) => {
    const { name, price, hexColor } = body;

    const existingProduct = await Product.findByPk(id);
    if (!existingProduct) {
        return errorIdMsg(id);
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
            return errorNameMsg(name);
        }
    }
    if (existingProduct.hexColor !== hexColor) {
        const existingProductByHexColor = await Product.findOne({
            where: {
                hexColor: hexColor
            }
        });
        if (existingProductByHexColor?.hexColor === hexColor) {
            return errorHexColorMsg(hexColor);
        }
    }

    return null;
};

module.exports = {
    createProductValidation,
    editProductStatusValidation,
    editProductByIdValidation
};
