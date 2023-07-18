const express = require("express");
const pool = require("../database");

const router = express.Router();
const { isLoggedIn } = require("../lib/auth");

router.get("/add", isLoggedIn, (req, res) => {
  res.render("links/add");
});

//Guardando links
router.post("/add", isLoggedIn, async (req, res) => {
  //obtenemos los datos
  const { title, url, description } = req.body;
  //se guaradan en un objeto
  const newLink = {
    title,
    url,
    description,
    user_id : req.user.id
  };
  //le pasamos el id del usuario que se gurada en la sesion 
  await pool.query("INSERT INTO links set ?", [newLink]);
  console.log(newLink);
  //console.log(req.body);
  /* esto es lo que devuelve req.body
    [Object: null prototype] {
    title: 'probando',
    url: 'http://localhost:4000/links/add',
    description: 'un dato'
    }
    */
  req.flash("success", "Link guardado correctamente");
  res.redirect("/links");
});

//listando los links va ser por usuario
//para que cada uno tenga los links separdos
router.get("/", isLoggedIn, async (req, res) => {
  const links = await pool.query("SELECT * FROM links WHERE user_id = ?",[req.user.id]);
  //console.log(links);
  res.render("links/list", { links });
});

//Elimando
router.get("/delete/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM links WHERE ID = ?", [id]);
  console.log(req.params.id); //se obtiene el id
  req.flash("success", "Eliminado correctamente");
  res.redirect("/links");
});

//editar
router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  //await pool.query('DELETE FROM links WHERE ID = ?', [id]);
  console.log(id); //se obtiene el id
  //res.redirect("/links");
  //mostrar una vista con los datos antiguos
  const link = await pool.query("SELECT * FROM links WHERE ID = ?", [id]);
  console.log(link[0]); //muestra un solo objeto
  /*
{
  id: 2,
  title: 'probando',
  url: 'http://localhost:4000/links/add',
  description: 'un dato',
  user_id: null,
  created_at: 2023-05-01T16:45:07.000Z
}
*/
  /* devolucion de links
[
  RowDataPacket {
    id: 3,
    title: 'facebook',
    url: 'https://trastetes.blogspot.com/2019/01/solucion-error-esperando-que-unattended.htmldd',
    description: 'facebbok corrije',
    user_id: null,
    created_at: 2023-05-01T16:48:37.000Z
  }
]
*/

  res.render("links/edit", { link: link[0] });
});

//Guardando links actualizado
router.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  //obtenemos los datos
  const { title, url, description } = req.body;
  //se guaradan en un objeto
  const newLink = {
    title,
    url,
    description,
  };
  await pool.query("UPDATE links set ? WHERE ID = ?", [newLink, id]);
  console.log(newLink);
  //console.log(req.body);
  req.flash("success", "Link editado correctamente");
  res.redirect("/links");
});

module.exports = router;
