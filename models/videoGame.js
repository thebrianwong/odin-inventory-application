const mongoose = require("mongoose");

const { Schema } = mongoose;

const VideoGameSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  developer: { type: Schema.Types.ObjectId, ref: "Developer", required: true },
  console: [{ type: Schema.Types.ObjectId, ref: "Console", default: null }],
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre", default: null }],
  price: Number,
  copies: Number,
});

VideoGameSchema.virtual("url").get(function () {
  return `/store/videogames/${this._id}`;
});

VideoGameSchema.virtual("priceFormatted").get(function () {
  return `$${this.price.toFixed(2)}`;
});

VideoGameSchema.virtual("releaseDateDisplayFormatted").get(function () {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = this.releaseDate;
  const year = date.getUTCFullYear();
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();
  return `${month} ${day}, ${year}`;
});

VideoGameSchema.virtual("releaseDateFormFormatted").get(function () {
  const date = this.releaseDate;
  const year = date.getUTCFullYear();
  const month = (() => {
    if (date.getUTCMonth() < 9) {
      return `0${date.getUTCMonth() + 1}`;
    }
    if (date.getUTCMonth() === 9) {
      return "10";
    }
    return (date.getUTCMonth() + 1).toString();
  })();
  const day = (() => {
    if (date.getUTCDate() < 10) {
      return `0${date.getUTCDate()}`;
    }
    return date.getUTCDate();
  })();
  return `${year}-${month}-${day}`;
});

const VideoGame = mongoose.model("VideoGame", VideoGameSchema);

module.exports = VideoGame;
