const Pool = require("pg").Pool;

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "password123",
    database: "resumes",
    port:5432,
});

module.exports=pool;