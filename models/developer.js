const mongoose = require("mongoose");

const { Schema } = mongoose;

const DeveloperSchema = new Schema({
  name: { type: String, required: true },
  founded: Number,
  headquarters: String,
  description: { type: String, required: true },
});

DeveloperSchema.virtual("url").get(function () {
  return `/store/developers/${this._id}`;
});

const Developer = mongoose.model("Developer", DeveloperSchema);

module.exports = Developer;
