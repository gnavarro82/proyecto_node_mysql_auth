//podemos escoger el tipo de autenticacion
const passport = require("passport");

//la autenticion sera de forma local con mi bbdd
const localStrategy = require("passport-local").Strategy;
const pool = require("../database");
const helpers = require("../lib/helpers");

//Logeo de Usuarios
passport.use(
  "local.sigin",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      //comprobar el usuario
      //que devuelva todos los users que coincidan con el username
      const rows = await pool.query("SELECT * FROM users WHERE username=?", [
        username,
      ]);
      console.log(req.body);
      //si hay muchas filas hay un user
      if (rows.length > 0) {
        const user = rows[0];
        //compramos la contraseña que pasa el form con la que hay en la bb
        const validPAssword = await helpers.machtPassword(
          password,
          user.password
        ); //true o false
        //si es verdadero
        if (validPAssword) {
          done(null, user, req.flash('success',"welcome" + user.username));
        } else {
          done(null, false, req.flash('message',"Password Incorrecto"));
        }
      } //endif
      else {
        //si no encontro ningun user
        return done(null, false, req.flash('message',"el nombre de usuario no existe"));
      }

      /* obteniedo el objeto de username y pass
console.log(req.body);
  console.log(username);
  console.log(password);
[Object: null prototype] { username: 'joe', password: '123' }
joe
123

*/
    }
  )
);

//Registro de Uusarios
passport.use(
  "local.signup",
  new localStrategy(
    {
      //a traves de que campoo estoy recibiendo username y password
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    }, //que es klo que va hacer al momento de autentificarse el user)
    async (req, username, password, done) => {
      const { fullname } = req.body;
      const newUser = {
        username,
        password,
        fullname,
      };
      //la contraseña debe estar cifrada  -- cifrando contraseña
      newUser.password = await helpers.encryptPassword(password);
      //antes estaba en texto plano pero se guradara cifrada
      const result = await pool.query("INSERT INTO users SET ?", [newUser]);
      //tenemos que asignarle su id
      newUser.id = result.insertId;
      //console.log(result)
      /*
OkPacket {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 2,
  serverStatus: 2,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0
}

*/
      //   console.log(req.body)
      /*
[Object: null prototype] {
  fullname: 'gianamrco',
  username: 'gnavarro82',
  password: '123'
}
*/
      //done se ejecuta al final cuando termino la autenticacion
      return done(null, newUser); //newUser se almacena en una sesion
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  done(null, rows[0]);
});
