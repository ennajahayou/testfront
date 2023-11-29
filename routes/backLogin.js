// Importez les modules nécessaires
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const createConnection = require("../dataBaseConnection");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Middleware pour analyser le corps des demandes
router.use(bodyParser.json());
router.use(cors());

router.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const connection = createConnection();
  // Recherchez l'utilisateur dans la base de données
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, row) => {
      if (err) {
        res.status(500).json({ message: "Erreur interne du serveur" });
      } else if (row.length) {
        bcrypt.compare(password, row[0].password_, function (err, result) {
          if (result) {
            const userId = row[0].id;
            const userName = row[0].user_name;
            const sqlIsCeo = `SELECT EXISTS (SELECT 1 FROM dio WHERE id_ceo = ?) AS is_userId_ceo`;
            connection.query(sqlIsCeo, [row[0].id], (err, row) => {
              if (err) {
                console.log(err);
              } else {
                console.log(userId, userName, row[0]);
                res.status(200).json({
                  message: "Authentification réussie",
                  userId: userId,
                  userName: userName,
                  isCEO: row[0].is_userId_ceo,
                });
              }
              connection.close();
            });
          } else {
            res
              .status(401)
              .json({ message: "Identifiant ou mot de passe incorrect" });
          }
        });
      } else {
        res
          .status(401)
          .json({ message: "Identifiant ou mot de passe incorrect" });
      }
      // connection.close();
    }
  );
});

// Route d'enrôlement
router.post("/api/signup", (req, res) => {
  const { username, email, password } = req.body;

  const connection = createConnection();
  bcrypt.hash(password, saltRounds, function (err, hash) {
    connection.query(
      "INSERT INTO users (user_name, email, password_) VALUES (?, ?, ?)",
      [username, email, hash],
      function (err) {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Erreur interne du serveur" });
        } else {
          res.status(200).json({ message: "Inscription réussie" });
        }
        connection.close();
      }
    );
  });
  // Ajoutez l'utilisateur à la base de données
});

module.exports = router;
