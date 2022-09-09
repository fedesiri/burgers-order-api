const { DataTypes } = require("sequelize");

module.exports = sequelize => {
    sequelize.define("orderProduct", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
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
            allowNull: false
        },
        subtotal: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        notes: {
            type: DataTypes.STRING
        }
    });
};
