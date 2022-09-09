const { DataTypes } = require("sequelize");

module.exports = sequelize => {
    sequelize.define(
        "order",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            address: {
                type: DataTypes.STRING
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            notes: {
                type: DataTypes.STRING
            },
            paymentMethod: {
                type: DataTypes.ENUM("cash", "transfer"),
                allowNull: false
            },
            deliveredBy: {
                type: DataTypes.STRING
            },
            takeAway: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            totalPrice: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            time: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        },
        {
            timestamps: false,
            createdAt: false,
            updatedAt: "actualizado"
        }
    );
};
