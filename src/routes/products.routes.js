const { Router } = require('express')
const {createProduct} = require('../controllers/products.controllers')
const router = Router();

router.post('/', createProduct);

module.exports = router;