const { Product } = require("../db.js");
const { Op } = require("sequelize");

const getAllProducts = async (req, res) => {
    try {
        const response = await Product.findAll();
        res.json(response);
    } catch (error) {
        console.log(error);
    }
};

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

const editProductStatus = async (req, res, next) => {
    const { id } = req.params;
    try {
        const existingProduct = await Product.findByPk(id);

        if (!existingProduct) {
            res.send({ success: false, msg: `There is no product with the id '${id}'` });
        } else {
            const newStatus = !existingProduct.status;
            await existingProduct.update({ status: newStatus });
            res.send({
                success: true,
                msg: `The product status was successfully edited to '${existingProduct.status}' `
            });
        }
    } catch (error) {
        next(error);
    }
};

const editProductById = async (req, res, next) => {
    const { id } = req.params;
    const { name, description, price, hexColor } = req.body;
    try {
        const existingProduct = await Product.findByPk(id);
        if (!existingProduct) {
            res.send({ success: false, msg: `There is no product with the id '${id}'` });
            return;
        }
        if (price < 0) {
            res.send({ success: false, msg: "Price must be a number greater than 0." });
            return;
        }
        if (existingProduct.name !== name) {
            const existingProductByName = await Product.findOne({
                where: {
                    name: name
                }
            });
            if (existingProductByName?.name === name) {
                res.send({ success: false, msg: `The name ${name} is already assigned for another product` });
                return;
            }
        }
        if (existingProduct.hexColor !== hexColor) {
            const existingProductByHexColor = await Product.findOne({
                where: {
                    hexColor: hexColor
                }
            });
            if (existingProductByHexColor?.hexColor === hexColor) {
                res.send({ success: false, msg: `The hexColor ${hexColor} is already assigned for another product` });
                return;
            }
        }
        await Product.update(
            {
                name,
                description,
                price,
                hexColor
            },
            {
                where: {
                    id: id
                }
            }
        );

        res.send({ success: true, msg: "Product has been edited succesfully!" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    editProductStatus,
    editProductById
};
