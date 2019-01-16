const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPass = async (pass) =>{
    const salt = await bcrypt.genSalt(10); // genera los saltos de encriptación
    const hash = await bcrypt.hash(pass,salt);
    return hash;
};

helpers.matchPass = async(password,savedPassword) => {

    try{
    //always be sure to return
        return await bcrypt.compare(password,savedPassword);
    }
    catch(e){
        console.log(e);
    }
    

};

module.exports = helpers;

/*
1 mucho tiempo jesica
2 mi rostro
5 abe dice : queremos meter la escen ade la alberca
pero que no estè fuera de lugar, si se puede
punto 3 no
4 oscuridad

6 1-24 difuminado raro 
7 {

    opcion 1 : que se quite por algo nuevo lo que sea/
    piscina o ella o lo que sea
    opcion 2 : que se queda tal y como esta
    opcion 3 : que se que pero retocada 
}

15
17 - 21 = 4

*/