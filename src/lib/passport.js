const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../../db');
const image2base64 = require('image-to-base64');

const helpers = require('../lib/helpers');


passport.use('local.signin', new LocalStrategy({
    usernameField : 'name',
    passwordField : 'pass',
    passReqToCallback: true
}, async (req,name,pass,done) => {
        
        console.log(req.body);
        const rows = await pool.query('Select * from Users where name = ?',[name]);
        
        if(rows.length > 0){
            const user = rows[0];
            //console.log(user);
            const spass = user.pass;
            const validPass = await helpers.matchPass(pass,spass);
            //console.log(validPass);
           
            if (validPass) {
                done(null, user, req.flash('success', 'Benvenido ' + user.name));
            } else {
                done(null, false, req.flash('errores', 'Contraseña invalida.'));
            }
        }else {
            return done(null, false, req.flash('errores', 'Este usuario no existe.'));
        }



       
        
       // return done(null,req.flash('message','yeah :3'));
}));




passport.use('local.signup', new LocalStrategy({
    usernameField : 'name',
    passwordField : 'pass',
    passReqToCallback : true
}, async (req,name,pass,done) => {
   console.log(req.body);


    const newUser = {
        name,
        pass,
        mail: req.body.mail ? req.body.mail : '',
        role: req.body.role ? parseInt(req.body.role) : 2,
        status : 1,
        data : '',
        admin : null,
        owner: null,
        Id_usercreated: req.body.Id_usercreated
    };
   
    
        const chck = await pool.query('select * from users where pass = ?',newUser.pass);
        if(chck.length > 0){
            console.log(chck)
            return done(null,false,req.flash('errores', 'Ya existe usario con ese mail.')); 

        }else{


        switch(newUser.role){
            case 3:
                newUser.admin = 1;
            break;
            case 1:
                newUser.owner = 1;
        }
        


        newUser.pass = await helpers.encryptPass(pass);
        
        const result = await pool.query('Insert into Users set ?',[newUser]);

        console.log(result);
        newUser.id_user = result.insertId;
        return done(null,newUser,req.flash('message', 'Usuario Creado con exito, ve a tu perfil .')); 
    }
}));


passport.serializeUser((user, done) => {
    done(null,user.id_user); //user is an object resulted from a query be sure to use the correct property name
});

passport.deserializeUser( async (id,done) => {
    const rows = await pool.query('select * from users where id_user = ?',[id]);
    done(null,rows[0])
    //console.log('deserializado'+rows);
});

