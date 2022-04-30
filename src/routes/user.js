const { login, signup, getPersonalDetails } = require("../controllers/users");

const router = require("express").Router();

router
   .post("/signup", signup)
   .post("/login", login)
   .get("/details/:email", getPersonalDetails);

module.exports = router;