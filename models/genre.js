const mongoose = require("mongoose");

const { Schema } = mongoose;

const GenreSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageURL: String,
});

GenreSchema.virtual("url").get(function () {
  return `/store/genres/${this._id}`;
});

const Genre = mongoose.model("Genre", GenreSchema);

module.exports = Genre;
