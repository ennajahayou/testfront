var express = require("express");
var router = express.Router();
const createConnection = require("../dataBaseConnection");

/* GET execution in progress of a DIO. */
router.get("/executionInProgress", function (req, res, next) {
  dioId = req.query.dioId;
  const connection = createConnection();
  let sql = `SELECT execution.id, execution.exec_description, users.user_name, execution.ceo_validated, execution.status_
              FROM execution
              JOIN users ON execution.id_ceo = users.id
              WHERE execution.id_dio = ? AND execution.status_ != "Done" AND execution.ceo_validated = 0 AND execution.archived = 0`;
  connection.query(sql, [dioId], (err, rows) => {
    if (err) {
      console.log(err);
      connection.close();
    }
    res.send(rows);

    connection.close();
  });
});

/* GET execution done of a DIO. */
router.get("/executionFinished", function (req, res, next) {
  dioId = req.query.dioId;
  const connection = createConnection();
  // TODO : add date management
  /*   let sql2 = `SELECT execution.id, execution.exec_description, users.user_name, execution.ceo_validated, execution.status_
              FROM execution
              JOIN users ON execution.id_talent = users.id
              WHERE execution.id_dio = ? AND execution.status_ = "Done"`; */
  let sql = `SELECT  id, exec_description, ceo_validated, status_
              FROM execution
              WHERE status_ = 'In review' AND id_dio = ? AND id NOT IN (
                SELECT id_execution
                FROM ceo_review)`;

  connection.query(sql, [dioId], (err, rows) => {
    if (err) {
      console.log(err);
      connection.close();
    }

    res.send(rows);

    connection.close();
  });
});

/* Accept execution. */
router.post("/acceptExecution", function (req, res, next) {
  const executionId = req.body.executionId;
  const connection = createConnection();
  let sql = `UPDATE execution SET ceo_validated = 1 WHERE id = ?`;

  connection.query(sql, [executionId], (err, rows) => {
    if (err) {
      console.log(err);
      connection.close();
    }
    res.send(rows);

    connection.close();
  });
});

/* Refuse execution. */
router.post("/refuseExecution", function (req, res, next) {
  const executionId = req.body.executionId;
  const connection = createConnection();
  let sql = `UPDATE execution SET ceo_validated = 0, archived = 1 WHERE id = ?`;

  connection.query(sql, [executionId], (err, rows) => {
    if (err) {
      console.log(err);
      connection.close();
    }
    res.send(rows);

    connection.close();
  });
});

/* Get CEO notifications. */
router.get("/notifications", function (req, res, next) {
  const connection = createConnection();
  let sql = `SELECT COUNT(*) AS notifications FROM execution WHERE ceo_validated = 0 AND archived = 0`;

  connection.query(sql, [], (err, rows) => {
    if (err) {
      console.log(err);
      connection.close();
    }
    res.send(rows);

    connection.close();
  });
});

module.exports = router;
