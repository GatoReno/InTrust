// rutas de ligas

const express = require('express');
const router = express.Router();
var fs = require('fs');
const pdf2base64 = require('pdf-to-base64');

const pool = require('../../db');

//multer config
var multer = require('multer');

const {isLoggedIn} = require('../lib/auth');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req,file,cb){
        cb(null, file.fieldname + Date.now()+path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});
router.get('/addN',(req,res)=>{
    res.send('send');
})
router.post('/addN', isLoggedIn, upload.array('fx', 4), async (req, res) => {

    console.log(req.body);
    console.log(req.files);

    const nNew = {
        title : req.body.title,
        Id_usercreated : req.body.Id_usercreated,
        id_proyecto : req.body.id_proyecto,
        text1 : req.body.text1,
        text2 : req.body.text2,
        text3 : req.body.text3,
        
    }

    try{
        await pool.query('INSERT INTO NEWS set ?',[nNew]);
        res.redirect('/profile/', 200, req.flash('success', 'Noticia'+req.body.title+' generada con éxito'));
    }
    catch(err){
        console.log('errores', err.name + ':' + err.message);
        res.redirect('/profile/', 500, req.flash('errores', err.name + ':' + err.message));
    }

  
});



router.get('/chart',(req,res)=>{
    res.render('links/chart');
});



module.exports = router;