const { DataTypes } = require("sequelize");

module.exports = sequelize => {
    sequelize.define("orderProduct", {
        orderId: {
            type: DataTypes.INTEGER,
            primaryKey: false,
            allowNull: false
        },
        productId: {
            type: DataTypes.INTEGER,
            primaryKey: false,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        subtotal: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        notes: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    });
};
