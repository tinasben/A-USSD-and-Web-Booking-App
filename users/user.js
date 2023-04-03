const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User.js');

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/register', (req, res) => {
    const { firstName, lastName, phoneNumber, email, password, password2 } = req.body;
    let errors =[];

    //check fields
    if (!firstName || !lastName || !phoneNumber || !email || !password || !password2) {
        errors.push({msg: 'Please fill in all the fields'});
    }

    // check if password and password2 match
 if (password !== password2) {
    errors.push({msg: 'passwords do not match'});
}

   //check if password length meets minimum number of characters
   if(password.length < 6) {
       errors.push({msg: 'Input a password that is more than 6 characters'});
   }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            firstName,
            lastName,
            phoneNumber,
            email,
            password,
            password2
        });
    } else{
        
        //pass validated data into the db
        //first check if user exists in the database
        User.findOne({email : email})
        .then(user => {
            if(user) {
                //user already exists
                errors.push({msg: 'User email is already registered.'});
                res.render('register', {
                    errors,
                    firstName,
                    lastName,
                    phoneNumber,
                    email,
                    password,
                    password2
                });
            } else {
                // create a new user while encrypting the password
                const newUser = new User({
                    firstName,
                    lastName,
                    phoneNumber,
                    email,
                    password
                });
                // Hash the password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    //set password to hashed value
                    newUser.password = hash;

                    //save the user and redirect the user to tthe login page
                    newUser.save()
                    .then( user => {
                        req.flash('success_msg','You are now registered');
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                }));
            }
        });
    }
});

//login handler
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//logout handler
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;