//rutas de login


const express = require('express');
const router = express.Router();
const image2base64 = require('image-to-base64');
var fs = require('fs');
const helpers = require('../lib/helpers');


const passport = require('passport');
const pool = require('../../db');
const {
    isLoggedIn,
    isNotLoggedIn
} = require('../lib/auth');


//multer config
var multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }

});

const upload = multer({
    storage: storage
});
//*





router.post('/signup/subadmin', upload.single('fx'), async (req, res, err) => {
    //console.log(req.body);
    //console.log(req.file);

    const newUser = {

        name: req.body.name,
        mail: req.body.mail ? req.body.mail : '',
        pass: '',
        status: 1,
        data: '',
        role: req.body.role ? parseInt(req.body.role) : 3,
        admin: 1,
        owner: null,
        gender: req.body.gender,
        datenac: req.body.datenac,
        phone: req.body.phone,
        numdt: 0,
        calle: req.body.calle,
        colonia: req.body.colonia,
        estado: req.body.estado,
        cp: req.body.cp,
        img: '',
        Id_usercreated: req.body.Id_usercreated
    };
    newUser.pass = await helpers.encryptPass(req.body.pass);
    let {
        originalname
    } = req.file;
    let respimg = 0;
    const img64 = image2base64('uploads/' + originalname).then(
        (resp) => {
            console.log('image converted');
            newUser.img = resp;
            //console.log( )
            // console.log(newUser);

        }
    ).catch(
        (errs) => {
            console.log(errs)
        }
    );

    try {
        const result = await pool.query('Insert into Users set ?', [newUser]);
        res.redirect('/profile/', req.flash('success', 'Admin creado con éxito'));
        return console.log(result);

    } catch (err) {
        res.redirect('/profile/', 500, req.flash('errores', err.name + ':' + err.message));
    }




});

router.get('/signup/subadmin', isLoggedIn, (req, res) => {
    res.render('auth/signupsubadmin');
});




router.post('/signin', (req, res, next) => {

    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});


router.get('/signup', (req, res) => {

    res.render('auth/signup');
});


router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));




//query para todos los tipos de usuarios
router.get('/profile', isLoggedIn, async (req, res) => {

    const admins = await pool.query('Select * from Users where admin  = 1');
    const links = await pool.query('Select * from links order by created_at desc');
    const json = {
        admins,
        links
    };
    var count = Object.keys(json).length;
    console.log('objects in json' + count)
    res.render('links/profile', {
        json
    });

});

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});


module.exports = router;