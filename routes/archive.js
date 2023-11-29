var express = require("express");
var router = express.Router();
const createConnection = require("../dataBaseConnection");

router.get("/", function (req, res, next) {
  const dioId = req.query.dioId;
  const connection = createConnection();
  let sql = `SELECT exec_description FROM execution WHERE id_dio = ? AND archived = 1`;

  connection.query(sql, [dioId], (err, rows) => {
    if (err) {
      res.send(err);
    }
    res.send(rows);

    connection.close();
  });
});
