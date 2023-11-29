const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const createConnection = require("../dataBaseConnection");

// Middleware pour analyser le corps des demandes
router.use(bodyParser.json());
router.use(cors());

router.get("/userdetails", (req, res) => {
  const db = createConnection();
  db.query(
    "SELECT id,user_name,thanks FROM users ORDER BY thanks DESC",
    (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des données des utilisateurs :",
          err
        );
        res.status(500).json({
          error: "Erreur lors de la récupération des données des utilisateurs",
        });
      } else {
        res.json(results);
      }

      db.close();
    }
  );
});

router.get("/userdetails/user", (req, res) => {
  const { userId } = req.query;
  console.log(req.query);
  const db = createConnection();
  const sql =
    "SELECT id, exec_description, score_thanks FROM execution WHERE id_talent = ? AND status_ = 'Done'";

  db.query(sql, [Number(userId)], (err, results) => {
    if (err) {
      console.log(err);
      console.error(
        "Erreur lors de la récupération des données des utilisateurs :",
        err
      );
      res.status(500).json({
        error: "Erreur lors de la récupération des données des utilisateurs",
      });
    } else {
      res.json(results);
    }

    db.close();
  });
});

router.get("/ExecutionReviews", async (req, res) => {
  const { executionId } = req.query;

  const sqlSelfReview = `SELECT difficulty, reactivity FROM review WHERE id_execution = ?`;
  const sqlPeerReview = `SELECT expectations, reactivity FROM peer_review WHERE id_execution = ?`;
  const sqlCeoReview = `SELECT expectations, reactivity FROM ceo_review WHERE id_execution = ?`;

  const [selfReview, peerReview, ceoReview] = await Promise.all([
    executeSQLRequest(sqlSelfReview, [executionId]),
    executeSQLRequest(sqlPeerReview, [executionId]),
    executeSQLRequest(sqlCeoReview, [executionId]),
  ]);

  const review = {
    selfReview,
    peerReview,
    ceoReview,
  };

  res.json(review);
});

const executeSQLRequest = async (sql, params) => {
  const connection = createConnection();

  const res = new Promise((resolve, reject) => {
    connection.query(sql, params, (err, rows) => {
      connection.close();
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });

  return res;
};

module.exports = router;
