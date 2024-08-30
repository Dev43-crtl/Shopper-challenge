const FileManagerRepository = require('../repositories/fileManagerRepository');
const fileManagerRepository = new FileManagerRepository();
const fs = require('fs');
const path = require('path');

class FileManagerService {
    constructor() {
        this.repository = new FileManagerRepository();
    }

    async handleImage(image, customerUuid, datetime, type) {
        const fileUuid = `${customerUuid}_${type}_${datetime}`;
        const fileName = `${fileUuid}.png`;
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const measure_value = await this.readImageValue(base64Data);

        const rootDir = path.dirname(require.main.filename);
        const directoryPath = path.join(rootDir, 'assets/uploads');
        const filePath = path.join(directoryPath, fileName);

        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }


        fs.writeFileSync(filePath, buffer);
        const port = 80;
        const image_url = `http://localhost:${port}/api/uploads/${fileUuid}`;

        return {image_url , measure_value};
    }

    async readImageValue(image) {
        const result = await fileManagerRepository.llmImageRead(image);
        const measure = result.replace(/```json\s*|\s*```/g, '');

        return JSON.parse(measure).measure_value;

    }
}

module.exports = FileManagerService;