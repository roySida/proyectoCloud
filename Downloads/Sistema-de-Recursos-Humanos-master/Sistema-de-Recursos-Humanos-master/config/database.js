//const mysql = require('mysql')
//const util = require('util')

// const pool = mysql.createPool({
//     connectionLimit: 10,
//     // host: '192.168.1.77',
//     // user: 'boss',
//     // password: 'edgarM5pro',
//     // database: 'recursoshumanos'
//     host: 'srvrecursoshumanos.database.windows.net',
//     user: 'administrador',
//     password: 'edgarM5pro',
//     database: 'recursoshumanos'
// })

//module.exports = pool

const sql = require("mssql");

async function main() {
  const config = {
    user: "administrador",
    password: "Castellano23",
    server: "servidorcloud1.database.windows.net",
    database: "championshumanos",
    options: {
      encrypt: true,
    },
  };

  await sql.connect(config);

  const result = await sql.query`SELECT * FROM administradores`;

  console.log(result.recordset);
}

main().catch((error) => {
  console.error(error);
});

module.exports = { sql } 