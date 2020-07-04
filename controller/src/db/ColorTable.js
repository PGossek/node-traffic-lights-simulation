'use strict';

class ColorTable {
    constructor(dao) {
        this.dao = dao;
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS color (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            color_name TEXT NOT NULL,
            UNIQUE(color_name))`;
        return this.dao.run(sql);
    }

    truncateTable() {
        return this.dao.run(`DELETE FROM color`);
    }

    removeIndex() {
        return this.dao.run(`DELETE FROM SQLITE_SEQUENCE WHERE name='color'`);
    }

    insert(name) {
        return this.dao.run(
            'INSERT OR IGNORE INTO color (color_name) VALUES (?)',
            [name]);
    }

    getAll() {
        return this.dao.all(`SELECT * FROM color`);
    }
}

module.exports = ColorTable;
