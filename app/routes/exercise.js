const express = require("express");
const router = express.Router({ mergeParams: true });

/**
 *
 * Exercise controllers
 * @const
 */
const { createExercise } = require("../controllers/exercise");

/**
 *
 * Validate User controller
 * @const
 */
const { validateUserID } = require("../controllers/user");

/**
 *
 * Route for new Exercise
 * @name POST/api/users/:_id/exercises
 */
router.post("/", validateUserID, createExercise);

module.exports = router;
