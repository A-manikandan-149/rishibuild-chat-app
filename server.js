const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const redis = require("redis");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Redis connection (for AWS ElastiCache later)
const redisClient = redis.createClient({
  socket: {
    host: "master.rishibuild-redis.3t6jdi.eun1.cache.amazonaws.com",
    port: 6379
  }
});

redisClient.connect()
.then(() => console.log("🔥 REDIS CONNECTED SUCCESS"))
.catch(err => console.log("Redis error:", err));

// Serve frontend files
app.use(express.static(__dirname));

// WebSocket connection
wss.on("connection", (ws) => {

    console.log("User connected");

    ws.on("message", (message) => {

        console.log("Message:", message.toString());

        // broadcast message to all clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });

    });

    ws.on("close", () => {
        console.log("User disconnected");
    });

});

// Start server
server.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});