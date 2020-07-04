'use strict';

class TrafficLightTable {
    constructor(dao) {
        this.dao = dao;
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS traffic_light (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            unique_name TEXT NOT NULL,
            UNIQUE(unique_name))`;
        return this.dao.run(sql);
    }

    truncateTable() {
        return this.dao.run(`DELETE FROM traffic_light`);
    }

    removeIndex() {
        return this.dao.run(`DELETE FROM SQLITE_SEQUENCE WHERE name='traffic_light'`);
    }

    insert(id) {
        return this.dao.run(
            'INSERT OR IGNORE INTO traffic_light (unique_name) VALUES (?)',
            [id]);
    }

    getAll() {
        return this.dao.all(`SELECT * FROM traffic_light`);
    }
}

module.exports = TrafficLightTable;
