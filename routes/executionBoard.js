var express = require("express");
var router = express.Router();
const createConnection = require("../dataBaseConnection");
const thanksCalculator = require("./thanksCalculator");

/* Determine if an execution has a review, a peer review and a CEO review. */
const has3review = (id_execution) => {
  const connection = createConnection();
  let sql = `SELECT COUNT(*) AS nb_review FROM review WHERE id_execution = ?`;
  let sql2 = `SELECT COUNT(*) AS nb_peer_review FROM peer_review WHERE id_execution = ?`;
  let sql3 = `SELECT COUNT(*) AS nb_ceo_review FROM ceo_review WHERE id_execution = ?`;

  const res = new Promise((resolve, reject) => {
    connection.query(sql, [id_execution], (err, rows) => {
      if (err) {
        reject(err);
      }
      connection.query(sql2, [id_execution], (err, rows2) => {
        if (err) {
          reject(err);
        }
        connection.query(sql3, [id_execution], (err, rows3) => {
          if (err) {
            reject(err);
          }
          resolve([
            rows[0].nb_review > 0,
            rows2[0].nb_peer_review > 0,
            rows3[0].nb_ceo_review > 0,
          ]);
        });
      });
    });
  });

  return res;
};

router.post("/save-texte", (req, res) => {
  const { executionId, texte } = req.body;
  const db = createConnection();

  const updateSql =
    "UPDATE execution SET exec_content = ?, status_ = ? WHERE id = ?";
  const updateValue = "In review";

  db.query(
    updateSql,
    [texte, updateValue, executionId],
    (updateErr, updateResult) => {
      if (updateErr) {
        console.error(
          "Erreur lors de la mise à jour de exec_content :",
          updateErr
        );
        res.status(500).send("Erreur lors de la mise à jour de exec_content");
      } else {
        res
          .status(200)
          .send("Texte inséré et exec_content mis à jour avec succès");
      }
      db.close();
    }
  );
});

router.post("/setDone", async (req, res) => {
  const { executionId, userId } = req.body;

  console.log(userId);

  const isReviewed = await has3review(executionId);
  if (!isReviewed[0] || !isReviewed[1] || !isReviewed[2]) {
    let errorString = "There is no ";
    if (!isReviewed[0]) {
      errorString += "self review, ";
    }
    if (!isReviewed[1]) {
      errorString += "peer review, ";
    }
    if (!isReviewed[2]) {
      errorString += "CEO review, ";
    }
    res.status(200).send(errorString + "for this execution");
    return;
  }

  const scoreThanks = await thanksCalculator(executionId, 0);
  const db = createConnection();

  const updateSql =
    "UPDATE execution SET status_ = ?, score_thanks = ? WHERE id = ?; ";
  const updateValue = "Done";

  db.query(
    updateSql,
    [updateValue, scoreThanks, executionId],
    (updateErr, updateResult) => {
      if (updateErr) {
        res.status(500).send("Erreur lors de la mise à jour de status_");
        db.close();
      } else {
        const updateUserSql =
          "UPDATE users SET thanks = thanks + ? WHERE id = ?";
        db.query(
          updateUserSql,
          [scoreThanks, userId],
          (updateUserErr, updateUserResult) => {
            if (updateUserErr) {
              console.error("Erreur lors de la mise à jour de thanks :");
              db.close();
            } else {
              res.status(200).send({ scoreThanks: scoreThanks });
              db.close();
            }
          }
        );
      }
    }
  );
});

router.get("/myExecutions", (req, res) => {
  const { userId } = req.query;
  const db = createConnection();

  const sql = `
        SELECT id, exec_description, status_, deadline, id_talent, ceo_validated, archived, score_thanks
        FROM execution
        WHERE id_ceo = ? OR id_talent = ?
        ORDER BY last_updated DESC`;
  db.query(sql, [userId, userId], (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des executions :", err);
      res.status(500).send("Erreur lors de la récupération des executions");
    } else {
      res.status(200).send(result);
    }
    db.close();
  });
});

router.get("/ExecutionsInReview", (req, res) => {
  const { userId } = req.query;
  const db = createConnection();
  const sql = `SELECT e.id, e.exec_description
  FROM execution e
  WHERE e.status_ = 'In review'
    AND e.id_talent != ?
    AND e.id NOT IN (
      SELECT DISTINCT pr.id_execution
      FROM peer_review pr
      WHERE pr.id_issuer = ?
    );`;
  db.query(sql, [userId, userId], (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des executions :", err);
      res.status(500).send("Erreur lors de la récupération des executions");
    } else {
      res.status(200).send(result);
    }
    db.close();
  });
});

module.exports = router;
