const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./routes");

const app = express();
const port = process.env.PORT || 3005;

// middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// routes
app.use("/", router);

app.listen(port, () => {
    console.log("server on port " + port);
});
