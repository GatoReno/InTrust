//rutas de login


const express = require('express');
const router = express.Router();

const passport = require('passport');
const pool = require('../../db');
const {isLoggedIn,isNotLoggedIn} = require('../lib/auth');

router.post('/signin', (req,res,next) => {

    passport.authenticate('local.signin',{
        successRedirect : '/profile',
        failureRedirect: '/signin',
        failureFlash : true
    })(req,res,next);
});


router.get('/signup', (req,res) => {

    res.render('auth/signup');
});


router.post('/signup', passport.authenticate('local.signup',{
    successRedirect: '/profile',
    failureRedirect : '/signup',
    failureFlash : true
}));

router.get('/profile',isLoggedIn, async (req,res)=>{

    const admins = await  pool.query('Select * from Users where admin  = 1' );
    const links = await pool.query('Select * from links order by created_at desc' );
    const json = {admins,links};
    var count = Object.keys(json).length;
    console.log('objects in json'+count)
    res.render('links/profile',{json});
    
});

router.get('/signin', isNotLoggedIn ,(req,res) => {
    res.render('auth/signin');
});

router.get('/logout', (req,res) => {
   req.logOut();
   res.redirect('/');
});


module.exports = router;