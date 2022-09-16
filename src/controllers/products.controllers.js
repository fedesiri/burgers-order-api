const { Product } = require("../db.js");
const { createProductValidation, editProductStatusValidation, editProductByIdValidation } = require("./validations/productValidations");

const getAllProducts = async (req, res) => {
    try {
        const response = await Product.findAll();
        res.send(response);
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    const { name, description, price, hexColor } = req.body;
    try {
        const errorMsg = await createProductValidation(req.body);
        if (errorMsg) {
            res.send({ success: false, msg: errorMsg });
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
        const errorMsg = await editProductStatusValidation(id);
        if (errorMsg) {
            res.send({ success: false, msg: errorMsg });
        } else {
            res.send({
                success: true,
                msg: `The product status was successfully edited`
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
        const errorMsg = await editProductByIdValidation(req.params, req.body);
        if (errorMsg) {
            res.send({ success: false, msg: errorMsg });
        } else {
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
        }
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
