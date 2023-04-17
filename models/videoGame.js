const mongoose = require("mongoose");

const { Schema } = mongoose;

const VideoGameSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  developer: { type: Schema.Types.ObjectId, ref: "Developer", required: true },
  console: [{ type: Schema.Types.ObjectId, ref: "Console", required: true }],
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  price: Number,
  copies: Number,
});

VideoGameSchema.virtual("url").get(function () {
  return `/store/videogames/${this._id}`;
});

const VideoGame = mongoose.model("VideoGame", VideoGameSchema);

module.exports = VideoGame;
