import Database from "better-sqlite3"

const consts = {
    DB: new Database("./data/data.db")
}

export default consts