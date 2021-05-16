const stripe = require('stripe')('sk_test_51HrpZEJDqElShSTUfbgsmAEDwqvmpDAaNxWYloM5CqJ3vEBFZlhnCTXkcyzZIEmyc5zjgTsOTjDtlnGYhCU1VjKl00v0khy3zf')
const bcrypt = require("bcryptjs");
const User = require("./../model/userModel");


exports.getUserPage = async (req, res) => {
    const user =  await User.findOne({email: req.user.email});
    res.render("user-dashboard", {
        user
    });
}

exports.configurePage = async (req,res) => {
    const user =  await User.findOne({email: req.user.email});
    res.render("configure", {
        user
    });
}
exports.paymentPage = async (req,res) => {
    const user =  await User.findOne({email: req.user.email});
    res.render("payment-history", {
        user
    });

}

exports.profilePage = async (req,res) => {
    const user =  await User.findOne({email: req.user.email});
    res.render("profile", {
        user
    });

}
exports.configure = async (req, res) => {
    const user = await User.findById({_id: req.user._id});
    user.savingsAmount = req.body.savingsAmount;
    user.savingsDuration = req.body.savingsDuration;
    user.bank = req.body.bank;
    user.accountName = req.body.accountName;
    user.accountNumber = req.body.accountNumber;
    user.registration = "complete";
    await user.save();

    res.redirect("/user-dashboard");
}

exports.profile = async (req, res) => {
    const user = await User.findById({_id: req.user._id});
    user.bank = req.body.bank;
    user.phoneNumber = req.body.phoneNumber;
    user.accountName = req.body.accountName;
    user.accountNumber = req.body.accountNumber;
    await user.save();

    res.redirect("/profile");
}

exports.getCheckoutSession = async (req, res) => {
    const user = await User.findById(req.params.id);

   const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url:`${req.protocol}://${req.get('host')}/`,
        cancel_url:`${req.protocol}://${req.get('host')}/`,
        customer_email: req.user.email,
        client_reference_id: req.params.id,
        line_items: [
            {
                amount: user.savingsAmount * 100,
                currency: 'ngn'
            }
        ]
    })
}

exports.changePassword = async (req, res) => {
    const user = await User.findById({_id: req.user._id});
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
        console.log("password does not match");
       return res.redirect("/profile");
    }

    const hashedPassword = await bcrypt.hash(req.body.confirmPassword, 12);
    user.password = hashedPassword;
    console.log("password changed successfully");
    await user.save();
    res.redirect("/profile");
}