const MeasureRepository = require('../repositories/measureRepository');

class MeasureService {
    constructor() {
        this.repository = new MeasureRepository();
    }

    async init() {
        await this.repository.createTable();
    }

    async getAllMeasures() {
        return await this.repository.getAllMeasures();
    }

    async getMeasure(measure_uuid) {
        return await this.repository.getMeasure(measure_uuid);
    }

    async createMeasure(measure_value, measure_type, measure_datetime, customer_code, image_url) {
        return await this.repository.createMeasure(
            measure_value, 
            measure_type, 
            measure_datetime, 
            customer_code, 
            image_url
        );
    }

    async validateDoubleReport(customer_code, measure_type, measure_datetime) {
        return await this.repository.validateDoubleReport(
            customer_code, 
            measure_type, 
            measure_datetime, 
        )
    }

    async confirmMeasure(measure_uuid, confirmed_value) {
        return await this.repository.confirmMeasure(measure_uuid, confirmed_value)
    }

    async getCustomerList(customer_code, measure_type) {
        return await this.repository.getCustomerList(customer_code, measure_type)
    }
}

module.exports = MeasureService;