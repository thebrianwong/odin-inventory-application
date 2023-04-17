const mongoose = require("mongoose");

const { Schema } = mongoose;

const ConsoleSchema = new Schema({
  name: { type: String, required: true },
  creator: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: Date,
});

ConsoleSchema.virtual("url").get(function () {
  return `/store/consoles/${this._id}`;
});

const Console = mongoose.model("Console", ConsoleSchema);

module.exports = Console;
