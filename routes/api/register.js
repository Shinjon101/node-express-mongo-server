const express = require("express");
const router = express.Router();
const { handleNewUser } = require("../../controllers/registrationController");

router.route("/").post(handleNewUser);

module.exports = router;
