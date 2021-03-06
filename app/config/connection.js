const mysql = require("mysql");

class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}
function dbConnect(dbName, dbPassword) {
  // at top INIT DB connection
  const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: dbPassword,
    database: dbName,
  });
  return db;
}

module.exports = dbConnect;
