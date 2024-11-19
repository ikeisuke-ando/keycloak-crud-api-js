import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.get('/', function (req, res) {
    res.send('Hello World');
})

app.listen(port, () => console.log(`Server running in port: http://localhost:${port}`));
