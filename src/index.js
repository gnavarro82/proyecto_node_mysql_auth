const express = require("express");
const morgan = require("morgan");
const {dirname, join} = require("path");
const { engine } = require("express-handlebars");
const flash = require("connect-flash");
const session  = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport')
const {database} = require('./keys')


// Intializations
const app = express();
require('./lib/passport')

// Settings
app.set("port", process.env.PORT || 4000);

/* configuracion de handlebars*/
app.set("views", join(__dirname, "views"));
//app.engine('handlebars', engine());
app.set("view engine", "handlebars");

app.set("view engine", ".hbs");

//no es necesario layoutsDir: path.join(app.get("views"), "partials"),
//handelbar ahora busca sola partials
app.engine(
  ".hbs",
  engine({
    layoutsDir: join(app.get("views"), "layouts"),
    defaulLayout: "main",
    extname: ".hbs",
    helpers: require("./lib/handlebar"),
  })
);



// Public
app.use(express.static(join(__dirname, "public")));
console.log(join(__dirname, "public"))
// RUTA ABSOLUTA
//   /home/gianmarco/proyectos/Fast/nodejs-mysql-links/src/public
//app.use('/recursos', express.static(path.join(__dirname, "/public")));
//app.use(express.static( path.join(__dirname),'publicos'))
//console.log(join(__dirname, "public"))
// RUTA ABSOLUTA
//   /home/gianmarco/proyectos/Fast/nodejs-mysql-links/src/public
/* el error es porque tiene un espacio
/home/gianmarco/proyectos/Fast/nodejs-mysql-links/src /publicos
*/
//la ruta real seria asi sin espacio
/*
/home/gianmarco/proyectos/Fast/nodejs-mysql-links/src/publicos
*/
// Bootstrap 4 y librerías necesarias error
/* app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

 */

// Middlewares
//sesion para usar flash()
app.use(session({
  secret: 'gianmarconavarro',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false })); //acepta los datos de los formularios de los usuarios
app.use(express.json());
//Configurando passport para autenticacion
app.use(passport.initialize()) // iniciando passport
app.use(passport.session()) // necesita la sesion para poder trabajar

// Variables Globales
app.use((req, res, next) => {
  app.locals.success = req.flash('success')
  app.locals.message = req.flash('message')
  app.locals.user = req.user // datos del user
  next();
});



// Routes
app.use(require("./routes/index"));
app.use(require("./routes/authentication"));
app.use("/links", require("./routes/links"));




// Starting
app.listen(app.get("port"), () => {
  console.log("Servidor corriendo en puerto", app.get("port"));
});
