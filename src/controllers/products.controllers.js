const { Product } = require("../db.js");
const { Op } = require("sequelize");

const createProduct = async (req, res) => {
    const { name, description, price, hexColor } = req.body;
    try {
        const existingProduct = await Product.findOne({
            where: {
                [Op.or]: [{ name: name }, { hexColor: hexColor }]
            }
        });

        if (existingProduct) {
            if (existingProduct.name === name) {
                res.send({ success: false, msg: "Product with that name already exists." });
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
        console.log(error);
    }
};

module.exports = {
    createProduct
};
