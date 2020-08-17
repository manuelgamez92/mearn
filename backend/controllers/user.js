const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailgun = require("mailgun-js");
const DOMAIN = "sandbox586029eda203452d8eb0b27f2ec970dc.mailgun.org";
const mg = mailgun({ apiKey: "90544aa084e217f6892a8d4c7877798e-a65173b1-e01b08de", domain: DOMAIN });
const _ = require("lodash");

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
                username: req.body.user,
                country: req.body.country
            })
            user.save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: "User created",
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: "The email have already taken, please try with other one"
                    });
                });
        })



}


exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            console.log(user);
            if (!user) {
                return res.status(401).json({
                    message: "User not found, be sure to have already signed up"
                });
            }

            fetchedUser = user;
            console.log(fetchedUser.password + "  -  " + req.body.password);
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            console.log(result);
            if (!result) {
                return res.status(401).json({
                    message: "User and/or password incorrect"
                });
            }
            const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id, username: fetchedUser.username }, process.env.JWT_KEY, {
                expiresIn: "1h"

            }); res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id,
                username: fetchedUser.username
            });
        }).catch(err => {
            console.log(err);
            return res.status(401).json({
                message: "Auth failed"
            })
        });

}

exports.getUsers = (req, res, next) => {

    const userQuery = User.find();
    let fetchedUsers;

    userQuery.then(documents => {
        fetchedUsers = documents;
        return User.count();
    })
        .then(count => {
            console.log(fetchedUsers);
            res.status(200).json({
                message: 'Users fetchedd succesfully',
                users: fetchedUsers
            });
        }).catch(error => {
            res.status(500).json({
                message: "Fetching users failed"
            })
        });


}



exports.getUser = (req, res, next) => {
    const userQuery = User.findOne({ _id: req.body.userId });
    let user;

    userQuery.then(document => {
        user = document;
        console.log(user);
        res.status(200).json({
            message: 'User fetched succesfully',
            user: user
        });
    }).catch(error => {
        res.status(500).json({
            message: "Fetching users failed"
        })
    });


}

exports.updateUser = (req, res, next) => {
    const _id = req.body.userId;
    const country = req.body.country;
    let user1;
    const url = req.protocol + '://' + req.get("host");
    let imagePath = req.body.imagePath;
    if (req.file) {
        imagePath = url + "/images/" + req.file.filename

    }
    User.findOne({ _id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: "User with this id does not exist" });
        }
        return user.updateOne({ country: country, imagePath: imagePath }, function (err, success) {

            if (err) {
                return res.status(400).json({ error: "User not founded" });

            }
            User.findOne({ _id }, (err, user) => {
                if (err || !user) {
                    return res.status(400).json({ message: "User with this id does not exist" });
                }

                return res.status(200).json({ message: "User updated successfully", user: user });

            })


        }


        )
    });
}





exports.forgotPassword = (req, res, next) => {
    const email = req.body.email;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: "User with this email does not exist" });
        }
        const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_KEY, { expiresIn: "15min" });

        const data = {
            from: "postmaster@sandbox586029eda203452d8eb0b27f2ec970dc.mailgun.org",
            to: "manuelgamez92@gmail.com",
            subject: "Hello",
            html: `<h2>The Three Musketeer´s Experiences Reset Password Request</h2>
        <h3>Please pinwin click on given link to activate you account<h3>
        <a href='${process.env.CLIENT_URL}/${token}'>Reseat Password click here </a>
        
        `
        };

        return user.updateOne({ resetLink: token }, function (err, success) {
            if (err) {
                return res.status(400).json({ error: "Token not founded, please provide the correct user mail registrated" });

            }
            else {
                mg.messages().send(data, function (error, body) {
                    if (err) {
                        return res.status(400).json({ message: "Problem sending your email reseat password link. Please try again" });
                    }
                    return res.status(200).json({ message: "Email sended success. Search on SPAM folder and click in the link provided on the body message", reseatLink: token });
                });
            }
        })



    });



}


exports.resetPassword = (req, res) => {
    const resetLink = req.body.reseatLink;
    console.log()
    if (resetLink) {
        const decodedToken = jwt.verify(resetLink, process.env.JWT_KEY, function (err, success) {
            if (err) {
                return res.status(400).json({ message: "Your token is wrong or expired" });

            }
            User.findOne({ resetLink }, function (err, user) {
                if (err || !user) {
                    return res.status(400).json({ message: "Not user found" });
                }

                bcrypt.hash(req.body.newPass, 10)
                    .then(hash => {
                        const obj = {
                            password: hash
                        }

                        user = _.extend(user, obj);
                        user.save((err, success) => {
                            if (err) {
                                return res.status(400).json({ message: "Your token is wrong or expired" });

                            }
                            return res.status(200).json({ message: "New password changed successfully, please log in again with your new password" });

                        });
                    });


            })
        });

    } else {
        return res.status(400).json({ message: "Your token is wrong or expireddddd" });

    }

}


exports.deleteUser = (req, res, next) => {
    User.deleteOne({ _id: req.body.id }).then(result => {

        if (result.deletedCount > 0) {
            res.status(200).json({ message: "User deleted" });
        } else {
            res.status(401).json({ message: "Not authorizaded" });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Deleting post failed"
        })
    });

}