'use strict';

class LastColorTable {
    constructor(dao) {
        this.dao = dao;
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS last_color (
            unique_name_id INTEGER,
            color_name_id INTEGER,
            PRIMARY KEY (unique_name_id),
            FOREIGN KEY (unique_name_id)
                REFERENCES traffic_light (id)
                ON DELETE CASCADE ON UPDATE NO ACTION,
            FOREIGN KEY (color_name_id)
                REFERENCES color (id)
                ON DELETE CASCADE ON UPDATE NO ACTION)`;
        return this.dao.run(sql);
    }

    truncateTable() {
        return this.dao.run(`DELETE FROM last_color`);
    }

    insert(id, color) {
        return this.dao.run(
            `INSERT OR REPLACE INTO last_color (unique_name_id, color_name_id) VALUES ((SELECT id FROM traffic_light WHERE unique_name='${id}'),
        (SELECT id FROM color WHERE color_name='${color}'))`);
    }

    update(id, color) {
        return this.dao.run(
            `UPDATE last_color SET color_name_id = (SELECT id FROM color WHERE color_name='${color}') WHERE unique_name_id = (SELECT id FROM traffic_light WHERE unique_name='${id}')`);
    }

    getAll() {
        return this.dao.all(`SELECT * FROM last_color`);
    }
}

module.exports = LastColorTable;
