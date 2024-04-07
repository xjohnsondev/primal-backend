const User = require("../models/user");

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- This is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, first_name, last_name, email, is_admin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (e) {
    return next(e);
  }
});

/** GET / => { users: [ {username, first_name, last_name, email, favorites }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/
router.get("/", async function(req, res, next){
    try{
        const users = await User.getAll();
        return res.json({ users })
    } catch(e){
        return next(e);
    }
})

/** GET / => { user: {username, first_name, last_name, email, favorites } }
 *
 * Returns selected user.
 *
 **/
router.get("/:username", ensureCorrectUserOrAdmin, async function(req, res, next){
  try {
    const user = await User.get(req.params.username);
    return res.json({ user })
  } catch(e){
    return next(e);
  }
})

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { first_name, last_name, password, email }
 *
 * Returns { first_name, last_name, password, email, is_admin }
 *
 * Authorization required: admin or same-user-as-:username
 **/
router.patch("/", ensureCorrectUserOrAdmin, async function(req, res, next){
    try{
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }
        const user = await User.update(req.params.username, req.body);
        return res.json({ user });
    } catch(e){
        return next(e);
    }
})

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
    }
  });

module.exports = router;
