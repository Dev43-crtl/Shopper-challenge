const DatabaseConnection = require('../services/databaseConnection');
const { v4: uuidv4 } = require('uuid');
const { TABLE_MEASURES } = require('../helpers/constants')

class MeasureRepository {
    constructor() {
        this.connection = new DatabaseConnection()
    }

    async createTable() 
    {
        const sql = `CREATE TABLE IF NOT EXISTS ${TABLE_MEASURES} (
            measure_uuid TEXT PRIMARY KEY,
            measure_datetime TEXT,
            measure_value INTEGER,
            measure_type TEXT,
            has_confirmed INTEGER DEFAULT 0,
            image_url TEXT,
            customer_code TEXT
        )`

        try{
            await this.connection.connect();
            await this.connection.createTable(sql);
        }catch(err){
            throw new Error(`Não foi possível criar a table: ${err.message}`);
        }finally{
            this.connection.close();
        }
    }

    async getAllMeasures() 
    {
        const query = `SELECT * 
                        FROM ${TABLE_MEASURES}`;
        
        try {
            await this.connection.connect();
            let measures = await this.connection.db.all(query);
            
            return measures;
        } catch (error) {
            throw new Error(`Não foi possível obter os dados: ${err.message}`);
        }finally{
            this.connection.close();
        }


    }

    async getMeasure(measure_uuid) 
    {
        let query = `SELECT * FROM ${TABLE_MEASURES} WHERE measure_uuid = ?`
        
        try{
            await this.connection.connect();

            return await this.connection.db.get(query, [measure_uuid]);;
        }catch(err) {
            throw new Error(`Não foi possível obter os dados: ${err.message}`);
        }finally{
            this.connection.close();
        }

    }

    async createMeasure(measure_value, measure_type, measure_datetime, customer_code, image_url) 
    {
        const newUuid = uuidv4();
        let query = `INSERT INTO ${TABLE_MEASURES} 
                    (measure_uuid, measure_value, measure_type, measure_datetime, customer_code, image_url) 
                    VALUES (?,?,?,?,?,?)`
        
        try{
            await this.connection.connect();
            await this.connection.db.run(
                    query, 
                    [newUuid, measure_value, measure_type, measure_datetime, customer_code, image_url]
                );
            
            return newUuid;

        }catch(err) {
            throw new Error(`Não foi possível criar um novo item: ${err.message}`);
        }finally{
            this.connection.close();
        }
    }

    async validateDoubleReport(customer_code, measure_type, measure_datetime)
    {
        let query = `SELECT COUNT(*) AS total 
                    ,strftime('%m', measure_datetime) AS month 
                    FROM ${TABLE_MEASURES} 
                    WHERE customer_code = ? 
                    AND measure_type = ? 
                    AND strftime('%m', measure_datetime) = strftime('%m', ?)`;
            
        try{
            await this.connection.connect();
            return await this.connection.db.get(
                    query, 
                    [ customer_code, measure_type, measure_datetime ]
                );            
        }catch(err) {
            throw new Error(`Não foi possível obter os dados: ${err.message}`);
        }finally{
            this.connection.close();
        }
    }

    async confirmMeasure(measure_uuid, confirmed_value)
    {
        let query = `UPDATE ${TABLE_MEASURES} 
            SET measure_value = ?, has_confirmed = 1 WHERE measure_uuid = ? AND has_confirmed = 0`;
            
        try{
            await this.connection.connect();
            let measure = await this.connection.db.run(
                    query, 
                    [ confirmed_value, measure_uuid ]
                );

            return measure.changes;
        }catch(err) {
            throw new Error(`Não foi possível obter os dados: ${err.message}`);
        }finally{
            this.connection.close();
        }
    }
    
    async getCustomerList(customer_code, measure_type)
    {
        let query = `SELECT * FROM ${TABLE_MEASURES} WHERE customer_code = ?`;
        const params = [customer_code];
    
        if (measure_type) {
            query += ` AND measure_type = ?`;
            params.push(measure_type);
        }
            
        try{
            await this.connection.connect();
            let measure = await this.connection.db.all(
                    query, 
                    params
                );

                return measure;
        }catch(err) {
            throw new Error(`Não foi possível obter os dados: ${err.message}`);
        }finally{
            this.connection.close();
        }
    }
}

module.exports = MeasureRepository;