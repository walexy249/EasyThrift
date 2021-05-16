const express = require("express");

const authController = require("./../controller/authController");
const userController = require("./../controller/userController")

const router = express.Router();

router.route("/user-dashboard").get(authController.isAuthenticated, userController.getUserPage);
router.route("/payment-history").get(authController.isAuthenticated, userController.paymentPage);
router.route("/changePassword").post(authController.isAuthenticated, userController.changePassword);

router.route("/profile").get(authController.isAuthenticated, userController.profilePage).post(authController.isAuthenticated, userController.profile);



router.route("/configure").get(authController.isAuthenticated, userController.configurePage).post(authController.isAuthenticated, userController.configure)

router.get('/checkout-session/:id', authController.isAuthenticated, userController.getCheckoutSession);
module.exports = router;