const express = require('express');
const server = express();
const port = 80;
const errorHandler = require('./middlewares/errorHandler');
const fileManagerRoute = require("./routes/fileManagerRoute")
const measureRoute = require("./routes/measureRoute")

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(errorHandler);

server.use('/api', [fileManagerRoute, measureRoute]);

server.get('/', (req, res) => {
    res.send('Hello World!');
});


server.listen(port, () => {
    console.log(`Server running at http://localhost:${80}`);
});
