// Import and Dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').Config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true}));

app.get("/",(req,res) => {
    res.status(200).json({ message : "Welcome to the Express server API!"})
})


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error : "Something went wrong on the Server"})
})

app.listen(PORT, () => {
    console.log(`Server is running smoothly on the Port : ${PORT}`);
})