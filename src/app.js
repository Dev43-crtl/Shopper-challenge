const express = require('express');
const server = express();
const port = 80;
const errorHandler = require('./middlewares/errorHandler');
const fileManagerRoute = require("./routes/fileManagerRoute")
const measureRoute = require("./routes/measureRoute")

server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ limit: '10mb', extended: true }));
server.use(errorHandler);

server.use('/', [fileManagerRoute, measureRoute]);

server.listen(port, () => {
    console.log(`Server running at http://localhost:${80}`);
});
