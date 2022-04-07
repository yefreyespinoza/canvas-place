import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";

const DB = "mongodb://localhost/pixel-place";
mongoose
  .connect(DB)
  .then((db) => console.log("database is connected"))
  .catch((e) => console.log(e));

const app = express();
app.use(cors({ origin: "*" }));
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  console.log("new user connected");
  socket.on("coordinate", (dt) => {
    console.log(dt);
    io.emit("coordinate", dt);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
export default httpServer;
