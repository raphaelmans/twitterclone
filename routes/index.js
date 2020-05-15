var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

//==========
//AUTH ROUTES
//==========

//Register
router.get('/signup',(req,res)=>{
    res.render('signup');
});


router.post('/signup',(req,res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err,user)=>{
        if(err){
            console.log(err);
            req.flash("err",err.message);
        }else{
            passport.authenticate('local')(req,res,()=>{
                req.flash("success","You may now log-in with the username you have chosen");
                res.redirect('/');
            });
        }
    });
});

//LOGIN
router.get('/',(req,res)=>{
    res.render('index');
});

router.post('/login',passport.authenticate('local',
    {
        successRedirect: '/home',
        failureRedirect: '/login'

    }),(req,res)=>{

});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash("success","Successfully Logout");
    res.redirect('/');
})


module.exports = router;
