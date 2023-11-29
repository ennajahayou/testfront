var express = require("express");
var router = express.Router();
const createConnection = require("../dataBaseConnection");

/* Handle execution Creation */
router.post("/", function (req, res, next) {
  const executionDescription = req.body.executionDescription;
  const talentId = req.body.talentId;
  const creatorId = Number(req.body.creatorId);
  const dioId = req.body.dioId;
  const doItMyself = req.body.doItMyself;
  const howMake = req.body.howMake;
  const deadline = req.body.deadline;

  let status = "Not assigned";
  if (doItMyself) {
    status = "In progress";
  }

  const connection = createConnection();
  const sqlGetCEO = `SELECT id_ceo FROM dio WHERE id = ?`;

  connection.query(sqlGetCEO, [dioId], (err, rows) => {
    if (err) {
      console.log(err);
      connection.close();
    }
    if (!rows.length) {
      res.status(400).send("No dio found");

      connection.close();
    } else {
      const ceoId = rows[0].id_ceo;

      let sqlAddExecution = "";
      if (req.body.deadline) {
        sqlAddExecution = `INSERT INTO execution (exec_description, id_talent, id_ceo, id_dio, status_, ceo_validated, candidate_description, deadline) 
                                VALUES ('${executionDescription}', ${talentId}, ${creatorId}, ${dioId}, '${status}', ${
          ceoId === creatorId
        }, '${howMake}', '${deadline}')`;
      } else {
        sqlAddExecution = `INSERT INTO execution (exec_description, id_talent, id_ceo, id_dio, status_, ceo_validated)
                            VALUES ('${executionDescription}', ${talentId}, ${creatorId}, ${dioId}, '${status}', ${
          ceoId === creatorId
        })`;
      }

      connection.query(sqlAddExecution, [], (err) => {
        if (err) {
          console.log(err);
          connection.close();
        }
        res.status(200).send("Execution created");

        connection.close();
      });
    }
  });
});

/* Add an execution with the work already done */
router.post("/workDone", function (req, res, next) {
  const { userId, executionDescription, dioId, texte } = req.body;
  const connection = createConnection();
  const sqlGetCEO = `SELECT id_ceo FROM dio WHERE id = ?`;

  connection.query(sqlGetCEO, [dioId], (err, rows) => {
    if (err) {
      console.log(err);
      connection.close();
    }
    if (!rows.length) {
      res.status(400).send("No dio found");

      connection.close();
    } else {
      const ceoId = rows[0].id_ceo;
      const sql = `
        INSERT INTO execution (exec_description, id_talent, id_ceo, id_dio, status_, ceo_validated, exec_content) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      connection.query(
        sql,
        [
          executionDescription,
          userId,
          userId,
          dioId,
          "In review",
          ceoId == userId,
          texte,
        ],
        (err, rows) => {
          if (err) {
            res;
            console.log(err);
            connection.close();
          }
          res.send(rows);

          connection.close();
        }
      );
    }
  });
});

/* Asign a user to an execution */
router.post("/assign", function (req, res, next) {
  const executionId = req.body.executionId;
  const userId = req.body.userId;
  const howMake = req.body.howMake;
  const deliverDate = req.body.deliverDate;

  connection = createConnection();
  sql = `UPDATE execution SET id_talent = ?, candidate_description = ?, deadline = ?, status_ = ? WHERE id = ?`;

  connection.query(
    sql,
    [userId, howMake, deliverDate, "In progress", executionId],
    (err, rows) => {
      if (err) {
        console.log(err);
        connection.close();
      }
      res.status(200).send("Execution assigned");
      connection.close();
    }
  );
});

/* Set an execution to In review */
// TODO : Handle the deposit of a txt to begin, then the deposit of a file
router.post("/setInReview", function (req, res, next) {
  const executionId = req.body.executionId;
  const userId = req.body.userId;
  const execContent = req.body.execContent;

  const connection = createConnection();
  sql = `UPDATE execution SET status_ = ?, id_talent = ?, exec_content = ? WHERE id = ?`;

  connection.query(
    sql,
    ["In review", userId, execContent, executionId],
    (err) => {
      if (err) {
        res.status(500);
      } else {
        res.status(200).send("Execution in review");
      }
      connection.close();
    }
  );
});

module.exports = router;
