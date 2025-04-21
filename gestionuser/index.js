const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const os = require("os");
const http = require("http");
const { Eureka } = require("eureka-js-client");
const { initializeSocket } = require("./Socket");

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Fichiers statiques
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:4200",
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
    fileUpload({
        useTempFiles: true,
        limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
        responseOnLimit: "File size limit has been reached",
    })
);

// Connexion à MongoDB
connectDB();

// Routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Project Management Platform Backend");
});

// Serveur HTTP
const server = http.createServer(app);
initializeSocket(server);

// Obtenir l'adresse IP locale
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const config of iface) {
            if (config.family === "IPv4" && !config.internal) {
                return config.address;
            }
        }
    }
    return "127.0.0.1";
}

const IP = getLocalIP();
const PORT = process.env.PORT || 3002;

// Eureka Client
const client = new Eureka({
    instance: {
        app: "gestionuser",
        instanceId: `gestionuser-${PORT}`,
        hostName: IP,
        ipAddr: IP,
        statusPageUrl: `http://${IP}:${PORT}`,
        port: {
            $: PORT,
            "@enabled": true,
        },
        vipAddress: "gestionuser",
        dataCenterInfo: {
            "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
            name: "MyOwn",
        },
    },
    eureka: {
        host: "localhost",
        port: 8761,
        servicePath: "/eureka/apps/",
    },
});

// Démarrer le serveur puis s'enregistrer à Eureka
server.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);

    client.start((error) => {
        if (error) {
            console.error("❌ Eureka registration failed:", error);
        } else {
            console.log("✅ Registered with Eureka");
        }
    });
});
