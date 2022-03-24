const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const callbacklinkschema = new Schema({
  link: {
    type: String,
    required: true
  } 
},{versionKey: false});

module.exports = mongoose.model("apilink", callbacklinkschema);