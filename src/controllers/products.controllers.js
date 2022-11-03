const { Product } = require("../db.js");
const { createProductValidation, editExistingProductValidation, editProductByIdValidation } = require("./validations/productValidations");

const getAllProducts = async (req, res, next) => {
    const { status } = req.query;
    try {
        let query = {};
        if (status) {
            query.status = status;
        }
        const response = await Product.findAll({
            where: query
        });
        res.send(response);
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const existingProduct = await Product.findByPk(id);
        const errorMsg = editExistingProductValidation(existingProduct, id);
        if (errorMsg) {
            res.send({ success: false, msg: errorMsg, data: null });
        } else {
            res.send({ success: true, msg: null, data: existingProduct });
        }
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
        const productToEdit = await Product.findByPk(id);
        const errorMsg = editExistingProductValidation(productToEdit, id);
        if (errorMsg) {
            res.send({ success: false, msg: errorMsg });
        } else {
            const newStatus = !productToEdit.status;
            await productToEdit.update({ status: newStatus });
            res.send({ success: true, msg: `The product status was successfully edited by '${productToEdit.status}'` });
        }
    } catch (error) {
        next(error);
    }
};

const editProductById = async (req, res, next) => {
    const { id } = req.params;
    const { name, description, price, hexColor } = req.body;
    try {
        const errorMsg = await editProductByIdValidation(id, req.body);
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
    getProductById,
    createProduct,
    editProductStatus,
    editProductById
};
