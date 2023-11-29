var express = require("express");
var router = express.Router();
const createConnection = require("../dataBaseConnection");

/* GET user listing. */
router.get("/", function (req, res, next) {
  const connection = createConnection();
  const sql = `SELECT id, user_name, email, profil_informations FROM users`;

  connection.query(sql, [], (err, rows) => {
    if (err) {
      console.log(err);
      connection.close();
    }
    res.send(rows);

    connection.close();
  });
});

/* GET user by id. */
router.get("/:id", function (req, res, next) {
  const id = req.params.id;
  const connection = createConnection();
  let sql = `SELECT id, user_name, email, profil_informations FROM users WHERE id = ?`;

  connection.query(sql, [id], (err, rows) => {
    if (err) {
      console.log(err);
      connection.close();
    }
    res.send(rows);

    connection.close();
  });
});

module.exports = router;
