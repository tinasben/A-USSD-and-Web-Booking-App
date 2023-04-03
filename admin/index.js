const router = require('express').Router();
const {ensureAuthenticated, isAdmin} = require('../handlers/validators');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Customer = require('../models/Customer');

 router.get('/', ensureAuthenticated, isAdmin, (req, res) => {
     Booking.find({ $and:[{"is_Verified": false}, {"is_Valid": false}, {"is_Archived": false}]})
     .then(bookings => {
         res.render('admin', {
             bookings: bookings
         });
     })
     .catch(err => console.log(err));
    
 });

 router.get('/wait',ensureAuthenticated, (req, res) => {
     User.findById({_id : req.user._id})
     .then( user => {
         res.render('wait');
     })
     .catch(err => {
         console.log(err);
     })
    
 });

 router.get('/users', ensureAuthenticated, isAdmin, (req, res) => {
    User.find()
     .then(users => {
         res.render('users', {
             users: users
         });
     })
     .catch(err => {
         console.log(err);
     });
 });
 router.get('/verified',ensureAuthenticated, isAdmin, (req, res) => {
    Booking.find({ $and:[{"is_Verified":true}, {"is_Valid": true},{"is_Archived": false}] })
    .then(bookings => {
        res.render('verified', {
            bookings: bookings
        });
    })
    .catch(err => console.log(err));
 });
 
 router.get('/searchverified',ensureAuthenticated, isAdmin, (req, res) => {
    res.render('search');
    
 });
 router.get('/searchresults',ensureAuthenticated, isAdmin, (req, res) => {
    const   { customer_ID }  = req.query;
    Booking.find({customer_ID : customer_ID})
    .then(bookings => {
        res.render('searchresults', {
            bookings: bookings
        });
    })
    .catch(err => {
        console.log(err);
    });
 });
 

 router.get('/customers', ensureAuthenticated, isAdmin, (req, res) => {
     Customer.find()
     .then(customers => {
         res.render('customers', {
             customers: customers
         });
     })
     .catch(err => {
         console.log(err);
     });
     
 });
 router.get('/logs', ensureAuthenticated, isAdmin, (req, res) => {
     Booking.find({ $and:[{"is_Archived": true}, {"is_Valid": false}]})
     .then(bookings => {
         res.render('logs', {
             bookings: bookings
         });
     })
     .catch(err => {
         console.log(err);
     });
    
 });

 router.get('/verify/:id',ensureAuthenticated, isAdmin, (req, res, next) => {
    Booking.findById( req.params.id, (err, data) => {
        if(err) {
            console.log(err);
            return next(err);
        }
        data.is_Verified = true;
        data.is_Valid = true;
        data.is_Archived = false;
        data.save();
        return res.redirect('/admin');
    });
 });

 router.get('/unverify/:id', ensureAuthenticated, isAdmin, (req, res, next) => {
    Booking.findById( req.params.id, (err, data) => {
        if(err) {
            console.log(err);
            return next(err);
        }
        data.is_Verified = false;
        data.is_Valid = false;
        data.is_Archived = false;
        data.save();
        return res.redirect('/admin/verified');
    });
 });

 router.get('/archive/:id',ensureAuthenticated, isAdmin, (req, res, next) => {
    Booking.findById( req.params.id, (err, data) => {
        if(err) {
            console.log(err);
            return next(err);
        }
        data.is_Archived = true;
        data.is_Valid = false;
        data.is_Verified = true;
        data.save();
        return res.redirect('/admin/verified');
    });
 });

 router.get('/unarchive/:id', ensureAuthenticated, isAdmin, (req, res, next) => {
    Booking.findById( req.params.id, (err, data) => {
        if(err) {
            console.log(err);
            return next(err);
        }
        data.is_Archived = false;
        data.is_Valid = true;
        data.save();
        return res.redirect('/admin/logs');
    });
 });

 router.get('/delete/:id',ensureAuthenticated, isAdmin, (req, res, next) => {
     Booking.findById(req.params.id, (err, data) => {
        if(err) {
            console.log(err);
            return next(err);
        }
        data.is_Archived = true;
        data.is_Valid = false;
        data.is_verified = false;
        data.save();
        return res.redirect('/admin');
     });
 });

 router.get('/takeadmin/:id', ensureAuthenticated, isAdmin, (req, res, next) => {
    User.findById(req.params.id, (err, data) => {
        if(err) {
            console.log(err);
            return next(err);
        }
        data.userType = false;
        data.save();
        return res.redirect('/admin/users');
     });

 });

 router.get('/giveadmin/:id', ensureAuthenticated, isAdmin, (req, res, next) => {
    User.findById(req.params.id, (err, data) => {
        if(err) {
            console.log(err);
            return next(err);
        }
        data.userType = true;
        data.save();
        return res.redirect('/admin/users');
     });

 });

 router.get('/makeregular/:id', ensureAuthenticated, isAdmin, (req, res, next) => {
    Customer.findById(req.params.id, (err, data) => {
        if(err) {
            console.log(err);
            return next(err);
        }
        data.is_Regular = true;
        data.save();
        return res.redirect('/admin/customers');
     });

 });



module.exports = router;