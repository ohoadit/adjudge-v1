const {Pool} = require('pg');
require('dotenv').config();

if(process.env.NODE_ENV === "production"){
    const pool = new Pool({
        connectionString : process.env.CLOUD_URI,
        ssl : true
    });
    module.exports=(pool)
}
else{
    const pool = new Pool({
        connectionString : process.env.LOCAL_URI,
        
    });
    module.exports=(pool)
}


