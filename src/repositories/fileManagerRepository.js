const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

class FileManagerRepository {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    }

    async llmImageRead(image, format = "png") {
        const prompt =  "Read the image and return a json {measure_value = ''} with the image value from a water or gas measure";

        const result = await this.model.generateContent([
            {
                inlineData: {
                    data: image,
                    mimeType: `image/${format}`,
                }
            },
            { text: prompt },
        ]);

        return result.response.text();
    }
}


module.exports = FileManagerRepository;