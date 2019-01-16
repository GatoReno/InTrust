// rutas de ligas

const express = require('express');
const router = express.Router();

const image2base64 = require('image-to-base64');
const multer= require('multer');
const storage = multer.diskStorage({
    destination : (req,file,cb) => {
             cb(null,'./uploads/');
    },
    filename : (req,file,cb)=>{
        cb(null,Date.now()+file.originalname);
    }
});

const upload = multer({storage:storage});

/*
const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'./uploads/');
    },
    filename : (req,file,cb)=>{
        cb(null, new Date().toISOString()+file.filename);
    }
});

const fileFilter = (req,file,cb) =>{
    if(file.mimetype === 'image/jpeg' 
    || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
        cb(null,false);
        console.log('file rejected');
    }
};

const upload = multer({
    storage:storage,
    limits:{
    fileSize: 1024 * 1024 * 5},
    fileFilter : fileFilter
,});
*/

const pool = require('../../db');
const {
    isLoggedIn
} = require('../lib/auth');

//ruta añadir
router.get('/add', isLoggedIn, (req, res) => {

    res.render('links/add');
});

//ruta x
router.get('/x', (req, res) => {
    res.send('x');
});



//añadir proyecto upload.array("uploads",2),
router.post('/add', isLoggedIn, upload.any(), async (req, res) => {
    //obteniendo datos
    console.log(req.files);

    //console.log(req.files[i].path);


 

    //inteno de image-2base64

    /* console.log(req.body);
    image2base64(pdf) // you can also to use url
    .then(
        (response) => {
            console.log(response); //cGF0aC90by9maWxlLmpwZw==
        }
    )
    .catch(
        (error) => {
            console.log(error); //Exepection error....
        }
    )

/*
    /*

    // primer insert de proyectos
    const newLink = { 
        //este json es que le vamos a mandar al query por tanto los nombres de los objetos
        //deben de coincidir con los nombres de las tablas para poder hacer el query
        title : name,
        url,
        description : descrip
        
    };

  
    console.log(newLink);
    //for(i= 0; i < 100; i++){
        await pool.query('INSERT INTO LINKS set ?',[newLink]);
    //}

    req.flash('success','Proyecto Generado');
    //res.send('recibido');
    const msn = 'creado con éxito';
    //res.render('links/createsuccess',{newLink,msn});
    res.redirect('/links/proyectos');
    //

    */
});

//ruta proyectos
router.get('/proyectos', async (req, res) => {
    const links = await pool.query('Select * from  LINKS ');
    console.log(links);

    res.render('links/lists', {
        links
    });
});

//ruta links
router.post('/', async (req, res) => {
    const links = await pool.query('SELECT * FROM links order by created_at desc');
    //console.log(links);

    res.render('links/lists', {
        links
    });
});

//eliminar proyecto
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const {
        id
    } = req.params;
    pool.query('DELETE FROM LINKS WHERE ID = ?', [id]);
    console.log('link with id ' + {
        id
    } + ' deleted succcesfuly');
    //crear notificación
    // misma vista res.redirect('/links/proyectos');
    req.flash('success', 'Proyecto Eliminado');
    res.redirect('/links/proyectos');
});

//editar proyecto
router.get('/update/:id', isLoggedIn, async (req, res) => {
    const {
        id
    } = req.params;
    const links = await pool.query('Select * from Links where id  = ?', [id]);


    //console.log(links[0])

    res.render('links/edit', {
        links: links[0]
    });
});

router.get('/proyect', (req, res) => {
    res.render('links/formEmprendedor');
});


//query de edición
router.post('/update/edit/:id', isLoggedIn, async (req, res) => {
    const {
        id
    } = req.params;
    const {
        name,
        url,
        descrip
    } = req.body;

    const newLink = {
        title: name,
        url: url,
        description: descrip
    };
    //CURRENT_TIMESTAMP

    await pool.query('UPDATE Links set ? where id = ? ', [newLink, id]);

    req.flash('success', 'Proyecto Modificado');
    res.redirect('/links/proyectos');


});
module.exports = router;