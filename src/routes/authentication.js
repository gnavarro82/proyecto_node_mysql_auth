const express = require("express");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

const router = express.Router();

//muestra el form de registro
 //no mostrara al usuario algunas rutas si esta logeado
router.get("/signup",isNotLoggedIn, (req, res) => {
  res.render("auth/signup");
});

//REGISTRARSE EN EL SISTEMA
router.post(
  "/signup",isNotLoggedIn,
  passport.authenticate("local.signup", {
    successRedirect: "/profile", //si no hay erro dirige a profile
    failureRedirect: "/signup", //si hay error se envia al formulario
    failureFlash: true,
  })
);
// se llama al nombre que le habia configurado

//reenderizar el formulario de logeo
router.get("/sigin", isNotLoggedIn, (req, res) => {
  res.render("auth/sigin");
});

//proceso de logeo
router.post("/sigin", (req, res, next) => {
  //tendremos que hacer validaciones
  passport.authenticate("local.sigin", {
    successRedirect: "/profile", //si no hay erro dirige a profile
    failureRedirect: "/sigin", //si hay error se envia al formulario
    failureFlash: true,
  })(req, res, next);
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.redirect("/links");
  });
});

/**
 En el código anterior, he envuelto req.logout() 
 en una función de callback que maneja cualquier error que pueda 
 ocurrir durante el proceso de logout. Si hay un error, 
 se imprimirá en la consola y se pasará al middleware next. 
 Si no hay errores, redirigirá al usuario a la página de inicio ("/").
Con esta modificación, el error que mencionaste debería resolverse.
 Ahora, cuando accedas a "/logout", debería ejecutarse la función de logout sin problemas.
 */



module.exports = router;
