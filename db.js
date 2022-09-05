require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
    logging: false,
    native: false,
});

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

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
// const { Recipe, Diet } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
// Recipe.belongsToMany(Diet, {  through: 'recipeDiet'});
// Diet.belongsToMany(Recipe, {  through: 'recipeDiet'});

module.exports = { ...sequelize.models, conn: sequelize };
