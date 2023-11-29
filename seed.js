const createConnection = require("./dataBaseConnection");
const bcrypt = require("bcrypt");
const saltRounds = 10;

userMourad = {
  name: "Mourad",
  mail: "a",
  password_: "Thanksandtip2023!",
};

userPaul = {
  name: "Paul",
  mail: "b",
  password_: "12345678",
};

userOusmane = {
  name: "Ousmane",
  mail: "c",
  password_: "12345678",
};

userMohamed = {
  name: "Mohamed",
  mail: "d",
  password_: "12345678",
};

userHassan = {
  name: "Hassan",
  mail: "e",
  password_: "12345678",
};

userMarine = {
  name: "Marine",
  mail: "f",
  password_: "12345678",
};

userHelene = {
  name: "Helene",
  mail: "g",
  password_: "12345678",
};

dioCDL = {
  nom_dio: "CDL",
  dio_description: "Centrale digital lab",
  id_ceo: 1,
};

const users = [
  userMourad,
  // userPaul,
  // userOusmane,
  // userMohamed,
  // userHassan,
  // userMarine,
  // userHelene,
];

const connection = createConnection();

// users.forEach((user) => {
//   bcrypt.hash("Thanksandtip2023!", saltRounds, function (err, hash) {
//     connection.query(
//       `INSERT INTO users (user_name, email, password_) VALUES ('${user.name}', '${user.mail}', '${hash}')`,
//       (err, rows) => {
//         if (err) throw err;
//       }
//     );
//   });
// });

console.log("here");
bcrypt.hash(userMourad.password_, saltRounds, function (err, hash) {
  connection.query(
    `INSERT INTO users (user_name, email, password_) VALUES (?, ?, ?)`,
    [userMourad.name, userMourad.mail, hash],
    (err, rows) => {
      if (err) throw err;
      connection.close();
    }
  );
});

console.log(userMourad);

//   connection.query(
//     `INSERT INTO users (user_name, email, password_) VALUES ('${user.name}', '${user.mail}', '${user.password_}')`,
//     (err, rows) => {
//       if (err) throw err;
//     }
//   );
// });

// connection.query(
//   `INSERT INTO dio (nom_dio, dio_description, id_ceo) VALUES ('${dioCDL.nom_dio}', '${dioCDL.dio_description}', ${dioCDL.id_ceo})`,
//   (err, rows) => {
//     if (err) throw err;
//   }
// );
