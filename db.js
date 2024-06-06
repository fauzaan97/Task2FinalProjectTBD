const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "FinalProjectTBD",
    password: "fauzaantdm97",
    port: 5432
});

module.exports = pool;
