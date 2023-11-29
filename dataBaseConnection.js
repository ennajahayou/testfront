const mysql = require("mysql2");

const connectToDatabase = () => {
  const connectionInfo = {
    host: "database-testdeploy.censrelaamzf.eu-west-3.rds.amazonaws.com",
    user: "admin",
    password: "Azert12345",
    database: "database_testdeploy",
    port: 3307, // Le port de votre instance RDS
    // d'autres options de connexion si nécessaire
  };

  return mysql.createConnection(connectionInfo);
};

module.exports = connectToDatabase;