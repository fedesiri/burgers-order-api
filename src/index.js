const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./routes");
const { conn } = require("./db");

const app = express();
app.set("port", process.env.PORT || 3005);

// middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// routes
app.use("/", router);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || err;
    console.error(err);
    res.status(status).send(message);
});

conn.sync({ force: false }).then(() => {
    app.listen(app.get("port"), () => {
        console.log("PostgresDB connected");
        console.log("Server on port " + app.get("port"));
    });
});
