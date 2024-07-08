const sql = require("mssql")
const config = {
    user : 'reemadmin',
    password : '@Reem24555',
    server : 'server255',
    database : 'shoppingDB',
    options : {
        // trustServerCertificate:true
        encrypt: true // windows azur
    }
};
sql.connect(config).catch(error => console.log(error))
module.exports = sql;
// heroo