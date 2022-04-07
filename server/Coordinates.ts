import { model, Schema } from "mongoose";
import { CoordinatesI } from "./types";

const Coordinates = new Schema<CoordinatesI>({
  coordinates: {
    type: [],
  },
});

export default model<CoordinatesI>("Coordinates", Coordinates);
