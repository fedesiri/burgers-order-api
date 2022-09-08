const { Product } = require("../db");

const getAllProducts = async (req, res) => {
    try {
        const response = await Product.findAll();
        res.json(response);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getAllProducts
};
