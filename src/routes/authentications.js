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




router.post('/deleteadmin', isLoggedIn, async (req, res) => {
    console.log(req.body);
    const idadmin = req.body.id_admin;
    const iduser = req.body.id_user;
    const pass = req.body.confirmpass;
    const rows = await pool.query('Select pass from users where id_user = ?', [idadmin]);

    if (rows.length > 0) {
        const user = rows[0];
        const spass = user.pass;
        const validPass = await helpers.matchPass(pass, spass);


        if (validPass) {
            console.log(validPass);
            const deleteuser = await pool.query('Delete from users where id_user = ?', [iduser]);

            // done(null, user, req.flash('success', 'Usuario eliminado ' + user.name));
            res.redirect('/profile/', 200, req.flash('sucess', 'Usuario eliminado '));
        } else {
            res.redirect('/profile/', 500, req.flash('errores', 'Contraseña de administración invalida.'));
        }
    }




    // res.send('deleteadmin');
});





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
        admin: null,
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

    switch (newUser.role) {
        case 2:
            newUser.owner = 1;
            break

        case 3:
            newUser.admin = 1;
    }
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

        let typeuser = newUser.role;
        let fnuser = '';
        switch (typeuser) {
            case 2:
                fnuser = 'Owner';
                break;

            case 3:
                fnuser = 'Admin';
                break;
        }
        res.redirect('/profile/', req.flash('success', ' ' + fnuser + ' creado con éxito'));
        //return console.log(result);

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
    const owners = await pool.query('Select * from Users where owner  = 1');
    const links = await pool.query('Select * from links order by created_at desc');
    const news = await pool.query('SELECT News.title title, News.id id_news, News.id_proyecto id_proyecto,News.created_at created_at,Links.title proyecto FROM News INNER JOIN Links ON Links.id = News.id_proyecto order by News.created_at desc ');
    const json = {
        admins,
        links,
        owners,
        news
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