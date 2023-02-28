const express = require("express");
const router = express.Router();

const { createUser, validateUser } = require("./controller");

router.post("/create", createUser);
router.post("/validate", validateUser);

module.exports = router;
