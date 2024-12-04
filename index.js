require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categoryRoutes"); 
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes"); 

const app = express();
const PORT = process.env.PORT || 5000; // Ensure flexibility for deployment
const db = process.env.DBURI;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Connect to MongoDB and start server
async function startServer() {
    try {
        await mongoose.connect(db);
        console.log("Connected to MongoDB");

        // Routes
        app.use(authRoutes); 
        app.use("/api", categoryRoutes);
        app.use("/api", productRoutes);
        app.use("/api", cartRoutes);
        app.use("/api", orderRoutes);

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1); // Exit the process with an error
    }
}

// Export app for testing or integration
module.exports = { app, startServer };

// Start the server if the file is executed directly
if (require.main === module) {
    startServer();
}
