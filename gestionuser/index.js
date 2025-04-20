const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const fileUpload = require('express-fileupload');
app.use(express.json({ limit: '50mb' })); // Increase from default ~1MB to 50MB
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir les fichiers statiques du dossier public
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:4200",
        credentials: true,
        methods: ["GET", "POST",'PATCH', "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
    fileUpload({
        useTempFiles: true,
        limits: { fileSize: 10 * 1024 * 1024 }, // 5 MB limit
        responseOnLimit: 'File size limit has been reached',
    })

);

connectDB();

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);



app.get("/", (req, res) => {
    res.send("Project Management Platform Backend");
});

const http = require('http');
const { initializeSocket } = require('./Socket');
const {spawn} = require("child_process");

const server = http.createServer(app);

initializeSocket(server);

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
