import Database from "better-sqlite3"
import fs from 'node:fs';

fs.mkdirSync("data")
const consts = {
    DB: new Database("./data/data.db")
}

export default consts