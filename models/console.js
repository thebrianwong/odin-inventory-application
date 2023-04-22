const mongoose = require("mongoose");

const { Schema } = mongoose;

const ConsoleSchema = new Schema({
  name: { type: String, required: true },
  creator: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: Date,
  imageURL: String,
});

ConsoleSchema.virtual("url").get(function () {
  return `/store/consoles/${this._id}`;
});

ConsoleSchema.virtual("releaseDateDisplayFormatted").get(function () {
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

ConsoleSchema.virtual("releaseDateFormFormatted").get(function () {
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

const Console = mongoose.model("Console", ConsoleSchema);

module.exports = Console;
