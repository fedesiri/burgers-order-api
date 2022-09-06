const {Product} = require('../db.js')


const createProduct = async (req, res) => {
    const {name, description, price, hexColor, status} = req.body
    try{
        let existingProduct = await Product.findOne({
            where: {
                name: name
            }
        })

        let existingHexColorProduct = await Product.findOne({
            where: {
                hexColor: hexColor
            }
        })
        
        if(existingProduct){
            res.send({message: 'product with that name already exists'})
        } else if(existingHexColorProduct){
            res.send({message: `the color ${hexColor} is already assigned for another product`})
        } else if(price <= 0){
            res.send({message: 'price must be a number greater than 0'})
        } else {
            const newProduct = await Product.create({
                name,
                description,
                price,
                hexColor,
                status,
            })
            
            newProduct ? res.send({succes: true, msg: 'product has been succesfully!'}) : res.send({succes: false, msg: 'product has not been created'})
            
        }
    } catch (error){
        console.log(error)
    }
}

module.exports = {
    createProduct
}