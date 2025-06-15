const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const userRoutes = require("./routes/userRoute");
const itemRoutes = require("./routes/itemRoute");
const requestRoutes = require("./routes/requestRoute");
const ratingRoutes = require("./routes/ratingRoute");
const conversationRoutes = require("./routes/conversationRoute");
const messageRoutes = require("./routes/messageRoute");

env.config();

const app = express(); 

const allowedOrigins = [
  "http://localhost:5173",
  "https://studymart-svk7.onrender.com",
  "https://study-mart-cyan.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("joinRoom", ({ conversationId, userId }) => {
    socket.join(conversationId);
    onlineUsers[userId] = socket.id;
    console.log(`User ${userId} joined room ${conversationId}`);
  });

  socket.on("sendMessage", ({ conversationId, message }) => {
    socket.to(conversationId).emit("receiveMessage", {
      ...message,
      conversationId,
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
    for (const [userId, socketId] of Object.entries(onlineUsers)) {
      if (socketId === socket.id) delete onlineUsers[userId];
    }
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Server and Socket.IO running on port ${process.env.PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Atlas Database connected"))
  .catch((err) => console.error(err));