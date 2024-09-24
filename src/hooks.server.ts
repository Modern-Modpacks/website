import serverConsts from "./lib/server/serverConsts";

serverConsts.DB.exec(`CREATE TABLE IF NOT EXISTS blogs (
    id TEXT UNIQUE,
    views INTEGER,
    lastip TEXT,
    comments JSON
);`)