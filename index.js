require("dotenv").config();
const cors = require('cors');

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

// Middleware
app.use(express.json());

const PORT = 5000;

const db = process.env.DBURI;
app.use(cors({ origin: 'http://localhost:3000' }));
mongoose
    .connect(db)
    .then(()=>{
        console.log("Connected to MongoDB");
        app.listen(PORT,()=>{
            console.log(`Server is running on ${PORT}`);
        });
    }).catch((err) => {
        console.log("Failed to connect to MongoDB",err);
    });

    app.use(authRoutes);