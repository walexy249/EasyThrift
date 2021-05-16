const express = require("express");
const { body } = require("express-validator/check");

const authController = require("../controller/authController");

const router = express.Router();


router.route("/signup").get(authController.signupPage).post(
    [
        body("password").isLength({min: 5}).withMessage("password must be more than 5 characters"),
        body("confirmPassword").custom((value, { req}) => {
            if(req.body.password !== value) {
                throw new Error("password must match");
            }
            return true
        })
    ],
    authController.signup
);
router.route("/login").get(authController.loginPage).post(authController.login);



module.exports = router;