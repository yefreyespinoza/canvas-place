import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import Coordinate from "./Coordinate";
import { CoordinateI } from "./types";

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

  //send coordinates
  const getCoordinates = async () => {
    const coordinates = await Coordinate.find();
    io.emit("coordinates", coordinates);
  };
  getCoordinates();

  //search a coordinate in the database and update it if it exists
  socket.on("coordinate", async (dt: CoordinateI) => {
    const coordinate = await Coordinate.findOne({ x: dt.x, y: dt.y });
    if (coordinate) {
      coordinate.color = dt.color;
      coordinate.save();
    } else {
      const newCoordinate = new Coordinate(dt);
      await newCoordinate.save();
    }
    io.emit("coordinate", dt);
  });
});
export default httpServer;
