const { Product } = require("../../db.js");
const { Op } = require("sequelize");

const createProductValidation = async body => {
    const { name, hexColor, price } = body;

    const existingProduct = await Product.findOne({
        where: {
            [Op.or]: [{ name: name }, { hexColor: hexColor }]
        }
    });
    if (existingProduct) {
        if (existingProduct.name === name) {
            return `The name ${name} is already assigned for another product`;
        }
        if (existingProduct.hexColor === hexColor) {
            return `The color ${hexColor} is already assigned for another product`;
        }
    } else if (price <= 0) {
        return "Price must be a number greater than 0";
    }

    return null;
};

const editProductStatusValidation = async params => {
    const { id } = params;
    const existingProduct = await Product.findByPk(params);
    if (!existingProduct) {
        return `There is no product with the id '${params}'`;
    } else {
        const newStatus = !existingProduct.status;
        await existingProduct.update({ status: newStatus });
    }

    return null;
};

module.exports = {
    createProductValidation,
    editProductStatusValidation
};
