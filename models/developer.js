const mongoose = require("mongoose");

const { Schema } = mongoose;

const DeveloperSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  founded: Number,
  headquarters: { type: Map, of: String },
});

DeveloperSchema.virtual("url").get(function () {
  return `/store/developers/${this._id}`;
});

DeveloperSchema.virtual("headquartersFormatted").get(function () {
  let location = this.headquarters.get("country");
  if (this.headquarters.get("state")) {
    location = `${this.headquarters.get("state")}, ${location}`;
  }
  if (this.headquarters.get("city")) {
    location = `${this.headquarters.get("city")}, ${location}`;
  }
  return location;
});

const Developer = mongoose.model("Developer", DeveloperSchema);

module.exports = Developer;
