const { Op } = require("sequelize");
require("dotenv").config();
const { Product } = require("../db");

//GET /products?name="..."
const getAllProductsFromDb = async name => {
    if (!name) {
        return await Product.findAll();
    } else {
        return await Product.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            }
        });
    }
};

const getAllProducts = async (req, res, next) => {
    const { name } = req.query;
    try {
        const response = await getAllProductsFromDb(name);
        if (!response.length) {
            res.json({ msg: "Product not found" });
        } else {
            res.json(response);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts
};
