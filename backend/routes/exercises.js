const Exercise = require("../models/exercise");
const express = require("express");
const router = express.Router();

/** GET / { exercises }  => [{ name, target, secondary, gif, instructions}, ...]
 *
 * Returns all exercises
 *
 **/
router.get("/all", async function (req, res, next) {
  try {
    const exercises = await Exercise.getAll();
    return res.status(201).json({ exercises });
  } catch (e) {
    return next(e);
  }
});

/** GET / { exercise }  => { name, target, secondary, gif, instructions}
 *
 * Returns chosen exercise
 *
 **/
router.get("/:exercise", async function (req, res, next) {
  try {
    const exercise = await Exercise.get(req.params.exercise);
    return res.json({ exercise });
  } catch (e) {
    return next(e);
  }
});

/** GET / { target }  => { exercises }
 *
 * Returns all exercises for a  chosen target
 **/
router.get("/target/:target", async function (req, res, next) {
  try {
    const target = await Exercise.getTargetExercises(req.params.target);
    return res.json({ target });
  } catch (e) {
    return next(e);
  }
});

/** GET / { targets }  => { target }
 *
 * Returns all targets
 *
 **/
router.get("/", async function (req, res, next) {
  try {
    const targets = await Exercise.getTargets();
    return res.json({ targets });
  } catch (e) {
    return next(e);
  }
});

/** POST / { exercises }  => [{ name, target, secondary, gif, instructions}, ...]
 *
 * Returns updated exercises data
 *
 **/
router.post("/data/refresh", async function (req, res, next) {
  try {
    const updatedExercises = await Exercise.refreshData();
    return res.status(201).json({ exercises: updatedExercises });
  } catch (e) {
    return next(e);
  }
});

/** POST / { user, exercise }
 *
 * Pairs userId and exerciseId and adds to user_favorites table to track exercises favorited
 *
 **/
router.post("/favorite", async function (req, res, next) {
  try {
    const favExercise = await Exercise.handleFavorite(
      req.body.userId,
      req.body.exerciseId
    );
    res.json({
      message: "Exercise favorites handled successfully",
      favExercise,
    });
  } catch (e) {
    return next(e);
  }
});

/** POST / { user, exercises }
 *
 * Fetches all exercises user has favorited
 *
 **/
router.post("/user-favorite", async function (req, res, next) {
  try {
    const userFavorites = await Exercise.getUserFavorites(req.body.userId);
    res.json({ userFavorites });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
