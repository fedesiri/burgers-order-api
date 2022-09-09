require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, ENVIRONMENT, PROD_DB_URL } = process.env;

let sequelize;
if (ENVIRONMENT === "dev") {
    sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
        logging: false,
        native: false
    });
} else {
    sequelize = new Sequelize(PROD_DB_URL, {
        logging: false,
        native: false
    });
}

const basename = path.basename(__filename);

const modelDefiners = [];

// Read all the model folder files, require and add them to the model definers array
fs.readdirSync(path.join(__dirname, "/models"))
    .filter(file => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
    .forEach(file => {
        modelDefiners.push(require(path.join(__dirname, "/models", file)));
    });

// Inject the connection to all models
modelDefiners.forEach(model => model(sequelize));
// Capitalize the model names
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(entry => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const { Product, Order, OrderProduct } = sequelize.models;

Product.belongsToMany(Order, { through: OrderProduct });
Order.belongsToMany(Product, { through: OrderProduct });

module.exports = { ...sequelize.models, conn: sequelize };
