const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    console.log("blablablablba");
    res.send({ success: true });
});

module.exports = router;
