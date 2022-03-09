PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY ASC,
	username VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS exercises (
	id INTEGER PRIMARY KEY ASC,
	user_id INTEGER,
    description VARCHAR(1000),
    duration INTEGER,
    date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);