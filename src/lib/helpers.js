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

