const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

class DatabaseConnection {
    constructor() {
        this.dbPath = "src/configs/database/database.sqlite"
        this.db = null;
    }

    async connect ()  {
        try {
            this.db = await sqlite.open({
                filename: this.dbPath,
                driver: sqlite3.Database
            });
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Error connecting to the database:', error);
        }
    }

    async createTable(query) {
        return await this.db.run(query);
    }

    async close() {
        await this.db.close();
    }
}

module.exports = DatabaseConnection;