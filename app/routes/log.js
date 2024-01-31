const express = require("express");
const router = express.Router({ mergeParams: true });

/**
 *
 * Log controllers
 * @const
 */
const { log, validateUserID, validateQuery } = require("../controllers/log");

/**
 *
 * Route for Log
 * @name GET/api/users/:_id/logs
 */
router.get("/", validateUserID, validateQuery, log);

module.exports = router;
