require("dotenv").config();
const cors = require('cors');
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categoryRoutes"); // Import category routes
const productRoutes = require("./routes/productRoutes"); // Product routes'u import et
const cartRoutes = require("./routes/cartRoutes");

const app = express();
const PORT = 5000;
const db = process.env.DBURI;


// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Connect to MongoDB
mongoose
    .connect(db)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Failed to connect to MongoDB", err);
    });

// Routes
app.use(authRoutes); // Existing auth routes
app.use('/api', categoryRoutes); // Add category routes
app.use('/api', productRoutes); // Add product routes
app.use("/api", cartRoutes);