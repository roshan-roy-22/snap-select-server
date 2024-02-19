const express = require('express');
const app = express();
require('dotenv').config();
require('./DB/connection');
const cors = require('cors');
const router = require('./Routes/route');

app.use(cors());
app.use(express.json());
app.use(router); // Pass the router instance directly to app.use()


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server has started at ${PORT}`));
