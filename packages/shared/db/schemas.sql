CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY NOT NULL, json TEXT);
SELECT crsql_as_crr('messages');
