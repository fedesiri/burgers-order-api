const { Product } = require("../../db.js");
const { Op } = require("sequelize");

const errorMessages = {
    assignedName: name => `The name '${name}' is already assigned for another product`,
    assignedColor: hexColor => `The color '${hexColor}' is already assigned for another product`,
    invalidPrice: "Price must be a number greater than 0",
    nonexistingId: id => `There is no product with the id '${id}'`
};

const createProductValidation = async body => {
    const { name, hexColor, price } = body;

    const existingProduct = await Product.findOne({
        where: {
            [Op.or]: [{ name: name }, { hexColor: hexColor }]
        }
    });
    if (existingProduct) {
        if (existingProduct.name === name) {
            return errorMessages.assignedName(name);
        }
        if (existingProduct.hexColor === hexColor) {
            return errorMessages.assignedColor(hexColor);
        }
    } else if (price <= 0) {
        return errorMessages.invalidPrice;
    }

    return null;
};

const editProductStatusValidation = async existingProduct => {
    if (!existingProduct) {
        return errorMessages.nonexistingId(id);
    }

    return null;
};

const editProductByIdValidation = async (id, body) => {
    const { name, price, hexColor } = body;

    const existingProduct = await Product.findByPk(id);
    if (!existingProduct) {
        return errorMessages.nonexistingId(id);
    }
    if (price < 0) {
        return errorMessages.invalidPrice;
    }
    if (existingProduct.name !== name) {
        const existingProductByName = await Product.findOne({
            where: {
                name: name
            }
        });
        if (existingProductByName?.name === name) {
            return errorMessages.assignedName(name);
        }
    }
    if (existingProduct.hexColor !== hexColor) {
        const existingProductByHexColor = await Product.findOne({
            where: {
                hexColor: hexColor
            }
        });
        if (existingProductByHexColor?.hexColor === hexColor) {
            return errorMessages.assignedColor(hexColor);
        }
    }

    return null;
};

module.exports = {
    createProductValidation,
    editProductStatusValidation,
    editProductByIdValidation
};
