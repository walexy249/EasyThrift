const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./../model/userModel");


exports.loginPage = (req, res) => {
    res.render("login", {
        errorMessage: undefined
    });
}

exports.signupPage = (req, res) => {
    res.render("signup", {
        errorMessage: undefined
    });
}

exports.signup = async (req, res) => {

    const fullname = req.body.fullname;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);
    // console.log(errors.errors)
    if (!errors.isEmpty()) {
        return res.render("signup", {
            errorMessage: errors.array()[0].msg,
            oldData: {
                fullname,
                email,
                phoneNumber,
                password,
                confirmPassword
            }
        })
    }
    const user = await User.findOne({email: req.body.email});
    console.log(user)
    if(user) {
        return res.render ("signup", {
            errorMessage: "user alrealdy exist",
            oldData: {
                fullname,
                email,
                phoneNumber,
                password,
                confirmPassword
            }
        });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
        fullname,
        email,
        phoneNumber,
        password: hashedPassword
    });
    res.redirect("/login");
}


exports.login = async (req, res ) => {

    const email = req.body.email;
    const password = req.body.password

    // console.log(req.body);
    const user = await User.findOne({email: req.body.email});

    if (!user) {
        return res.render("login", {
            errorMessage: "Invalid username or password",
            oldData: {
                email: req.body.email,
                password: req.body.password
            }
        })
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
        return res.render("login", {
            errorMessage: "Invalid username or password",
            oldData: {
                email,
                password,
            }
        });
    }

    const token = jwt.sign({id: user._id}, "my-jwt-ultra-long-secret", {
        expiresIn: "90d"
    });

    res.cookie("jwt", token , {
        expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    });
    // req.user = user;

    res.redirect("/user-dashboard");

}

exports.isAuthenticated =  async (req, res, next) => {
    try {
        if (!req.cookies.jwt) {
            return res.redirect("/login")
        }

        const token = req.cookies.jwt;
        // console.log(token);

        const decoded = await jwt.verify(token, "my-jwt-ultra-long-secret");

        const user = await User.findById({_id: decoded.id});

        if (!user) {
            return res.redirect("/login");
        }
        req.user = user;
        next();
    }
    catch(err) {
        console.log(err);
        return res.redirect("/");
    }
}

exports.logout = (req, res, next) => {

    res.cookie("jwt", "loggedout", {
        expiresIn: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    return res.redirect("/")
}

