const { Product } = require("../db");

const getAllProductsFromDb = async () => {
    return await Product.findAll();
};

const getAllProducts = async (req, res) => {
    try {
        const response = await getAllProductsFromDb();
        if (!response.length) {
            res.json({ msg: "Product not found" });
        } else {
            res.json(response);
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getAllProducts
};
