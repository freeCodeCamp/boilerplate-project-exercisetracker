const express = require("express");
const router = express.Router();

/**
 *
 * User controllers
 * @const
 */
const { getUsers, createUser } = require("../controllers/user");

/**
 *
 * Route for get all Users
 * @name GET/api/users
 */
router.get("/", getUsers);

/**
 *
 * Route for create new User
 * @name POST/api/users
 */
router.post("/", createUser);

module.exports = router;
