const path = require('path');
const fs = require('fs');
const util = require('util');
const sqlite3 = require('sqlite3');

const DB_PATH = path.join(__dirname, "my.db");
const DB_SQL_PATH = path.join(__dirname, "mydb.sql");

main().catch(console.error);

async function main() {

    // define DB
    const DB = new sqlite3.Database(DB_PATH);
    const SQL3 = {
        run(...args) {
            return new Promise((resolve, reject) => {
                DB.run(...args, function onResult(error) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(this);
                    }
                })
            })
        },
        get: util.promisify(DB.get.bind(DB)),
        all: util.promisify(DB.all.bind(DB)),
        exec: util.promisify(DB.exec.bind(DB))
    };

    const initSQL = fs.readFileSync(DB_SQL_PATH, "utf-8");
    await SQL3.exec(initSQL);

}
