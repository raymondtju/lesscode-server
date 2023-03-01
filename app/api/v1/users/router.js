const express = require("express");
const router = express.Router();

const { createUser, validateUser, verifyUser } = require("./controller");

router.post("/create", createUser);
router.post("/validate", validateUser);
router.post("/verify", verifyUser);

module.exports = router;
