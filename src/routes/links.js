// rutas de ligas

const express = require('express');
const router = express.Router();
const image2base64 = require('image-to-base64');
var fs = require('fs');
//const PDFDocument = require('pdfkit');
const pdf2base64 = require('pdf-to-base64');


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



const pool = require('../../db');
const {
    isLoggedIn
} = require('../lib/auth');

//ruta añadir
router.get('/add', isLoggedIn, (req, res) => {

    res.render('links/add');
});



//añadir proyecto upload.array("uploads",2),
router.post('/add', isLoggedIn, upload.array('fx', 3), async (req, res) => {

    //console.log(req.body);
    console.log(req.files);

    let originalname = req.files[0].originalname;
    const img64 = image2base64('uploads/' + originalname).then(
        (resp) => {
            console.log('image converted');
            newLink.img = resp;
        }
    ).catch(
        (errs) => {
            console.log(errs)
        }
    );

    let originalnamepdf = req.files[1].originalname;
    const pdf64 = pdf2base64('uploads/' + originalnamepdf)
        .then(
            (respdf) => {
                console.log('pdf converted');
                newLink.onepayer = respdf;
                //console.log(response); //cGF0aC90by9maWxlLmpwZw==
            }
        )
        .catch(
            (error) => {
                console.log(error); //Exepection error....
            }
        )


    let originalnamet = req.files[2].originalname;
    const img64t = image2base64('uploads/' + originalnamet).then(
        (resp) => {
            console.log('imaget converted');
            newLink.imgt = resp;
        }
    ).catch(
        (errs) => {
            console.log(errs)
        }
    );

    const newLink = {
        //este json es que le vamos a mandar al query por tanto los nombres de los objetos
        //deben de coincidir con los nombres de las tablas para poder hacer el query
        title: req.body.title,
        fullname: req.body.fullname,
        mail: req.body.mail,
        phone: req.body.phone,
        area: req.body.area,
        url: req.body.url,
        urlyt: req.body.urlyt,
        university: req.body.univer,
        mail_investigator: req.body.mail_investigator,
        name_investigator: req.body.name_investigator,
        description: req.body.descrip,

        cvu: req.body.cvu,
        phone: req.body.phone,
        Id_usercreated: req.body.Id_usercreated
    };

    console.log(newLink);
    try {
        await pool.query('INSERT INTO LINKS set ?', [newLink]);
        //}

        fs.unlinkSync('uploads/' + originalname);
        req.flash('success', 'Proyecto Generado');
        //res.send('recibido');
        const msn = 'creado con éxito';
        //res.render('links/createsuccess',{newLink,msn});
        res.redirect('/links/proyectos');
    } catch (err) {
        res.redirect('/profile/', 500, req.flash('errores', err.name + ':' + err.message));
    }


    //for(i= 0; i < 100; i++){

    //


});


//ruta add noticia

/*
router.get('/addNew', (req, res) => {
    res.render('links/addNew');
});
*/

router.post('/addNew',isLoggedIn,upload.array('fx',4),(req,res)=>{
    console.log(req.files)

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



router.get('/viewproyect/:id', async (req, res) => {


    const {
        id
    } = req.params;
    console.log(id);

    const links = await pool.query('Select * from Links where id  = ?', [id]);
    const pdfx = await pool.query('Select onepayer from Links where id  = ?', [id]);
    const goals = await pool.query('Select * from Goals where id_proyecto = ? ', [id]);
    const owners = await pool.query('Select * from Users where owner = 1');

    const missgoals = await pool.query('Select Count(*) as missgoals from Goals where status = 1 and id_proyecto = ? ', [id]);
    const successgoals = await pool.query('Select count(*) as successgoals from Goals  where  status = 2 and id_proyecto = ? ', [id]);;

    console.log(pdfx[0]);
    //console.log(successgoals[0]);
    //console.log(links[0]);
    //console.log(goals[0]);

    res.render('links/viewproyect', {
        links: links[0],
        goals: goals,
        owners: owners,
        missgoals: missgoals[0],
        successgoals: successgoals[0],
        pdfx: pdfx[0].toString('ascii')
    });
});


router.post('/add/goal/', async (req, res) => {


    const newGoal = {
        id_proyecto: req.body.id_proyecto,
        id_owner: req.body.id_owner,
        Id_usercreated: req.body.id_user,
        title: req.body.title,
        descrip: req.body.descrip,
        init: req.body.init,
        end: req.body.end,
        status: '1'
    };

    console.log(newGoal)
    try {
        await pool.query('Insert into Goals set ?', [newGoal]);
        req.flash('success', 'Meta Generada con éxito');
        res.redirect('/links/viewproyect/' + newGoal.id_proyecto);

    } catch (e) {
        req.flash('errores', 'Error : ' + e);
        res.redirect('/links/viewproyect/' + newGoal.id_proyecto);
        console.log(e)
    }

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

//editar proyecto
router.get('/update/:id', isLoggedIn, async (req, res) => {
    const {
        id
    } = req.params;
    const links = await pool.query('Select * from Links where id  = ?', [id]);


    console.log(links[0])

    res.render('links/edit', {
        links: links[0]
    });
});

router.get('/proyect', (req, res) => {
    res.render('links/formEmprendedor');
});

//editar proyecto
router.get('/updateadmin/:id', isLoggedIn, async (req, res) => {
    const {
        id
    } = req.params;
    const admin = await pool.query('Select * from users where id_user  = ?', [id]);


    console.log(admin[0])

    res.render('links/edit', {
        admin: admin[0]
    });
});

router.get('/proyect', (req, res) => {
    res.render('links/formEmprendedor');
});


module.exports = router;