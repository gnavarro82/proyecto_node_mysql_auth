//cifrar claves
const bcryptjs = require("bcryptjs");
const helpers = {};

//metodo para registrar una contraseña con hash en la bbdd
helpers.encryptPassword = async (password) => {
  //genera un hash
  const salt = await bcryptjs.genSalt(10);
  //para cifrar
  const hash = await bcryptjs.hash(password, salt);
  return hash; //se envia la contraseña cifrada
};

//metodo para el logeo
helpers.machtPassword = async (password, savePassword) => {
  try {
    //para comparar
    const hash = await bcryptjs.compare(password, savePassword);
    return hash
  } catch (error) {
    console.log(e);
  }
};

module.exports = helpers;
