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
  let location = "";
  if (this.headquarters.get("country")) {
    location = this.headquarters.get("country");
  }
  if (this.headquarters.get("state")) {
    if (location === "") {
      location = this.headquarters.get("state");
    } else {
      location = `${this.headquarters.get("state")}, ${location}`;
    }
  }
  if (this.headquarters.get("city")) {
    if (location === "") {
      location = this.headquarters.get("city");
    } else {
      location = `${this.headquarters.get("city")}, ${location}`;
    }
  }
  return location;
});

const Developer = mongoose.model("Developer", DeveloperSchema);

module.exports = Developer;
