//este codigo es para proteger la vista de profil si no esta logeado se manda al logeo
module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/sigin');
    },
    //no mostrara al usuario algunas rutas si esta logeado
    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/profile');
    }

};