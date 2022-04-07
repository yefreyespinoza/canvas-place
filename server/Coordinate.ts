import { model, Schema } from "mongoose";
import { CoordinateI } from "./types";

const Coordinate = new Schema<CoordinateI>({
  x: {
    type: String,
  },
  y: {
    type: String,
  },
  color: {
    type: String,
  },
});

export default model<CoordinateI>("Coordinate", Coordinate);
