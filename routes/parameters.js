var fs = require("fs");

// const jsonData = {
//   truc: "slt",
//   truc2: "aurevoir",
// };

// fs.writeFile("parameters.json", JSON.stringify(jsonData), function (err) {
//   if (err) {
//     console.log(err);
//   }
// });

// console.log("truc");

var express = require("express");
var router = express.Router();

router.get("/get-parameters", (req, res) => {
  var obj;
  fs.readFile("parameters.json", "utf8", function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    res.send(obj);
  });
});

router.post("/save-parameters", (req, res) => {
  const parameters = req.body.parameters;
  console.log(parameters);
  fs.writeFile("parameters.json", JSON.stringify(parameters), function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la mise à jour des paramètres");
    } else {
      console.log("parameters mis à jour avec succès");
      res.status(200).send("parameters mis à jour avec succès");
    }
  });
});

module.exports = router;
