var express = require("express");
var router = express.Router();
const createConnection = require("../dataBaseConnection");

/* GET dio listing. */
router.get("/", function (req, res, next) {
  const connection = createConnection();
  let sql = `SELECT id, nom_dio, dio_description FROM dio`;

  connection.query(sql, [], (err, rows) => {
    if (err) {
      console.log(err);
      connection.close();
    }
    res.send(rows);

    connection.close();
  });
});

/* POST dio creation. */
router.post("/", function (req, res, next) {
  const connection = createConnection();
  let sql = `INSERT INTO dio (nom_dio, dio_description) VALUES ('${req.body.nom_dio}', '${req.body.dio_description}')`;

  connection.query(sql, [], (err, rows) => {
    if (err) {
      console.log(err);
      connection.close();
    }
    res.send(rows);

    connection.close();
  });
});

/* GET dio list of execution of a DIO. */
router.get("/execution", function (req, res, next) {
  dioId = req.query.dioId;

  const connection = createConnection();
  const sql = `SELECT execution.id, execution.exec_description, users.user_name AS talent_name, execution.status_, execution.deadline
                FROM execution 
                JOIN users ON execution.id_talent = users.id 
                WHERE execution.id_dio = ? AND ceo_validated = 1
                ORDER BY execution.last_updated DESC`;
  connection.query(sql, [dioId], (err, rows) => {
    if (err) {
      console.log(err);
      connection.close();
    }
    res.send(rows);

    connection.close();
  });
});

/* ADD user to DIO */
router.post("/addUser", function (req, res, next) {
  const userId = req.body.id_user;
  const dioId = req.body.id_dio;
  const connection = createConnection();
  let sql = `INSERT INTO user_dio (id_user, id_dio) VALUES (?, ?)`;

  connection.query(sql, [userId, dioId], (err, rows) => {
    if (err) {
      console.log(err);
      connection.close();
    }
    res.send(rows);

    connection.close();
  });
});

module.exports = router;
