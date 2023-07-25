const Pool = require("pg").Pool;

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "admin",
    database: "resumes",
    port:5432,
});

module.exports=pool;